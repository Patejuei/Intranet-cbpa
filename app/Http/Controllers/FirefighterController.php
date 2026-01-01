<?php

namespace App\Http\Controllers;

use App\Models\Firefighter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FirefighterController extends Controller
{
    public function index()
    {
        $user = request()->user();
        $query = Firefighter::query();

        if ($user->role !== 'admin' && $user->company) {
            $query->where('company', $user->company);
        }

        return Inertia::render('admin/firefighters/index', [
            'firefighters' => $query->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'general_registry_number' => 'nullable|string|unique:firefighters',
            'full_name' => 'required|string',
            'rut' => 'required|string|unique:firefighters',
            'company' => 'required|string',
        ]);

        Firefighter::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Firefighter $firefighter)
    {
        $validated = $request->validate([
            'general_registry_number' => 'nullable|string|unique:firefighters,general_registry_number,' . $firefighter->id,
            'full_name' => 'required|string',
            'rut' => 'required|string|unique:firefighters,rut,' . $firefighter->id,
            'company' => 'required|string',
        ]);

        $firefighter->update($validated);

        return redirect()->back();
    }

    public function destroy(Firefighter $firefighter)
    {
        $firefighter->delete();
        return redirect()->back();
    }
}
