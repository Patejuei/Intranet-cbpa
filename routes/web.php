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
    });
});

require __DIR__ . '/settings.php';
