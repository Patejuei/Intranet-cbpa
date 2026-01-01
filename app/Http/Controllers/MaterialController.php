<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function index()
    {
        $user = request()->user();
        $query = Material::query();

        if ($user->role !== 'admin' && $user->company) {
            $query->where('company', $user->company);
        }

        return Inertia::render('inventory/index', [
            'materials' => $query->orderBy('product_name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'code' => 'nullable|string|unique:materials',
            'stock_quantity' => 'required|integer',
            'company' => 'required|string',
            'category' => 'nullable|string',
        ]);

        Material::create($validated);

        return redirect()->back();
    }
}
