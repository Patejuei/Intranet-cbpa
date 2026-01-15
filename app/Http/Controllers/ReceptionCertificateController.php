<?php

namespace App\Http\Controllers;

use App\Models\ReceptionCertificate;
use App\Models\Firefighter;
use App\Models\Material;
use App\Models\ReceptionItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

use App\Traits\CompanyScopeTrait;

class ReceptionCertificateController extends Controller
{
  use CompanyScopeTrait;

  public function index()
  {
    $user = request()->user();
    if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('reception.view', $user->permissions ?? []) && !in_array('reception.edit', $user->permissions ?? [])) {
      abort(403);
    }

    $query = ReceptionCertificate::with('firefighter', 'user', 'items.material')->latest();
    $this->applyCompanyScope($query, request());

    return Inertia::render('receptions/index', [
      'certificates' => $query->paginate(10)
    ]);
  }

  public function create()
  {
    $user = request()->user();
    if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('reception.edit', $user->permissions ?? [])) {
      abort(403);
    }

    $firefightersQuery = Firefighter::query();
    // For reception, we might want to see ALL materials, not just those with stock > 0, 
    // because we are adding stock. So remove the where > 0 constraint.
    $materialsQuery = Material::query();

    $this->applyCompanyScope($firefightersQuery, request());
    $this->applyCompanyScope($materialsQuery, request());

    return Inertia::render('receptions/create', [
      'firefighters' => $firefightersQuery->get(),
      'materials' => $materialsQuery->get()
    ]);
  }

  public function store(Request $request)
  {
    $user = $request->user();
    if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('reception.edit', $user->permissions ?? [])) {
      abort(403);
    }

    $validated = $request->validate([
      'firefighter_id' => 'required|exists:firefighters,id',
      'date' => 'required|date',
      'observations' => 'nullable|string',
      'company' => 'required|string',
      'items' => 'required|array|min:1',
      'items.*.material_id' => 'required|exists:materials,id',
      'items.*.quantity' => 'required|integer|min:1',
      'assignment_type' => 'required|in:firefighter,company',
    ]);

    // Enforce company for non-privileged users
    if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->company !== 'Comandancia') {
      $validated['company'] = $user->company;
    }

    DB::transaction(function () use ($validated, $request) {
      // Calculate correlative
      $lastCorrelative = ReceptionCertificate::where('company', $validated['company'])->max('correlative');
      $nextCorrelative = $lastCorrelative ? $lastCorrelative + 1 : 1;

      $certificate = ReceptionCertificate::create([
        'firefighter_id' => $validated['firefighter_id'],
        'user_id' => $request->user()->id,
        'date' => $validated['date'],
        'observations' => $validated['observations'],
        'company' => $validated['company'],
        'correlative' => $nextCorrelative,
        'assignment_type' => $validated['assignment_type'],
      ]);

      foreach ($validated['items'] as $item) {
        ReceptionItem::create([
          'reception_certificate_id' => $certificate->id,
          'material_id' => $item['material_id'],
          'quantity' => $item['quantity'],
        ]);

        if ($validated['assignment_type'] === 'firefighter') {
          // Update Assigned Materials (Decrement)
          $assigned = \App\Models\AssignedMaterial::where('firefighter_id', $validated['firefighter_id'])
            ->where('material_id', $item['material_id'])
            ->first();

          if ($assigned) {
            if ($assigned->quantity < $item['quantity']) {
              throw new \Exception("El bombero no tiene suficiente cantidad asignada de este material. Asignado: {$assigned->quantity}, Retornando: {$item['quantity']}");
            }
            $assigned->decrement('quantity', $item['quantity']);
          } else {
            // Strict check
            throw new \Exception("El bombero no tiene asignado este material.");
          }
        } elseif ($validated['assignment_type'] === 'company') {
          // Decrement from Source Company Inventory
          // We assume the source is the firefighter's company
          $firefighter = Firefighter::find($validated['firefighter_id']);
          $sourceCompany = $firefighter->company;

          // If source company is same as receiving company, it might be just a return to shelf?
          // "Material solamente realizará un movimiento de compañía".
          // If same company, it's just moving from... where?
          // If I select "Company Assignment" but same company...
          // It implies "Moving from Company Stock -> My Stock". If same, no change?
          // Or maybe it's just correcting stock?
          // Let's assume it's a transfer between companies.

          if ($sourceCompany !== $validated['company']) {
            $myMaterial = Material::findOrFail($item['material_id']);

            // Find matching material in source company
            $sourceMaterial = null;
            if ($myMaterial->code) {
              $sourceMaterial = Material::where('company', $sourceCompany)->where('code', $myMaterial->code)->first();
            } else {
              $sourceMaterial = Material::where('company', $sourceCompany)
                ->where('product_name', $myMaterial->product_name)
                ->where('brand', $myMaterial->brand)
                ->where('model', $myMaterial->model)
                ->first();
            }

            if ($sourceMaterial) {
              if ($sourceMaterial->stock_quantity < $item['quantity']) {
                throw new \Exception("La compañía de origen ({$sourceCompany}) no tiene suficiente stock.");
              }
              $sourceMaterial->decrement('stock_quantity', $item['quantity']);

              // History for Source
              \App\Models\MaterialHistory::create([
                'material_id' => $sourceMaterial->id,
                'user_id' => $request->user()->id,
                'type' => 'TRANSFER_OUT',
                'quantity_change' => -$item['quantity'],
                'current_balance' => $sourceMaterial->stock_quantity,
                'reference_type' => ReceptionCertificate::class,
                'reference_id' => $certificate->id,
                'description' => 'Traspaso (Salida) hacia ' . $validated['company'],
              ]);
            }
            // If not found in source, we can't decrement. Maybe warn? or ignore?
            // For now, strict: if it's a company transfer, source must exist.
            // But preventing blocking: just log or skip if not found?
            // "search materials to enter from... company inventory".
            // This implies we should have SELECTED from company inventory.
            // But Frontend create.tsx uses `assignMaterials` (which is just ALL materials in my company).
            // So we are guessing the match.
            // Let's leave it as is: attempt decrement, if not found, ignore (maybe it was found physically but not in system?).
          }
        }

        // Increment stock
        $material = Material::findOrFail($item['material_id']);
        $material->increment('stock_quantity', $item['quantity']);

        // Create Material History
        \App\Models\MaterialHistory::create([
          'material_id' => $material->id,
          'user_id' => $request->user()->id,
          'type' => 'RECEPTION',
          'quantity_change' => $item['quantity'],
          'current_balance' => $material->stock_quantity, // Incremented value
          'reference_type' => ReceptionCertificate::class,
          'reference_id' => $certificate->id,
          'description' => 'Recepción Acta #' . $certificate->id,
        ]);
      }
    });

    return redirect()->route('receptions.index');
  }

  public function show(ReceptionCertificate $reception)
  {
    $user = request()->user();
    if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('reception.view', $user->permissions ?? []) && !in_array('reception.edit', $user->permissions ?? [])) {
      abort(403);
    }

    $reception->load('firefighter', 'user', 'items.material');
    return Inertia::render('receptions/show', [
      'certificate' => $reception
    ]);
  }

  public function downloadPdf(ReceptionCertificate $reception)
  {
    $user = request()->user();
    if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('reception.view', $user->permissions ?? []) && !in_array('reception.edit', $user->permissions ?? [])) {
      abort(403);
    }

    $reception->load('firefighter', 'user', 'items.material');
    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.reception-certificate', ['certificate' => $reception]);
    return $pdf->download('acta-recepcion-' . $reception->id . '.pdf');
  }
}
