<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = request()->user();

        $logQuery = \App\Models\VehicleLog::with(['vehicle', 'driver'])->latest();

        // If not admin/comandancia, filter logs by user's company
        if ($user->company !== 'Comandancia' && $user->role !== 'admin') {
            // But if user has 'vehicles.logs' or 'vehicles.logs.view' permission, maybe they should see everything?
            // The requirement says: "el usuario de Comandancia pueda ver los registros de todos los vehículos."
            // Also Mechanic is typically focused on Maintenance, but if they have Read Only logs they might need to see all?
            // Let's stick to the specific request: Comandancia users see all.
            // If user is mechanic, they usually see all because they fix all cars.
            if ($user->role !== 'mechanic') {
                $logQuery->whereHas('vehicle', function ($q) use ($user) {
                    $q->where('company', $user->company);
                });
            }
        }

        // Vehicle Filter
        if (request()->has('vehicle_id') && request()->vehicle_id) {
            $logQuery->where('vehicle_id', request()->vehicle_id);
        }

        return Inertia::render('vehicles/logs/index', [
            'logs' => $logQuery->paginate(15)->appends(request()->all()),
            'vehicles' => \App\Models\Vehicle::query()
                ->when($user->role !== 'admin' && $user->role !== 'mechanic' && $user->company !== 'Comandancia', function ($q) use ($user) {
                    $driverIds = $user->driverVehicles()->pluck('vehicles.id');
                    $q->where(function ($query) use ($driverIds, $user) {
                        $query->where('company', $user->company);
                        if ($driverIds->isNotEmpty()) {
                            $query->orWhereIn('id', $driverIds);
                        }
                    });
                })
                ->addSelect([
                    'last_mileage' => \App\Models\VehicleLog::select('end_km')
                        ->whereColumn('vehicle_id', 'vehicles.id')
                        ->latest('date')
                        ->limit(1)
                ])
                ->orderBy('name')->get(['id', 'name', 'last_mileage']),
            'filters' => request()->only(['vehicle_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_km' => 'required|integer',
            'end_km' => 'nullable|integer|gte:start_km',
            'activity_type' => 'required|string',
            'destination' => 'required|string',
            'date' => 'required|date',
            'fuel_liters' => 'nullable|numeric',
            'fuel_coupon' => 'nullable|string',
            'observations' => 'nullable|string',
            'receipt' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120', // 5MB max
            'departure_time' => 'nullable|date_format:H:i',
            'arrival_time' => 'nullable|date_format:H:i',
        ]);

        $receiptPath = null;
        if ($request->hasFile('receipt')) {
            $receiptPath = $request->file('receipt')->store('receipts', 'public');
        }

        \App\Models\VehicleLog::create([
            ...$validated,
            'driver_id' => $request->user()->id,
            'receipt_path' => $receiptPath,
        ]);

        return redirect()->back()->with('success', 'Bitácora registrada correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
    /**
     * Export logs to Excel (Native HTML Table).
     */
    public function export(Request $request)
    {
        $user = $request->user();
        $logQuery = \App\Models\VehicleLog::with(['vehicle', 'driver'])->latest();

        // Apply same filters as Index (Replicated logic)
        if ($user->company !== 'Comandancia' && $user->role !== 'admin') {
            if ($user->role !== 'mechanic') {
                $logQuery->whereHas('vehicle', function ($q) use ($user) {
                    $q->where('company', $user->company);
                });
            }
        }

        // Vehicle Filter
        if ($request->has('vehicle_id') && $request->vehicle_id) {
            $logQuery->where('vehicle_id', $request->vehicle_id);
        }

        $logs = $logQuery->get();

        $filename = "bitacora_export_" . date('Y-m-d_H-i') . ".xls";

        $headers = [
            "Content-Type" => "application/vnd.ms-excel",
            "Content-Disposition" => "attachment; filename=\"$filename\"",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function () use ($logs) {
            $file = fopen('php://output', 'w');

            // Start HTML
            fputs($file, '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"></head><body>');
            fputs($file, '<table border="1">');

            // Header Row
            fputs($file, '<tr style="background-color: #f0f0f0; font-weight: bold;">');
            $columns = ['ID', 'Vehículo', 'Compañía', 'Conductor', 'Fecha', 'Hora Salida', 'Hora Llegada', 'Km Inicio', 'Km Término', 'Kms Recorridos', 'Actividad', 'Destino', 'Obs'];
            foreach ($columns as $col) {
                fputs($file, "<th>{$col}</th>");
            }
            fputs($file, '</tr>');

            // Data Rows
            foreach ($logs as $log) {
                fputs($file, '<tr>');
                fputs($file, "<td>{$log->id}</td>");
                fputs($file, "<td>" . ($log->vehicle ? $log->vehicle->name : 'N/A') . "</td>");
                fputs($file, "<td>" . ($log->vehicle ? $log->vehicle->company : 'N/A') . "</td>");
                fputs($file, "<td>" . ($log->driver ? $log->driver->full_name : 'N/A') . "</td>");
                fputs($file, "<td>{$log->date}</td>");
                fputs($file, "<td>{$log->departure_time}</td>");
                fputs($file, "<td>{$log->arrival_time}</td>");
                fputs($file, "<td>{$log->start_km}</td>");
                fputs($file, "<td>{$log->end_km}</td>");
                fputs($file, "<td>" . (($log->end_km && $log->start_km) ? $log->end_km - $log->start_km : 0) . "</td>");
                fputs($file, "<td>{$log->activity_type}</td>");
                fputs($file, "<td>{$log->destination}</td>");
                fputs($file, "<td>{$log->observations}</td>");
                fputs($file, '</tr>');
            }

            fputs($file, '</table></body></html>');
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
