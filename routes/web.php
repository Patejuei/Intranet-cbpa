<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VehicleLogController;
use App\Http\Controllers\VehicleIssueController;
use App\Http\Controllers\VehicleMaintenanceController;
use App\Http\Controllers\VehicleInventoryController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

use App\Http\Controllers\BatteryLogController;
use App\Http\Controllers\EquipmentLogController;
use App\Http\Controllers\TicketController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
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
            $pendingTickets = \App\Models\Ticket::where('status', 'ABIERTO')->with('user')->take(5)->get();
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

        if ($user->role !== 'admin' && $user->company !== 'Comandancia' && $user->company) {
            $vehicleQuery->where('company', $user->company);
            $incidentQuery->whereHas('vehicle', function ($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        $vehiclesStopped = $vehicleQuery->get();
        $pendingIncidents = $incidentQuery->take(5)->get();

        // Workshop Vehicles Logic (Vehicles in Workshop state, get active Maintenance)
        $workshopQuery = \App\Models\Vehicle::query()
            ->where('status', 'Workshop')
            ->with(['maintenances' => function ($q) {
                $q->where('status', '!=', 'Completed')->latest();
            }]);

        if ($user->role !== 'admin' && $user->company !== 'Comandancia' && $user->company) {
            $workshopQuery->where('company', $user->company);
        }

        $vehiclesInWorkshop = $workshopQuery->get();

        // Expiring Documents Logic
        $expiringQuery = \App\Models\Vehicle::query()
            ->where('status', '!=', 'Decommissioned')
            ->where(function ($q) {
                $threshold = now()->addDays(30);
                $q->whereDate('technical_review_expires_at', '<=', $threshold)
                    ->orWhereDate('circulation_permit_expires_at', '<=', $threshold)
                    ->orWhereDate('insurance_expires_at', '<=', $threshold);
            });

        if ($user->role !== 'admin' && $user->company !== 'Comandancia' && $user->company) {
            $expiringQuery->where('company', $user->company);
        }

        $expiringDocuments = $expiringQuery->get()->map(function ($vehicle) {
            $alerts = [];
            $check = function ($date, $label) use (&$alerts) {
                if (!$date) return;
                $dateObj = \Carbon\Carbon::parse($date);
                $days = (int)now()->diffInDays($dateObj, false);
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
        })->filter(function ($v) {
            return count($v['alerts']) > 0;
        })->values();

        return Inertia::render('dashboard', [
            'upcomingBatteries' => $upcomingBatteries,
            'pendingTickets' => $pendingTickets,
            'respondedTickets' => $respondedTickets,
            'vehiclesStopped' => $vehiclesStopped,
            'pendingIncidents' => $pendingIncidents,
            'vehiclesInWorkshop' => $vehiclesInWorkshop,
            'expiringDocuments' => $expiringDocuments,
        ]);
    })->name('dashboard');

    Route::resource('batteries', BatteryLogController::class)->only(['index', 'store'])->middleware('module:batteries');
    Route::resource('equipment', EquipmentLogController::class)->only(['index', 'store'])->middleware('module:equipment');
    Route::resource('tickets', TicketController::class)->middleware('module:tickets');
    Route::post('tickets/{ticket}/reply', [TicketController::class, 'reply'])->name('tickets.reply');
    Route::patch('tickets/{ticket}/status', [TicketController::class, 'updateStatus'])->name('tickets.updateStatus');
    Route::patch('tickets/{ticket}/priority', [TicketController::class, 'updatePriority'])->name('tickets.updatePriority');

    // Material Mayor Routes
    Route::middleware('module:vehicles')->prefix('vehicles')->group(function () {
        Route::get('create', [VehicleController::class, 'create'])->name('vehicles.create');
        Route::post('', [VehicleController::class, 'store'])->name('vehicles.store');
        Route::get('{vehicle}/edit', [VehicleController::class, 'edit'])->name('vehicles.edit');
        Route::put('{vehicle}', [VehicleController::class, 'update'])->name('vehicles.update');
        Route::delete('{vehicle}', [VehicleController::class, 'destroy'])->name('vehicles.destroy');

        Route::resource('status', VehicleController::class)->names('vehicles.status'); // Main vehicle CRUD/Status
        Route::resource('logs', VehicleLogController::class)->names('vehicles.logs');
        Route::patch('incidents/{incident}/mark-read', [VehicleIssueController::class, 'markAsRead'])->name('vehicles.incidents.markRead');
        Route::resource('incidents', VehicleIssueController::class)->names('vehicles.incidents');
        Route::get('workshop/{maintenance}/print', [VehicleMaintenanceController::class, 'print'])->name('vehicles.workshop.print');
        Route::get('workshop/{maintenance}/print-exit', [VehicleMaintenanceController::class, 'printExit'])->name('vehicles.workshop.print_exit');
        Route::resource('workshop', VehicleMaintenanceController::class)->names('vehicles.workshop');
        Route::resource('inventory', VehicleInventoryController::class)->names('vehicles.inventory');
    });

    // Admin Routes
    Route::middleware('module:admin')->group(function () {
        Route::resource('admin/users', \App\Http\Controllers\AdminUserController::class);
        Route::resource('admin/firefighters', \App\Http\Controllers\FirefighterController::class);
    });

    // Inventory & Deliveries (Protected by equipment permission for now, or just auth?)
    // Assuming users with 'equipment' permission can manage inventory and deliveries
    Route::middleware('module:equipment')->group(function () {
        Route::get('inventory/search', [\App\Http\Controllers\MaterialController::class, 'search'])->name('inventory.search');
        Route::post('inventory/import', [\App\Http\Controllers\MaterialController::class, 'import'])->name('inventory.import');
        Route::resource('inventory', \App\Http\Controllers\MaterialController::class)->only(['index', 'store', 'update', 'show']);
        Route::resource('deliveries', \App\Http\Controllers\DeliveryCertificateController::class);
        Route::get('deliveries/{delivery}/pdf', [\App\Http\Controllers\DeliveryCertificateController::class, 'downloadPdf'])->name('deliveries.pdf');
        Route::resource('receptions', \App\Http\Controllers\ReceptionCertificateController::class);
        Route::get('receptions/{reception}/pdf', [\App\Http\Controllers\ReceptionCertificateController::class, 'downloadPdf'])->name('receptions.pdf');
    });
});

require __DIR__ . '/settings.php';
