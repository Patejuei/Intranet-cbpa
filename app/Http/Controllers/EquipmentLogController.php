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

        EquipmentLog::create($validated + ['user_id' => $request->user()->id]);
        return redirect()->back();
    }
}
