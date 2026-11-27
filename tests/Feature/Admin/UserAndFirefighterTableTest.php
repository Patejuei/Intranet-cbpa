<?php

use App\Models\Firefighter;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->admin = User::factory()->create([
        'name' => 'Admin Principal',
        'email' => 'admin@cbpa.cl',
        'rut' => '11111111-1',
        'company' => 'Comandancia',
        'role' => 'admin',
        'is_enabled' => true,
    ]);
});

test('non-admin cannot access users or firefighters index', function () {
    $user = User::factory()->create([
        'role' => 'user',
        'company' => 'Primera Compañía',
    ]);

    $this->actingAs($user)->get(route('users.index'))->assertForbidden();
    $this->actingAs($user)->get(route('firefighters.index'))->assertForbidden();
});

test('users table supports column filtering and sorting', function () {
    User::factory()->create([
        'name' => 'Carlos Bravo',
        'email' => 'carlos@cbpa.cl',
        'rut' => '12345678-9',
        'company' => 'Primera Compañía',
        'role' => 'capitan',
        'is_enabled' => true,
        'permissions' => ['vehicles.view'],
    ]);

    User::factory()->create([
        'name' => 'Ana Zapata',
        'email' => 'ana@cbpa.cl',
        'rut' => '98765432-1',
        'company' => 'Segunda Compañía',
        'role' => 'maquinista',
        'is_enabled' => false,
        'permissions' => ['equipment.view'],
    ]);

    // Filter by company and sort by name desc
    $this->actingAs($this->admin)
        ->get(route('users.index', [
            'company' => 'Primera Compañía',
            'sort' => 'name',
            'direction' => 'desc',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users/index')
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Carlos Bravo')
            ->where('filters.company', 'Primera Compañía')
            ->where('filters.sort', 'name')
            ->where('filters.direction', 'desc')
        );

    // Filter by status disabled
    $this->actingAs($this->admin)
        ->get(route('users.index', ['status' => 'disabled']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Ana Zapata')
        );

    // Sort by name asc
    $this->actingAs($this->admin)
        ->get(route('users.index', ['sort' => 'name', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('users.data.0.name', 'Admin Principal')
            ->where('users.data.1.name', 'Ana Zapata')
            ->where('users.data.2.name', 'Carlos Bravo')
        );

    // Invalid sort column falls back safely
    $this->actingAs($this->admin)
        ->get(route('users.index', ['sort' => 'invalid_column; DROP TABLE users;--']))
        ->assertOk();
});

test('firefighters table supports column filtering and sorting', function () {
    Firefighter::create([
        'general_registry_number' => '200',
        'first_name' => 'Juan',
        'paternal_last_name' => 'Pérez',
        'maternal_last_name' => 'Soto',
        'rut' => '15111222-3',
        'company' => 'Primera Compañía',
        'email' => 'juan@cbpa.cl',
    ]);

    Firefighter::create([
        'general_registry_number' => '100',
        'first_name' => 'María',
        'paternal_last_name' => 'Alvarez',
        'maternal_last_name' => 'Díaz',
        'rut' => '16333444-5',
        'company' => 'Segunda Compañía',
        'email' => 'maria@cbpa.cl',
    ]);

    // Filter by company
    $this->actingAs($this->admin)
        ->get(route('firefighters.index', ['company' => 'Segunda Compañía']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/firefighters/index')
            ->has('firefighters.data', 1)
            ->where('firefighters.data.0.rut', '16333444-5')
        );

    // Filter by registry number
    $this->actingAs($this->admin)
        ->get(route('firefighters.index', ['general_registry_number' => '200']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('firefighters.data', 1)
            ->where('firefighters.data.0.rut', '15111222-3')
        );

    // Sort by full_name asc
    $this->actingAs($this->admin)
        ->get(route('firefighters.index', ['sort' => 'full_name', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('firefighters.data', 2)
            ->where('firefighters.data.0.rut', '15111222-3')
            ->where('firefighters.data.1.rut', '16333444-5')
        );

    // Invalid sort column falls back safely
    $this->actingAs($this->admin)
        ->get(route('firefighters.index', ['sort' => 'non_existent']))
        ->assertOk();
});
