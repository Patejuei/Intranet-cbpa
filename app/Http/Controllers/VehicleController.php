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
    public function show(\App\Models\Vehicle $vehicle)
    {
        $vehicle->load(['issues' => function ($q) {
            $q->latest(); // Filter resolved? Maybe show all but differentiate.
        }, 'maintenances' => function ($q) {
            $q->latest();
        }]);

        return Inertia::render('vehicles/status/show', [
            'vehicle' => $vehicle
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
