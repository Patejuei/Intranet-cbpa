<!DOCTYPE html>
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Acta de Recepción #{{ $certificate->id }}</title>
  <style>
    body {
      font-family: sans-serif;
      font-size: 14px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .subtitle {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    .info-table td {
      padding: 5px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }

    .items-table th,
    .items-table td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }

    .items-table th {
      background-color: #f0f0f0;
    }

    .signatures {
      margin-top: 50px;
      width: 100%;
    }

    .signature-box {
      width: 45%;
      float: left;
      text-align: center;
    }

    .signature-line {
      border-top: 1px solid #000;
      margin-top: 50px;
      margin-bottom: 5px;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }

    .clear {
      clear: both;
    }
  </style>
</head>

<body>
  <div class="header">
    <div class="title">CUERPO DE BOMBEROS DE PUENTE ALTO</div>
    <div class="subtitle">{{ $certificate->company }}</div>
    <h2>ACTA DE RECEPCIÓN DE MATERIAL MENOR</h2>
  </div>

  <table class="info-table">
    <tr>
      <td width="20%"><strong>Fecha:</strong></td>
      <td>{{ \Carbon\Carbon::parse($certificate->date)->format('d/m/Y') }}</td>
    </tr>
    <tr>
      <td><strong>Bombero (Entrega):</strong></td>
      <td>{{ $certificate->firefighter->full_name }}</td>
    </tr>
    <tr>
      <td><strong>Oficial (Receptor):</strong></td>
      <td>{{ $certificate->user->name }}</td>
    </tr>
    @if($certificate->observations)
    <tr>
      <td><strong>Observaciones:</strong></td>
      <td>{{ $certificate->observations }}</td>
    </tr>
    @endif
  </table>

  <table class="items-table">
    <thead>
      <tr>
        <th>Item</th>
        <th>Material</th>
        <th>Cantidad</th>
      </tr>
    </thead>
    <tbody>
      @foreach($certificate->items as $index => $item)
      <tr>
        <td>{{ $index + 1 }}</td>
        <td>{{ $item->material->product_name }}</td>
        <td>{{ $item->quantity }}</td>
      </tr>
      @endforeach
    </tbody>
  </table>

  <div class="signatures">
    <div class="signature-box">
      <div class="signature-line"></div>
      <strong>{{ $certificate->user->name }}</strong><br>
      Recibido por (Oficial)
    </div>
    <div class="signature-box" style="float: right;">
      <div class="signature-line"></div>
      <strong>{{ $certificate->firefighter->full_name }}</strong><br>
      Entregado por (Bombero)
    </div>
    <div class="clear"></div>
  </div>
</body>

</html>