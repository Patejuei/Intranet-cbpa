<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    private const COMPANIES = [
        'Primera Compañía',
        'Segunda Compañía',
        'Tercera Compañía',
        'Cuarta Compañía',
        'Quinta Compañía',
        'Séptima Compañía',
        'Octava Compañía',
        'Novena Compañía',
        'Décima Compañía',
        'Comandancia',
    ];

    private const ROLES = [
        'user' => 'Usuario Estándar',
        'admin' => 'Administrador',
        'comandante' => 'Comandante',
        'inspector' => 'Inspector',
        'capitan' => 'Capitán',
        'teniente' => 'Teniente',
        'maquinista' => 'Maquinista',
        'ayudante' => 'Ayudante',
        'comandancia' => 'Comandancia',
        'cuartelero' => 'Cuartelero',
        'mechanic' => 'Taller Mecánico',
        'secretaria_adquisiciones' => 'Secretaria de Adquisiciones',
        'central_operator' => 'Operador Central',
    ];

    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            abort(403);
        }

        $query = \App\Models\User::query();

        if ($search = trim((string) $request->input('search', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('rut', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        foreach (['name', 'rut', 'email'] as $column) {
            if ($value = trim((string) $request->input($column, ''))) {
                $query->where($column, 'like', "%{$value}%");
            }
        }

        if ($company = trim((string) $request->input('company', ''))) {
            if ($company !== 'all') {
                $query->where('company', $company);
            }
        }

        if ($role = trim((string) $request->input('role', ''))) {
            if ($role !== 'all') {
                $query->where('role', $role);
            }
        }

        if ($status = trim((string) $request->input('status', ''))) {
            if ($status === 'enabled') {
                $query->where('is_enabled', true);
            } elseif ($status === 'disabled') {
                $query->where('is_enabled', false);
            }
        }

        if ($permission = trim((string) $request->input('permission', ''))) {
            $query->where(function ($q) use ($permission) {
                $q->where('permissions', 'like', "%{$permission}%");
                if (stripos('acceso total', $permission) !== false) {
                    $q->orWhere('role', 'admin');
                }
            });
        }

        $sortableColumns = ['name', 'rut', 'email', 'company', 'role', 'is_enabled'];
        $sort = $request->input('sort');
        $direction = strtolower((string) $request->input('direction', 'asc')) === 'desc' ? 'desc' : 'asc';

        if (is_string($sort) && in_array($sort, $sortableColumns, true)) {
            $query->orderBy($sort, $direction);
        } else {
            $query->orderBy('id', 'asc');
        }

        return \Inertia\Inertia::render('admin/users/index', [
            'users' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only([
                'search',
                'name',
                'rut',
                'email',
                'company',
                'role',
                'status',
                'permission',
                'sort',
                'direction',
            ]),
            'companies' => self::COMPANIES,
            'roles' => self::ROLES,
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

        if ($request->has('rut')) {
            $request->merge(['rut' => $this->normalizeRut($request->input('rut'))]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'rut' => 'nullable|string|max:20|unique:users,rut',
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
            'rut' => $validated['rut'] ?? null,
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

        if ($request->has('rut')) {
            $request->merge(['rut' => $this->normalizeRut($request->input('rut'))]);
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
            'rut' => $validated['rut'] ?? null,
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

    private function normalizeRut($rut): ?string
    {
        if (!$rut) {
            return null;
        }
        $clean = strtoupper(preg_replace('/[^0-9kK]/', '', (string)$rut));
        if (strlen($clean) > 1) {
            return substr($clean, 0, -1) . '-' . substr($clean, -1);
        }
        return $clean !== '' ? $clean : null;
    }
}
