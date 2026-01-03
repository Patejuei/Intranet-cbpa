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
        ]);

        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('equipment_docs', 'public');
        }

        $inventoryNumber = null;
        $manualInventoryNumber = $request->input('inventory_number'); // From "Smart Alta" or "Smart Baja"
        $material = null;

        // Logic for ALTA
        if ($validated['type'] === 'ALTA') {

            // Check if Smart Alta (Existing Manual Number) provided
            if (!empty($manualInventoryNumber)) {
                // Find existing material by this code
                $existingMaterial = \App\Models\Material::where('code', $manualInventoryNumber)
                    ->where('company', $user->company)
                    ->first();

                if ($existingMaterial) {
                    $material = $existingMaterial;
                    $material->increment('stock_quantity');
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
                    $material->increment('stock_quantity');
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
                        'stock_quantity' => 1,
                        'company' => $user->company,
                        'category' => $validated['category'],
                        'code' => $inventoryNumber, // Null if consumable
                        'serial_number' => $validated['serial_number'],
                    ]);
                }
            }

            // Constraint: If Serial Number exists, Stock max is 1. (Check AFTER incrementing)
            if (!empty($material->serial_number) && $material->stock_quantity > 1) {
                // Revert increment logic if this was an existing Unique Asset with S/N
                // Actually, if it's Unique Asset with S/N, it shouldn't be incremented. It should be unique.
                // But user might be trying to add same S/N again? Or user might simply be adding stock to a pile.
                // Constraint: "Si el item de inventario posee número de serie del fabricante, limita el stock puede entre 0 y 1"
                // So if stock > 1 AND has serial number, we should technically error or warn.
                // But since we already saved... we can force it back to 1? NO, that deletes data.
                // The correct flow for S/N items is: CREATE NEW Material row for each S/N item? Or unique constraint?
                // Given the current 'Material' schema implies 'stock_quantity' aggregator...
                // If S/N is present, it implies UNIQUE item.
                // So if user adds ALTA for existing S/N item, it's either duplicate or error.
                // Let's assumet if it has S/N, we should NOT increment existing, but create NEW row?
                // But 'code' (Inv Number) is unique in DB...
                // If user scans same Inv Code, writes S/N...
                // Let's enforce the rule: If S/N exists, stock cannot exceed 1.
                if ($material->wasRecentlyCreated && $material->stock_quantity > 1) {
                    // Should not happen for new items initiated with 1.
                } elseif (!$material->wasRecentlyCreated && $material->stock_quantity > 1) {
                    // We just incremented it. Check previous state.
                    // If it WAS 0 or 1, and now is 2...
                    // For now, let's just create the history and let the user deal with the "Stock > 1" anomaly or
                    // assume they aren't scanning S/N items into the same bin.
                    // BUT USER SAID: "limita el stock posible entre 0 y 1"
                    // So we must prevent the increment IF it has S/N.
                    $material->decrement('stock_quantity'); // Revert
                    return redirect()->back()->withErrors(['serial_number' => 'Este material tiene N° serie y no puede tener stock > 1.']);
                }
            }

            // Create History Record
            if ($material) {
                \App\Models\MaterialHistory::create([
                    'material_id' => $material->id,
                    'user_id' => $user->id,
                    'type' => 'ADD', // ALTA
                    'quantity_change' => 1,
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
                if ($material->stock_quantity > 0) {
                    $material->decrement('stock_quantity');
                    $inventoryNumber = $material->code;

                    // Create History Record
                    \App\Models\MaterialHistory::create([
                        'material_id' => $material->id,
                        'user_id' => $user->id,
                        'type' => 'REMOVE', // BAJA
                        'quantity_change' => -1,
                        'current_balance' => $material->stock_quantity,
                        'reference_type' => EquipmentLog::class,
                        'reference_id' => null,
                        'description' => 'Baja Manual: ' . $validated['reason'],
                    ]);
                } else {
                    return redirect()->back()->withErrors(['item_name' => 'El material no tiene stock suficiente para dar de baja.']);
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
