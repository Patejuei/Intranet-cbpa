<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = request()->user();

        $logQuery = \App\Models\VehicleLog::with(['vehicle', 'driver'])->latest();

        // If not admin/comandancia, filter logs by user's company
        if ($user->company !== 'Comandancia' && $user->role !== 'admin') {
            $logQuery->whereHas('vehicle', function ($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        return Inertia::render('vehicles/logs/index', [
            'logs' => $logQuery->paginate(15),
            'vehicles' => \App\Models\Vehicle::query()
                ->when($user->role !== 'admin' && $user->role !== 'mechanic', function ($q) use ($user) {
                    $driverIds = $user->driverVehicles()->pluck('vehicles.id');
                    if ($driverIds->isNotEmpty()) {
                        $q->whereIn('id', $driverIds);
                    } else {
                        $q->where('company', $user->company);
                    }
                })
                ->orderBy('name')->get(['id', 'name']),
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
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_km' => 'required|integer',
            'end_km' => 'nullable|integer|gte:start_km',
            'activity_type' => 'required|string',
            'destination' => 'required|string',
            'date' => 'required|date',
            'fuel_liters' => 'nullable|numeric',
            'fuel_coupon' => 'nullable|string',
            'observations' => 'nullable|string',
            'receipt' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120', // 5MB max
        ]);

        $receiptPath = null;
        if ($request->hasFile('receipt')) {
            $receiptPath = $request->file('receipt')->store('receipts', 'public');
        }

        \App\Models\VehicleLog::create([
            ...$validated,
            'driver_id' => $request->user()->id,
            'receipt_path' => $receiptPath,
        ]);

        return redirect()->back()->with('success', 'Bitácora registrada correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
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
