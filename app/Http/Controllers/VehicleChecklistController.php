<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VehicleChecklist;
use Inertia\Inertia;

class VehicleChecklistController extends Controller
{
    public function create()
    {
        $user = request()->user();
        $query = \App\Models\Vehicle::where('status', '!=', 'Decommissioned');

        if ($user->role === 'capitan') {
            $query->where('company', $user->company);
        } elseif ($user->role !== 'admin') {
            // Restrict to vehicles the user is allowed to drive
            $query->whereIn('id', $user->driverVehicles()->pluck('vehicles.id'));
        }

        $vehicles = $query->get();

        $items = \App\Models\ChecklistItem::where('is_active', true)
            ->get()
            ->groupBy('category');

        return \Inertia\Inertia::render('vehicles/checklist/create', [
            'vehicles' => $vehicles,
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'details' => 'required|array',
            'details.*.item_id' => 'required|exists:checklist_items,id',
            'details.*.status' => 'required|in:ok,urgent,next_maint',
            'details.*.notes' => 'nullable|string',
            'general_observations' => 'nullable|string',
        ]);

        $checklist = \App\Models\VehicleChecklist::create([
            'vehicle_id' => $validated['vehicle_id'],
            'user_id' => $request->user()->id,
            'status' => 'Pending',
            'general_observations' => $validated['general_observations'] ?? null,
        ]);

        foreach ($validated['details'] as $detail) {
            $checklist->details()->create([
                'checklist_item_id' => $detail['item_id'],
                'status' => $detail['status'],
                'notes' => $detail['notes'] ?? null,
            ]);
        }

        return redirect()->route('vehicles.checklists.show', $checklist)->with('success', 'Checklist creado correctamente.');
    }

    public function show(\App\Models\VehicleChecklist $checklist)
    {
        $checklist->load(['vehicle', 'user', 'details.item', 'captain', 'machinist']);
        $auth_user = request()->user();
        return \Inertia\Inertia::render('vehicles/checklist/show', [
            'checklist' => $checklist,
            'canReview' => $this->userCanReview($auth_user, $checklist),
        ]);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $query = \App\Models\VehicleChecklist::with(['vehicle', 'user'])->latest();

        // Filter by user permissions/company
        if ($user->company !== 'Comandancia' && $user->role !== 'admin' && $user->role !== 'mechanic') {
            $query->whereHas('vehicle', function ($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        // Vehicle Filter
        if ($request->has('vehicle_id') && $request->vehicle_id) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        // Vehicles list for filter
        $vehiclesQuery = \App\Models\Vehicle::query()->orderBy('name');
        if ($user->company !== 'Comandancia' && $user->role !== 'admin' && $user->role !== 'mechanic') {
            $vehiclesQuery->where('company', $user->company);
        }

        return \Inertia\Inertia::render('vehicles/checklist/index', [
            'checklists' => $query->paginate(15)->appends($request->all()),
            'vehicles' => $vehiclesQuery->get(['id', 'name']),
            'filters' => $request->only(['vehicle_id']),
        ]);
    }

    public function review(Request $request, \App\Models\VehicleChecklist $checklist)
    {
        $user = $request->user();
        // Check roles
        $isCaptain = ($user->role === 'capitan' || $user->role === 'admin'); // Assuming Admin can sign as Captain
        $isMachinist = ($user->role === 'maquinista' || $user->role === 'mechanic'); // Allow mechanic too? user requested machinist.

        if (!$isCaptain && !$isMachinist) {
            return back()->with('error', 'No autorizado.');
        }

        if ($isCaptain) {
            $checklist->update([
                'captain_id' => $user->id,
                'captain_reviewed_at' => now(),
            ]);
        }

        if ($isMachinist) {
            $checklist->update([
                'machinist_id' => $user->id,
                'machinist_reviewed_at' => now(),
            ]);
        }

        // Check if both signed
        $checklist->refresh();
        if ($checklist->captain_reviewed_at && $checklist->machinist_reviewed_at) {
            $checklist->update(['status' => 'Completed']);
        } else {
            $checklist->update(['status' => 'Partially Reviewed']);
        }

        return back()->with('success', 'Checklist visado.');
    }

    private function userCanReview($user, $checklist)
    {
        if (!$user) return false;
        $isCaptain = ($user->role === 'capitan' || $user->role === 'admin');
        $isMachinist = ($user->role === 'maquinista' || $user->role === 'mechanic');

        if ($checklist->status === 'Completed') return false;

        if ($isCaptain && !$checklist->captain_reviewed_at) return true;
        if ($isMachinist && !$checklist->machinist_reviewed_at) return true;

        return false;
    }
}
