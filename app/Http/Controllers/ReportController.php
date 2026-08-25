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
        $user = $request->user();
        $query = VehicleIssue::with(['vehicle', 'reporter', 'reviewer'])->latest('date')->latest('id');

        if ($user) {
            $driverIds = $user->driverVehicles()->pluck('vehicles.id');
            $isInspectorMM = $user->role === 'inspector' && $user->department === 'Material Mayor';

            if ($user->company !== 'Comandancia' && $user->role !== 'admin' && !$isInspectorMM) {
                $query->whereHas('vehicle', function ($q) use ($user, $driverIds) {
                    $q->where('company', $user->company);
                    if ($driverIds->isNotEmpty()) {
                        $q->orWhereIn('id', $driverIds);
                    }
                });
            }
            if ($user->role === 'mechanic') {
                $query->where('sent_to_workshop', '=', 1);
            }
            if ($user->role === 'commander') {
                $query->where('reported_to_commander', '=', 1);
            }
        }

        $exportAll = $request->boolean('export_all');

        if (!$exportAll) {
            // Vehicle IDs filter
            if ($request->filled('vehicle_ids')) {
                $vehicleIds = is_array($request->vehicle_ids)
                    ? $request->vehicle_ids
                    : explode(',', (string) $request->vehicle_ids);
                $vehicleIds = array_filter(array_map('trim', $vehicleIds));
                if (!empty($vehicleIds)) {
                    $query->whereIn('vehicle_id', $vehicleIds);
                }
            } elseif ($request->filled('vehicle_id') && $request->vehicle_id !== 'all') {
                $query->where('vehicle_id', $request->vehicle_id);
            }

            // Period filter
            $periodType = $request->input('period_type');
            if ($periodType === 'month') {
                $year = $request->input('year');
                $month = $request->input('month');
                if ($year && $month) {
                    $query->whereYear('date', $year)->whereMonth('date', $month);
                } elseif ($month) {
                    $query->whereMonth('date', $month);
                } elseif ($year) {
                    $query->whereYear('date', $year);
                }
            } elseif ($periodType === 'year') {
                $year = $request->input('year');
                if ($year) {
                    $query->whereYear('date', $year);
                }
            } elseif ($periodType === 'custom') {
                if ($request->filled('date_from')) {
                    $query->whereDate('date', '>=', $request->date_from);
                }
                if ($request->filled('date_to')) {
                    $query->whereDate('date', '<=', $request->date_to);
                }
            } else {
                // Backwards compatibility for start_date & end_date
                if ($request->filled('start_date')) {
                    $query->whereDate('date', '>=', $request->start_date);
                }
                if ($request->filled('end_date')) {
                    $query->whereDate('date', '<=', $request->end_date);
                }
            }
        }

        $incidents = $query->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Incidencias');

        $headers = [
            'ID',
            'Fecha',
            'Vehículo',
            'Compañía',
            'Informante',
            'Descripción',
            'Gravedad',
            'Estado',
            '¿Detenido?',
            'Enviado a Cuartel General',
            'Enviado a Taller',
            'Revisado Por',
            'Fecha Revisión'
        ];
        $sheet->fromArray($headers, null, 'A1');
        $sheet->getStyle('A1:M1')->getFont()->setBold(true);

        $severityTranslations = [
            'Low' => 'Baja',
            'Medium' => 'Media',
            'High' => 'Alta',
            'Critical' => 'Crítica',
        ];

        $statusTranslations = [
            'Open' => 'Abierta',
            'Reviewed' => 'Revisada',
            'In Progress' => 'En Progreso',
            'Resolved' => 'Resuelta',
        ];

        $row = 2;
        foreach ($incidents as $i) {
            $sheet->setCellValue('A' . $row, $i->id);
            $sheet->setCellValue('B' . $row, $i->date);
            $sheet->setCellValue('C' . $row, $i->vehicle ? $i->vehicle->name : 'N/A');
            $sheet->setCellValue('D' . $row, $i->vehicle ? $i->vehicle->company : 'N/A');
            $sheet->setCellValue('E' . $row, $i->reporter ? $i->reporter->name : 'N/A');
            $sheet->setCellValue('F' . $row, $i->description);
            $sheet->setCellValue('G' . $row, $severityTranslations[$i->severity] ?? $i->severity);
            $sheet->setCellValue('H' . $row, $statusTranslations[$i->status] ?? $i->status);
            $sheet->setCellValue('I' . $row, $i->is_stopped ? 'Sí' : 'No');
            $sheet->setCellValue('J' . $row, $i->sent_to_hq ? 'Sí' : 'No');
            $sheet->setCellValue('K' . $row, $i->sent_to_workshop ? 'Sí' : 'No');
            $sheet->setCellValue('L' . $row, $i->reviewer ? $i->reviewer->name : 'N/A');
            $sheet->setCellValue('M' . $row, $i->reviewed_at ? $i->reviewed_at->format('Y-m-d H:i') : 'N/A');
            $row++;
        }

        foreach (range('A', 'M') as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $fileName = 'Reporte_Incidencias_' . date('Y-m-d_H-i') . '.xlsx';

        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Cache-Control' => 'max-age=0',
        ]);
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
        
        // Include options
        $includeSummary = $request->query('include_summary') === '1';
        $includeStatusStats = $request->query('include_status_stats') === '1';
        $includeCharts = $request->query('include_charts') === '1';
        $includeHistory = $request->query('include_history') === '1';

        $checklists = VehicleChecklist::where('vehicle_id', $vehicle->id)
            ->when($startDate, fn($q) => $q->where('created_at', '>=', $startDate))
            ->when($endDate, fn($q) => $q->where('created_at', '<=', $endDate))
            ->orderBy('created_at', 'desc')
            ->get();

        $total = $checklists->count();
        $byStatus = $checklists->groupBy('status')->map(fn($g) => $g->count());

        $maintenanceIssues = collect();
        $urgentIssues = collect();

        if ($includeCharts && $total > 0) {
            $checklistIds = $checklists->pluck('id');
            
            // Aggregated data for maintenance items (next_maint)
            $maintenanceIssues = \App\Models\VehicleChecklistDetail::whereIn('vehicle_checklist_id', $checklistIds)
                ->where('status', 'next_maint')
                ->with('item')
                ->get()
                ->groupBy('checklist_item_id')
                ->map(fn($group) => [
                    'name' => $group->first()->item->name ?? 'Ítem #' . $group->first()->checklist_item_id,
                    'count' => $group->count()
                ])
                ->sortByDesc('count')
                ->take(10);

            // Aggregated data for urgent items (urgent)
            $urgentIssues = \App\Models\VehicleChecklistDetail::whereIn('vehicle_checklist_id', $checklistIds)
                ->where('status', 'urgent')
                ->with('item')
                ->get()
                ->groupBy('checklist_item_id')
                ->map(fn($group) => [
                    'name' => $group->first()->item->name ?? 'Ítem #' . $group->first()->checklist_item_id,
                    'count' => $group->count()
                ])
                ->sortByDesc('count')
                ->take(10);
        }

        $pdf = Pdf::loadView('pdf.individual_checklist_report', [
            'vehicle' => $vehicle,
            'checklists' => $checklists,
            'total' => $total,
            'byStatus' => $byStatus,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'maintenanceIssues' => $maintenanceIssues,
            'urgentIssues' => $urgentIssues,
            'includeSummary' => $includeSummary,
            'includeStatusStats' => $includeStatusStats,
            'includeCharts' => $includeCharts,
            'includeHistory' => $includeHistory,
        ]);

        return $pdf->download("Checklist_{$vehicle->name}.pdf");
    }
}
