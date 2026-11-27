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
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && $user->role !== 'secretaria_adquisiciones' && !in_array('batteries.view', $user->permissions ?? []) && !in_array('batteries.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $query = BatteryLog::with('user');
        $this->applyCompanyScope($query, $request);

        foreach (['equipment_id', 'responsible_name', 'observations'] as $column) {
            if ($value = trim((string) $request->input($column, ''))) {
                $query->where($column, 'like', "%{$value}%");
            }
        }

        if ($equipmentType = trim((string) $request->input('equipment_type', ''))) {
            if ($equipmentType !== 'all') {
                $query->where('equipment_type', $equipmentType);
            }
        }

        $sortableColumns = [
            'change_date',
            'equipment_id',
            'equipment_type',
            'responsible_name',
            'next_change_date',
            'observations',
        ];
        $sort = $request->input('sort');
        $direction = strtolower((string) $request->input('direction', 'asc')) === 'desc' ? 'desc' : 'asc';

        if (is_string($sort) && in_array($sort, $sortableColumns, true)) {
            $query->orderBy($sort, $direction);
        } else {
            $query->latest();
        }

        return Inertia::render('batteries/index', [
            'logs' => $query->paginate(10)->withQueryString(),
            'userCompany' => $request->user()->company,
            'filters' => $request->only([
                'company',
                'equipment_id',
                'equipment_type',
                'responsible_name',
                'observations',
                'sort',
                'direction',
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && $user->role !== 'secretaria_adquisiciones' && !in_array('batteries.edit', $user->permissions ?? [])) {
            abort(403);
        }

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
