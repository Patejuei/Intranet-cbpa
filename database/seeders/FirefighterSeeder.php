<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Firefighter;

class FirefighterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvFile = base_path('bomberos.csv');
        if (!File::exists($csvFile)) {
            $this->command->error("CSV file not found at: $csvFile");
            return;
        }

        // Company Mapping
        $companyMap = [
            '1° Cía.' => 'Primera Compañía',
            '2° Cía.' => 'Segunda Compañía',
            '3° Cía.' => 'Tercera Compañía',
            '4° Cía.' => 'Cuarta Compañía',
            '5° Cía.' => 'Quinta Compañía',
            '6° Cía.' => 'Sexta Compañía',
            '7° Cía.' => 'Séptima Compañía',
            '8° Cía.' => 'Octava Compañía',
            '9° Cía.' => 'Novena Compañía',
            '10° Cía.' => 'Décima Compañía', // Assuming this exists if there's a 10th
            'Brigada Juvenil' => 'Brigada Juvenil',
            'Comandancia' => 'Comandancia',
        ];

        // Read CSV
        $file = fopen($csvFile, 'r');
        $headers = fgetcsv($file, 0, ';'); // Parse headers to skip them or verify

        while (($data = fgetcsv($file, 0, ';')) !== false) {
            // CIA;REGISTRO;RUT;NOMBRE;EMAIL
            $ciaRaw = trim($data[0] ?? '');
            $registro = trim($data[1] ?? '');
            $rut = trim($data[2] ?? '');
            $nombre = trim($data[3] ?? '');
            $email = trim($data[4] ?? '');

            // Handle encoding for company and name
            // Convert from likely Windows-1252/ISO-8859-1 to UTF-8
            if (!mb_check_encoding($ciaRaw, 'UTF-8')) {
                $ciaRaw = mb_convert_encoding($ciaRaw, 'UTF-8', 'Windows-1252');
            }
            if (!mb_check_encoding($nombre, 'UTF-8')) {
                $nombre = mb_convert_encoding($nombre, 'UTF-8', 'Windows-1252');
            }

            // Robust Mapping Logic
            $company = $ciaRaw;

            // Normalize for matching
            // "1° Cía." might come in as "1° Cía." (UTF8), "1º Cía." (Ord indicator), etc.
            // We can match by simpler logic: Number + "Cía" or just use the mapped string.

            if (isset($companyMap[$ciaRaw])) {
                $company = $companyMap[$ciaRaw];
            } else {
                // Try matching numbers if exact string failed
                if (preg_match('/^(\d+)/', $ciaRaw, $matches)) {
                    $num = $matches[1];
                    // Re-construct likely key or try direct map
                    $key = $num . '° Cía.';
                    if (isset($companyMap[$key])) {
                        $company = $companyMap[$key];
                    }
                }
            }

            // Skip invalid rows
            if (empty($rut) || empty($nombre)) {
                continue;
            }

            Firefighter::updateOrCreate(
                ['rut' => $rut], // Unique identifier
                [
                    'general_registry_number' => $registro ?: null,
                    'full_name' => $nombre,
                    'company' => $company,
                    'email' => $email ?: null,
                ]
            );
        }

        fclose($file);
    }
}
