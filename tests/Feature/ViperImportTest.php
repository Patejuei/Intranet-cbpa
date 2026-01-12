<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Material;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ViperImportTest extends TestCase
{
  use RefreshDatabase;

  public function test_viper_import_creates_material()
  {
    // 1. Create User with permissions
    $user = User::factory()->create([
      'role' => 'admin',
    ]);

    // 2. Create a Mock Excel File
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

    // Headers (Row 1) - mimicking what the controller expects (index 0)
    // Col indices: 1=Lugar, 2=Familia, 4=Producto, 5=Marca, 8=Serie, 9=Cantidad
    // Array is 0-indexed in PhpSpreadsheet if we use fromArray, but setCellValue mimics user input
    // Controller uses $sheet->toArray(), so Row 1 is index 0. We start data at Row 2.

    $headers = ['Id', 'Lugar', 'Familia', 'SubFamilia', 'Producto', 'Marca', 'Modelo', 'Estado', 'Serie', 'Cantidad'];
    $sheet->fromArray($headers, null, 'A1');

    // Data Row (Row 2)
    $data = [
      '1', // Id
      'Cuartel Segunda', // Lugar -> Should map to 'Segunda Compañía'
      'COMUNICACIONES', // Familia -> Should map to 'Telecomunicaciones'
      'Radio', // SubFamilia
      'Radio Portátil', // Producto
      'Motorola', // Marca
      'APX 2000', // Modelo
      'Bueno', // Estado
      'SN123456', // Serie
      '5' // Cantidad
    ];
    $sheet->fromArray($data, null, 'A2');

    // Data Row 3 (Complex Category Logic)
    $data2 = [
      '2',
      'Cuartel Primera',
      'Equipos de Protección Personal', // -> EPP
      'Guantes',
      'Guante Estructural',
      'Dragon Fire',
      'Alpha X',
      'Bueno',
      'SN789',
      '10'
    ];
    $sheet->fromArray($data2, null, 'A3');

    // Save to temporary file
    $tempFile = tempnam(sys_get_temp_dir(), 'viper_import_test') . '.xlsx';
    $writer = new Xlsx($spreadsheet);
    $writer->save($tempFile);

    $file = new UploadedFile($tempFile, 'viper_import.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true);

    // 3. Act
    $this->withoutExceptionHandling();
    $response = $this->actingAs($user)
      ->post(route('inventory.import-viper'), [
        'file' => $file,
      ]);

    // 4. Assert
    $response->assertRedirect();
    $response->assertSessionHas('success');

    // 5. Verify Database
    $this->assertDatabaseHas('materials', [
      'product_name' => 'Radio Portátil',
      'company' => 'Segunda Compañía',
      'category' => 'Telecomunicaciones', // Mapped from COMUNICACIONES
      'brand' => 'Motorola',
      'serial_number' => 'SN123456',
      'stock_quantity' => 5,
    ]);

    // Check code generation (Should have TEL prefix)
    $material = Material::where('product_name', 'Radio Portátil')->first();
    $this->assertNotNull($material->code);
    $this->assertStringStartsWith('TEL-', $material->code);

    $this->assertDatabaseHas('materials', [
      'product_name' => 'Guante Estructural',
      'company' => 'Primera Compañía',
      'category' => 'Equipos de Protección Personal',
      'stock_quantity' => 10,
    ]);

    // Cleanup
    @unlink($tempFile);
  }
}
