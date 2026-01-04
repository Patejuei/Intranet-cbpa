<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index()
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan') {
            abort(403);
        }

        $query = \App\Models\User::query();

        if ($user->role === 'capitan') {
            $query->where('company', $user->company);
        }

        return \Inertia\Inertia::render('admin/users/index', [
            'users' => $query->paginate(10)
        ]);
    }

    public function create()
    {
        if (request()->user()->role !== 'admin' && request()->user()->role !== 'capitan') {
            abort(403);
        }
        $vehicles = \App\Models\Vehicle::query();
        if (request()->user()->role === 'capitan') {
            $vehicles->where('company', request()->user()->company);
        }

        return \Inertia\Inertia::render('admin/users/create', [
            'availableVehicles' => $vehicles->get()
        ]);
    }

    public function store(Request $request)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan') {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'company' => 'required|string',
            'role' => 'required|string|in:user,admin,capitan,teniente,maquinista,ayudante,comandancia,cuartelero,mechanic',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string', // Validate contents
            'driver_vehicles' => 'nullable|array',
            'driver_vehicles.*' => 'exists:vehicles,id',
            'password' => 'required|string|min:8',
        ]);

        if ($user->role === 'capitan') {
            // Force company to be captain's company
            if ($validated['company'] !== $user->company) {
                abort(403, 'No puedes crear usuarios para otra compañía.');
            }
            // Prevent creating admins or captains? Maybe allow creating subordinates.
            if (in_array($validated['role'], ['admin', 'capitan'])) {
                abort(403, 'No tienes permisos para crear este rol.');
            }
        }

        $createdUser = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'company' => $validated['company'],
            'role' => $validated['role'],
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
        if ($currentUser->role !== 'admin' && $currentUser->role !== 'capitan') {
            abort(403);
        }
        if ($currentUser->role === 'capitan' && $user->company !== $currentUser->company) {
            abort(403);
        }

        $vehicles = \App\Models\Vehicle::query();
        if ($currentUser->role === 'capitan') {
            $vehicles->where('company', $currentUser->company);
        }

        $user->load('driverVehicles');

        return \Inertia\Inertia::render('admin/users/edit', [
            'user' => $user,
            'availableVehicles' => $vehicles->get()
        ]);
    }

    public function update(Request $request, \App\Models\User $user)
    {
        $currentUser = request()->user();
        if ($currentUser->role !== 'admin' && $currentUser->role !== 'capitan') {
            abort(403);
        }

        if ($currentUser->role === 'capitan' && $user->company !== $currentUser->company) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'company' => 'required|string',
            'role' => 'required|string|in:user,admin,capitan,teniente,maquinista,ayudante,comandancia,cuartelero,mechanic',
            'permissions' => 'nullable|array',
            'driver_vehicles' => 'nullable|array',
            'driver_vehicles.*' => 'exists:vehicles,id',
            'password' => 'nullable|string|min:8',
        ]);

        if ($currentUser->role === 'capitan') {
            if ($validated['company'] !== $currentUser->company) {
                abort(403, 'No puedes mover usuarios a otra compañía.');
            }
            if (in_array($validated['role'], ['admin'])) {
                abort(403, 'No puedes asignar el rol de admin.');
            }
            // Helper logic: Prevent Captain from demoting themselves or changing own role if critical?
            // Assuming Captain is editing OTHER users mostly.
        }

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'company' => $validated['company'],
            'role' => $validated['role'],
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
        // Based on previous code: route('users.index') was used in store. I will stick to that or check routes.
    }

    public function destroy(\App\Models\User $user)
    {
        $currentUser = request()->user();
        if ($currentUser->role !== 'admin' && $currentUser->role !== 'capitan') {
            abort(403);
        }
        if ($currentUser->role === 'capitan' && $user->company !== $currentUser->company) {
            abort(403);
        }

        $user->delete();
        return redirect()->back();
    }
}
