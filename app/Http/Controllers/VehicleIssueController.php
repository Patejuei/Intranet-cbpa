<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleIssueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = request()->user();
        $query = \App\Models\VehicleIssue::with(['vehicle', 'reporter'])->latest();

        if ($user->company !== 'Comandancia' && $user->role !== 'admin') {
            $query->whereHas('vehicle', function ($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        return Inertia::render('vehicles/incidents/index', [
            'issues' => $query->paginate(10),
            'vehicles' => \App\Models\Vehicle::when($user->company !== 'Comandancia' && $user->role !== 'admin', function ($q) use ($user) {
                $q->where('company', $user->company);
            })->orderBy('name')->get(['id', 'name']),
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
            'description' => 'required|string',
            'severity' => 'required|in:Low,Medium,High,Critical',
            'is_stopped' => 'boolean',
            'date' => 'required|date',
        ]);

        $issue = \App\Models\VehicleIssue::create([
            ...$validated,
            'reporter_id' => $request->user()->id,
            'status' => 'Open',
        ]);

        // If is_stopped is true, update vehicle status
        if ($validated['is_stopped']) {
            $issue->vehicle->update(['status' => 'Out of Service']);
        }

        return redirect()->back()->with('success', 'Incidencia reportada correctamente.');
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
