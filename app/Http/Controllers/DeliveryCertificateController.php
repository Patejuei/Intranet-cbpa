<?php

namespace App\Http\Controllers;

use App\Models\DeliveryCertificate;
use App\Models\Firefighter;
use App\Models\Material;
use App\Models\DeliveryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

use App\Traits\CompanyScopeTrait;

class DeliveryCertificateController extends Controller
{
    use CompanyScopeTrait;

    public function index()
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('deliveries.view', $user->permissions ?? []) && !in_array('deliveries.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $query = DeliveryCertificate::with('firefighter', 'user', 'items.material')->latest();
        $this->applyCompanyScope($query, request());

        return Inertia::render('deliveries/index', [
            'certificates' => $query->paginate(10)
        ]);
    }

    public function create()
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('deliveries.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $firefightersQuery = Firefighter::query();
        $materialsQuery = Material::query()->where('stock_quantity', '>', 0);

        $this->applyCompanyScope($firefightersQuery, request());
        $this->applyCompanyScope($materialsQuery, request());

        return Inertia::render('deliveries/create', [
            'firefighters' => $firefightersQuery->get(),
            'materials' => $materialsQuery->get()
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('deliveries.edit', $user->permissions ?? [])) {
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
            $lastCorrelative = DeliveryCertificate::where('company', $validated['company'])->max('correlative');
            $nextCorrelative = $lastCorrelative ? $lastCorrelative + 1 : 1;

            $certificate = DeliveryCertificate::create([
                'firefighter_id' => $validated['firefighter_id'],
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'observations' => $validated['observations'],
                'company' => $validated['company'],
                'correlative' => $nextCorrelative,
            ]);

            foreach ($validated['items'] as $item) {
                $material = Material::findOrFail($item['material_id']);

                if ($material->stock_quantity < $item['quantity']) {
                    throw new \Exception("Stock insuficiente para el material: {$material->product_name}");
                }

                DeliveryItem::create([
                    'delivery_certificate_id' => $certificate->id,
                    'material_id' => $item['material_id'],
                    'quantity' => $item['quantity'],
                ]);

                // Update Assigned Materials (Prendas a Cargo)
                // Check if exists
                $assigned = \App\Models\AssignedMaterial::where('firefighter_id', $validated['firefighter_id'])
                    ->where('material_id', $item['material_id'])
                    ->first();

                if ($assigned) {
                    $assigned->increment('quantity', $item['quantity']);
                } else {
                    \App\Models\AssignedMaterial::create([
                        'firefighter_id' => $validated['firefighter_id'],
                        'material_id' => $item['material_id'],
                        'quantity' => $item['quantity'],
                    ]);
                }

                // Decrement stock
                $material = Material::findOrFail($item['material_id']);
                $material->decrement('stock_quantity', $item['quantity']);

                // Create Material History
                \App\Models\MaterialHistory::create([
                    'material_id' => $material->id,
                    'user_id' => $request->user()->id,
                    'type' => 'DELIVERY',
                    'quantity_change' => -$item['quantity'],
                    'current_balance' => $material->stock_quantity, // Decremented value
                    'reference_type' => DeliveryCertificate::class,
                    'reference_id' => $certificate->id,
                    'description' => 'Entrega Acta #' . $certificate->id,
                ]);
            }
        });

        return redirect()->route('deliveries.index');
    }

    public function show(DeliveryCertificate $delivery)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('deliveries.view', $user->permissions ?? []) && !in_array('deliveries.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $delivery->load('firefighter', 'user', 'items.material');
        return Inertia::render('deliveries/show', [
            'certificate' => $delivery
        ]);
    }

    public function downloadPdf(DeliveryCertificate $delivery)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('deliveries.view', $user->permissions ?? []) && !in_array('deliveries.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $delivery->load('firefighter', 'user', 'items.material');
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.delivery-certificate', ['certificate' => $delivery]);
        return $pdf->download('acta-entrega-' . $delivery->id . '.pdf');
    }
}
