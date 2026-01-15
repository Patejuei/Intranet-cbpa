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
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('deliveries.view', $user->permissions ?? []) && !in_array('deliveries.edit', $user->permissions ?? [])) {
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
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('deliveries.edit', $user->permissions ?? [])) {
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
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('deliveries.edit', $user->permissions ?? [])) {
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
            $lastCorrelative = DeliveryCertificate::where('company', $validated['company'])->max('correlative');
            $nextCorrelative = $lastCorrelative ? $lastCorrelative + 1 : 1;

            $certificate = DeliveryCertificate::create([
                'firefighter_id' => $validated['firefighter_id'],
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'observations' => $validated['observations'],
                'company' => $validated['company'],
                'correlative' => $nextCorrelative,
                'assignment_type' => $validated['assignment_type'],
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

                // Update Assigned Materials (Prendas a Cargo) ONLY if assignment_type is 'firefighter'
                if ($validated['assignment_type'] === 'firefighter') {
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
                }

                // Decrement stock
                $material = Material::findOrFail($item['material_id']);
                $material->decrement('stock_quantity', $item['quantity']);

                // === COMANDANCIA TRANSFER LGOIC ===
                // If the sender is Comandancia (which we know because of the material's company or user's company),
                // and the receiver is a Company (not 'Baja' or something else, assuming 'company' field in certificate is the target),
                // we should INCREASE the stock in the target company.
                if ($certificate->company !== 'Comandancia') { // If target is NOT Comandancia (it's a delivery TO a company)
                    // Check if this material comes from Comandancia (source)
                    if ($material->company === 'Comandancia') {
                        // Find or Create the material in the target company
                        // We assume "Code" is the unique identifier for the same product across companies.
                        // If no code, we might match by name? Code is safer.

                        $targetMaterial = null;
                        if ($material->code) {
                            $targetMaterial = Material::where('company', $certificate->company)
                                ->where('code', $material->code)
                                ->first();
                        } else {
                            // Fallback to strict name match if no code (less reliable but needed if codes aren't used)
                            $targetMaterial = Material::where('company', $certificate->company)
                                ->where('product_name', $material->product_name)
                                ->where('brand', $material->brand)
                                ->where('model', $material->model)
                                ->first();
                        }

                        if ($targetMaterial) {
                            $targetMaterial->increment('stock_quantity', $item['quantity']);

                            // History for Target
                            \App\Models\MaterialHistory::create([
                                'material_id' => $targetMaterial->id,
                                'user_id' => $request->user()->id,
                                'type' => 'ADD', // Received from Comandancia
                                'quantity_change' => $item['quantity'],
                                'current_balance' => $targetMaterial->stock_quantity,
                                'reference_type' => DeliveryCertificate::class,
                                'reference_id' => $certificate->id,
                                'description' => 'Recepción por Transferencia desde Comandancia',
                            ]);
                        } else {
                            // Create it if it doesn't exist
                            $newMaterial = Material::create([
                                'product_name' => $material->product_name,
                                'brand' => $material->brand,
                                'model' => $material->model,
                                'code' => $material->code, // Keep same code
                                'stock_quantity' => $item['quantity'],
                                'company' => $certificate->company,
                                'category' => $material->category,
                                // 'serial_number' => $material->serial_number, // Unique items logic? If has serial, we might need to clear it from source?
                                // For now assuming bulk items. If serial exists, we should probably transfer the record or handle uniqueness.
                            ]);

                            // History for New Material
                            \App\Models\MaterialHistory::create([
                                'material_id' => $newMaterial->id,
                                'user_id' => $request->user()->id,
                                'type' => 'ADD',
                                'quantity_change' => $item['quantity'],
                                'current_balance' => $item['quantity'],
                                'reference_type' => DeliveryCertificate::class,
                                'reference_id' => $certificate->id,
                                'description' => 'Recepción por Transferencia desde Comandancia (Nuevo Item)',
                            ]);
                        }
                    }
                }
                // === END TRANSFER LOGIC ===

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
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('deliveries.view', $user->permissions ?? []) && !in_array('deliveries.edit', $user->permissions ?? [])) {
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
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('deliveries.view', $user->permissions ?? []) && !in_array('deliveries.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $delivery->load('firefighter', 'user', 'items.material');
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.delivery-certificate', ['certificate' => $delivery]);
        return $pdf->download('acta-entrega-' . $delivery->id . '.pdf');
    }
}
