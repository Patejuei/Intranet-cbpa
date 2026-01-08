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
      'unit_of_measure' => 'nullable|string|max:50',
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

  public function edit(WorkshopInventory $inventory)
  {
    return Inertia::render('vehicles/inventory/edit', [
      'item' => $inventory,
      'vehicles' => \App\Models\Vehicle::all(['id', 'name', 'plate', 'model'])
    ]);
  }

  public function update(Request $request, WorkshopInventory $inventory)
  {
    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'sku' => 'nullable|string|unique:workshop_inventory,sku,' . $inventory->id,
      'category' => 'required|in:insumo,repuesto',
      'unit_of_measure' => 'nullable|string|max:50',
      'stock' => 'required|integer|min:0',
      'min_stock' => 'required|integer|min:0',
      'unit_cost' => 'required|integer|min:0',
      'location' => 'nullable|string|max:255',
      'compatibility' => 'nullable|array',
      'description' => 'nullable|string',
    ]);

    $inventory->update($validated);

    return redirect()->route('vehicles.inventory.index')->with('success', 'Ítem actualizado correctamente.');
  }

  public function destroy(WorkshopInventory $inventory)
  {
    try {
      $inventory->delete();
      return redirect()->route('vehicles.inventory.index')->with('success', 'Ítem eliminado correctamente.');
    } catch (\Exception $e) {
      return back()->withErrors(['error' => 'No se puede eliminar este ítem porque tiene registros asociados.']);
    }
  }

  public function export()
  {
    $filename = 'inventario-bodega-' . date('Y-m-d') . '.csv';
    $items = WorkshopInventory::all();

    $columns = ['SKU', 'Nombre', 'Categoria', 'Unidad Medida', 'Stock', 'Min Stock', 'Costo Unit.', 'Total Valorizado', 'Ubicacion', 'Descripcion'];

    $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

    // Set Headers
    $sheet->fromArray($columns, NULL, 'A1');

    // Add Data
    $data = [];
    foreach ($items as $item) {
      $data[] = [
        $item->sku,
        $item->name,
        $item->category,
        $item->unit_of_measure,
        $item->stock,
        $item->min_stock,
        $item->unit_cost,
        $item->stock * $item->unit_cost,
        $item->location,
        $item->description
      ];
    }

    if (!empty($data)) {
      $sheet->fromArray($data, NULL, 'A2');
    }

    // Prepare Writer
    $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);

    // Save to temp file
    $tempFile = tempnam(sys_get_temp_dir(), 'inv');
    $writer->save($tempFile);

    return response()->download($tempFile, 'inventario-bodega-' . date('Y-m-d') . '.xlsx')->deleteFileAfterSend(true);
  }
}
