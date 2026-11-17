<?php

use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleIssue;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});

test('cuartelero de comandancia only sees comandancia vehicle incidents and assigned vehicles stopped on dashboard', function () {
    // 1. Vehicles
    $vCmd1 = Vehicle::create([
        'name' => 'K-1',
        'make' => 'Chevrolet',
        'model' => 'D-Max',
        'year' => 2022,
        'plate' => 'CD-EF-34',
        'status' => 'Out of Service',
        'company' => 'Comandancia',
        'type' => 'Comandancia',
    ]);

    $vCmd2 = Vehicle::create([
        'name' => 'K-2',
        'make' => 'Chevrolet',
        'model' => 'D-Max',
        'year' => 2023,
        'plate' => 'GH-IJ-56',
        'status' => 'Out of Service',
        'company' => 'Comandancia',
        'type' => 'Comandancia',
    ]);

    $vCompany = Vehicle::create([
        'name' => 'B-1',
        'make' => 'Rosenbauer',
        'model' => 'Commander',
        'year' => 2020,
        'plate' => 'AB-CD-12',
        'status' => 'Out of Service',
        'company' => '1a Compañía',
        'type' => 'Bomba',
    ]);

    // 2. User: Cuartelero de Comandancia assigned only to K-1
    $cuartelero = User::create([
        'name' => 'Cuartelero Cmd',
        'email' => 'cuartelero.cmd.dash@test.com',
        'rut' => '55555555-5',
        'password' => bcrypt('password'),
        'role' => 'cuartelero',
        'company' => 'Comandancia',
        'is_enabled' => true,
    ]);
    $cuartelero->driverVehicles()->attach($vCmd1->id);

    // 3. Incidents
    $issueCmd = VehicleIssue::create([
        'vehicle_id' => $vCmd2->id, // Comandancia vehicle not assigned to driver
        'reporter_id' => $cuartelero->id,
        'description' => 'Fuga comandancia',
        'severity' => 'Medium',
        'date' => '2026-11-17',
        'status' => 'Open',
        'is_stopped' => true,
        'company' => 'Comandancia',
    ]);

    $issueCompany = VehicleIssue::create([
        'vehicle_id' => $vCompany->id, // Company vehicle
        'reporter_id' => $cuartelero->id,
        'description' => 'Fuga compañía',
        'severity' => 'Medium',
        'date' => '2026-11-17',
        'status' => 'Open',
        'is_stopped' => true,
        'company' => '1a Compañía',
    ]);

    $response = $this->actingAs($cuartelero)->get(route('dashboard'));
    $response->assertOk();

    // Inertia assertions:
    // vehiclesStopped should ONLY have $vCmd1 (assigned vehicle)
    // pendingIncidents should ONLY have $issueCmd (Comandancia vehicle), NOT $issueCompany
    $response->assertInertia(fn ($page) =>
        $page->component('dashboard')
            ->has('vehiclesStopped', 1)
            ->where('vehiclesStopped.0.id', $vCmd1->id)
            ->has('pendingIncidents', 1)
            ->where('pendingIncidents.0.id', $issueCmd->id)
    );
});
