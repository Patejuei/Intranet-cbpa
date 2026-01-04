<?php

namespace App\Http\Controllers;

use App\Models\WorkshopInventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkshopInventoryController extends Controller
{
  public function index(Request $request)
  {
    $query = WorkshopInventory::query();

    if ($request->has('search')) {
      $query->where('name', 'like', '%' . $request->search . '%')
        ->orWhere('sku', 'like', '%' . $request->search . '%');
    }

    if ($request->has('category') && $request->category !== 'all') {
      $query->where('category', $request->category);
    }

    return Inertia::render('vehicles/inventory/index', [
      'items' => $query->orderBy('name')->paginate(10),
      'filters' => $request->only(['search', 'category']),
    ]);
  }

  public function create()
  {
    return Inertia::render('vehicles/inventory/create');
  }

  public function store(Request $request)
  {
    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'sku' => 'nullable|string|unique:workshop_inventory,sku',
      'category' => 'required|in:insumo,repuesto',
      'stock' => 'required|integer|min:0',
      'min_stock' => 'required|integer|min:0',
      'unit_cost' => 'required|integer|min:0',
      'location' => 'nullable|string|max:255',
      'compatibility' => 'nullable|string',
      'description' => 'nullable|string',
    ]);

    WorkshopInventory::create($validated);

    return redirect()->route('vehicles.inventory.index')->with('success', 'Ítem creado correctamente.');
  }

  public function edit(WorkshopInventory $item)
  {
    return Inertia::render('vehicles/inventory/edit', [
      'item' => $item
    ]);
  }

  public function update(Request $request, WorkshopInventory $item)
  {
    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'sku' => 'nullable|string|unique:workshop_inventory,sku,' . $item->id,
      'category' => 'required|in:insumo,repuesto',
      'stock' => 'required|integer|min:0',
      'min_stock' => 'required|integer|min:0',
      'unit_cost' => 'required|integer|min:0',
      'location' => 'nullable|string|max:255',
      'compatibility' => 'nullable|string',
      'description' => 'nullable|string',
    ]);

    $item->update($validated);

    return redirect()->route('vehicles.inventory.index')->with('success', 'Ítem actualizado correctamente.');
  }

  public function destroy(WorkshopInventory $item)
  {
    // Prevent deletion if used in maintenance? Or allow and nullify?
    // Usually safer to block or soft delete. For now, try/catch constrain
    try {
      $item->delete();
      return redirect()->route('vehicles.inventory.index')->with('success', 'Ítem eliminado correctamente.');
    } catch (\Exception $e) {
      return back()->withErrors(['error' => 'No se puede eliminar este ítem porque tiene registros asociados.']);
    }
  }
}
