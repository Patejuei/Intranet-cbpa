<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function dashboard()
    {
        // Permission check
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('vehicles.view', $user->permissions ?? [])) {
            abort(403);
        }

        return Inertia::render('vehicles/dashboard');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = request()->user();

        // 1. Authorization
        // Note: Middleware 'module:vehicles' already checks basic access if set up correctly, 
        // but we can double check or rely on it. 
        // We need to return different data structure based on role.

        if ($user->company === 'Comandancia' || $user->role === 'admin' || $user->role === 'cuartelero' || $user->role === 'mechanic') {
            // Define custom order
            $order = [
                'Comandancia',
                'Primera Compañía',
                'Segunda Compañía',
                'Tercera Compañía',
                'Cuarta Compañía',
                'Quinta Compañía',
                'Sexta Compañía',
                'Séptima Compañía',
                'Octava Compañía',
                'Novena Compañía',
                'Décima Compañía'
            ];

            // Fetch ALL vehicles
            $vehicles = \App\Models\Vehicle::all();

            // Group by company
            $grouped = $vehicles->groupBy('company');

            // Sort the groups based on $order
            $sortedGrouped = $grouped->sortBy(function ($vehicles, $company) use ($order) {
                $index = array_search($company, $order);
                return $index === false ? 999 : $index;
            });

            return Inertia::render('vehicles/status/index', [
                'groupedVehicles' => $sortedGrouped,
                'isComandancia' => true,
            ]);
        } else {
            // Fetch ONLY user's company vehicles
            $vehicles = \App\Models\Vehicle::where('company', $user->company)->orderBy('name')->get();

            return Inertia::render('vehicles/status/index', [
                'vehicles' => $vehicles,
                'isComandancia' => false,
                'userCompany' => $user->company,
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $vehicle = \App\Models\Vehicle::with(['issues' => function ($q) {
            $q->latest();
        }, 'maintenances' => function ($q) {
            $q->latest();
        }, 'maintenances.tasks', 'maintenances.issues'])->findOrFail($id);

        $totalMaintenanceCost = $vehicle->maintenances->sum(function ($maintenance) {
            return $maintenance->tasks->sum('cost');
        });

        return Inertia::render('vehicles/status/show', [
            'vehicle' => $vehicle,
            'totalMaintenanceCost' => $totalMaintenanceCost
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan') {
            abort(403, 'No tiene permisos para agregar vehículos.');
        }

        return Inertia::render('vehicles/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan') {
            abort(403, 'No tiene permisos para agregar vehículos.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'plate' => 'required|string|max:255|unique:vehicles',
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'company' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'technical_review_expires_at' => 'nullable|date',
            'circulation_permit_expires_at' => 'nullable|date',
            'insurance_expires_at' => 'nullable|date',
        ]);

        $vehicle = \App\Models\Vehicle::create([
            ...$validated,
            'status' => 'Operative',
        ]);

        return redirect()->route('vehicles.status.index')->with('success', 'Vehículo creado correctamente.');
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan') {
            abort(403, 'No tiene permisos para editar vehículos.');
        }

        $vehicle = \App\Models\Vehicle::findOrFail($id);

        return Inertia::render('vehicles/edit', [
            'vehicle' => $vehicle
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan') {
            abort(403, 'No tiene permisos para editar vehículos.');
        }

        $vehicle = \App\Models\Vehicle::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'plate' => 'required|string|max:255|unique:vehicles,plate,' . $vehicle->id,
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'company' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'technical_review_expires_at' => 'nullable|date',
            'circulation_permit_expires_at' => 'nullable|date',
            'insurance_expires_at' => 'nullable|date',
        ]);

        $vehicle->update($validated);

        return redirect()->route('vehicles.status.show', $vehicle->id)->with('success', 'Vehículo actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan') {
            abort(403, 'No tiene permisos para eliminar vehículos.');
        }

        $vehicle = \App\Models\Vehicle::findOrFail($id);
        $vehicle->delete();

        return redirect()->route('vehicles.status.index')->with('success', 'Vehículo eliminado correctamente.');
    }
}
