<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleMaintenanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $status = $request->input('status');
        $search = $request->input('search');

        $query = \App\Models\VehicleMaintenance::with(['vehicle', 'issues'])
            ->orderBy('entry_date', 'desc');

        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'comandancia') {
            $query->whereHas('vehicle', function ($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        if ($status) {
            if ($status === 'active') {
                $query->whereNull('exit_date');
            } elseif ($status === 'history') {
                $query->whereNotNull('exit_date');
            } else {
                $query->where('status', $status);
            }
        } else {
            // Default to active if no filter? Or all? 
            // User asked to "show all orders... and add filter".
            // Let's default to ALL but typically "active" is more useful as default. 
            // I'll default to 'active' for UI cleanliness, but user can select 'All'.
            // Actually, let's look at the instruction "muestra todas las ordenes...". 
            // It might be an instruction: "Show all orders [in the view] and add a filter".
            // So if I default to All, it matches the request text literally.
            // But 'active' is safer for performance/usability. I'll default to Active in the controller if param missing?
            // "muestra todas las ordenes" might be "It currently shows all orders [active ones? No, it only shows active ones usually]". 
            // The current code has `whereNull('exit_date')`. 
            // Use case: user wants to see history.
            // I will NOT apply default filter if 'status' is not present, effectively showing "All" IF I remove the `whereNull`.
            // But wait, `whereNull` was there before.
            // Let's add a default behaviour: if status is NOT provided, show ALL (as per "muestra todas las ordenes").
            // And use the filter to narrow it down.
        }

        if ($search) {
            $query->whereHas('vehicle', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('plate', 'like', "%{$search}%");
            });
        }

        $maintenances = $query->paginate(20)->withQueryString();

        return Inertia::render('vehicles/workshop/index', [
            'maintenances' => $maintenances,
            'filters' => $request->only(['status', 'search'])
        ]);
    }

    public function create()
    {
        $user = request()->user();

        $vehicles = \App\Models\Vehicle::query()
            ->when($user->role === 'capitan', function ($q) use ($user) {
                $q->where('company', $user->company);
            })
            ->with(['issues' => function ($q) {
                $q->where('status', '!=', 'Resolved')->latest();
            }, 'maintenances' => function ($q) {
                $q->whereNull('exit_date')->latest();
            }])
            ->orderBy('name')
            ->get()
            ->map(function ($vehicle) {
                $vehicle->active_maintenance_id = $vehicle->maintenances->first()?->id;
                unset($vehicle->maintenances);
                return $vehicle;
            });

        return Inertia::render('vehicles/workshop/create', [
            'vehicles' => $vehicles
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'entry_date' => 'required|date',
            'tentative_exit_date' => 'nullable|date',
            'workshop_name' => 'required|string',
            'description' => 'nullable|string',
            'issue_ids' => 'nullable|array',
            'issue_ids.*' => 'exists:vehicle_issues,id',
            'tasks' => 'nullable|array',
            'tasks.*' => 'string',
            // New Fields
            'responsible_person' => 'required|string',
            'mileage_in' => 'required|integer',
            'traction' => 'required|string', // 4x2, 4x4
            'fuel_type' => 'required|string',
            'transmission' => 'required|string',
            'entry_checklist' => 'nullable|array',
        ]);

        $maintenance = \App\Models\VehicleMaintenance::create([
            'vehicle_id' => $validated['vehicle_id'],
            'entry_date' => $validated['entry_date'],
            'tentative_exit_date' => $validated['tentative_exit_date'],
            'workshop_name' => $validated['workshop_name'],
            'description' => $validated['description'] ?? '',
            'status' => 'En Taller',
            'responsible_person' => $validated['responsible_person'],
            'mileage_in' => $validated['mileage_in'],
            'traction' => $validated['traction'],
            'fuel_type' => $validated['fuel_type'],
            'transmission' => $validated['transmission'],
            'entry_checklist' => $validated['entry_checklist'] ?? null,
        ]);

        if (!empty($validated['issue_ids'])) {
            \App\Models\VehicleIssue::whereIn('id', $validated['issue_ids'])
                ->update(['vehicle_maintenance_id' => $maintenance->id]);
        }

        if (!empty($validated['tasks'])) {
            foreach ($validated['tasks'] as $taskDescription) {
                if (!empty($taskDescription)) {
                    $maintenance->tasks()->create([
                        'description' => $taskDescription,
                    ]);
                }
            }
        }

        // Update Vehicle Status
        $maintenance->vehicle->update(['status' => 'Workshop']);

        return redirect()->route('vehicles.workshop.index')->with('success', 'Ingreso a taller registrado.');
    }

    public function finalize(Request $request, \App\Models\VehicleMaintenance $maintenance)
    {
        if ($maintenance->status === 'Finalizado' || $maintenance->status === 'Entregado') {
            return back()->with('error', 'El mantenimiento ya está finalizado.');
        }

        $maintenance->update([
            'status' => 'Finalizado',
            'exit_date' => now(),
        ]);

        // Resolve issues
        $maintenance->issues()->update(['status' => 'Resolved']);
        $maintenance->tasks()->update(['is_completed' => true]);

        return back()->with('success', 'Mantenimiento finalizado correctamente.');
    }

    public function addInventoryItem(Request $request, \App\Models\VehicleMaintenance $maintenance)
    {
        $validated = $request->validate([
            'inventory_item_id' => 'required|exists:workshop_inventory,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $item = \App\Models\WorkshopInventory::findOrFail($validated['inventory_item_id']);

        if ($item->stock < $validated['quantity']) {
            return back()->withErrors(['quantity' => 'Stock insuficiente. Disponible: ' . $item->stock]);
        }

        // Calculate cost
        $unitCost = $item->unit_cost;
        $totalCost = $unitCost * $validated['quantity'];

        // Decrement stock
        $item->decrement('stock', $validated['quantity']);

        // Attach to maintenance
        $maintenance->items()->attach($item->id, [
            'quantity' => $validated['quantity'],
            'unit_cost' => $unitCost,
            'total_cost' => $totalCost,
        ]);

        // Update maintenance total cost (optional, if stored on maintenance table)
        // $maintenance->increment('cost', $totalCost); // If cost column tracks parts + labor

        return back()->with('success', 'Ítem agregado correctamente.');
    }

    public function removeInventoryItem(Request $request, \App\Models\VehicleMaintenance $maintenance, $itemId)
    {
        // Find the pivot record
        $pivot = \Illuminate\Support\Facades\DB::table('vehicle_maintenance_items')
            ->where('maintenance_id', $maintenance->id)
            ->where('inventory_item_id', $itemId)
            ->first();

        if (!$pivot) {
            return back()->with('error', 'Ítem no encontrado en esta orden.');
        }

        // Restore stock
        \App\Models\WorkshopInventory::where('id', $itemId)->increment('stock', $pivot->quantity);

        // Detach
        $maintenance->items()->detach($itemId);

        return back()->with('success', 'Ítem eliminado y stock restaurado.');
    }

    /**
     * Display the specified resource.
     */
    public function show(\App\Models\VehicleMaintenance $workshop)
    {
        $workshop->load(['vehicle', 'issues', 'tasks', 'items']);

        return Inertia::render('vehicles/workshop/show', [
            'maintenance' => $workshop,
            'inventoryItems' => \App\Models\WorkshopInventory::orderBy('name')->get()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    public function print(\App\Models\VehicleMaintenance $maintenance)
    {
        $maintenance->load(['vehicle', 'issues', 'tasks']);
        return Inertia::render('vehicles/workshop/print', [
            'maintenance' => $maintenance
        ]);
    }

    public function printExit(\App\Models\VehicleMaintenance $maintenance)
    {
        $maintenance->load(['vehicle', 'issues', 'tasks', 'items']);
        return Inertia::render('vehicles/workshop/print_exit', [
            'maintenance' => $maintenance
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, \App\Models\VehicleMaintenance $workshop)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'tentative_exit_date' => 'nullable|date',
            'tasks' => 'nullable|array',
            'tasks.*.id' => 'nullable|integer',
            'tasks.*.description' => 'required|string',
            'tasks.*.is_completed' => 'boolean',
            'tasks.*.cost' => 'nullable|numeric',
            'resolved_issue_ids' => 'nullable|array',
        ]);

        $workshop->update([
            'status' => $validated['status'],
            'tentative_exit_date' => $validated['tentative_exit_date'],
        ]);

        // Handle Tasks
        if (isset($validated['tasks'])) {
            $currentTaskIds = [];
            foreach ($validated['tasks'] as $taskData) {
                if (isset($taskData['id'])) {
                    $task = \App\Models\VehicleMaintenanceTask::find($taskData['id']);
                    if ($task && $task->vehicle_maintenance_id === $workshop->id) {
                        $task->update([
                            'description' => $taskData['description'],
                            'is_completed' => $taskData['is_completed'] ?? false,
                            'cost' => $taskData['cost'] ?? null,
                        ]);
                        $currentTaskIds[] = $task->id;
                    }
                } else {
                    $newTask = $workshop->tasks()->create([
                        'description' => $taskData['description'],
                        'is_completed' => $taskData['is_completed'] ?? false,
                        'cost' => $taskData['cost'] ?? null,
                    ]);
                    $currentTaskIds[] = $newTask->id;
                }
            }
            // Optional: Delete tasks not in the list? User didn't ask for deletion explicitly but editing specific tasks implies list management.
            // For now, let's keep it additive/update unless we implement delete in frontend.
        }

        // Handle Issues Resolution
        if (isset($validated['resolved_issue_ids'])) {
            \App\Models\VehicleIssue::whereIn('id', $validated['resolved_issue_ids'])
                ->where('vehicle_maintenance_id', $workshop->id)
                ->update(['status' => 'Resolved']); // Or 'Fixed'
        }

        // Check if status is finalized (e.g. 'Entregado') to release vehicle?
        // User asked for states like "Ingresado, Trabajando, En espera de materiales".
        // If "Entregado" or "Finalizado", we might want to set Vehicle to Operative.
        if ($validated['status'] === 'Entregado' || $validated['status'] === 'Finalizado') {
            $workshop->update(['exit_date' => now()]);
            $workshop->vehicle->update(['status' => 'Operative']);
        }

        return redirect()->back()->with('success', 'Orden de trabajo actualizada.');
    }
}
