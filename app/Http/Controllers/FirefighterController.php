<?php

namespace App\Http\Controllers;

use App\Models\Firefighter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FirefighterController extends Controller
{
    public function index(Request $request)
    {
        $user = request()->user();
        $query = Firefighter::query();

        // Access Control
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('firefighters.view', $user->permissions ?? []) && !in_array('firefighters.edit', $user->permissions ?? [])) {
            abort(403, 'Unauthorized access to Firefighters module');
        }

        if ($user->role !== 'admin' && $user->role !== 'comandante' && $user->company) {
            $query->where('company', $user->company);
        }

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

    public function store(Request $request)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('firefighters.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $validated = $request->validate([
            'general_registry_number' => 'nullable|string|unique:firefighters',
            'full_name' => 'required|string',
            'rut' => 'required|string|unique:firefighters',
            'company' => 'required|string',
            'email' => 'nullable|email|max:255',
        ]);

        Firefighter::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Firefighter $firefighter)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('firefighters.edit', $user->permissions ?? [])) {
            abort(403);
        }

        if ($user->role === 'capitan' && $user->company && $firefighter->company !== $user->company) {
            abort(403, 'No puedes editar bomberos de otra compañía.');
        }

        $validated = $request->validate([
            'general_registry_number' => 'nullable|string|unique:firefighters,general_registry_number,' . $firefighter->id,
            'full_name' => 'required|string',
            'rut' => 'required|string|unique:firefighters,rut,' . $firefighter->id,
            'company' => 'required|string',
            'email' => 'nullable|email|max:255',
        ]);

        $firefighter->update($validated);

        return redirect()->back();
    }

    public function destroy(Firefighter $firefighter)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('firefighters.edit', $user->permissions ?? [])) {
            abort(403);
        }

        if ($user->role === 'capitan' && $user->company && $firefighter->company !== $user->company) {
            abort(403, 'No puedes eliminar bomberos de otra compañía.');
        }

        $firefighter->delete();
        return redirect()->back();
    }
}
