<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Traits\CompanyScopeTrait;

class MaterialController extends Controller
{
    use CompanyScopeTrait;

    public function index()
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('inventory.view', $user->permissions ?? []) && !in_array('inventory.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $query = Material::query();
        $this->applyCompanyScope($query, request());

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%");
            });
        }

        return Inertia::render('inventory/index', [
            'materials' => $query->orderBy('product_name')->paginate(10),
            'filters' => request()->only(['search']) // Pass filters back to view to maintain state if needed
        ]);
    }

    public function show(Material $inventory)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('inventory.view', $user->permissions ?? [])) {
            abort(403);
        }

        // Ensure user can view this company's material
        if ($user->role !== 'admin' && $user->company !== $inventory->company) {
            abort(403);
        }

        return Inertia::render('inventory/show', [
            'material' => $inventory,
            'logs' => $inventory->logs()->with('user')->latest()->get(),
            'history' => $inventory->history()->with('user')->get(),
        ]);
    }

    public function update(Request $request, Material $inventory)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('inventory.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $validated = $request->validate([
            'product_name' => 'required|string',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'code' => 'nullable|string|unique:materials,code,' . $inventory->id,
            'serial_number' => 'nullable|string',
            'stock_quantity' => 'required|integer',
            'company' => 'required|string',
            'category' => 'nullable|string',
            'document_path' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('document_path')) {
            $path = $request->file('document_path')->store('materials', 'public');
            $validated['document_path'] = $path;
        }

        // Constraint: If Serial Number exists, Stock max is 1.
        if (!empty($validated['serial_number']) && $validated['stock_quantity'] > 1) {
            return redirect()->back()->withErrors(['stock_quantity' => 'Items with Serial Number must have a stock of 1 (Unique Asset).']);
        }

        $oldStock = $inventory->stock_quantity;
        $inventory->fill($validated);

        $changes = $inventory->getDirty();
        $inventory->save();

        if (array_key_exists('stock_quantity', $changes)) {
            $newStock = $inventory->stock_quantity;
            $diff = $newStock - $oldStock;

            if ($diff !== 0) {
                \App\Models\MaterialHistory::create([
                    'material_id' => $inventory->id,
                    'user_id' => $user->id,
                    'type' => $diff > 0 ? 'ADD' : 'REMOVE',
                    'quantity_change' => $diff,
                    'current_balance' => $newStock,
                    'reference_type' => null, // Manual edit
                    'reference_id' => null,
                    'description' => 'Ajuste Manual de Inventario',
                ]);
            }
        } elseif (!empty($changes)) {
            // Log other changes? Maybe type 'EDIT'
            // For now, only stock changes are crucial for "history" table based on requirement.
            // But let's add a generic EDIT record if desired.
            \App\Models\MaterialHistory::create([
                'material_id' => $inventory->id,
                'user_id' => $user->id,
                'type' => 'EDIT',
                'quantity_change' => 0,
                'current_balance' => $inventory->stock_quantity,
                'reference_type' => null,
                'reference_id' => null,
                'description' => 'Edición de detalles: ' . implode(', ', array_keys($changes)),
            ]);
        }

        return redirect()->back();
    }

    public function store(Request $request)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('inventory.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $validated = $request->validate([
            'product_name' => 'required|string',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'code' => 'nullable|string|unique:materials',
            'serial_number' => 'nullable|string',
            'stock_quantity' => 'required|integer',
            'company' => 'required|string',
            'category' => 'nullable|string',
            'document_path' => 'nullable|file|max:10240', // Max 10MB
        ]);

        if ($request->hasFile('document_path')) {
            $path = $request->file('document_path')->store('materials', 'public');
            $validated['document_path'] = $path;
        }

        // Constraint: If Serial Number exists, Stock max is 1.
        if (!empty($validated['serial_number']) && $validated['stock_quantity'] > 1) {
            return redirect()->back()->withErrors(['stock_quantity' => 'Items with Serial Number must have a stock of 1 (Unique Asset).']);
        }

        Material::create($validated);

        return redirect()->back();
    }

    public function search(Request $request)
    {
        $code = $request->query('code');
        if (!$code) {
            return response()->json(null);
        }

        $user = request()->user();

        // Find match by code or serial_number
        $material = Material::where(function ($q) use ($code) {
            $q->where('code', $code)
                ->orWhere('serial_number', $code);
        });

        $this->applyCompanyScope($material, $request);

        $material = $material->first();

        return response()->json($material);
    }
}
