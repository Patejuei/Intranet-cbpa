<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\VehicleIssue;
use App\Models\VehicleMaintenance;
use App\Models\VehicleChecklist;
use App\Models\VehicleLog;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Individual vehicle report (PDF)
     */
    public function vehicleReport(Request $request, Vehicle $vehicle)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $maintenances = $vehicle->maintenances()
            ->when($startDate, fn($q) => $q->where('entry_date', '>=', $startDate))
            ->when($endDate, fn($q) => $q->where('entry_date', '<=', $endDate))
            ->with(['tasks', 'items', 'externalWorks'])
            ->get();

        // Calculate investment
        $totalInvestment = $maintenances->sum(function ($m) {
            return $m->tasks->sum('cost') + 
                   $m->items->sum('pivot.total_cost') + 
                   $m->externalWorks->sum('cost') + 
                   ($m->working_hours * $m->hour_rate);
        });

        // Logs data
        $logs = VehicleLog::where('vehicle_id', $vehicle->id)
            ->when($startDate, fn($q) => $q->where('date', '>=', $startDate))
            ->when($endDate, fn($q) => $q->where('date', '<=', $endDate))
            ->get();

        $totalKm = $logs->sum(fn($l) => max(0, $l->end_km - $l->start_km));
        
        $totalHours = $logs->sum(function($l) {
            if (!$l->arrival_time || !$l->departure_time) return 0;
            $start = Carbon::parse($l->departure_time);
            $end = Carbon::parse($l->arrival_time);
            return $end->diffInHours($start);
        });

        $exitStats = $logs->groupBy('activity_type')->map(fn($group) => count($group));

        $driverStats = $logs->groupBy('driver_id')->map(function($group) {
            $driverName = $group->first()->driver->name ?? 'Desconocido';
            $km = $group->sum(fn($l) => max(0, $l->end_km - $l->start_km));
            $hours = $group->sum(function($l) {
                if (!$l->arrival_time || !$l->departure_time) return 0;
                $start = Carbon::parse($l->departure_time);
                $end = Carbon::parse($l->arrival_time);
                return $end->diffInHours($start);
            });
            return [
                'name' => $driverName,
                'km' => $km,
                'hours' => $hours
            ];
        });

        $pdf = Pdf::loadView('pdf.vehicle_report', [
            'vehicle' => $vehicle,
            'maintenances' => $maintenances,
            'totalInvestment' => $totalInvestment,
            'totalKm' => $totalKm,
            'totalHours' => $totalHours,
            'exitStats' => $exitStats,
            'driverStats' => $driverStats,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);

        return $pdf->download("Reporte_{$vehicle->name}.pdf");
    }

    /**
     * Incidents report (Excel)
     */
    public function incidentsReport(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $incidents = VehicleIssue::with(['vehicle', 'reporter'])
            ->when($startDate, fn($q) => $q->where('date', '>=', $startDate))
            ->when($endDate, fn($q) => $q->where('date', '<=', $endDate))
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Incidencias');

        $headers = ['Fecha', 'Vehículo', 'Informante', 'Descripción', 'Gravedad', 'Estado', '¿Detenido?'];
        $sheet->fromArray($headers, null, 'A1');

        $data = $incidents->map(function($i) {
            return [
                $i->date,
                $i->vehicle->name ?? 'N/A',
                $i->reporter->name ?? 'N/A',
                $i->description,
                $i->severity,
                $i->status,
                $i->is_stopped ? 'Sí' : 'No'
            ];
        })->toArray();

        $sheet->fromArray($data, null, 'A2');

        $writer = new Xlsx($spreadsheet);
        $fileName = 'Reporte_Incidencias.xlsx';
        
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        $writer->save('php://output');
        exit;
    }

    /**
     * Workshop report (Excel)
     */
    public function workshopReport(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $maintenances = VehicleMaintenance::with(['vehicle'])
            ->when($startDate, fn($q) => $q->where('entry_date', '>=', $startDate))
            ->when($endDate, fn($q) => $q->where('entry_date', '<=', $endDate))
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Taller Mecánico');

        $headers = ['Fecha Entrada', 'Fecha Salida', 'Vehículo', 'Taller', 'Descripción', 'Costo', 'Estado'];
        $sheet->fromArray($headers, null, 'A1');

        $data = $maintenances->map(function($m) {
            return [
                $m->entry_date?->format('Y-m-d'),
                $m->exit_date?->format('Y-m-d'),
                $m->vehicle->name ?? 'N/A',
                $m->workshop_name,
                $m->description,
                $m->cost, // Note: This might need calculation if not stored
                $m->status
            ];
        })->toArray();

        $sheet->fromArray($data, null, 'A2');

        $writer = new Xlsx($spreadsheet);
        $fileName = 'Reporte_Taller.xlsx';
        
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        $writer->save('php://output');
        exit;
    }

    /**
     * General Checklist report (Excel)
     */
    public function checklistsReport(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $checklists = VehicleChecklist::with(['vehicle', 'user'])
            ->when($startDate, fn($q) => $q->where('created_at', '>=', $startDate))
            ->when($endDate, fn($q) => $q->where('created_at', '<=', $endDate))
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Checklists');

        $headers = ['Fecha', 'Vehículo', 'Usuario', 'Estado', 'Observaciones'];
        $sheet->fromArray($headers, null, 'A1');

        $data = $checklists->map(function($c) {
            return [
                $c->created_at->format('Y-m-d H:i'),
                $c->vehicle->name ?? 'N/A',
                $c->user->name ?? 'N/A',
                $c->status,
                $c->general_observations
            ];
        })->toArray();

        $sheet->fromArray($data, null, 'A2');

        $writer = new Xlsx($spreadsheet);
        $fileName = 'Reporte_Checklists_General.xlsx';
        
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        $writer->save('php://output');
        exit;
    }

    /**
     * Individual Checklist report (PDF)
     */
    public function individualChecklistReport(Request $request, Vehicle $vehicle)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $checklists = VehicleChecklist::where('vehicle_id', $vehicle->id)
            ->when($startDate, fn($q) => $q->where('created_at', '>=', $startDate))
            ->when($endDate, fn($q) => $q->where('created_at', '<=', $endDate))
            ->get();

        // Statistics: number of checklists, common issues?
        $total = $checklists->count();
        $byStatus = $checklists->groupBy('status')->map(fn($g) => $g->count());

        $pdf = Pdf::loadView('pdf.individual_checklist_report', [
            'vehicle' => $vehicle,
            'checklists' => $checklists,
            'total' => $total,
            'byStatus' => $byStatus,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);

        return $pdf->download("Checklist_{$vehicle->name}.pdf");
    }
}
