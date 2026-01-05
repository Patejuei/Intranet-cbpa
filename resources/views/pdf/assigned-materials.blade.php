<!DOCTYPE html>
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Prendas a Cargo - {{ $firefighter->full_name }}</title>
  <style>
    body {
      font-family: sans-serif;
      font-size: 12px;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
    }

    .header h1 {
      margin: 0;
      font-size: 18px;
      text-transform: uppercase;
    }

    .info-table {
      width: 100%;
      margin-bottom: 20px;
    }

    .info-table td {
      padding: 5px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
    }

    .items-table th,
    .items-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    .items-table th {
      background-color: #f2f2f2;
      font-weight: bold;
    }

    .footer {
      margin-top: 50px;
      text-align: center;
      font-size: 10px;
      color: #666;
    }

    .signatures {
      margin-top: 50px;
      width: 100%;
    }

    .signature-box {
      width: 45%;
      display: inline-block;
      text-align: center;
      border-top: 1px solid #000;
      padding-top: 10px;
    }
  </style>
</head>

<body>
  <div class="header">
    <h1>Cuerpo de Bomberos de Puente Alto</h1>
    <h2>Ficha de Prendas a Cargo</h2>
  </div>

  <table class="info-table">
    <tr>
      <td><strong>Nombre:</strong> {{ $firefighter->full_name }}</td>
      <td><strong>RUT:</strong> {{ $firefighter->rut }}</td>
    </tr>
    <tr>
      <td><strong>Compañía:</strong> {{ $firefighter->company }}</td>
      <td><strong>Fecha Emisión:</strong> {{ date('d/m/Y H:i') }}</td>
    </tr>
  </table>

  <table class="items-table">
    <thead>
      <tr>
        <th>Material</th>
        <th>Código</th>
        <th>Marca / Modelo</th>
        <th style="text-align: right;">Cantidad</th>
      </tr>
    </thead>
    <tbody>
      @forelse($firefighter->assignedMaterials as $assigned)
      <tr>
        <td>{{ $assigned->material->product_name }}</td>
        <td>{{ $assigned->material->code ?? '-' }}</td>
        <td>{{ $assigned->material->brand }} {{ $assigned->material->model }}</td>
        <td style="text-align: right;">{{ $assigned->quantity }}</td>
      </tr>
      @empty
      <tr>
        <td colspan="4" style="text-align: center;">Este bombero no tiene prendas asignadas.</td>
      </tr>
      @endforelse
    </tbody>
  </table>

  <div class="signatures">
    <div class="signature-box" style="float: left;">
      Firma Bombero
    </div>
    <div class="signature-box" style="float: right;">
      Firma Oficial a Cargo
    </div>
  </div>

  <div style="clear: both;"></div>

  <div class="footer">
    <p>Documento generado electrónicamente por Intranet CBPA.</p>
  </div>
</body>

</html>