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
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('batteries', BatteryLogController::class)->only(['index', 'store'])->middleware('module:batteries');
    Route::resource('equipment', EquipmentLogController::class)->only(['index', 'store'])->middleware('module:equipment');
    Route::resource('tickets', TicketController::class)->only(['index', 'store'])->middleware('module:tickets');

    // Admin Routes
    Route::middleware('module:admin')->group(function () {
        Route::resource('admin/users', \App\Http\Controllers\AdminUserController::class);
        Route::resource('admin/firefighters', \App\Http\Controllers\FirefighterController::class);
    });

    // Inventory & Deliveries (Protected by equipment permission for now, or just auth?)
    // Assuming users with 'equipment' permission can manage inventory and deliveries
    Route::middleware('module:equipment')->group(function () {
        Route::resource('inventory', \App\Http\Controllers\MaterialController::class)->only(['index', 'store']);
        Route::resource('deliveries', \App\Http\Controllers\DeliveryCertificateController::class);
        Route::get('deliveries/{delivery_certificate}/pdf', [\App\Http\Controllers\DeliveryCertificateController::class, 'downloadPdf'])->name('deliveries.pdf');
    });
});

require __DIR__ . '/settings.php';
