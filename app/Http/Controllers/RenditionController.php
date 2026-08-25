<?php

namespace App\Http\Controllers;

use App\Models\PettyCashRendition;
use App\Models\PettyCashAttachment;
use App\Models\RenditionReview;
use App\Models\Vehicle;
use App\Models\WorkshopInventory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use App\Services\NotificationRecipientService;
use App\Notifications\PettyCashRenditionCreatedNotification;
use App\Notifications\PettyCashRenditionApprovedByInspectorNotification;

class RenditionController extends Controller
{
  public function index(Request $request)
  {
    $user = $request->user();
    $userDepartment = trim($user->department ?? '');

    // Role-based access
    if ($user->role === 'mechanic') {
      $query = PettyCashRendition::where('user_id', $user->id);
    } elseif ($user->role === 'inspector' && $userDepartment === 'Material Mayor') {
      $query = PettyCashRendition::query();
    } elseif ($user->role === 'secretaria_adquisiciones') {
      $query = PettyCashRendition::query();
    } elseif (in_array($user->role, ['admin', 'comandante'])) {
      $query = PettyCashRendition::query();
    } else {
      abort(403, 'No tienes permiso para acceder a este módulo.');
    }

    $query->with(['user', 'vehicle', 'attachments'])->latest();

    // Status filter
    if ($request->has('status') && $request->status !== 'all') {
      $query->where('status', $request->status);
    }

    // Expense type filter
    if ($request->has('expense_type') && $request->expense_type !== 'all') {
      $query->where('expense_type', $request->expense_type);
    }

    $renditions = $query->paginate(15);

    return Inertia::render('vehicles/renditions/index', [
      'renditions' => $renditions,
      'userRole' => $user->role,
      'userDepartment' => $userDepartment,
    ]);
  }

  public function create()
  {
    $user = request()->user();

    if (!in_array($user->role, ['mechanic', 'admin'])) {
      abort(403, 'Solo mecánicos y administradores pueden crear rendiciones.');
    }

    return Inertia::render('vehicles/renditions/create', [
      'vehicles' => Vehicle::whereNull('deleted_at')->select('id', 'name', 'company')->orderBy('company')->get(),
      'inventoryItems' => WorkshopInventory::select('id', 'name', 'sku', 'stock as current_stock')->orderBy('name')->get(),
    ]);
  }

  public function store(Request $request)
  {
    if ($request->vehicle_id === 'taller') {
      $request->merge(['vehicle_id' => null]);
    }

    $request->validate([
      'supplier_rut' => 'required|string',
      'invoice_date' => 'required|date',
      'invoice_number' => 'required|string',
      'vehicle_id' => 'nullable|exists:vehicles,id',
      'expense_type' => 'required|in:repair_supplies,spare_parts,tools,other_tools',
      'description' => 'required|string',
      'amount' => 'required|integer|min:1',
      'stock_item_id' => 'nullable|exists:workshop_inventory,id',
      'stock_quantity' => 'nullable|integer|min:1',
      'is_new_entry' => 'boolean',
      'sku' => 'nullable|string',
      'unit_of_measure' => 'nullable|string',
      'unit_cost' => 'nullable|numeric',
      'attachments' => 'required|array|min:1',
      'attachments.*' => 'file|mimes:jpeg,png,jpg,pdf|max:10240',
    ]);

    DB::transaction(function () use ($request) {
      $rendition = PettyCashRendition::create([
        'user_id' => $request->user()->id,
        'supplier_rut' => $request->supplier_rut,
        'invoice_date' => $request->invoice_date,
        'invoice_number' => $request->invoice_number,
        'vehicle_id' => $request->vehicle_id,
        'expense_type' => $request->expense_type,
        'description' => $request->description, // Concepto
        'amount' => $request->amount,
        'stock_item_id' => $request->stock_item_id,
        'status' => 'pending_inspector',
      ]);

      // Logic for Workshop Inventory (Supplies / Spare Parts)
      if (in_array($request->expense_type, ['repair_supplies', 'spare_parts'])) {
        // If User selected "New Entry"
        if ($request->is_new_entry) {
          $category = $request->expense_type === 'repair_supplies' ? 'insumo' : 'repuesto';

          $newItem = WorkshopInventory::create([
            'name' => $request->description, // Use description as name
            'sku' => $request->sku,
            'category' => $category,
            'unit_of_measure' => $request->unit_of_measure ?? 'UNIDAD',
            'stock' => $request->stock_quantity ?? 0,
            'min_stock' => 1, // Default
            'unit_cost' => $request->unit_cost ?? 0,
            'location' => 'Taller',
            'compatibility' => 'Todos',
            'description' => 'Ingresado por Rendición #' . $request->invoice_number,
          ]);

          // Link the rendition to this new item
          $rendition->update(['stock_item_id' => $newItem->id]);
        } else {
          // Existing Item Logic
          if ($request->stock_item_id && $request->stock_quantity) {
            $item = WorkshopInventory::find($request->stock_item_id);
            if ($item) {
              $item->increment('stock', $request->stock_quantity);
            }
          }
        }
      }

      // Logic for Tools (Material Menor)
      if (in_array($request->expense_type, ['tools', 'other_tools'])) {
        // Verify we have a quantity
        $qty = $request->stock_quantity ?? 1;

        \App\Models\Material::create([
          'product_name' => $request->description,
          'stock_quantity' => $qty,
          'company' => 'Comandancia',
          'dependency' => 'Taller Mecánico',
          'category' => 'Otro',
          'brand' => null,
          'model' => null,
          'serial_number' => null,
          'document_path' => null,
        ]);
      }

      if ($request->hasFile('attachments')) {
        foreach ($request->file('attachments') as $file) {
          $path = $file->store('petty_cash', 'public');
          PettyCashAttachment::create([
            'rendition_id' => $rendition->id,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
          ]);
        }
      }

      // Notificar al Inspector de Material Mayor para su aprobación
      $inspectors = NotificationRecipientService::getMaterialMayorInspectors();
      NotificationRecipientService::safeNotify($inspectors, new PettyCashRenditionCreatedNotification($rendition));
    });

    return redirect()->route('vehicles.renditions.index')->with('success', 'Rendición ingresada correctamente.');
  }

  public function show(PettyCashRendition $rendition)
  {
    $user = request()->user();
    $userDepartment = trim($user->department ?? '');

    $rendition->load(['user', 'vehicle', 'attachments', 'reviews.user', 'inspector', 'secretary', 'rejectedBy']);

    // Determine if current user can review this rendition
    $canReview = false;
    if ($rendition->status === 'pending_inspector' && ($user->role === 'admin' || ($user->role === 'inspector' && $userDepartment === 'Material Mayor'))) {
      $canReview = true;
    } elseif ($rendition->status === 'pending_secretary' && ($user->role === 'admin' || $user->role === 'secretaria_adquisiciones')) {
      $canReview = true;
    }

    return Inertia::render('vehicles/renditions/show', [
      'rendition' => $rendition,
      'userRole' => $user->role,
      'userDepartment' => $userDepartment,
      'canReview' => $canReview,
    ]);
  }

  public function reviewRendition(Request $request, PettyCashRendition $rendition)
  {
    $this->validateOtp($request);

    $request->validate([
      'action' => 'required|in:approve,reject',
      'comment' => 'nullable|required_if:action,reject|string',
    ]);

    $user = $request->user();
    $userDepartment = trim($user->department ?? '');
    $originalStatus = $rendition->status;

    // Verify the user has the correct role for the current step
    if ($originalStatus === 'pending_inspector') {
      if ($user->role !== 'admin' && !($user->role === 'inspector' && $userDepartment === 'Material Mayor')) {
        abort(403, 'No tienes permiso para revisar esta rendición en este paso.');
      }
    } elseif ($originalStatus === 'pending_secretary') {
      if ($user->role !== 'admin' && $user->role !== 'secretaria_adquisiciones') {
        abort(403, 'No tienes permiso para revisar esta rendición en este paso.');
      }
    } else {
      abort(403, 'Esta rendición no está pendiente de revisión.');
    }

    if ($request->action === 'approve') {
      if ($originalStatus === 'pending_inspector') {
        $rendition->update([
          'status' => 'pending_secretary',
          'inspector_id' => $user->id,
          'inspector_vised_at' => now(),
        ]);

        // Notificar a la Secretaria de Adquisiciones para validación final
        $secretaries = NotificationRecipientService::getAcquisitionSecretaries();
        NotificationRecipientService::safeNotify($secretaries, new PettyCashRenditionApprovedByInspectorNotification($rendition));
      } elseif ($originalStatus === 'pending_secretary') {
        $rendition->update([
          'status' => 'approved',
          'secretary_id' => $user->id,
          'secretary_vised_at' => now(),
        ]);
      }
    } else {
      $rendition->update([
        'status' => 'rejected',
        'rejected_by' => $user->id,
        'rejected_at' => now(),
        'rejection_reason' => $request->comment,
      ]);
    }

    // Create audit review record
    RenditionReview::create([
      'rendition_id' => $rendition->id,
      'user_id' => $user->id,
      'action' => $request->action === 'approve' ? 'approved' : 'rejected',
      'step' => $originalStatus === 'pending_inspector' ? 'inspector' : 'secretary',
      'comment' => $request->comment,
    ]);

    $message = $request->action === 'approve' ? 'Rendición aprobada correctamente.' : 'Rendición rechazada.';

    return back()->with('success', $message);
  }

  public function reviewBatch(Request $request)
  {
    $this->validateOtp($request);

    $request->validate([
      'ids' => 'required|array|min:1',
      'ids.*' => 'exists:petty_cash_renditions,id',
      'action' => 'required|in:approve',
    ]);

    $user = $request->user();
    $userDepartment = trim($user->department ?? '');

    // Determine which status to filter and transition based on user role
    if ($user->role === 'inspector' && $userDepartment === 'Material Mayor') {
      $filterStatus = 'pending_inspector';
      $newStatus = 'pending_secretary';
      $updateFields = [
        'status' => $newStatus,
        'inspector_id' => $user->id,
        'inspector_vised_at' => now(),
      ];
      $step = 'inspector';
    } elseif ($user->role === 'secretaria_adquisiciones') {
      $filterStatus = 'pending_secretary';
      $newStatus = 'approved';
      $updateFields = [
        'status' => $newStatus,
        'secretary_id' => $user->id,
        'secretary_vised_at' => now(),
      ];
      $step = 'secretary';
    } elseif ($user->role === 'admin') {
      // Admin defaults to pending_inspector unless target_status is specified
      $targetStatus = $request->input('target_status', 'pending_inspector');
      if ($targetStatus === 'pending_secretary') {
        $filterStatus = 'pending_secretary';
        $newStatus = 'approved';
        $updateFields = [
          'status' => $newStatus,
          'secretary_id' => $user->id,
          'secretary_vised_at' => now(),
        ];
        $step = 'secretary';
      } else {
        $filterStatus = 'pending_inspector';
        $newStatus = 'pending_secretary';
        $updateFields = [
          'status' => $newStatus,
          'inspector_id' => $user->id,
          'inspector_vised_at' => now(),
        ];
        $step = 'inspector';
      }
    } else {
      abort(403, 'No tienes permiso para realizar esta acción.');
    }

    // Get matching renditions
    $renditions = PettyCashRendition::whereIn('id', $request->ids)
      ->where('status', $filterStatus)
      ->get();

    // Bulk update
    PettyCashRendition::whereIn('id', $renditions->pluck('id'))
      ->update($updateFields);

    // Create audit records
    foreach ($renditions as $rendition) {
      RenditionReview::create([
        'rendition_id' => $rendition->id,
        'user_id' => $user->id,
        'action' => 'approved',
        'step' => $step,
        'comment' => null,
      ]);

      if ($newStatus === 'pending_secretary') {
        $rendition->refresh();
        $secretaries = NotificationRecipientService::getAcquisitionSecretaries();
        NotificationRecipientService::safeNotify($secretaries, new PettyCashRenditionApprovedByInspectorNotification($rendition));
      }
    }

    return back()->with('success', 'Rendiciones seleccionadas han sido aprobadas correctamente.');
  }

  public function downloadAttachment(PettyCashRendition $rendition, PettyCashAttachment $attachment)
  {
    if ($attachment->rendition_id !== $rendition->id) abort(404);

    $path = $attachment->file_path;
    if (!Storage::disk('public')->exists($path)) abort(404);

    return response()->file(
      Storage::disk('public')->path($path),
      ['Content-Disposition' => 'attachment; filename="' . $attachment->file_name . '"']
    );
  }

  public function export(Request $request)
  {
    $ids = $request->input('ids');

    $query = PettyCashRendition::with(['user', 'vehicle']);

    if (!empty($ids)) {
      $query->whereIn('id', $ids);
    }

    // Expense type filter
    if ($request->has('expense_type') && $request->expense_type !== 'all') {
      $query->where('expense_type', $request->expense_type);
    }

    $renditions = $query->latest()->get();

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

    // Headers with Estado column added
    $headers = ['Concepto', 'Fecha Gasto', 'Proveedor', 'Dependencia', 'Tipo Gasto', 'Nº Boleta', 'Valor', 'Estado'];
    $sheet->fromArray($headers, NULL, 'A1');
    $sheet->getStyle('A1:H1')->getFont()->setBold(true);

    // Data
    $row = 2;
    $total = 0;

    foreach ($renditions as $r) {
      $sheet->setCellValue('A' . $row, $r->description);
      $sheet->setCellValue('B' . $row, $r->invoice_date ? date('d/m/Y', strtotime($r->invoice_date)) : '-');
      $sheet->setCellValue('C' . $row, $r->supplier_rut);
      $sheet->setCellValue('D' . $row, $r->vehicle ? $r->vehicle->name : 'Taller / General');

      // Translate Expense Type
      $expenseLabel = match ($r->expense_type) {
        'repair_supplies' => 'Insumos Reparación',
        'spare_parts' => 'Repuestos',
        'tools' => 'Herramientas',
        'other_tools' => 'Otras Herramientas',
        default => $r->expense_type
      };
      $sheet->setCellValue('E' . $row, $expenseLabel);

      $sheet->setCellValue('F' . $row, $r->invoice_number);
      $sheet->setCellValue('G' . $row, $r->amount);

      // Translate Status
      $statusLabel = match ($r->status) {
        'pending_inspector' => 'Pendiente Inspector',
        'pending_secretary' => 'Pendiente Secretaria',
        'approved' => 'Aprobada',
        'rejected' => 'Rechazada',
        default => $r->status
      };
      $sheet->setCellValue('H' . $row, $statusLabel);

      $total += $r->amount;
      $row++;
    }

    // Total Row
    $sheet->setCellValue('F' . $row, 'TOTAL RENDICIÓN:');
    $sheet->setCellValue('G' . $row, $total);
    $sheet->getStyle('F' . $row . ':G' . $row)->getFont()->setBold(true);

    // Auto size
    foreach (range('A', 'H') as $columnID) {
      $sheet->getColumnDimension($columnID)->setAutoSize(true);
    }

    $writer = new Xlsx($spreadsheet);

    $fileName = 'rendiciones_export_' . date('Y-m-d_H-i') . '.xlsx';

    return response()->streamDownload(function () use ($writer) {
      $writer->save('php://output');
    }, $fileName, [
      'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]);
  }
}
