<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\NotificationRecipientService;
use App\Notifications\VehicleIssueCreatedNotification;
use App\Notifications\VehicleIssueReviewedNotification;

class VehicleIssueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = \App\Models\VehicleIssue::with(['vehicle', 'reporter'])->withCount('images');
        $driverIds = $user->driverVehicles()->pluck('vehicles.id');

        $isInspectorMM = $user->role === 'inspector' && $user->department === 'Material Mayor';
        $isCuarteleroComandancia = ($user->role === 'cuartelero' && $user->company === 'Comandancia');

        if ($isCuarteleroComandancia) {
            $query->whereHas('vehicle', function ($q) {
                $q->where('company', 'Comandancia');
            });
        } elseif ($user->company !== 'Comandancia' && $user->role !== 'admin' && !$isInspectorMM) {
            $query->whereHas('vehicle', function ($query) use ($user, $driverIds) {
                $query->where('company', $user->company);
                if ($driverIds->isNotEmpty()) {
                    $query->orWhereIn('id', $driverIds);
                }
            });
        }
        if ($user->role === 'mechanic') {
            $query->where('vehicle_issues.sent_to_workshop', '=', 1);
        }
        if ($user->role === 'commander') {
            $query->where('vehicle_issues.reported_to_commander', '=', 1);
        }

        $scopedVehicleIds = (clone $query)->whereNotNull('vehicle_id')->distinct()->pluck('vehicle_id');

        // Column Filters
        if ($request->filled('date')) {
            $query->where('vehicle_issues.date', 'like', '%' . trim($request->input('date')) . '%');
        }

        if ($request->filled('vehicle_ids')) {
            $vehicleIds = array_values(array_filter(array_map('trim', explode(',', (string) $request->input('vehicle_ids')))));
            if (!empty($vehicleIds)) {
                $query->whereIn('vehicle_issues.vehicle_id', $vehicleIds);
            }
        }

        if ($request->filled('vehicle_name')) {
            $vehicleName = trim($request->input('vehicle_name'));
            $query->whereHas('vehicle', function ($q) use ($vehicleName) {
                $q->where('name', 'like', "%{$vehicleName}%");
            });
        }

        if ($request->filled('severity') && $request->input('severity') !== 'all') {
            $query->where('vehicle_issues.severity', $request->input('severity'));
        }

        if ($request->filled('description')) {
            $query->where('vehicle_issues.description', 'like', '%' . trim($request->input('description')) . '%');
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $status = $request->input('status');
            if ($status === 'Resolved' || $status === 'En Taller') {
                $query->where('vehicle_issues.status', $status);
            } elseif ($status === 'pending_review') {
                $query->whereNotIn('vehicle_issues.status', ['Resolved', 'En Taller'])
                    ->whereNull('vehicle_issues.reviewed_at');
            } elseif ($status === 'reviewed') {
                $query->whereNotIn('vehicle_issues.status', ['Resolved', 'En Taller'])
                    ->whereNotNull('vehicle_issues.reviewed_at');
            }
        }

        if ($request->filled('reporter_name')) {
            $reporterName = trim($request->input('reporter_name'));
            $query->whereHas('reporter', function ($q) use ($reporterName) {
                $q->where('name', 'like', "%{$reporterName}%");
            });
        }

        // Whitelisted Sorting
        $sort = $request->input('sort');
        $direction = $request->input('direction') === 'asc' ? 'asc' : 'desc';

        switch ($sort) {
            case 'date':
                $query->orderBy('vehicle_issues.date', $direction);
                break;
            case 'vehicle':
                $query->leftJoin('vehicles', 'vehicle_issues.vehicle_id', '=', 'vehicles.id')
                    ->select('vehicle_issues.*')
                    ->orderBy('vehicles.name', $direction);
                break;
            case 'severity':
                $query->orderBy('vehicle_issues.severity', $direction);
                break;
            case 'description':
                $query->orderBy('vehicle_issues.description', $direction);
                break;
            case 'status':
                $query->orderBy('vehicle_issues.status', $direction);
                break;
            case 'reporter':
                $query->leftJoin('users', 'vehicle_issues.reporter_id', '=', 'users.id')
                    ->select('vehicle_issues.*')
                    ->orderBy('users.name', $direction);
                break;
            default:
                $query->latest('vehicle_issues.created_at');
                break;
        }

        return Inertia::render('vehicles/incidents/index', [
            'issues' => $query->paginate(10)->withQueryString(),
            'vehicles' => \App\Models\Vehicle::whereIn('id', $scopedVehicleIds)
                ->orderBy('name')
                ->get(['id', 'name', 'company']),
            'filters' => $request->only([
                'date',
                'vehicle_ids',
                'vehicle_name',
                'severity',
                'description',
                'status',
                'reporter_name',
                'sort',
                'direction',
            ]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = request()->user();
        if ($user->role === 'ayudante' || $user->role === 'cuartelero') {
            abort(403, 'No tiene permiso para reportar incidencias directamente.');
        }

        $driverIds = $user->driverVehicles()->pluck('vehicles.id');
        $isInspectorMM = $user->role === 'inspector' && $user->department === 'Material Mayor';
        $isCuarteleroComandancia = ($user->role === 'cuartelero' && $user->company === 'Comandancia');

        $vehicles = \App\Models\Vehicle::when($isCuarteleroComandancia, function ($q) {
            $q->where('company', 'Comandancia');
        })->when(!$isCuarteleroComandancia && $user->company !== 'Comandancia' && $user->role !== 'admin' && !$isInspectorMM, function ($q) use ($user, $driverIds) {
            $q->where(function ($query) use ($driverIds, $user) {
                $query->where('company', $user->company);
                if ($driverIds->isNotEmpty()) {
                    $query->orWhereIn('id', $driverIds);
                }
            });
        })->orderBy('name')->get(['id', 'name', 'company']);

        return Inertia::render('vehicles/incidents/create', [
            'vehicles' => $vehicles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'ayudante' || $user->role === 'cuartelero') {
            abort(403, 'No tiene permiso para reportar incidencias directamente.');
        }

        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'description' => 'required|string',
            'severity' => 'required|in:Low,Medium,High,Critical',
            'date' => 'required|date',
            'images' => 'nullable|array|max:3',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ], [
            'images.max' => 'Se pueden adjuntar hasta un máximo de 3 imágenes.',
            'images.*.image' => 'Los archivos adjuntos deben ser imágenes.',
            'images.*.mimes' => 'Solo se aceptan imágenes en formato JPEG, PNG, JPG o WEBP.',
            'images.*.max' => 'Cada imagen no debe superar los 5MB de tamaño.',
        ]);

        $issue = \App\Models\VehicleIssue::create([
            'vehicle_id' => $validated['vehicle_id'],
            'description' => $validated['description'],
            'severity' => $validated['severity'],
            'date' => $validated['date'],
            'reporter_id' => $request->user()->id,
            'status' => 'Open',
            'is_stopped' => false,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                if ($file && $file->isValid()) {
                    $originalName = $file->getClientOriginalName();
                    $path = $file->store("vehicle_issues/{$issue->id}", 'public');

                    \App\Models\VehicleIssueImage::create([
                        'vehicle_issue_id' => $issue->id,
                        'image_path' => $path,
                        'original_name' => $originalName,
                        'uploaded_by' => $user->id,
                    ]);
                }
            }
        }

        $issue->load('vehicle');
        $vehicle = $issue->vehicle;

        if ($vehicle) {
            if ($vehicle->company === 'Comandancia') {
                $recipients = NotificationRecipientService::getCommanders()
                    ->merge(NotificationRecipientService::getMaterialMayorInspectors());
            } else {
                $recipients = NotificationRecipientService::getCaptainsForCompany($vehicle->company);
            }

            NotificationRecipientService::safeNotify($recipients, new VehicleIssueCreatedNotification($issue));
        }

        return redirect()->route('vehicles.incidents.index')->with('success', 'Incidencia reportada. Pendiente de revisión por Capitán.');
    }

    /**
     * Display the specified resource.
     */
    public function show(\App\Models\VehicleIssue $incident)
    {
        $user = request()->user();

        // Cuartelero de Comandancia: solo puede visualizar incidencias de los vehículos de Comandancia
        if ($user && $user->role === 'cuartelero' && $user->company === 'Comandancia') {
            if ($incident->vehicle->company !== 'Comandancia') {
                abort(403, 'No tiene permiso para ver esta incidencia.');
            }
        }
        
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
        }

        // Notificar a las entidades seleccionadas en la revisión
        $recipients = collect();

        if (!empty($validated['sent_to_hq'])) {
            $recipients = $recipients->merge(NotificationRecipientService::getMaterialMayorInspectors());
        }
        if (!empty($validated['sent_to_workshop'])) {
            $recipients = $recipients->merge(NotificationRecipientService::getMechanics());
        }
        if (!empty($validated['reported_to_commander'])) {
            $recipients = $recipients->merge(NotificationRecipientService::getCommanders());
        }

        if ($recipients->isNotEmpty()) {
            NotificationRecipientService::safeNotify($recipients, new VehicleIssueReviewedNotification($incident));
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
