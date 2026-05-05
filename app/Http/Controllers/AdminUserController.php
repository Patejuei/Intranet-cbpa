<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index()
    {
        $user = request()->user();
        if ($user->role !== 'admin') {
            abort(403);
        }

        $query = \App\Models\User::query();

        return \Inertia\Inertia::render('admin/users/index', [
            'users' => $query->paginate(10)
        ]);
    }

    public function create()
    {
        if (request()->user()->role !== 'admin') {
            abort(403);
        }
        
        $vehicles = \App\Models\Vehicle::query();

        return \Inertia\Inertia::render('admin/users/create', [
            'availableVehicles' => $vehicles->get()
        ]);
    }

    public function store(Request $request)
    {
        $this->validateOtp($request);

        $user = request()->user();
        if ($user->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'rut' => 'nullable|string|max:20|unique:users',
            'company' => 'required|string',
            'role' => 'required|string|in:user,admin,capitan,teniente,maquinista,ayudante,comandancia,cuartelero,mechanic,inspector,comandante,secretaria_adquisiciones,central_operator',
            'department' => 'nullable|string|in:Material Mayor,Material Menor',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
            'driver_vehicles' => 'nullable|array',
            'driver_vehicles.*' => 'exists:vehicles,id',
            'is_enabled' => 'boolean',
            'password' => 'required|string|min:8',
        ]);

        if ($validated['role'] === 'comandante' || $validated['role'] === 'inspector' || $validated['role'] === 'central_operator') {
            // Force Comandancia company for high rank roles
            $validated['company'] = 'Comandancia';
        }

        $createdUser = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'rut' => isset($validated['rut']) ? $this->normalizeRut($validated['rut']) : null,
            'company' => $validated['company'],
            'role' => $validated['role'],
            'department' => isset($validated['department']) ? trim($validated['department']) : null,
            'is_enabled' => $validated['is_enabled'] ?? true,
            'permissions' => $validated['permissions'] ?? [],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
        ]);

        if (isset($validated['driver_vehicles'])) {
            $createdUser->driverVehicles()->sync($validated['driver_vehicles']);
        }

        return redirect()->route('users.index');
    }

    public function edit(\App\Models\User $user)
    {
        $currentUser = request()->user();
        if ($currentUser->role !== 'admin') {
            abort(403);
        }

        $vehicles = \App\Models\Vehicle::query();
        $user->load('driverVehicles');

        return \Inertia\Inertia::render('admin/users/edit', [
            'user' => $user,
            'availableVehicles' => $vehicles->get()
        ]);
    }

    public function update(Request $request, \App\Models\User $user)
    {
        $currentUser = request()->user();
        if ($currentUser->role !== 'admin') {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'rut' => 'nullable|string|max:20|unique:users,rut,' . $user->id,
            'company' => 'required|string',
            'role' => 'required|string|in:user,admin,capitan,teniente,maquinista,ayudante,comandancia,cuartelero,mechanic,inspector,comandante,secretaria_adquisiciones,central_operator',
            'department' => 'nullable|string|in:Material Mayor,Material Menor',
            'permissions' => 'nullable|array',
            'driver_vehicles' => 'nullable|array',
            'driver_vehicles.*' => 'exists:vehicles,id',
            'is_enabled' => 'boolean',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validated['role'] === 'comandante' || $validated['role'] === 'inspector' || $validated['role'] === 'central_operator') {
            // Force Comandancia company for high rank roles
            $validated['company'] = 'Comandancia';
        }

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'rut' => isset($validated['rut']) ? $this->normalizeRut($validated['rut']) : null,
            'company' => $validated['company'],
            'role' => $validated['role'],
            'department' => isset($validated['department']) ? trim($validated['department']) : null,
            'is_enabled' => $validated['is_enabled'] ?? true,
            'permissions' => $validated['permissions'] ?? [],
        ];

        if (!empty($validated['password'])) {
            $userData['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        }

        $user->update($userData);

        if (isset($validated['driver_vehicles'])) {
            $user->driverVehicles()->sync($validated['driver_vehicles']);
        }

        return redirect()->route('users.index');
    }

    public function destroy(\App\Models\User $user)
    {
        $currentUser = request()->user();
        if ($currentUser->role !== 'admin') {
            abort(403);
        }

        $user->delete();
        return redirect()->back();
    }

    private function normalizeRut($rut)
    {
        if (!$rut) return null;
        $rut = str_replace(['.', '-'], '', strtoupper($rut));
        if (strlen($rut) > 1) {
            return substr($rut, 0, -1) . '-' . substr($rut, -1);
        }
        return $rut;
    }
}
