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
        ]);

        foreach ($request->vehicle_ids as $vId) {
            $vehicle = Vehicle::find($vId);

            DutyLog::where('vehicle_id', $vId)
                ->where('is_primary', $request->is_primary)
                ->whereNull('end_time')
                ->update(['end_time' => now()]);

            DutyLog::create([
                'user_id' => $request->user_id,
                'vehicle_id' => $vId,
                'start_time' => now(),
                'is_primary' => $request->is_primary,
                'company' => $vehicle->company,
            ]);
        }

        return back()->with('success', 'Puestas en servicio registradas.');
    }

    public function endDuty(DutyLog $duty)
    {
        $duty->update(['end_time' => now()]);
        return back()->with('success', 'Puesta en servicio finalizada.');
    }

    public function reportsIndex(Request $request)
    {
        $user = $request->user();
        $startDate = $request->input('start_date') ? Carbon::parse($request->input('start_date')) : now()->startOfMonth();
        $endDate = $request->input('end_date') ? Carbon::parse($request->input('end_date')) : now()->endOfMonth();

        $query = DutyLog::with(['user', 'vehicle'])
            ->whereNotNull('end_time')
            ->where('start_time', '>=', $startDate)
            ->where('end_time', '<=', $endDate->endOfDay());

        if ($user->role === 'capitan') {
            $query->whereHas('vehicle', function($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        $logs = $query->get();

        $reportData = [];
        foreach ($logs as $log) {
            $key = $log->user_id . '_' . $log->vehicle_id;
            if (!isset($reportData[$key])) {
                $reportData[$key] = [
                    'user_name' => $log->user->name,
                    'vehicle_name' => $log->vehicle->name,
                    'total_seconds' => 0,
                    'is_primary' => $log->is_primary,
                ];
            }
            $reportData[$key]['total_seconds'] += $log->start_time->diffInSeconds($log->end_time);
        }

        $formattedData = array_values(array_map(function($item) {
            $hours = floor($item['total_seconds'] / 3600);
            $minutes = floor(($item['total_seconds'] % 3600) / 60);
            $item['duration_human'] = "{$hours}h {$minutes}m";
            return $item;
        }, $reportData));

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
            ->where('start_time', '>=', $startDate)
            ->where('end_time', '<=', $endDate->endOfDay());

        if ($user->role === 'capitan') {
            $query->whereHas('vehicle', function($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        $logs = $query->get();

        $reportData = [];
        foreach ($logs as $log) {
            $key = $log->user_id . '_' . $log->vehicle_id;
            if (!isset($reportData[$key])) {
                $reportData[$key] = [
                    'user_name' => $log->user->name,
                    'vehicle_name' => $log->vehicle->name,
                    'total_seconds' => 0,
                    'is_primary' => $log->is_primary,
                ];
            }
            $reportData[$key]['total_seconds'] += $log->start_time->diffInSeconds($log->end_time);
        }

        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setCellValue('A1', 'Conductor');
        $sheet->setCellValue('B1', 'Vehículo');
        $sheet->setCellValue('C1', 'Tipo');
        $sheet->setCellValue('D1', 'Tiempo Total');

        $row = 2;
        foreach ($reportData as $item) {
            $hours = floor($item['total_seconds'] / 3600);
            $minutes = floor(($item['total_seconds'] % 3600) / 60);
            $sheet->setCellValue('A' . $row, $item['user_name']);
            $sheet->setCellValue('B' . $row, $item['vehicle_name']);
            $sheet->setCellValue('C' . $row, $item['is_primary'] ? 'Primario' : 'Secundario');
            $sheet->setCellValue('D' . $row, "{$hours}h {$minutes}m");
            $row++;
        }

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $fileName = 'reporte_conductores_' . now()->format('YmdHis') . '.xlsx';
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
            ->where('start_time', '>=', $startDate)
            ->where('end_time', '<=', $endDate->endOfDay());

        if ($user->role === 'capitan') {
            $query->whereHas('vehicle', function($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        $logs = $query->get();

        $reportData = [];
        foreach ($logs as $log) {
            $key = $log->user_id . '_' . $log->vehicle_id;
            if (!isset($reportData[$key])) {
                $reportData[$key] = [
                    'user_name' => $log->user->name,
                    'vehicle_name' => $log->vehicle->name,
                    'total_seconds' => 0,
                    'is_primary' => $log->is_primary,
                ];
            }
            $reportData[$key]['total_seconds'] += $log->start_time->diffInSeconds($log->end_time);
        }

        $formattedData = array_values(array_map(function($item) {
            $hours = floor($item['total_seconds'] / 3600);
            $minutes = floor(($item['total_seconds'] % 3600) / 60);
            $item['duration_human'] = "{$hours}h {$minutes}m";
            return $item;
        }, $reportData));

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
