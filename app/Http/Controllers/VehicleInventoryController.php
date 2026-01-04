<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleInventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->user()->role === 'capitan') {
            abort(403, 'Acceso denegado.');
        }

        $query = \App\Models\WorkshopInventory::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('sku', 'like', "%{$search}%");
        }

        if ($request->has('category') && $request->input('category') !== 'all') {
            $query->where('category', $request->input('category'));
        }

        $items = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('vehicles/inventory/index', [
            'items' => $items,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (request()->user()->role === 'capitan') {
            abort(403);
        }
        $vehicles = \App\Models\Vehicle::orderBy('name')->get(['id', 'name', 'plate', 'model']);
        return Inertia::render('vehicles/inventory/create', [
            'vehicles' => $vehicles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->user()->role === 'capitan') {
            abort(403);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|unique:workshop_inventory,sku',
            'category' => 'required|in:insumo,repuesto',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'required|integer|min:0',
            'unit_cost' => 'required|integer|min:0',
            'location' => 'nullable|string',
            'compatibility' => 'nullable|array', // Expecting array of vehicle IDs or strings
            'description' => 'nullable|string',
        ]);

        \App\Models\WorkshopInventory::create($validated);

        return redirect()->route('vehicles.inventory.index')->with('success', 'Ítem creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Not used explicitly? Maybe for details view later.
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        if (request()->user()->role === 'capitan') {
            abort(403);
        }
        $item = \App\Models\WorkshopInventory::findOrFail($id);
        $vehicles = \App\Models\Vehicle::orderBy('name')->get(['id', 'name', 'plate', 'model']);

        return Inertia::render('vehicles/inventory/edit', [
            'item' => $item,
            'vehicles' => $vehicles
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        if ($request->user()->role === 'capitan') {
            abort(403);
        }
        $item = \App\Models\WorkshopInventory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|unique:workshop_inventory,sku,' . $item->id,
            'category' => 'required|in:insumo,repuesto',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'required|integer|min:0',
            'unit_cost' => 'required|integer|min:0',
            'location' => 'nullable|string',
            'compatibility' => 'nullable|array',
            'description' => 'nullable|string',
        ]);

        $item->update($validated);

        return redirect()->route('vehicles.inventory.index')->with('success', 'Ítem actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (request()->user()->role === 'capitan') {
            abort(403);
        }
        $item = \App\Models\WorkshopInventory::findOrFail($id);

        // Check if used? 
        // Logic: if used in maintenance, maybe prevent delete or soft delete.
        // For now, allow delete (FK constraint might block if cascade not set or restrict set).
        // Migration said: onDelete('restrict') for maintenance items. So it will fail if used.

        try {
            $item->delete();
            return redirect()->back()->with('success', 'Ítem eliminado correctamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'No se puede eliminar el ítem porque tiene registros asociados.');
        }
    }
}
