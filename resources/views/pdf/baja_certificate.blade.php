<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Acta de Baja de Material Menor</title>
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

    .alert {
      color: red;
      font-weight: bold;
      margin-top: 10px;
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
    <div class="subtitle">SECRETARÍA DE ADQUISICIONES</div>
    <h2>CERTIFICADO DE BAJA DE MATERIAL MENOR</h2>
  </div>

  <div class="content">
    <p><strong>Fecha de Aprobación:</strong> {{ $date }}</p>
    <p><strong>Folio de Baja:</strong> {{ $history->id }}</p>
    <p><strong>Solicitud Original:</strong> #{{ $baja->id }}</p>

    <p>En virtud de los antecedentes técnicos presentados y la validación realizada por el Departamento de Material Menor, se procede a dar de baja definitiva del inventario institucional el siguiente ítem:</p>

    <table class="table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Producto</th>
          <th>Cantidad Eliminada</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $history->code }}</td>
          <td>{{ $history->product_name }}</td>
          <td>{{ $history->quantity_removed }}</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 20px;">
      <strong>Evaluación Técnica:</strong>
      <p>Inspector: {{ $baja->validation->inspector->name }}</p>
      <p>Diagnóstico: {{ $baja->validation->is_reparable ? 'REPARABLE (Error: No debería ser baja)' : 'IRREPARABLE / DESECHABLE' }}</p>
      <p>Observaciones: {{ $baja->validation->evaluation_notes }}</p>
    </div>

    <div class="alert">
      ESTE DOCUMENTO CERTIFICA LA ELIMINACIÓN FÍSICA Y ADMINISTRATIVA DEL MATERIAL.
    </div>
  </div>

  <div class="footer">
    <div class="signature-box">
      Aprobado Por<br>
      {{ $history->approver->name }}<br>
      Secretaria de Adquisiciones
    </div>
  </div>
</body>

</html>