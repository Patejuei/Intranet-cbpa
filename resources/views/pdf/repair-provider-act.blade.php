<!DOCTYPE html>
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>{{ $title }}</title>
  <style>
    body {
      font-family: sans-serif;
      font-size: 14px;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo {
      width: 80px;
      height: auto;
    }

    .title {
      font-size: 18px;
      font-weight: bold;
      margin-top: 10px;
    }

    .info {
      margin-bottom: 20px;
    }

    .info table {
      width: 100%;
      border-collapse: collapse;
    }

    .info td {
      padding: 5px;
    }

    .details {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    .details th,
    .details td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }

    .details th {
      background-color: #f2f2f2;
    }

    .signatures {
      margin-top: 50px;
      width: 100%;
    }

    .signature-box {
      width: 45%;
      float: left;
      text-align: center;
      border-top: 1px solid #000;
      margin-right: 5%;
      padding-top: 10px;
    }

    .clearfix::after {
      content: "";
      clear: both;
      display: table;
    }
  </style>
</head>

<body>
  <div class="header">
    <div class="title">CUERPO DE BOMBEROS PUENTE ALTO</div>
    <div class="title">{{ $title }}</div>
    <div>Fecha: {{ $date }}</div>
    <div>Solicitud #{{ $request->id }}</div>
  </div>

  <div class="info">
    <strong>Se entrega el siguiente material a proveedor para reparación:</strong>
  </div>

  <table class="details">
    <tr>
      <th>Proveedor</th>
      <td>{{ $request->provider_name }}</td>
    </tr>
    <tr>
      <th>Material</th>
      <td>{{ $request->material->product_name }}</td>
    </tr>
    <tr>
      <th>Marca / Modelo</th>
      <td>{{ $request->material->brand }} / {{ $request->material->model }}</td>
    </tr>
    <tr>
      <th>N° Serie / Código</th>
      <td>{{ $request->material->serial_number ?? $request->material->code }}</td>
    </tr>
    <tr>
      <th>Descripción Trabajo</th>
      <td>{{ $request->repair_description }}</td>
    </tr>
  </table>

  <div class="signatures clearfix">
    <div class="signature-box">
      <br><br>
      __________________________<br>
      Firma Entrega (Inspector)
    </div>
    <div class="signature-box" style="float: right; margin-right: 0;">
      <br><br>
      __________________________<br>
      Firma Recepción (Proveedor)
    </div>
  </div>
</body>

</html>