<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

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
            $driverIds = $user->driverVehicles()->pluck('vehicles.id');
            if ($driverIds->isEmpty()) {
                $logQuery->whereHas('vehicle', function ($q) use ($user) {
                    $q->where('company', $user->company);
                });
            } else {
                $logQuery->whereHas('vehicle', function ($query) use ($driverIds, $user) {
                    $query->where('company', $user->company);
                    if ($driverIds->isNotEmpty()) {
                        $query->orWhereIn('id', $driverIds);
                    }
                });
            }
        }

        // Vehicle Filter
        if (request()->has('vehicle_id') && request()->vehicle_id && request()->vehicle_id !== 'all') {
            $logQuery->where('vehicle_id', request()->vehicle_id);
        }

        // Movement Key Filter
        if (request()->has('movement_key') && request()->movement_key) {
            $logQuery->where('movement_key', 'like', '%' . request()->movement_key . '%');
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
                ->orderBy('name')->get(['vehicles.id', 'vehicles.name', 'vehicles.coupon_number', 'last_mileage']),
            'filters' => request()->only(['vehicle_id', 'movement_key']),
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
            'end_km' => 'required|integer|gte:start_km',
            'activity_type' => 'required|string',
            'destination' => 'required|string',
            'movement_key' => 'nullable|string|max:20',
            'date' => 'required|date',
            'has_fuel' => 'nullable|boolean',
            'fuel_liters' => 'nullable|numeric',
            'fuel_coupon' => 'nullable|string',
            'observations' => 'nullable|string',
            'receipt' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:5120', // 5MB max
            'departure_time' => 'required|date_format:H:i',
            'arrival_time' => 'required|date_format:H:i',
        ]);

        $user = $request->user();
        if ($user->role === 'cuartelero') {
            $vehicle = \App\Models\Vehicle::findOrFail($validated['vehicle_id']);
            if ($vehicle->company !== $user->company) {
                abort(403, 'Solo puede registrar bitácoras para vehículos de su compañía.');
            }
        }

        if ($user->role === 'ayudante') {
            $isDriver = $user->driverVehicles()->where('vehicles.id', $validated['vehicle_id'])->exists();
            if (!$isDriver) {
                abort(403, 'Solo puede registrar movimientos para las unidades donde usted es conductor asignado.');
            }
        }

        // Sanitización si no se cargó combustible
        if (!($validated['has_fuel'] ?? false)) {
            $validated['fuel_liters'] = null;
            $validated['fuel_coupon'] = null;
            $receiptPath = null;
        } else {
            $receiptPath = null;
            if ($request->hasFile('receipt')) {
                $receiptPath = $request->file('receipt')->store('receipts', 'public');
            }
        }

        unset($validated['has_fuel']);

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
        $user = request()->user();
        $log = \App\Models\VehicleLog::with(['vehicle', 'driver'])->findOrFail($id);

        // Security check
        if ($user->company !== 'Comandancia' && $user->role !== 'admin' && $user->role !== 'mechanic') {
            if ($log->vehicle->company !== $user->company) {
                abort(403, 'No tiene permiso para ver esta bitácora.');
            }
        }

        return Inertia::render('vehicles/logs/show', [
            'log' => $log,
        ]);
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
     * Export logs to Excel (XLSX).
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

        // Vehicle Filter - Fixed to handle 'all'
        if ($request->has('vehicle_id') && $request->vehicle_id && $request->vehicle_id !== 'all') {
            $logQuery->where('vehicle_id', $request->vehicle_id);
        }

        // Movement Key Filter
        if ($request->has('movement_key') && $request->movement_key) {
            $logQuery->where('movement_key', 'like', '%' . $request->movement_key . '%');
        }

        $logs = $logQuery->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Header Row
        $columns = ['ID', 'Vehículo', 'Compañía', 'Conductor', 'Fecha', 'Hora Salida', 'Hora Llegada', 'Km Inicio', 'Km Término', 'Kms Recorridos', 'Actividad', 'Lts. Combust.', 'Nº Cupón Comb.', 'Destino', 'Clave', 'Obs'];
        $sheet->fromArray($columns, NULL, 'A1');
        $sheet->getStyle('A1:P1')->getFont()->setBold(true);

        // Data Rows
        $row = 2;
        foreach ($logs as $log) {
            $sheet->setCellValue('A' . $row, $log->id);
            $sheet->setCellValue('B' . $row, $log->vehicle ? $log->vehicle->name : 'N/A');
            $sheet->setCellValue('C' . $row, $log->vehicle ? $log->vehicle->company : 'N/A');
            $sheet->setCellValue('D' . $row, $log->driver ? $log->driver->name : 'N/A');
            $sheet->setCellValue('E' . $row, $log->date);
            $sheet->setCellValue('F' . $row, $log->departure_time);
            $sheet->setCellValue('G' . $row, $log->arrival_time);
            $sheet->setCellValue('H' . $row, $log->start_km);
            $sheet->setCellValue('I' . $row, $log->end_km);
            $sheet->setCellValue('J' . $row, ($log->end_km && $log->start_km) ? $log->end_km - $log->start_km : 0);
            $sheet->setCellValue('K' . $row, $log->activity_type);
            $sheet->setCellValue('L' . $row, $log->fuel_liters ?? 'N/A');
            $sheet->setCellValue('M' . $row, $log->fuel_coupon ?? 'N/A');
            $sheet->setCellValue('N' . $row, $log->destination);
            $sheet->setCellValue('O' . $row, $log->movement_key ?? 'N/A');
            $sheet->setCellValue('P' . $row, $log->observations);
            $row++;
        }

        // Auto size columns
        foreach (range('A', 'P') as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $filename = "bitacora_export_" . date('Y-m-d_H-i') . ".xlsx";

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Cache-Control' => 'max-age=0',
        ]);
    }
}
