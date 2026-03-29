<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Reporte de Conductores</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .title { font-size: 18px; font-weight: bold; }
        .subtitle { font-size: 14px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f0f0f0; }
        .filters { margin-bottom: 10px; font-style: italic; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">CUERPO DE BOMBEROS DE PUENTE ALTO</div>
        <div class="subtitle">REPORTE DE TIEMPOS DE CONDUCTORES</div>
    </div>

    <div class="filters">
        Período: {{ $filters['start_date'] }} al {{ $filters['end_date'] }}
    </div>

    <table>
        <thead>
            <tr>
                <th>Conductor</th>
                <th>Vehículo</th>
                <th>Tipo</th>
                <th>Tiempo Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reportData as $item)
            <tr>
                <td>{{ $item['user_name'] }}</td>
                <td>{{ $item['vehicle_name'] }}</td>
                <td>{{ $item['is_primary'] ? 'Primario' : 'Secundario' }}</td>
                <td>{{ $item['duration_human'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
