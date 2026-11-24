<?php

namespace App\Http\Controllers;

use App\Models\Firefighter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FirefighterController extends Controller
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

    public function index(Request $request)
    {
        $user = request()->user();
        if ($user->role !== 'admin') {
            abort(403, 'Solo el Administrador del sistema puede acceder al módulo de bomberos.');
        }

        $query = Firefighter::query();

        // Search Filter
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('rut', 'like', "%{$search}%")
                    ->orWhere('general_registry_number', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('admin/firefighters/index', [
            'firefighters' => $query->latest()->paginate(10)->appends($request->all()),
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        $user = request()->user();
        if ($user->role !== 'admin') {
            abort(403, 'Solo el Administrador del sistema puede acceder al módulo de bomberos.');
        }

        return Inertia::render('admin/firefighters/create', [
            'companies' => self::COMPANIES,
        ]);
    }

    public function show(Firefighter $firefighter)
    {
        $user = request()->user();
        if ($user->role !== 'admin') {
            abort(403, 'Solo el Administrador del sistema puede acceder al módulo de bomberos.');
        }

        $firefighter->load([
            'assignedMaterials.material',
            'deliveryCertificates' => function ($q) {
                $q->latest()->limit(10);
            },
        ]);

        return Inertia::render('admin/firefighters/show', [
            'firefighter' => $firefighter,
        ]);
    }

    public function edit(Firefighter $firefighter)
    {
        $user = request()->user();
        if ($user->role !== 'admin') {
            abort(403, 'Solo el Administrador del sistema puede acceder al módulo de bomberos.');
        }

        return Inertia::render('admin/firefighters/edit', [
            'firefighter' => $firefighter,
            'companies' => self::COMPANIES,
        ]);
    }

    public function store(Request $request)
    {
        $user = request()->user();
        if ($user->role !== 'admin') {
            abort(403, 'Solo el Administrador del sistema puede registrar bomberos.');
        }

        $validated = $request->validate([
            'general_registry_number' => 'nullable|string|unique:firefighters',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'paternal_last_name' => 'required|string|max:255',
            'maternal_last_name' => 'required|string|max:255',
            'rut' => 'required|string|unique:firefighters',
            'company' => 'required|string',
            'email' => 'nullable|email|max:255',
        ]);

        $firefighter = Firefighter::create($validated);

        return redirect()->route('firefighters.index')->with('success', 'Bombero registrado correctamente.');
    }

    public function update(Request $request, Firefighter $firefighter)
    {
        $user = request()->user();
        if ($user->role !== 'admin') {
            abort(403, 'Solo el Administrador del sistema puede editar bomberos.');
        }

        $validated = $request->validate([
            'general_registry_number' => 'nullable|string|unique:firefighters,general_registry_number,' . $firefighter->id,
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'paternal_last_name' => 'required|string|max:255',
            'maternal_last_name' => 'required|string|max:255',
            'rut' => 'required|string|unique:firefighters,rut,' . $firefighter->id,
            'company' => 'required|string',
            'email' => 'nullable|email|max:255',
        ]);

        $firefighter->update($validated);

        return redirect()->route('firefighters.index')->with('success', 'Bombero actualizado correctamente.');
    }

    public function destroy(Firefighter $firefighter)
    {
        $user = request()->user();
        if ($user->role !== 'admin') {
            abort(403, 'Solo el Administrador del sistema puede eliminar bomberos.');
        }

        $firefighter->delete();
        return redirect()->back();
    }
}
