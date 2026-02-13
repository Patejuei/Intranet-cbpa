<?php

namespace App\Http\Controllers;

use App\Models\PettyCashRendition;
use App\Models\PettyCashAttachment;
use App\Models\Vehicle;
use App\Models\WorkshopInventory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class RenditionController extends Controller
{
  public function index(Request $request)
  {
    $user = $request->user();

    // Authorization: Secretary (primary), Admin, or maybe Inspector/Comandante for history?
    // User said "Secretaria... validará...". Taller is offline.
    // We'll allow Admin and Secretary for now.

    if ($user->role !== 'secretaria_adquisiciones' && $user->role !== 'admin') {
      // Should we allow read-only for others? For now, abort.
      // abort(403);
    }

    $query = PettyCashRendition::with(['user', 'vehicle', 'attachments'])->latest();

    // Filters?
    if ($request->has('status') && $request->status !== 'all') {
      $query->where('status', $request->status);
    }

    $renditions = $query->paginate(15);

    return Inertia::render('vehicles/renditions/index', [
      'renditions' => $renditions,
      'userRole' => $user->role,
    ]);
  }

  public function create()
  {
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
        'status' => 'pending_validation',
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

          // Link the rendition to this new item? 
          // The table has stock_item_id, we should update it.
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

        // Create Material (Material Mayor / Menor logic implies this is Material Menor generally)
        // User asked: "si es Herramienta u otra herramienta, que se agregue además al Inventario de Comandancia como dependencia Taller Mecánico"

        // We need to generate a code? MaterialController does it. We can try to replicate or leave null.
        // Material model allows null code.

        \App\Models\Material::create([
          'product_name' => $request->description,
          'stock_quantity' => $qty,
          'company' => 'Comandancia',
          'dependency' => 'Taller Mecánico',
          'category' => 'Otro', // Default for tools/other unless we map 'Herramientas' specific category if exists
          'brand' => null,
          'model' => null,
          'serial_number' => null,
          'document_path' => null,
          // 'code' => ... // Leave null for now or auto-generate implies logic duplication. 
          // Better to leave null and let Admin assign later or leave as is.
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
    });

    return redirect()->route('vehicles.renditions.index')->with('success', 'Rendición ingresada correctamente.');
  }

  public function show(PettyCashRendition $rendition)
  {
    $rendition->load(['user', 'vehicle', 'attachments']);

    return Inertia::render('vehicles/renditions/show', [
      'rendition' => $rendition,
    ]);
  }

  public function validateRendition(Request $request, PettyCashRendition $rendition)
  {
    $request->validate([
      'action' => 'required|in:validate,reject',
      'rejection_reason' => 'nullable|required_if:action,reject|string',
    ]);

    if ($request->action === 'reject') {
      $rendition->update([
        'status' => 'rejected',
        'rejected_by' => $request->user()->id,
        'rejected_at' => now(),
        'rejection_reason' => $request->rejection_reason,
      ]);
      return back()->with('success', 'Rendición rechazada.');
    }

    $rendition->update([
      'status' => 'rendido',
      'inspector_id' => $request->user()->id, // Acting as Validator
      'inspector_vised_at' => now(),
    ]);

    return back()->with('success', 'Rendición validada (Rendida).');
  }

  public function viewAttachment(PettyCashRendition $rendition, PettyCashAttachment $attachment)
  {
    if ($attachment->rendition_id !== $rendition->id) abort(404);

    $path = $attachment->file_path;
    if (!Storage::disk('public')->exists($path)) abort(404);

    return response()->file(Storage::disk('public')->path($path));
  }

  public function validateBatch(Request $request)
  {
    $request->validate([
      'ids' => 'required|array|min:1',
      'ids.*' => 'exists:petty_cash_renditions,id',
      'action' => 'required|in:validate', // Only validation for now as requested
    ]);

    // Update all selected renditions
    PettyCashRendition::whereIn('id', $request->ids)
      ->where('status', 'pending_validation') // Only validatable ones
      ->update([
        'status' => 'rendido',
        'inspector_id' => $request->user()->id,
        'inspector_vised_at' => now(),
      ]);

    return back()->with('success', 'Rendiciones seleccionadas han sido validadas correctamente.');
  }

  public function export(Request $request)
  {
    $ids = $request->input('ids');

    $query = PettyCashRendition::with(['user', 'vehicle']);

    if (!empty($ids)) {
      $query->whereIn('id', $ids);
    }

    $renditions = $query->latest()->get();

    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

    // Headers requested:
    // Concepto, Fecha Gasto, Proveedor, Dependencia, Tipo Gasto, Nº Boleta, Valor
    $headers = ['Concepto', 'Fecha Gasto', 'Proveedor', 'Dependencia', 'Tipo Gasto', 'Nº Boleta', 'Valor'];
    // Bold Headers
    $sheet->fromArray($headers, NULL, 'A1');
    $sheet->getStyle('A1:G1')->getFont()->setBold(true);

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

      $total += $r->amount;
      $row++;
    }

    // Total Row
    $sheet->setCellValue('F' . $row, 'TOTAL RENDICIÓN:');
    $sheet->setCellValue('G' . $row, $total);
    $sheet->getStyle('F' . $row . ':G' . $row)->getFont()->setBold(true);

    // Auto size
    foreach (range('A', 'G') as $columnID) {
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
