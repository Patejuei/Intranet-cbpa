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
    if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('reception.view', $user->permissions ?? []) && !in_array('reception.edit', $user->permissions ?? [])) {
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
    if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('reception.edit', $user->permissions ?? [])) {
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
    if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('reception.edit', $user->permissions ?? [])) {
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
      ]);

      foreach ($validated['items'] as $item) {
        ReceptionItem::create([
          'reception_certificate_id' => $certificate->id,
          'material_id' => $item['material_id'],
          'quantity' => $item['quantity'],
        ]);

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
    if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('reception.view', $user->permissions ?? []) && !in_array('reception.edit', $user->permissions ?? [])) {
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
    if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('reception.view', $user->permissions ?? []) && !in_array('reception.edit', $user->permissions ?? [])) {
      abort(403);
    }

    $reception->load('firefighter', 'user', 'items.material');
    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.reception-certificate', ['certificate' => $reception]);
    return $pdf->download('acta-recepcion-' . $reception->id . '.pdf');
  }
}
