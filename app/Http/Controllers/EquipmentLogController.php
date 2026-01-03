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
            'logs' => $query->paginate(10)
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

        $user = $request->user();

        // Handle File Upload
        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('equipment_docs', 'public');
        }

        $inventoryNumber = null;

        if ($validated['type'] === 'ALTA' && !empty($validated['category'])) {
            // Generate Inventory Number: CATEGORY-XXXX
            $prefix = $validated['category'];

            // Find max inventory number with this prefix
            $latestLog = EquipmentLog::where('inventory_number', 'like', "{$prefix}-%")
                ->orderByRaw('CAST(SUBSTRING(inventory_number, LENGTH(?) + 2) AS UNSIGNED) DESC', [$prefix])
                ->first();

            $nextSequence = 1;
            if ($latestLog && preg_match('/-(\d+)$/', $latestLog->inventory_number, $matches)) {
                $nextSequence = intval($matches[1]) + 1;
            }

            $inventoryNumber = $prefix . '-' . str_pad($nextSequence, 4, '0', STR_PAD_LEFT);
        }

        // Sync with Inventory
        $material = \App\Models\Material::where('company', $user->company)
            ->where('product_name', $validated['item_name'])
            ->first();

        if ($validated['type'] === 'ALTA') {
            // If we have a unique Inventory Number, we treat this as a unique asset (Material).
            // We do NOT look for existing materials to group with.
            if ($inventoryNumber) {
                // Determine category abbreviation map to avoid guessing or use full category?
                // Actually the prefix IS the category from the form (already validated).

                $material = \App\Models\Material::create([
                    'product_name' => $validated['item_name'],
                    'brand' => $validated['brand'],
                    'model' => $validated['model'],
                    'stock_quantity' => 1,
                    'company' => $user->company,
                    'category' => $validated['category'],
                    'code' => $inventoryNumber,
                ]);
            } else {
                // Consumable logic (Grouping)
                if ($material) {
                    $material->increment('stock_quantity');
                    // Update properties if provided
                    if (!empty($validated['brand'])) $material->brand = $validated['brand'];
                    if (!empty($validated['model'])) $material->model = $validated['model'];
                    if (!empty($validated['category'])) $material->category = $validated['category'];
                    $material->save();
                } else {
                    // Create new material if it doesn't exist
                    $material = \App\Models\Material::create([
                        'product_name' => $validated['item_name'],
                        'brand' => $validated['brand'],
                        'model' => $validated['model'],
                        'stock_quantity' => 1,
                        'company' => $user->company,
                        'category' => $validated['category'],
                        // No unique code for consumables/grouped items unless manually entered? 
                        // The form doesn't expose manual code input for logs yet.
                    ]);
                }
            }
        } elseif ($validated['type'] === 'BAJA') {
            if ($material) {
                $material->decrement('stock_quantity');
            }
        }

        EquipmentLog::create([
            'item_name' => $validated['item_name'],
            'brand' => $validated['brand'],
            'model' => $validated['model'],
            'serial_number' => $validated['serial_number'],
            'inventory_number' => $inventoryNumber,
            'category' => $validated['category'],
            'type' => $validated['type'],
            'reason' => $validated['reason'],
            'document_path' => $documentPath,
            'material_id' => $material ? $material->id : null,
            'user_id' => $user->id,
        ]);

        return redirect()->back();
    }
}
