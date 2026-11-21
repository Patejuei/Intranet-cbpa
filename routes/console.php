<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use App\Models\VehicleIssue;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schedule;

Artisan::command('issues:cleanup-images', function () {
    $this->info('Starting cleanup of resolved vehicle issue images...');

    // Find issues resolved more than 7 days ago (updated_at < 7 days ago and status = 'Resolved')
    $cutoff = now()->subDays(7);
    $issues = VehicleIssue::where('status', 'Resolved')
        ->where('updated_at', '<', $cutoff)
        ->with('images')
        ->get();

    $deletedCount = 0;

    foreach ($issues as $issue) {
        foreach ($issue->images as $image) {
            if (Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
            $image->delete();
            $deletedCount++;
        }
    }

    $this->info("Successfully deleted {$deletedCount} images from resolved vehicle issues.");
})->purpose('Clean up vehicle issue images 7 days after resolution');

Artisan::command('users:normalize-ruts', function () {
    $this->info('Iniciando normalización de RUTs en la tabla de usuarios...');

    $users = \App\Models\User::whereNotNull('rut')->where('rut', '!=', '')->get();
    $updatedCount = 0;

    foreach ($users as $user) {
        $rawRut = (string) $user->rut;
        $clean = strtoupper(preg_replace('/[^0-9kK]/', '', $rawRut));

        if (strlen($clean) > 1) {
            $normalized = substr($clean, 0, -1) . '-' . substr($clean, -1);
        } else {
            $normalized = $clean !== '' ? $clean : null;
        }

        if ($normalized !== $rawRut) {
            $user->rut = $normalized;
            $user->save();
            $this->line("Usuario ID {$user->id} ({$user->name}): '{$rawRut}' -> '{$normalized}'");
            $updatedCount++;
        }
    }

    $this->info("Normalización completada. Se actualizaron {$updatedCount} RUTs.");
})->purpose('Normaliza todos los RUTs existentes de usuarios a formato estándar (12345678-K)');

Schedule::command('issues:cleanup-images')->daily();

