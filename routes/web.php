<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VehicleLogController;
use App\Http\Controllers\VehicleIssueController;
use App\Http\Controllers\VehicleMaintenanceController;

use App\Http\Controllers\Central\CentralController;
Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::post('/otp/verify', [App\Http\Controllers\OtpVerificationController::class, 'verify'])->name('otp.verify');
Route::get('/otp/check', [App\Http\Controllers\OtpVerificationController::class, 'check'])->name('otp.check');

use App\Http\Controllers\BatteryLogController;
use App\Http\Controllers\EquipmentLogController;
use App\Http\Controllers\TicketController;

Route::middleware(['auth', 'verified'])->group(function () {
    // Assigned Materials (Prendas a Cargo)
    Route::get('/assigned-materials', [App\Http\Controllers\AssignedMaterialController::class, 'index'])->name('assigned_materials.index');
    Route::get('/assigned-materials/{firefighter}/pdf', [App\Http\Controllers\AssignedMaterialController::class, 'downloadPdf'])->name('assigned_materials.pdf');
    Route::get('/assigned-materials/{firefighter}', [App\Http\Controllers\AssignedMaterialController::class, 'show'])->name('assigned_materials.show');
    Route::get('/api/assigned-materials/{firefighter}', [App\Http\Controllers\AssignedMaterialController::class, 'getByFirefighter'])->name('assigned_materials.get_json');

    Route::get(
        'dashboard',
        function () {
            $user = request()->user();
            $query = \App\Models\BatteryLog::query()
                ->whereDate('next_change_date', '>=', now())
                ->orderBy('next_change_date');

            if ($user->role !== 'admin' && $user->company !== 'Comandancia' && $user->company) {
                $query->where('company', $user->company);
            }

            $upcomingBatteries = $query->take(5)->get();

            // Ticket Logic
            $pendingTickets = [];
            $respondedTickets = [];

            if ($user->company === 'Comandancia') {
                $pendingTickets = \App\Models\Ticket::where('status', '!=', 'CERRADO')
                    ->when($user->role !== 'admin' && $user->role !== 'inspector', function ($q) {
                        $q->where('reported_to_commander', true)
                            ->where('commander_seen', false);
                    })
                    ->with('user')->take(5)->get();
            } else {
                $respondedTickets = \App\Models\Ticket::where('company', $user->company)
                    ->where('status', 'EN_PROCESO') // Assuming En Proceso means responded/active
                    ->with('user')
                    ->take(5)
                    ->get();
            }

            // Material Mayor Logic
            $vehicleQuery = \App\Models\Vehicle::query()->whereIn('status', ['Out of Service', 'Workshop']);
            $incidentQuery = \App\Models\VehicleIssue::query()->where('status', 'Open')->with(['vehicle', 'reporter']);

            if (
                ($user->role === 'inspector' && $user->department === 'Material Mayor')
            ) {
                $incidentQuery->where(
                    function ($q) {
                        $q->where('sent_to_hq', true)
                            ->whereNull('hq_read_at');
                    }
                );
            } elseif ($user->role !== 'admin' && $user->company !== 'Comandancia' && $user->company) {
                $vehicleQuery->where('company', $user->company);
                $incidentQuery->whereHas(
                    'vehicle',
                    function ($q) use ($user) {
                        $q->where('company', $user->company);
                    }
                );
            } elseif ($user->role === 'mechanic') {
                $incidentQuery->where('sent_to_workshop', true)->whereNull('workshop_read_at');
            } elseif ($user->role === 'comandante') {
                $incidentQuery->where('reported_to_commander', true)->whereNull('commander_seen');
            }

            $vehiclesStopped = $vehicleQuery->get();
            $pendingIncidents = $incidentQuery->take(5)->get();

            // Workshop Vehicles Logic (Vehicles in Workshop state, get active Maintenance)
    
            $workshopQuery = \App\Models\Vehicle::query()
                ->where('status', 'Workshop')
                ->with([
                    'maintenances' => function ($q) {
                        $q->where('status', '!=', 'Completed')->latest();
                    }
                ]);

            if ($user->role !== 'admin' && $user->company !== 'Comandancia' && $user->company) {
                $workshopQuery->where('company', $user->company);
            }

            $vehiclesInWorkshop = $workshopQuery->get();

            // Expiring Documents Logic
            $expiringQuery = \App\Models\Vehicle::query()
                ->where('status', '!=', 'Decommissioned')
                ->where(
                    function ($q) {
                    $threshold = now()->addDays(30);
                    $q->whereDate('technical_review_expires_at', '<=', $threshold)
                        ->orWhereDate('circulation_permit_expires_at', '<=', $threshold)
                        ->orWhereDate('insurance_expires_at', '<=', $threshold);
                }
                );

            if ($user->role !== 'admin' && $user->company !== 'Comandancia' && $user->company) {
                $expiringQuery->where('company', $user->company);
            }

            $expiringDocuments = $expiringQuery->get()->map(
                function ($vehicle) {
                    $alerts = [];
                    $check = function ($date, $label) use (&$alerts) {
                        if (!$date)
                            return;
                        $dateObj = \Carbon\Carbon::parse($date);
                        $days = (int) now()->diffInDays($dateObj, false);
                        // If days is negative, it's expired.
                        if ($days <= 30) {
                            $status = $days <= 7 ? 'danger' : 'warning';
                            $alerts[] = [
                                'label' => $label,
                                'date' => $dateObj->format('d-m-Y'),
                                'days' => $days,
                                'status' => $status
                            ];
                        }
                    };

                    $check($vehicle->technical_review_expires_at, 'Revisión Técnica');
                    $check($vehicle->circulation_permit_expires_at, 'Permiso de Circulación');
                    $check($vehicle->insurance_expires_at, 'Seguro Obligatorio');

                    return [
                        'id' => $vehicle->id,
                        'name' => $vehicle->name,
                        'company' => $vehicle->company,
                        'alerts' => $alerts
                    ];
                }
            )->filter(
                    function ($v) {
                        return count($v['alerts']) > 0;
                    }
                )->values();

            // Petty Cash Notifications
            $pendingPettyCash = [];
            if ($user->role === 'inspector' && $user->department === 'Material Mayor') {
                $pendingPettyCash = \App\Models\PettyCashRendition::where('status', 'pending_inspector')
                    ->with('user')
                    ->take(5)
                    ->get();
            } elseif ($user->role === 'comandante' || $user->role === 'admin') {
                $pendingPettyCash = \App\Models\PettyCashRendition::where('status', 'pending_comandante')
                    ->with('user')
                    ->take(5)
                    ->get();
            }

            // Critical Stock Logic (Comandancia / Inspector MM / Admin)
            $criticalStockItems = [];
            if (
                $user->role === 'admin' ||
                $user->company === 'Comandancia' ||
                ($user->role === 'inspector' && $user->department === 'Material Mayor')
            ) {
                $criticalStockItems = \App\Models\WorkshopInventory::whereColumn('stock', '<=', 'min_stock')->get();
            }

            // Pending Checklists Logic
            $checklistQuery = \App\Models\VehicleChecklist::with(['vehicle', 'user'])->where('status', '!=', 'Completed');

            if ($user->company === 'Comandancia') {
                // Comandancia Flow
                $isCommander = ($user->role === 'comandante' || $user->role === 'admin');
                $isInspector = ($user->role === 'inspector' && trim($user->department) === 'Material Mayor') || $user->role === 'admin';

                if ($isCommander || $isInspector) {
                    $checklistQuery->whereHas(
                        'vehicle',
                        function ($q) {
                            $q->where('company', 'Comandancia');
                        }
                    );

                    $conditions = [];
                    if ($isCommander)
                        $conditions[] = 'commander_reviewed_at';
                    if ($isInspector)
                        $conditions[] = 'inspector_reviewed_at';

                    $checklistQuery->where(
                        function ($q) use ($conditions) {
                            foreach ($conditions as $col) {
                                $q->orWhereNull($col); // Show if ANY of my roles haven't signed
                            }
                        }
                    );
                } else {
                    // Regular Comandancia user (like Workshop) sees nothing
                    $checklistQuery->whereRaw('1 = 0');
                }
            } else {
                // Company Flow
                $isCaptain = ($user->role === 'capitan' || $user->role === 'admin');
                $isMachinist = ($user->role === 'maquinista');

                if ($isCaptain || $isMachinist) {
                    // Filter by Company
                    $checklistQuery->whereHas(
                        'vehicle',
                        function ($q) use ($user) {
                        $q->where('company', $user->company);
                    }
                    );

                    $conditions = [];
                    if ($isCaptain)
                        $conditions[] = 'captain_reviewed_at';
                    if ($isMachinist)
                        $conditions[] = 'machinist_reviewed_at';

                    $checklistQuery->where(
                        function ($q) use ($conditions) {
                            foreach ($conditions as $col) {
                                $q->orWhereNull($col);
                            }
                        }
                    );
                } else {
                    // Regular user sees nothing
                    $checklistQuery->whereRaw('1 = 0');
                }
            }

            // Final execute
            $pendingChecklists = $checklistQuery->take(5)->get();


            return Inertia::render('dashboard', [
                'upcomingBatteries' => $upcomingBatteries,
                'pendingTickets' => $pendingTickets,
                'respondedTickets' => $respondedTickets,
                'vehiclesStopped' => $vehiclesStopped,
                'pendingIncidents' => $pendingIncidents,
                'vehiclesInWorkshop' => $vehiclesInWorkshop,
                'expiringDocuments' => $expiringDocuments,
                'pendingPettyCash' => $pendingPettyCash,
                'criticalStockItems' => $criticalStockItems,
                'pendingChecklists' => $pendingChecklists, // Added
            ]);
        }
    )->name('dashboard');

    Route::resource('batteries', BatteryLogController::class)->only(['index', 'store'])->middleware('module:batteries');
    // Equipment & Acquisitions
    Route::post('equipment/request', [EquipmentLogController::class, 'storeRequest'])->name('equipment.request');
    Route::post('equipment/acquisitions/{acquisition}/purchase', [EquipmentLogController::class, 'storePurchase'])->name('equipment.purchase');
    Route::post('equipment/acquisitions/{acquisition}/reception', [EquipmentLogController::class, 'confirmReception'])->name('equipment.reception');
    Route::post('equipment/acquisitions/{acquisition}/inventory-entry', [EquipmentLogController::class, 'finishInventoryEntry'])->name('equipment.inventory_entry');
    Route::resource('equipment', EquipmentLogController::class)->only(['index', 'store'])->middleware('module:equipment');
    Route::resource('tickets', TicketController::class)->middleware('module:tickets');
    Route::post('tickets/{ticket}/reply', [TicketController::class, 'reply'])->name('tickets.reply');
    Route::patch('tickets/{ticket}/status', [TicketController::class, 'updateStatus'])->name('tickets.updateStatus');
    Route::patch('tickets/{ticket}/priority', [TicketController::class, 'updatePriority'])->name('tickets.updatePriority');
    Route::post('tickets/{ticket}/report', [TicketController::class, 'reportToCommander'])->name('tickets.report');
    Route::post('tickets/{ticket}/mark-seen', [TicketController::class, 'markAsSeenByCommander'])->name('tickets.markSeen');

    // Material Mayor Routes
    Route::middleware('module:vehicles')->prefix('vehicles')->group(
        function () {
            // Report Routes
            Route::get('reports/incidents', [App\Http\Controllers\ReportController::class, 'incidentsReport'])->name('vehicles.reports.incidents');
            Route::get('reports/workshop', [App\Http\Controllers\ReportController::class, 'workshopReport'])->name('vehicles.reports.workshop');
            Route::get('reports/checklists', [App\Http\Controllers\ReportController::class, 'checklistsReport'])->name('vehicles.reports.checklists');
            Route::get('{vehicle}/reports/vehicle', [App\Http\Controllers\ReportController::class, 'vehicleReport'])->name('vehicles.reports.vehicle');
            Route::get('{vehicle}/reports/checklist', [App\Http\Controllers\ReportController::class, 'individualChecklistReport'])->name('vehicles.reports.individual_checklist');

            Route::get('create', [VehicleController::class, 'create'])->name('vehicles.create');
            Route::post('', [VehicleController::class, 'store'])->name('vehicles.store');
            Route::get('{vehicle}/edit', [VehicleController::class, 'edit'])->name('vehicles.edit');
            Route::put('{vehicle}', [VehicleController::class, 'update'])->name('vehicles.update');
            Route::delete('{vehicle}', [VehicleController::class, 'destroy'])->name('vehicles.destroy');

            Route::get('decommissioned', [VehicleController::class, 'decommissioned'])->name('vehicles.decommissioned');
            Route::patch('{vehicle}/restore', [VehicleController::class, 'restore'])->name('vehicles.restore')->withTrashed();
            Route::patch('{vehicle}/documents', [VehicleController::class, 'updateDocuments'])->name('vehicles.update_documents');

            Route::resource('status', VehicleController::class)->names('vehicles.status'); // Main vehicle CRUD/Status
            Route::get('logs/export', [VehicleLogController::class, 'export'])->name('vehicles.logs.export');
            Route::resource('logs', VehicleLogController::class)->names('vehicles.logs');
            Route::patch('incidents/{incident}/mark-read', [VehicleIssueController::class, 'markAsRead'])->name('vehicles.incidents.markRead');
            Route::patch('incidents/{incident}/mark-commander-seen', [VehicleIssueController::class, 'markCommanderSeen'])->name('vehicles.incidents.markCommanderSeen');
            Route::resource('incidents', VehicleIssueController::class)->names('vehicles.incidents');
            Route::get('workshop/{maintenance}/print', [VehicleMaintenanceController::class, 'print'])->name('vehicles.workshop.print');
            Route::get('workshop/{maintenance}/print-exit', [VehicleMaintenanceController::class, 'printExit'])->name('vehicles.workshop.print_exit');
            Route::post('workshop/{maintenance}/items', [VehicleMaintenanceController::class, 'addInventoryItem'])->name('vehicles.workshop.add_item');
            Route::delete('workshop/{maintenance}/items/{item}', [VehicleMaintenanceController::class, 'removeInventoryItem'])->name('vehicles.workshop.remove_item');
            Route::resource('workshop', VehicleMaintenanceController::class)->names('vehicles.workshop');
            Route::get('inventory/export', [App\Http\Controllers\WorkshopInventoryController::class, 'export'])->name('vehicles.inventory.export');
            Route::post('inventory/settings', [App\Http\Controllers\WorkshopInventoryController::class, 'updateSetting'])->name('vehicles.inventory.settings.update');
            Route::resource('inventory', App\Http\Controllers\WorkshopInventoryController::class)->names('vehicles.inventory');

            // Checklist Routes
            Route::post('checklists/{checklist}/review', [App\Http\Controllers\VehicleChecklistController::class, 'review'])->name('vehicles.checklists.review');
            Route::resource('checklists', App\Http\Controllers\VehicleChecklistController::class)->names('vehicles.checklists');

            // Route::resource('checklist-items', App\Http\Controllers\ChecklistItemController::class)->only(['index', 'store', 'destroy'])->names('vehicles.checklist-items');
    
            // Petty Cash Routes
            // Rendiciones (Ex-Petty Cash) Routes
            Route::post('renditions/export', [App\Http\Controllers\RenditionController::class, 'export'])->name('vehicles.renditions.export');
            Route::get('renditions/{rendition}/attachments/{attachment}', [App\Http\Controllers\RenditionController::class, 'viewAttachment'])->name('vehicles.renditions.attachment');
            Route::post('renditions/validate-batch', [App\Http\Controllers\RenditionController::class, 'validateBatch'])->name('vehicles.renditions.validate_batch');
            Route::post('renditions/{rendition}/validate', [App\Http\Controllers\RenditionController::class, 'validateRendition'])->name('vehicles.renditions.validate');
            Route::resource('renditions', App\Http\Controllers\RenditionController::class)->names('vehicles.renditions');
        }
    );

    // Central de Alarmas Routes
    Route::middleware('module:central')->prefix('central')->group(function () {
        Route::get('duty', [CentralController::class, 'dutyIndex'])->name('central.duty.index');
        Route::post('duty/start', [CentralController::class, 'startDuty'])->name('central.duty.start');
        Route::post('duty/{duty}/end', [CentralController::class, 'endDuty'])->name('central.duty.end');

        Route::get('reports', [CentralController::class, 'reportsIndex'])->name('central.reports.index');
        Route::get('reports/export-excel', [CentralController::class, 'exportReportsExcel'])->name('central.reports.export.excel');
        Route::get('reports/export-pdf', [CentralController::class, 'exportReportsPdf'])->name('central.reports.export.pdf');
    });

    // Admin Routes
    Route::middleware('module:users')->resource('admin/users', \App\Http\Controllers\AdminUserController::class);
    Route::middleware('module:firefighters')->resource('admin/firefighters', \App\Http\Controllers\FirefighterController::class);

    // Inventory & Deliveries (Protected by equipment permission for now, or just auth?)
    // Assuming users with 'equipment' permission can manage inventory and deliveries
    Route::middleware('module:equipment')->group(
        function () {
            Route::get('inventory/search', [\App\Http\Controllers\MaterialController::class, 'search'])->name('inventory.search');
            Route::get('materials/lookup', [\App\Http\Controllers\MaterialController::class, 'listForSelect'])->name('materials.lookup');
            Route::post('inventory/import-viper', [\App\Http\Controllers\MaterialController::class, 'importViper'])->name('inventory.import-viper');
            Route::get('inventory/import-viper', [\App\Http\Controllers\MaterialController::class, 'importViper'])->name('inventory.import-viper');
            Route::post('inventory/import', [\App\Http\Controllers\MaterialController::class, 'import'])->name('inventory.import');
            Route::get('inventory/{inventory}/document', [\App\Http\Controllers\MaterialController::class, 'downloadDocument'])->name('inventory.download-document');
            Route::resource('inventory', \App\Http\Controllers\MaterialController::class)->only(['index', 'store', 'update', 'show', 'destroy']);
            Route::resource('deliveries', \App\Http\Controllers\DeliveryCertificateController::class);
            Route::get('deliveries/{delivery}/pdf', [\App\Http\Controllers\DeliveryCertificateController::class, 'downloadPdf'])->name('deliveries.pdf');
            Route::resource('receptions', \App\Http\Controllers\ReceptionCertificateController::class);
            Route::get('receptions/{reception}/pdf', [\App\Http\Controllers\ReceptionCertificateController::class, 'downloadPdf'])->name('receptions.pdf');

            // Repair Requests
            Route::get('repairs', [\App\Http\Controllers\RepairRequestController::class, 'index'])->name('equipment.repairs.index');
            Route::get('repairs/create', [\App\Http\Controllers\RepairRequestController::class, 'create'])->name('equipment.repairs.create');
            Route::post('repairs', [\App\Http\Controllers\RepairRequestController::class, 'store'])->name('equipment.repairs.store');
            Route::get('repairs/{repair}', [\App\Http\Controllers\RepairRequestController::class, 'show'])->name('equipment.repairs.show');
            Route::post('repairs/{repair}/receive', [\App\Http\Controllers\RepairRequestController::class, 'receive'])->name('equipment.repairs.receive');
            Route::post('repairs/{repair}/evaluate', [\App\Http\Controllers\RepairRequestController::class, 'evaluate'])->name('equipment.repairs.evaluate');
            Route::post('repairs/{repair}/send-provider', [\App\Http\Controllers\RepairRequestController::class, 'sendToProvider'])->name('equipment.repairs.send_provider');
            Route::get('repairs/{repair}/provider-act', [\App\Http\Controllers\RepairRequestController::class, 'downloadProviderAct'])->name('equipment.repairs.download_provider_act');
            Route::post('repairs/{repair}/finish', [\App\Http\Controllers\RepairRequestController::class, 'finish'])->name('equipment.repairs.finish');
        }
    );

    // Material Baja Workflow
    Route::middleware(['auth'])->group(function () {
        Route::get('equipment/bajas', [\App\Http\Controllers\MaterialBajaController::class, 'index'])->name('equipment.bajas.index');
        Route::get('equipment/bajas/create', [\App\Http\Controllers\MaterialBajaController::class, 'create'])->name('equipment.bajas.create');
        Route::post('equipment/bajas', [\App\Http\Controllers\MaterialBajaController::class, 'storeRequest'])->name('equipment.bajas.store');
        Route::get('equipment/bajas/{baja}', [\App\Http\Controllers\MaterialBajaController::class, 'show'])->name('equipment.bajas.show');
        Route::post('equipment/bajas/{baja}/validate', [\App\Http\Controllers\MaterialBajaController::class, 'storeValidation'])->name('equipment.bajas.validate');
        Route::post('equipment/bajas/{baja}/approve', [\App\Http\Controllers\MaterialBajaController::class, 'approveBaja'])->name('equipment.bajas.approve');
        Route::get('equipment/bajas/{baja}/reception-certificate', [\App\Http\Controllers\MaterialBajaController::class, 'downloadReceptionCertificate'])->name('equipment.bajas.download.reception');
        Route::get('equipment/bajas/{baja}/baja-certificate', [\App\Http\Controllers\MaterialBajaController::class, 'downloadBajaCertificate'])->name('equipment.bajas.download.baja');
    });

    // My Profile Module (Accessible to all auth users)
    Route::get('/my-profile', [\App\Http\Controllers\MyProfileController::class, 'show'])->name('my-profile.show');
});

// Help & Manual (Publicly accessible)
Route::get('/help/{section?}/{submodule?}', [\App\Http\Controllers\HelpController::class, 'index'])->name('help.index');

require __DIR__ . '/settings.php';
