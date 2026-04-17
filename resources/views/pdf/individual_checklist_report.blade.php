<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Reporte de Checklist - {{ $vehicle->name }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #ce1212; padding-bottom: 10px; }
        .title { font-size: 18px; font-weight: bold; color: #ce1212; }
        .section-title { font-size: 14px; font-weight: bold; background-color: #f4f4f4; padding: 5px; margin-top: 15px; border-left: 4px solid #ce1212; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background-color: #f9f9f9; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; color: #777; }
        
        /* Bar chart styles */
        .bar-container { width: 100%; background-color: #eee; margin-bottom: 3px; height: 18px; border-radius: 2px; overflow: hidden; }
        .bar { height: 100%; background-color: #ce1212; text-align: right; padding-right: 5px; line-height: 18px; color: white; font-size: 10px; font-weight: bold; }
        .bar-urgent { background-color: #333; }
        .chart-item { margin-bottom: 10px; }
        .chart-label { font-size: 11px; margin-bottom: 2px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">CUERPO DE BOMBEROS DE PUENTE ALTO</div>
        <div>REPORTE DE ESTADÍSTICAS DE CHECKLIST</div>
        <div style="margin-top: 5px;"><strong>{{ $vehicle->name }} ({{ $vehicle->plate }})</strong></div>
        @if($startDate || $endDate)
            <div style="font-size: 11px;">Periodo: {{ $startDate ?? 'Inicio' }} al {{ $endDate ?? 'Fin' }}</div>
        @endif
    </div>

    @if($includeSummary)
    <div class="section-title">RESUMEN GENERAL</div>
    <table>
        <tr>
            <th width="50%">Total de Checklists Realizados</th>
            <td>{{ $total }}</td>
        </tr>
    </table>
    @endif

    @if($includeStatusStats)
    <div class="section-title">DESGLOSE POR ESTADO</div>
    <table>
        <thead>
            <tr>
                <th>Estado</th>
                <th>Cantidad</th>
                <th>Porcentaje</th>
            </tr>
        </thead>
        <tbody>
            @forelse($byStatus as $status => $count)
            <tr>
                <td>{{ $status }}</td>
                <td>{{ $count }}</td>
                <td>{{ $total > 0 ? number_format(($count / $total) * 100, 1) : 0 }}%</td>
            </tr>
            @empty
            <tr><td colspan="3">No hay registros en el periodo.</td></tr>
            @endforelse
        </tbody>
    </table>
    @endif

    @if($includeCharts)
    <div class="section-title">ÍTEMS QUE REQUIEREN MANTENCIÓN (TOP 10)</div>
    <p style="font-size: 10px; color: #666; margin-top: 5px;">Frecuencia de marca "Requiere Mantención" en el periodo seleccionado.</p>
    @php $maxMaint = $maintenanceIssues->max('count') ?: 1; @endphp
    <div style="margin-top: 10px;">
        @forelse($maintenanceIssues as $issue)
            <div class="chart-item">
                <div class="chart-label">{{ $issue['name'] }} ({{ $issue['count'] }} veces)</div>
                <div class="bar-container">
                    <div class="bar" style="width: {{ ($issue['count'] / $maxMaint) * 100 }}%">{{ $issue['count'] }}</div>
                </div>
            </div>
        @empty
            <p>No se registran ítems con requerimiento de mantención en este periodo.</p>
        @endforelse
    </div>

    <div class="section-title">ÍTEMS CON MANTENCIÓN URGENTE (TOP 10)</div>
    <p style="font-size: 10px; color: #666; margin-top: 5px;">Frecuencia de marca "Urgente" en el periodo seleccionado.</p>
    @php $maxUrgent = $urgentIssues->max('count') ?: 1; @endphp
    <div style="margin-top: 10px;">
        @forelse($urgentIssues as $issue)
            <div class="chart-item">
                <div class="chart-label">{{ $issue['name'] }} ({{ $issue['count'] }} veces)</div>
                <div class="bar-container">
                    <div class="bar bar-urgent" style="width: {{ ($issue['count'] / $maxUrgent) * 100 }}%">{{ $issue['count'] }}</div>
                </div>
            </div>
        @empty
            <p>No se registran ítems con mantención urgente en este periodo.</p>
        @endforelse
    </div>
    @endif

    @if($includeHistory)
    <div class="section-title">ÚLTIMOS CHECKLISTS</div>
    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Observaciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach($checklists->take(20) as $c)
            <tr>
                <td>{{ $c->created_at->format('d/m/Y H:i') }}</td>
                <td>{{ $c->user->name ?? 'N/A' }}</td>
                <td>{{ $c->status }}</td>
                <td>{{ \Illuminate\Support\Str::limit($c->general_observations, 50) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <div class="footer">
        Generado el {{ date('d/m/Y H:i') }} - Intranet CBPA
    </div>
</body>
</html>
