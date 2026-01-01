<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\EquipmentLog;
use Inertia\Inertia;

class EquipmentLogController extends Controller
{
    public function index()
    {
        $user = request()->user();
        $query = EquipmentLog::with('user')->latest();

        if ($user->role !== 'admin' && $user->company) {
            $query->whereHas('user', function ($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        return Inertia::render('equipment/index', [
            'logs' => $query->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_name' => 'required|string',
            'serial_number' => 'nullable|string',
            'type' => 'required|in:ALTA,BAJA',
            'reason' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        $user = $request->user();

        // Sync with Inventory
        $material = \App\Models\Material::where('company', $user->company)
            ->where('product_name', $validated['item_name'])
            ->first();

        if ($validated['type'] === 'ALTA') {
            if ($material) {
                $material->increment('stock_quantity');
            } else {
                // Create new material if it doesn't exist
                // Note: brand/model/code will be null as they are not in the log form yet
                \App\Models\Material::create([
                    'product_name' => $validated['item_name'],
                    'stock_quantity' => 1,
                    'company' => $user->company,
                ]);
            }
        } elseif ($validated['type'] === 'BAJA') {
            if ($material) {
                $material->decrement('stock_quantity');
            }
        }

        EquipmentLog::create($validated + ['user_id' => $user->id]);
        return redirect()->back();
    }
}
