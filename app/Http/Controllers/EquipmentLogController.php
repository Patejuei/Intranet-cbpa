<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\EquipmentLog;
use Inertia\Inertia;

class EquipmentLogController extends Controller
{
    public function index()
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('equipment.view', $user->permissions ?? []) && !in_array('equipment.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $query = EquipmentLog::with('user')->latest();

        if ($user->role !== 'admin' && $user->company) {
            $query->whereHas('user', function ($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        return Inertia::render('equipment/index', [
            'logs' => $query->paginate(10),
            'materials' => \App\Models\Material::where('company', $user->company)->get()
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('equipment.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $validated = $request->validate([
            'item_name' => 'required|string',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'serial_number' => 'nullable|string',
            'type' => 'required|in:ALTA,BAJA',
            'reason' => 'nullable|string',
            'document' => 'nullable|file|max:10240', // 10MB limit
            'category' => 'nullable|string', // e.g. 'EPP', 'EXT'
            'quantity' => 'required|integer|min:1',
        ]);

        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('equipment_docs', 'public');
        }

        $quantity = $validated['quantity'];
        $inventoryNumber = null;
        $manualInventoryNumber = $request->input('inventory_number'); // From "Smart Alta" or "Smart Baja"
        $material = null;

        // Logic for ALTA
        if ($validated['type'] === 'ALTA') {

            // Constraint: If Serial Number is provided, Quantity MUST be 1
            if (!empty($validated['serial_number']) && $quantity > 1) {
                return redirect()->back()->withErrors(['quantity' => 'Materiales con número de serie deben registrarse de a uno (unique).']);
            }

            // Check if Smart Alta (Existing Manual Number) provided
            if (!empty($manualInventoryNumber)) {
                // Find existing material by this code
                $existingMaterial = \App\Models\Material::where('code', $manualInventoryNumber)
                    ->where('company', $user->company)
                    ->first();

                if ($existingMaterial) {
                    $material = $existingMaterial;

                    // Specific check for S/N constraint on existing material
                    if (!empty($material->serial_number) && $material->stock_quantity >= 1) {
                        // Cannot add more stock to a S/N item
                        return redirect()->back()->withErrors(['serial_number' => 'Este material con serie ya existe y no puede tener stock > 1.']);
                    }

                    $material->increment('stock_quantity', $quantity);
                    $inventoryNumber = $manualInventoryNumber;

                    // Update Serial Number if provided and not set
                    if (!empty($validated['serial_number'])) {
                        $material->update(['serial_number' => $validated['serial_number']]);
                    }
                } else {
                    // New item with manually specified Inventory Number
                    $inventoryNumber = $manualInventoryNumber;
                }
            } elseif (!empty($validated['category'])) {
                // Generate Automatic Inventory Number
                $prefix = $validated['category'];
                $latestLog = EquipmentLog::where('inventory_number', 'like', "{$prefix}-%")
                    ->orderByRaw('CAST(SUBSTRING(inventory_number, LENGTH(?) + 2) AS UNSIGNED) DESC', [$prefix])
                    ->first();

                $nextSequence = 1;
                if ($latestLog && preg_match('/-(\d+)$/', $latestLog->inventory_number, $matches)) {
                    $nextSequence = intval($matches[1]) + 1;
                }
                $inventoryNumber = $prefix . '-' . str_pad($nextSequence, 4, '0', STR_PAD_LEFT);
            }

            // Material Sync Logic
            if (isset($material) && $material) { // Already handled above
                // Done
            } else {
                // Try to find by name if no specific code used or new item
                $material = \App\Models\Material::where('company', $user->company)
                    ->where('product_name', $validated['item_name'])
                    ->first();

                if ($material && !$inventoryNumber) {
                    // Grouping logic (Consumables, no inventory number)
                    if (!empty($material->serial_number) && $material->stock_quantity >= 1) {
                        // Cannot add more stock to a S/N item
                        return redirect()->back()->withErrors(['item_name' => 'Este material con serie ya existe y no puede tener stock > 1.']);
                    }
                    $material->increment('stock_quantity', $quantity);
                    // Update details only if empty
                    if (empty($material->brand) && !empty($validated['brand'])) $material->brand = $validated['brand'];
                    if (empty($material->model) && !empty($validated['model'])) $material->model = $validated['model'];
                    if (empty($material->category) && !empty($validated['category'])) $material->category = $validated['category'];
                    // Update Serial Number if provided
                    if (!empty($validated['serial_number'])) $material->serial_number = $validated['serial_number'];

                    $material->save();
                } else {
                    // Create NEW Unique Asset (Inventory Number exists) OR New Consumable
                    $material = \App\Models\Material::create([
                        'product_name' => $validated['item_name'],
                        'brand' => $validated['brand'],
                        'model' => $validated['model'],
                        'stock_quantity' => $quantity,
                        'company' => $user->company,
                        'category' => $validated['category'],
                        'code' => $inventoryNumber, // Null if consumable
                        'serial_number' => $validated['serial_number'],
                    ]);
                }
            }

            // Create History Record
            if ($material) {
                \App\Models\MaterialHistory::create([
                    'material_id' => $material->id,
                    'user_id' => $user->id,
                    'type' => 'ADD', // ALTA
                    'quantity_change' => $quantity,
                    'current_balance' => $material->stock_quantity,
                    'reference_type' => EquipmentLog::class,
                    'reference_id' => null,
                    'description' => 'Alta Manual: ' . $validated['reason'],
                ]);
            }
        } elseif ($validated['type'] === 'BAJA') {
            // Logic for BAJA
            // Try explicit Inventory Number or Serial Look up first (Smart Baja)
            if (!empty($manualInventoryNumber)) {
                $material = \App\Models\Material::where(function ($q) use ($manualInventoryNumber) {
                    $q->where('code', $manualInventoryNumber)
                        ->orWhere('serial_number', $manualInventoryNumber);
                })
                    ->where('company', $user->company)
                    ->first();
            }

            if (!$material) {
                // Fallback to name search
                $material = \App\Models\Material::where('company', $user->company)
                    ->where('product_name', $validated['item_name'])
                    ->first();
            }

            if ($material) {
                if ($material->stock_quantity >= $quantity) {
                    $material->decrement('stock_quantity', $quantity);
                    $inventoryNumber = $material->code;

                    // Create History Record
                    \App\Models\MaterialHistory::create([
                        'material_id' => $material->id,
                        'user_id' => $user->id,
                        'type' => 'REMOVE', // BAJA
                        'quantity_change' => -$quantity, // Negative
                        'current_balance' => $material->stock_quantity,
                        'reference_type' => EquipmentLog::class,
                        'reference_id' => null,
                        'description' => 'Baja Manual: ' . $validated['reason'],
                    ]);
                } else {
                    return redirect()->back()->withErrors(['quantity' => 'No hay suficiente stock para dar de baja esa cantidad.']);
                }
            } else {
                return redirect()->back()->withErrors(['item_name' => 'No se encontró el material para dar de baja.']);
            }
        }

        $log = EquipmentLog::create([
            'item_name' => $material ? $material->product_name : $validated['item_name'], // Ensure consistent naming
            'brand' => $material ? $material->brand : $validated['brand'],
            'model' => $material ? $material->model : $validated['model'],
            'serial_number' => $validated['serial_number'] ?? ($material ? $material->serial_number : null),
            'inventory_number' => $inventoryNumber,
            'category' => $validated['category'] ?? ($material ? $material->category : null),
            'type' => $validated['type'],
            'quantity' => $quantity, // Log quantity
            'reason' => $validated['reason'],
            'document_path' => $documentPath,
            'material_id' => $material ? $material->id : null,
            'user_id' => $user->id,
        ]);

        // Update Reference ID in History if mapped
        if ($material) {
            \App\Models\MaterialHistory::where('reference_type', EquipmentLog::class)
                ->where('material_id', $material->id)
                ->where('user_id', $user->id)
                ->where('created_at', '>=', now()->subSeconds(5))
                ->latest()
                ->first()
                ?->update(['reference_id' => $log->id]);
        }

        return redirect()->back();
    }
}
