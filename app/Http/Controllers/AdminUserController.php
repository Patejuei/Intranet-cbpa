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
            'role' => 'required|string|in:user,admin,capitan,teniente,maquinista,ayudante,comandancia,cuartelero,mechanic,inspector,comandante',
            'department' => 'nullable|string|in:Material Mayor,Material Menor',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string', // Validate contents
            'driver_vehicles' => 'nullable|array',
            'driver_vehicles.*' => 'exists:vehicles,id',
            'password' => 'required|string|min:8',
        ]);

        $allowedRoles = ['user', 'teniente', 'maquinista', 'ayudante'];
        $restrictedPermissions = [
            'vehicles.workshop',
            'vehicles.inventory', // Mayor modules
            'inventory',
            'deliveries',
            'reception', // Menor modules
            'admin',
            'firefighters' // Admin modules/logic
        ];

        if ($user->role === 'capitan') {
            // Force company to match captain's company regardless of input
            $validated['company'] = $user->company;

            // Restrict roles
            if (!in_array($validated['role'], $allowedRoles)) {
                abort(403, 'Rol no permitido para su nivel de acceso.');
            }

            // Filter permissions
            $cleanPermissions = [];
            if (isset($validated['permissions'])) {
                foreach ($validated['permissions'] as $perm) {
                    // Check if permission starts with restricted prefixes
                    $isRestricted = false;

                    // Block specific full permissions explicitly if needed
                    if ($perm === 'vehicles.full' || $perm === 'equipment.full') {
                        $isRestricted = true;
                    }

                    // Block module groups
                    foreach ($restrictedPermissions as $restricted) {
                        if (str_starts_with($perm, $restricted)) {
                            $isRestricted = true;
                            break;
                        }
                    }

                    if (!$isRestricted) {
                        $cleanPermissions[] = $perm;
                    }
                }
                $validated['permissions'] = $cleanPermissions;
            }
        }

        $createdUser = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'company' => $validated['company'],
            'role' => $validated['role'],
            'department' => isset($validated['department']) ? trim($validated['department']) : null,
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
            'role' => 'required|string|in:user,admin,capitan,teniente,maquinista,ayudante,comandancia,cuartelero,mechanic,inspector,comandante',
            'department' => 'nullable|string|in:Material Mayor,Material Menor',
            'permissions' => 'nullable|array',
            'driver_vehicles' => 'nullable|array',
            'driver_vehicles.*' => 'exists:vehicles,id',
            'password' => 'nullable|string|min:8',
        ]);

        if ($currentUser->role === 'capitan') {
            // Force company
            $validated['company'] = $currentUser->company;

            $allowedRoles = ['user', 'teniente', 'maquinista', 'ayudante'];
            if (!in_array($validated['role'], $allowedRoles)) {
                abort(403, 'Rol no permitido para su nivel de acceso.');
            }

            // Re-filter permissions (copy logic from store or reuse)
            $restrictedPermissions = [
                'vehicles.workshop',
                'vehicles.inventory',
                'inventory',
                'deliveries',
                'reception',
                'admin',
                'firefighters'
            ];

            $cleanPermissions = [];
            if (isset($validated['permissions'])) {
                foreach ($validated['permissions'] as $perm) {
                    $isRestricted = false;
                    if ($perm === 'vehicles.full' || $perm === 'equipment.full') {
                        $isRestricted = true;
                    }
                    foreach ($restrictedPermissions as $restricted) {
                        if (str_starts_with($perm, $restricted)) {
                            $isRestricted = true;
                            break;
                        }
                    }
                    if (!$isRestricted) {
                        $cleanPermissions[] = $perm;
                    }
                }
                $validated['permissions'] = $cleanPermissions;
            }
        }

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'company' => $validated['company'],
            'role' => $validated['role'],
            'department' => isset($validated['department']) ? trim($validated['department']) : null,
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
