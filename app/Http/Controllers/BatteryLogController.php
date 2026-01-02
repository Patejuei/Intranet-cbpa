<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\BatteryLog;
use Inertia\Inertia;

use App\Traits\CompanyScopeTrait;

class BatteryLogController extends Controller
{
    use CompanyScopeTrait;

    public function index(Request $request)
    {
        $query = BatteryLog::with('user')->latest();
        $this->applyCompanyScope($query, $request);

        return Inertia::render('batteries/index', [
            'logs' => $query->get(),
            'userCompany' => $request->user()->company
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
