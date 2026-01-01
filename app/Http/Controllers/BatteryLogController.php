<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\BatteryLog;
use Inertia\Inertia;

class BatteryLogController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Ensure user has a company, otherwise show empty or all (depending on logic, safer to show empty)
        $query = BatteryLog::with('user')->latest();

        if ($user->company && $user->role !== 'admin') {
            $query->where('company', $user->company);
        }

        return Inertia::render('batteries/index', [
            'logs' => $query->get(),
            'userCompany' => $user->company // Pass to frontend for context if needed
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'change_date' => 'required|date',
            'equipment_id' => 'required|string',
            'equipment_type' => 'required|in:Equipo de Respiracion,Toma presion,Saturometro',
            'responsible_name' => 'required|string',
            'observations' => 'nullable|string',
        ]);

        $changeDate = \Carbon\Carbon::parse($validated['change_date']);
        $nextChangeDate = $changeDate->copy()->addMonths(6);
        $userCompany = $request->user()->company ?? 'Sin Compañía'; // Fallback or strict requirement

        BatteryLog::create([
            ...$validated,
            'company' => $userCompany,
            'next_change_date' => $nextChangeDate,
            'user_id' => $request->user()->id
        ]);

        return redirect()->back();
    }
}
