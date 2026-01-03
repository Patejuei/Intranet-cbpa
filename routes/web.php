<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

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

        return Inertia::render('dashboard', [
            'upcomingBatteries' => $upcomingBatteries,
            'pendingTickets' => $pendingTickets,
            'respondedTickets' => $respondedTickets,
        ]);
    })->name('dashboard');

    Route::resource('batteries', BatteryLogController::class)->only(['index', 'store'])->middleware('module:batteries');
    Route::resource('equipment', EquipmentLogController::class)->only(['index', 'store'])->middleware('module:equipment');
    Route::resource('tickets', TicketController::class)->middleware('module:tickets');
    Route::post('tickets/{ticket}/reply', [TicketController::class, 'reply'])->name('tickets.reply');
    Route::patch('tickets/{ticket}/status', [TicketController::class, 'updateStatus'])->name('tickets.updateStatus');
    Route::patch('tickets/{ticket}/priority', [TicketController::class, 'updatePriority'])->name('tickets.updatePriority');

    // Admin Routes
    Route::middleware('module:admin')->group(function () {
        Route::resource('admin/users', \App\Http\Controllers\AdminUserController::class);
        Route::resource('admin/firefighters', \App\Http\Controllers\FirefighterController::class);
    });

    // Inventory & Deliveries (Protected by equipment permission for now, or just auth?)
    // Assuming users with 'equipment' permission can manage inventory and deliveries
    Route::middleware('module:equipment')->group(function () {
        Route::resource('inventory', \App\Http\Controllers\MaterialController::class)->only(['index', 'store', 'update']);
        Route::resource('deliveries', \App\Http\Controllers\DeliveryCertificateController::class);
        Route::get('deliveries/{delivery}/pdf', [\App\Http\Controllers\DeliveryCertificateController::class, 'downloadPdf'])->name('deliveries.pdf');
    });
});

require __DIR__ . '/settings.php';
