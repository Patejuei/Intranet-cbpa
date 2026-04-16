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

    <div class="section-title">RESUMEN GENERAL</div>
    <table>
        <tr>
            <th width="50%">Total de Checklists Realizados</th>
            <td>{{ $total }}</td>
        </tr>
    </table>

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
                <td>{{ number_format(($count / $total) * 100, 1) }}%</td>
            </tr>
            @empty
            <tr><td colspan="3">No hay registros en el periodo.</td></tr>
            @endforelse
        </tbody>
    </table>

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

    <div class="footer">
        Generado el {{ date('d/m/Y H:i') }} - Intranet CBPA
    </div>
</body>
</html>
