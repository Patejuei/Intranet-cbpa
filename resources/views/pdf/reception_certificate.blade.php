<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Acta de Recepción de Material Menor</title>
  <style>
    body {
      font-family: sans-serif;
      font-size: 12px;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .title {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 5px;
    }

    .subtitle {
      font-size: 14px;
    }

    .content {
      margin-top: 20px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    .table th,
    .table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    .footer {
      margin-top: 50px;
      text-align: center;
    }

    .signature-box {
      display: inline-block;
      width: 40%;
      margin-top: 60px;
      border-top: 1px solid #000;
      padding-top: 5px;
    }
  </style>
</head>

<body>
  <div class="header">
    <div class="title">CUERPO DE BOMBEROS DE PUENTE ALTO</div>
    <div class="subtitle">DEPARTAMENTO DE MATERIAL MENOR</div>
    <h2>ACTA DE RECEPCIÓN DE MATERIAL PARA EVALUACIÓN</h2>
  </div>

  <div class="content">
    <p><strong>Fecha:</strong> {{ $date }}</p>
    <p><strong>Solicitante:</strong> {{ $baja->user->name }} ({{ $baja->user->company }})</p>
    <p><strong>Referencia:</strong> Solicitud de Baja #{{ $baja->id }}</p>

    <p>Se ha recibido el siguiente material para inspección y evaluación técnica:</p>

    <table class="table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Producto</th>
          <th>Serie</th>
          <th>Cantidad</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $baja->material->code }}</td>
          <td>{{ $baja->material->product_name }}</td>
          <td>{{ $baja->material->serial_number }}</td>
          <td>{{ $baja->quantity }}</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 20px;">
      <strong>Motivo declarado:</strong>
      <p>{{ $baja->reason }}</p>
    </div>

    <div style="margin-top: 20px;">
      <strong>Observaciones de Recepción:</strong>
      <p>El material queda en custodia del Departamento de Material Menor para su evaluación técnica.</p>
    </div>
  </div>

  <div class="footer">
    <div class="signature-box">
      Firma Quien Entrega<br>
      {{ $baja->user->name }}
    </div>
    <div style="display: inline-block; width: 10%;"></div>
    <div class="signature-box">
      Firma Quien Recibe<br>
      {{ auth()->user()->name }}<br>
      Inspector de Material Menor
    </div>
  </div>
</body>

</html>