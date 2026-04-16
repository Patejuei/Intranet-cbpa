<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Reporte de Vehículo - {{ $vehicle->name }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #ce1212; padding-bottom: 10px; }
        .title { font-size: 18px; font-weight: bold; color: #ce1212; }
        .section-title { font-size: 14px; font-weight: bold; background-color: #f4f4f4; padding: 5px; margin-top: 15px; border-left: 4px solid #ce1212; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background-color: #f9f9f9; }
        .summary-box { margin-top: 10px; padding: 10px; border: 1px solid #ddd; background-color: #fdfdfd; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; color: #777; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">CUERPO DE BOMBEROS DE PUENTE ALTO</div>
        <div>REPORTE INDIVIDUAL DE UNIDAD</div>
        <div style="margin-top: 5px;"><strong>{{ $vehicle->name }} ({{ $vehicle->plate }})</strong></div>
        @if($startDate || $endDate)
            <div style="font-size: 11px;">Periodo: {{ $startDate ?? 'Inicio' }} al {{ $endDate ?? 'Fin' }}</div>
        @endif
    </div>

    <div class="section-title">DATOS PRINCIPALES DEL VEHÍCULO</div>
    <table>
        <tr>
            <th width="25%">Marca/Modelo</th><td>{{ $vehicle->make }} {{ $vehicle->model }}</td>
            <th width="25%">Año</th><td>{{ $vehicle->year }}</td>
        </tr>
        <tr>
            <th>Patente</th><td>{{ $vehicle->plate }}</td>
            <th>Compañía</th><td>{{ $vehicle->company }}</td>
        </tr>
        <tr>
            <th>Estado Actual</th><td>{{ $vehicle->status }}</td>
            <th>Tipo</th><td>{{ $vehicle->type }}</td>
        </tr>
    </table>

    <div class="section-title">ESTADÍSTICAS DE USO (SEGÚN BITÁCORAS)</div>
    <div class="summary-box">
        <table style="border: none;">
            <tr style="border: none;">
                <td style="border: none;"><strong>Kilómetros Recorridos:</strong> {{ number_format($totalKm, 0, ',', '.') }} km</td>
                <td style="border: none;"><strong>Horas de Trabajo:</strong> {{ number_format($totalHours, 1, ',', '.') }} hrs</td>
            </tr>
        </table>
    </div>

    <div class="section-title">ESTADÍSTICAS DE SALIDAS</div>
    <table>
        <thead>
            <tr>
                <th>Tipo de Actividad</th>
                <th>Cantidad</th>
            </tr>
        </thead>
        <tbody>
            @forelse($exitStats as $type => $count)
            <tr>
                <td>{{ $type }}</td>
                <td>{{ $count }}</td>
            </tr>
            @empty
            <tr><td colspan="2">No hay registros de salidas en el periodo.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="section-title">ESTADÍSTICAS POR CONDUCTOR</div>
    <table>
        <thead>
            <tr>
                <th>Conductor</th>
                <th>Kilómetros</th>
                <th>Horas</th>
            </tr>
        </thead>
        <tbody>
            @forelse($driverStats as $stat)
            <tr>
                <td>{{ $stat['name'] }}</td>
                <td>{{ number_format($stat['km'], 0, ',', '.') }} km</td>
                <td>{{ number_format($stat['hours'], 1, ',', '.') }} hrs</td>
            </tr>
            @empty
            <tr><td colspan="3">No hay registros de conductores en el periodo.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="section-title">TRABAJOS EN TALLER</div>
    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Taller</th>
                <th>Descripción</th>
                <th>Costo</th>
            </tr>
        </thead>
        <tbody>
            @forelse($maintenances as $m)
            <tr>
                <td>{{ $m->entry_date->format('d/m/Y') }}</td>
                <td>{{ $m->workshop_name }}</td>
                <td>{{ $m->description }}</td>
                <td>${{ number_format($m->cost, 0, ',', '.') }}</td>
            </tr>
            @empty
            <tr><td colspan="4">No hay registros de taller en el periodo.</td></tr>
            @endforelse
        </tbody>
        @if($maintenances->count() > 0)
        <tfoot>
            <tr>
                <th colspan="3" style="text-align: right;">INVERSIÓN TOTAL EN EL PERIODO:</th>
                <th>${{ number_format($totalInvestment, 0, ',', '.') }}</th>
            </tr>
        </tfoot>
        @endif
    </table>

    <div class="footer">
        Generado el {{ date('d/m/Y H:i') }} - Intranet CBPA
    </div>
</body>
</html>
