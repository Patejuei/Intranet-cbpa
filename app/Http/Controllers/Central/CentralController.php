<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Models\DutyLog;
use App\Models\Vehicle;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class CentralController extends Controller
{
    public function dutyIndex(Request $request)
    {
        $user = $request->user();
        $query = DutyLog::with(['user', 'vehicle'])->whereNull('end_time');

        if ($user->role === 'capitan') {
            $query->whereHas('vehicle', function($q) use ($user) {
                $q->where('company', $user->company);
            });
        } elseif ($user->role !== 'admin' && $user->role !== 'comandante' && $user->role !== 'central_operator' && $user->role !== 'inspector') {
             if ($user->company && $user->company !== 'Comandancia') {
                $query->whereHas('vehicle', function($q) use ($user) {
                    $q->where('company', $user->company);
                });
            }
        }

        $activeDuties = $query->get();
        
        $vehicleQuery = Vehicle::query()->where('status', '!=', 'Decommissioned');
        if ($user->role === 'capitan') {
            $vehicleQuery->where('company', $user->company);
        }
        $vehicles = $vehicleQuery->get();

        $drivers = User::whereHas('driverVehicles')->with('driverVehicles:id,name')->get();

        return Inertia::render('central/duty-logs', [
            'activeDuties' => $activeDuties,
            'vehicles' => $vehicles,
            'drivers' => $drivers,
        ]);
    }

    public function startDuty(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'vehicle_ids' => 'required|array',
            'vehicle_ids.*' => 'exists:vehicles,id',
            'is_primary' => 'required|boolean',
            'start_time' => 'nullable',
        ]);

        $startTime = $request->start_time ? Carbon::parse($request->start_time) : now();

        foreach ($request->vehicle_ids as $vId) {
            $vehicle = Vehicle::find($vId);

            DutyLog::where('vehicle_id', $vId)
                ->where('is_primary', $request->is_primary)
                ->whereNull('end_time')
                ->update(['end_time' => $startTime]);

            DutyLog::create([
                'user_id' => $request->user_id,
                'vehicle_id' => $vId,
                'start_time' => $startTime,
                'is_primary' => $request->is_primary,
                'company' => $vehicle->company,
            ]);
        }

        return back()->with('success', 'Puestas en servicio registradas.');
    }

    public function endDuty(Request $request, DutyLog $duty)
    {
        $request->validate([
            'end_time' => 'nullable',
        ]);

        $endTime = $request->end_time ? Carbon::parse($request->end_time) : now();

        $duty->update(['end_time' => $endTime]);
        return back()->with('success', 'Puesta en servicio finalizada.');
    }

    public function reportsIndex(Request $request)
    {
        $user = $request->user();
        $startDate = $request->input('start_date') ? Carbon::parse($request->input('start_date')) : now()->startOfMonth();
        $endDate = $request->input('end_date') ? Carbon::parse($request->input('end_date')) : now()->endOfMonth();

        $query = DutyLog::with(['user', 'vehicle'])
            ->whereNotNull('end_time')
            ->whereDate('start_time', '>=', $startDate)
            ->whereDate('end_time', '<=', $endDate);

        if ($user->role === 'capitan') {
            $query->whereHas('vehicle', function($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        $logs = $query->orderBy('start_time', 'desc')->get();

        $formattedData = $logs->map(function($log) {
            $diffInSeconds = $log->start_time->diffInSeconds($log->end_time);
            $hours = floor($diffInSeconds / 3600);
            $minutes = floor(($diffInSeconds % 3600) / 60);
            
            return [
                'user_name' => $log->user->name,
                'vehicle_name' => $log->vehicle->name,
                'start_time' => $log->start_time->format('d-m-Y H:i'),
                'end_time' => $log->end_time->format('d-m-Y H:i'),
                'duration_human' => "{$hours}h {$minutes}m",
                'is_primary' => $log->is_primary,
            ];
        });

        return Inertia::render('central/reports', [
            'reportData' => $formattedData,
            'filters' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ]
        ]);
    }

    public function exportReportsExcel(Request $request)
    {
        $user = $request->user();
        $startDate = $request->input('start_date') ? Carbon::parse($request->input('start_date')) : now()->startOfMonth();
        $endDate = $request->input('end_date') ? Carbon::parse($request->input('end_date')) : now()->endOfMonth();

        $query = DutyLog::with(['user', 'vehicle'])
            ->whereNotNull('end_time')
            ->whereDate('start_time', '>=', $startDate)
            ->whereDate('end_time', '<=', $endDate);

        if ($user->role === 'capitan') {
            $query->whereHas('vehicle', function($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        $logs = $query->orderBy('start_time', 'desc')->get();

        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setCellValue('A1', 'Conductor');
        $sheet->setCellValue('B1', 'Vehículo');
        $sheet->setCellValue('C1', 'Tipo');
        $sheet->setCellValue('D1', 'Inicio');
        $sheet->setCellValue('E1', 'Término');
        $sheet->setCellValue('F1', 'Tiempo Total');

        $row = 2;
        foreach ($logs as $log) {
            $diffInSeconds = $log->start_time->diffInSeconds($log->end_time);
            $hours = floor($diffInSeconds / 3600);
            $minutes = floor(($diffInSeconds % 3600) / 60);

            $sheet->setCellValue('A' . $row, $log->user->name);
            $sheet->setCellValue('B' . $row, $log->vehicle->name);
            $sheet->setCellValue('C' . $row, $log->is_primary ? 'Primario' : 'Secundario');
            $sheet->setCellValue('D' . $row, $log->start_time->format('d-m-Y H:i'));
            $sheet->setCellValue('E' . $row, $log->end_time ? $log->end_time->format('d-m-Y H:i') : '');
            $sheet->setCellValue('F' . $row, "{$hours}h {$minutes}m");
            $row++;
        }

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $fileName = 'reporte_tiempos_' . now()->format('YmdHis') . '.xlsx';
        $tempFile = tempnam(sys_get_temp_dir(), $fileName);
        $writer->save($tempFile);

        return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
    }

    public function exportReportsPdf(Request $request)
    {
        $user = $request->user();
        $startDate = $request->input('start_date') ? Carbon::parse($request->input('start_date')) : now()->startOfMonth();
        $endDate = $request->input('end_date') ? Carbon::parse($request->input('end_date')) : now()->endOfMonth();

        $query = DutyLog::with(['user', 'vehicle'])
            ->whereNotNull('end_time')
            ->whereDate('start_time', '>=', $startDate)
            ->whereDate('end_time', '<=', $endDate);

        if ($user->role === 'capitan') {
            $query->whereHas('vehicle', function($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        $logs = $query->orderBy('start_time', 'desc')->get();

        $formattedData = $logs->map(function($log) {
            $diffInSeconds = $log->start_time->diffInSeconds($log->end_time);
            $hours = floor($diffInSeconds / 3600);
            $minutes = floor(($diffInSeconds % 3600) / 60);
            
            return [
                'user_name' => $log->user->name,
                'vehicle_name' => $log->vehicle->name,
                'start_time' => $log->start_time->format('d-m-Y H:i'),
                'end_time' => $log->end_time->format('d-m-Y H:i'),
                'duration_human' => "{$hours}h {$minutes}m",
                'is_primary' => $log->is_primary,
            ];
        });

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.duty-report', [
            'reportData' => $formattedData,
            'filters' => [
                'start_date' => $startDate->format('d-m-Y'),
                'end_date' => $endDate->format('d-m-Y'),
            ]
        ]);
        return $pdf->download('reporte_conductores_' . now()->format('YmdHis') . '.pdf');
    }
}
