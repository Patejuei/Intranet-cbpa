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
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'serial_number' => 'nullable|string',
            'type' => 'required|in:ALTA,BAJA',
            'reason' => 'nullable|string',
            'status' => 'nullable|string',
            'document' => 'nullable|file|max:10240', // 10MB limit
        ]);

        $user = $request->user();

        // Handle File Upload
        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('equipment_docs', 'public');
        }

        // Sync with Inventory
        $material = \App\Models\Material::where('company', $user->company)
            ->where('product_name', $validated['item_name'])
            ->first();

        if ($validated['type'] === 'ALTA') {
            if ($material) {
                $material->increment('stock_quantity');
                // Optional: Update brand/model if provided and currently null?
            } else {
                // Create new material if it doesn't exist
                \App\Models\Material::create([
                    'product_name' => $validated['item_name'],
                    'brand' => $validated['brand'],
                    'model' => $validated['model'],
                    'stock_quantity' => 1,
                    'company' => $user->company,
                ]);
            }
        } elseif ($validated['type'] === 'BAJA') {
            if ($material) {
                $material->decrement('stock_quantity');
            }
        }

        EquipmentLog::create([
            'item_name' => $validated['item_name'],
            'brand' => $validated['brand'],
            'model' => $validated['model'],
            'serial_number' => $validated['serial_number'],
            'type' => $validated['type'],
            'reason' => $validated['reason'],
            'status' => $validated['status'],
            'document_path' => $documentPath,
            'user_id' => $user->id,
        ]);

        return redirect()->back();
    }
}
