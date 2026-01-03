<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Traits\CompanyScopeTrait;

class MaterialController extends Controller
{
    use CompanyScopeTrait;

    public function index()
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('inventory.view', $user->permissions ?? []) && !in_array('inventory.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $query = Material::query();
        $this->applyCompanyScope($query, request());

        return Inertia::render('inventory/index', [
            'materials' => $query->orderBy('product_name')->paginate(10)
        ]);
    }

    public function show(Material $inventory)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('inventory.view', $user->permissions ?? [])) {
            abort(403);
        }

        // Ensure user can view this company's material
        if ($user->role !== 'admin' && $user->company !== $inventory->company) {
            abort(403);
        }

        return Inertia::render('inventory/show', [
            'material' => $inventory,
            'logs' => $inventory->logs()->with('user')->latest()->get()
        ]);
    }

    public function update(Request $request, Material $inventory)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('inventory.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $validated = $request->validate([
            'product_name' => 'required|string',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'code' => 'nullable|string|unique:materials,code,' . $inventory->id,
            'stock_quantity' => 'required|integer',
            'company' => 'required|string',
            'category' => 'nullable|string',
            'document_path' => 'nullable|file|max:10240',
        ]);

        if ($request->hasFile('document_path')) {
            $path = $request->file('document_path')->store('materials', 'public');
            $validated['document_path'] = $path;
        }

        $inventory->update($validated);

        return redirect()->back();
    }

    public function store(Request $request)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('inventory.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $validated = $request->validate([
            'product_name' => 'required|string',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'code' => 'nullable|string|unique:materials',
            'stock_quantity' => 'required|integer',
            'company' => 'required|string',
            'category' => 'nullable|string',
            'document_path' => 'nullable|file|max:10240', // Max 10MB
        ]);

        if ($request->hasFile('document_path')) {
            $path = $request->file('document_path')->store('materials', 'public');
            $validated['document_path'] = $path;
        }

        Material::create($validated);

        return redirect()->back();
    }
}
