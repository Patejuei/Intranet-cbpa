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
        $query = \App\Models\VehicleIssue::with(['vehicle', 'reporter'])->withCount('images')->latest();
        $driverIds = $user->driverVehicles()->pluck('vehicles.id');

        $isInspectorMM = $user->role === 'inspector' && $user->department === 'Material Mayor';

        if ($user->company !== 'Comandancia' && $user->role !== 'admin' && !$isInspectorMM) {
            $query->whereHas('vehicle', function ($query) use ($user, $driverIds) {
                $query->where('company', $user->company);
                if ($driverIds->isNotEmpty()) {
                    $query->orWhereIn('id', $driverIds);
                }
            });
        }
        if ($user->role === 'mechanic') {
            $query->where('sent_to_workshop', '=', 1);
        }
        if ($user->role === 'commander') {
            $query->where('reported_to_commander', '=', 1);
        }

        return Inertia::render('vehicles/incidents/index', [
            'issues' => $query->paginate(10),
            'vehicles' => \App\Models\Vehicle::when($user->company !== 'Comandancia' && $user->role !== 'admin' && !$isInspectorMM, function ($q) use ($user, $driverIds) {
                // Allow both Company vehicles AND Driver Assigned vehicles
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
        $user = $request->user();
        if ($user->role === 'ayudante') {
            abort(403, 'El ayudante no puede reportar incidencias directamente.');
        }

        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'description' => 'required|string',
            'severity' => 'required|in:Low,Medium,High,Critical',
            'date' => 'required|date',
        ]);

        // Enforcement for Cuartelero: Must be from same Company
        if ($user->role === 'cuartelero') {
            $vehicle = \App\Models\Vehicle::findOrFail($validated['vehicle_id']);
            if ($vehicle->company !== $user->company) {
                abort(403, 'Solo puede reportar incidencias de vehículos de su compañía.');
            }
        }

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
    public function show(\App\Models\VehicleIssue $incident)
    {
        $user = request()->user();
        
        // Basic check: if not admin/comandante, must either be from same company OR be the reporter OR be mechanic (if sent to workshop) OR be inspector (if sent to HQ)
        $canView = $user->role === 'admin' || 
                   $user->company === 'Comandancia' || 
                   $incident->vehicle->company === $user->company ||
                   $incident->reporter_id === $user->id;

        if (!$canView) {
            if ($user->role === 'mechanic' && $incident->sent_to_workshop) {
                $canView = true;
            }
            if ($user->role === 'inspector' && $user->department === 'Material Mayor') {
                $canView = true;
            }
        }

        if (!$canView) {
            abort(403);
        }

        $incident->load(['vehicle', 'reporter', 'reviewer', 'images.uploader']);

        return Inertia::render('vehicles/incidents/show', [
            'incident' => $incident,
            'canEdit' => $incident->canBeEditedBy($user),
            'canDeleteImages' => $incident->canDeleteImagesBy($user),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(\App\Models\VehicleIssue $incident)
    {
        if (!$incident->canBeEditedBy(request()->user())) {
            abort(403, 'No tiene permisos para editar esta incidencia.');
        }

        $incident->load(['vehicle', 'reporter', 'images.uploader']);

        return Inertia::render('vehicles/incidents/edit', [
            'incident' => $incident,
        ]);
    }

    /**
     * Update the specified resource's content in storage.
     */
    public function updateContent(Request $request, \App\Models\VehicleIssue $incident)
    {
        if (!$incident->canBeEditedBy($request->user())) {
            abort(403, 'No tiene permisos para editar esta incidencia.');
        }

        $validated = $request->validate([
            'severity' => 'required|in:Low,Medium,High,Critical',
        ]);

        $incident->update($validated);

        return redirect()->route('vehicles.incidents.show', $incident)
            ->with('success', 'Gravedad de la incidencia actualizada correctamente.');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, \App\Models\VehicleIssue $incident) // Changed variable name to match route param if possible, or bind
    {
        $this->validateOtp($request);

        // This is for Captain / Ayudante Review
        $user = $request->user();
        if (
            $user->role !== 'capitan' &&
            $user->role !== 'ayudante' &&
            $user->role !== 'comandante' &&
            $user->role !== 'admin' &&
            $user->role !== 'cuartelero' && // Added Cuartelero
            !($user->role === 'inspector' && $user->department === 'Material Mayor')
        ) {
            abort(403);
        }

        // Trigger restriction for Cuartelero / Ayudante
        if ($user->role === 'cuartelero' || $user->role === 'ayudante') {
            if ($incident->vehicle->company !== $user->company) {
                abort(403, 'No tiene permisos para editar esta incidencia.');
            }
        }

        $validated = $request->validate([
            'is_stopped' => 'required|boolean',
            'sent_to_hq' => 'boolean',
            'sent_to_workshop' => 'boolean',
            'reported_to_commander' => 'boolean',
            'status' => 'nullable|string',
        ]);

        $incident->update([
            'is_stopped' => $validated['is_stopped'],
            'sent_to_hq' => $validated['sent_to_hq'] ?? false,
            'sent_to_workshop' => $validated['sent_to_workshop'] ?? false,
            'reported_to_commander' => $validated['reported_to_commander'] ?? false,
            'reviewed_at' => now(),
            'reviewed_by' => $user->id,
            'status' => $request->input('status', $incident->status), // Allow manual status update
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

        // Comandancia (HQ) OR Inspector Material Mayor
        if (
            $user->role === 'admin' ||
            ($user->role === 'inspector' && $user->department === 'Material Mayor' && $incident->sent_to_hq)
        ) {
            // "Visto por Material Mayor" (uses hq_read_at field)
            $incident->update(['hq_read_at' => now()]);
        }

        if ($user->role === 'comandante' || $user->role === 'admin') {
            $incident->update([
                'commander_seen' => true,
                'commander_seen_at' => now(),
            ]);
        }


        return redirect()->back();
    }

    public function markCommanderSeen(Request $request, \App\Models\VehicleIssue $incident)
    {
        $user = $request->user();

        if ($user->role === 'comandante' || $user->role === 'admin') {
            $incident->update([
                'commander_seen' => true,
                'commander_seen_at' => now(),
            ]);
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
