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

        // Comandancia Logic for CREATE: Can only create for own company's vehicles?
        // User said: "solo podrán registrar y configurar los checklist de los Vehículos asignados a Comandancia"
        if ($user->company === 'Comandancia') {
            $query->where('company', 'Comandancia');
        } elseif ($user->role === 'capitan') {
            $query->where('company', $user->company);
        } elseif ($user->role !== 'admin') {
            // Restrict to vehicles the user is allowed to drive
            // Requirement Logic:
            // 1. "solo podrá realizar los checklist de sus carros habilitados que sean de su compañía"
            // 2. "si no posee vehículos habilitados de su compañía, podrá realizar los vehículos de comandancia que tenga habilitados"

            $assignedIds = $user->driverVehicles()->pluck('vehicles.id');

            // Filter assigned IDs by User Company
            $companyAssignedIds = \App\Models\Vehicle::whereIn('id', $assignedIds)
                ->where('company', $user->company)
                ->pluck('id');

            if ($companyAssignedIds->isNotEmpty()) {
                // If they have assigned vehicles in their company, RESTRICT TO THESE ONLY.
                $query->whereIn('id', $companyAssignedIds);
            } else {
                // If NO assigned vehicles in their company, allow Comandancia vehicles they are assigned to.
                $comandanciaAssignedIds = \App\Models\Vehicle::whereIn('id', $assignedIds)
                    ->where('company', 'Comandancia')
                    ->pluck('id');

                // If they have Comandancia assigned vehicles, show those. 
                // If they have NEITHER, the result will be empty, which is correct (no access).
                $query->whereIn('id', $comandanciaAssignedIds);
            }
        }

        $vehicles = $query->get();

        $items = \App\Models\ChecklistItem::where('is_active', true)
            ->where(function ($q) use ($user) {
                $q->where('company', $user->company)
                    ->orWhereNull('company');
            })
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

        $user = $request->user();
        if ($user->company === 'Comandancia') {
            $vehicle = \App\Models\Vehicle::findOrFail($validated['vehicle_id']);
            if ($vehicle->company !== 'Comandancia') {
                abort(403, 'Solo puede registrar checklists para vehículos de Comandancia.');
            }
        } elseif ($user->role !== 'admin' && $user->role !== 'capitan') {
            // Re-validate against restricted logic
            $assignedIds = $user->driverVehicles()->pluck('vehicles.id');
            $companyAssignedIds = \App\Models\Vehicle::whereIn('id', $assignedIds)
                ->where('company', $user->company)
                ->pluck('id');

            $allowedIds = collect([]);
            if ($companyAssignedIds->isNotEmpty()) {
                $allowedIds = $companyAssignedIds;
            } else {
                $comandanciaAssignedIds = \App\Models\Vehicle::whereIn('id', $assignedIds)
                    ->where('company', 'Comandancia')
                    ->pluck('id');
                $allowedIds = $comandanciaAssignedIds;
            }

            if (!$allowedIds->contains($validated['vehicle_id'])) {
                abort(403, 'No tiene permiso para realizar checklist a este vehículo.');
            }
        }

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

            // Auto-create Incident if status is NOT 'ok'
            if ($detail['status'] !== 'ok') {
                $item = \App\Models\ChecklistItem::find($detail['item_id']);
                $severity = 'Medium';
                if ($detail['status'] === 'urgent') $severity = 'High';

                \App\Models\VehicleIssue::create([
                    'vehicle_id' => $checklist->vehicle_id,
                    'reporter_id' => $checklist->user_id,
                    'description' => "Falla reportada en Checklist: {$item->name}. Detalle: " . ($detail['notes'] ?? 'Sin observaciones'),
                    'severity' => $severity,
                    'status' => 'Open',
                    'date' => now(),
                    'is_stopped' => false, // Default to false, Captain decides
                ]);
            }
        }

        return redirect()->route('vehicles.checklists.show', $checklist)->with('success', 'Checklist creado correctamente.');
    }

    public function show(\App\Models\VehicleChecklist $checklist)
    {
        $checklist->load(['vehicle', 'user', 'details.item', 'captain', 'machinist', 'commander', 'inspector']);
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
        // Comandancia Logic: "podrán Visualizar todos los registros"
        if ($user->company !== 'Comandancia' && $user->role !== 'admin' && $user->role !== 'mechanic') {
            $query->whereHas('vehicle', function ($q) use ($user) {
                // Same visibility logic as logs: Company OR Assigned
                $driverIds = $user->driverVehicles()->pluck('vehicles.id');
                $q->where(function ($query) use ($driverIds, $user) {
                    $query->where('company', $user->company);
                    if ($driverIds->isNotEmpty()) {
                        $query->orWhereIn('id', $driverIds);
                    }
                });
            });
        }

        // Comandancia View All implied by NOT entering the if block above.

        // Vehicle Filter
        if ($request->has('vehicle_id') && $request->vehicle_id) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        // Vehicles list for filter
        $vehiclesQuery = \App\Models\Vehicle::query()->orderBy('name');
        if ($user->company !== 'Comandancia' && $user->role !== 'admin' && $user->role !== 'mechanic') {
            // Apply same filter for the dropdown
            $driverIds = $user->driverVehicles()->pluck('vehicles.id');
            $vehiclesQuery->where(function ($query) use ($driverIds, $user) {
                $query->where('company', $user->company);
                if ($driverIds->isNotEmpty()) {
                    $query->orWhereIn('id', $driverIds);
                }
            });
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
        $checklist->load('vehicle'); // Ensure vehicle is loaded

        // Logic for Comandancia Vehicles
        if ($checklist->vehicle->company === 'Comandancia') {
            $isCommander = ($user->role === 'comandante' || $user->role === 'admin');
            // Inspector MM
            $isInspector = ($user->role === 'inspector' && trim($user->department) === 'Material Mayor') || $user->role === 'admin';

            if (!$isCommander && !$isInspector) {
                return back()->with('error', 'No autorizado. Se requiere rol de Comandante o Inspector de Material Mayor.');
            }

            if ($isCommander) {
                $checklist->update([
                    'commander_id' => $user->id,
                    'commander_reviewed_at' => now(),
                ]);
            }

            if ($isInspector) {
                $checklist->update([
                    'inspector_id' => $user->id,
                    'inspector_reviewed_at' => now(),
                ]);
            }

            // Check if both signed (Comandancia flow)
            $checklist->refresh();
            if ($checklist->commander_reviewed_at && $checklist->inspector_reviewed_at) {
                $checklist->update(['status' => 'Completed']);
            } else {
                $checklist->update(['status' => 'Partially Reviewed']);
            }

            return back()->with('success', 'Checklist de Comandancia visado.');
        } else {
            // Logic for Company Vehicles (Standard)
            $isCaptain = ($user->role === 'capitan' || $user->role === 'admin');
            $isMachinist = ($user->role === 'maquinista' || $user->role === 'mechanic');

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

            // Check if both signed (Standard flow)
            $checklist->refresh();
            if ($checklist->captain_reviewed_at && $checklist->machinist_reviewed_at) {
                $checklist->update(['status' => 'Completed']);
            } else {
                $checklist->update(['status' => 'Partially Reviewed']);
            }

            return back()->with('success', 'Checklist visado.');
        }
    }

    private function userCanReview($user, $checklist)
    {
        if (!$user) return false;
        if ($checklist->status === 'Completed') return false;

        if ($checklist->vehicle->company === 'Comandancia') {
            $isCommander = ($user->role === 'comandante' || $user->role === 'admin');
            $isInspector = ($user->role === 'inspector' && trim($user->department) === 'Material Mayor') || $user->role === 'admin';

            if ($isCommander && !$checklist->commander_reviewed_at) return true;
            if ($isInspector && !$checklist->inspector_reviewed_at) return true;

            return false;
        } else {
            $isCaptain = ($user->role === 'capitan' || $user->role === 'admin');
            $isMachinist = ($user->role === 'maquinista' || $user->role === 'mechanic');

            if ($isCaptain && !$checklist->captain_reviewed_at) return true;
            if ($isMachinist && !$checklist->machinist_reviewed_at) return true;

            return false;
        }
    }
}
