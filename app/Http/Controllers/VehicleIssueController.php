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
                // Allow both Company vehicles AND Driver Assigned vehicles
                $driverIds = $user->driverVehicles()->pluck('vehicles.id');
                $q->where(function ($query) use ($driverIds, $user) {
                    $query->where('company', $user->company);
                    if ($driverIds->isNotEmpty()) {
                        $query->orWhereIn('id', $driverIds);
                    }
                });
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
            'date' => 'required|date',
        ]);

        $issue = \App\Models\VehicleIssue::create([
            ...$validated,
            'reporter_id' => $request->user()->id,
            'status' => 'Open',
            'is_stopped' => false, // Always false initially unless Captain creates it? 
            // Requirement: "User or Cuartelero ... cannot select if material is out of service"
            // Captain will review it.
            // If Captain creates it, maybe they can set it? 
            // For simplicity, let's say ALL go through review or Captain edits it immediately after.
            // But if Captain creates it, it's auto-reviewed?
            // Let's keep it simple: Create -> Open. Captain Review -> Reviewed.
        ]);

        // If Captain creates it, we could auto-approve, but let's stick to flow:
        // Reported -> Notification to Captain. Captain reviews.

        return redirect()->back()->with('success', 'Incidencia reportada. Pendiente de revisión por Capitán.');
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
    public function update(Request $request, \App\Models\VehicleIssue $incident) // Changed variable name to match route param if possible, or bind
    {
        // This is for Captain Review
        $user = $request->user();
        if ($user->role !== 'capitan' && $user->role !== 'admin' && $user->company !== 'Comandancia') {
            // Comandancia might also review? Requirement says "Capitán ... podrá revisar".
            // Let's allow Admin/Captain.
            abort(403);
        }

        $validated = $request->validate([
            'is_stopped' => 'required|boolean',
            'sent_to_hq' => 'boolean',
            'sent_to_workshop' => 'boolean',
        ]);

        $incident->update([
            'is_stopped' => $validated['is_stopped'],
            'sent_to_hq' => $validated['sent_to_hq'] ?? false,
            'sent_to_workshop' => $validated['sent_to_workshop'] ?? false,
            'reviewed_at' => now(),
            'reviewed_by' => $user->id,
        ]);

        if ($validated['is_stopped']) {
            $incident->vehicle->update(['status' => 'Out of Service']);
        } else {
            // If marked as NOT stopped, ensure vehicle is not Out of Service due to THIS incident?
            // Logic is tricky if multiple incidents. But usually one stops it.
            // If we mark it distinct, we might want to check if other active incidents stop it.
            // For now, if Captain says NOT stopped, we might assume it's operational unless other flags exists.
            // But simpler: If stopped -> Out of Service. If not stopped -> don't change or set to 'Active' (Available)?
            // The prompt says "determinar si queda fuera de servicio ... o no".
            // If "No", maybe we should set it back to Available if it was Out of Service? 
            // Or just leave it.
            // Let's leave it unless explicitly requested to restore.
            // Actually, if it was running, it stays running.
        }

        return redirect()->back()->with('success', 'Incidencia revisada correctamente.');
    }

    public function markAsRead(Request $request, \App\Models\VehicleIssue $incident)
    {
        $user = $request->user();

        // Workshop
        if ($user->role === 'mechanic' || $user->role === 'admin') { // Assuming mechanic role or specific permission
            // Or check if user is from Workshop?
            // Prompt: "usuarios del Taller Mecánico"
            // Role 'mechanic' exists in AdminUser options? Yes.
            $incident->update(['workshop_read_at' => now()]);
        }

        // Comandancia (HQ)
        if ($user->company === 'Comandancia' || $user->role === 'admin') {
            // "Visto por Comandancia"
            $incident->update(['hq_read_at' => now()]);
        }

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
