<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csvFile = base_path('carros cbpa.csv');
        if (!file_exists($csvFile)) {
            $this->command->error('CSV file not found: ' . $csvFile);
            return;
        }

        // Open file with read mode
        if (($handle = fopen($csvFile, "r")) !== FALSE) {
            // Skip header
            fgetcsv($handle, 1000, ";");

            while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
                // $data indices:
                // 0: COMPAÑIA
                // 1: TIPO
                // 2: NOMENCLATURA (Name)
                // 3: MARCA
                // 4: MODELO
                // 5: AÑO
                // 6: PPU (Plate)
                // 7: Rev Tecnica
                // 8: Permiso Circ
                // 9: Seguro

                $companyRaw = $data[0] ?? '';
                $type = $data[1] ?? null;
                $name = $data[2] ?? 'Unknown';
                $brand = $data[3] ?? null;
                $model = $data[4] ?? null;
                $year = (isset($data[5]) && is_numeric($data[5])) ? (int)$data[5] : null;
                $plate = $data[6] ?? null;

                // Dates
                $revDate = $this->parseDate($data[7] ?? null);
                $permDate = $this->parseDate($data[8] ?? null);
                $insDate = $this->parseDate($data[9] ?? null);

                // Clean Plate
                if (empty($plate) || trim($plate) === '') {
                    // If no plate, maybe use name as identifier or skip?
                    // For now, let's skip/log items without plate or use name-based dummy plate?
                    // Better to skip if strict, or generate if needed.
                    // Given user constraints, let's skip but warn
                    // $this->command->warn("Skipping vehicle $name without plate.");
                    continue;
                }

                $company = $this->normalizeCompany($companyRaw);

                \App\Models\Vehicle::updateOrCreate(
                    ['plate' => $plate],
                    [
                        'name' => $name,
                        'company' => $company,
                        'type' => $type,
                        'make' => $brand,
                        'model' => $model,
                        'year' => $year,
                        'status' => 'Operative', // Default status unless logic suggests otherwise
                        'technical_review_expires_at' => $revDate,
                        'circulation_permit_expires_at' => $permDate,
                        'insurance_expires_at' => $insDate,
                    ]
                );
            }
            fclose($handle);
        }
    }

    private function normalizeCompany($value)
    {
        $value = mb_strtoupper(trim($value), 'UTF-8');
        // Map common variations
        $map = [
            'PRIMERA' => 'Primera Compañía',
            'SEGUNDA' => 'Segunda Compañía',
            'TERCERA' => 'Tercera Compañía',
            'CUARTA' => 'Cuarta Compañía',
            'QUINTA' => 'Quinta Compañía',
            'SEXTA' => 'Sexta Compañía',
            'SEPTIMA' => 'Séptima Compañía',
            'OCTAVA' => 'Octava Compañía',
            'NOVENA' => 'Novena Compañía',
            'DECIMA' => 'Décima Compañía', // Handle accented E if present?
            'DÉCIMA' => 'Décima Compañía',
            'BRIGADA JUVENIL' => 'Brigada Juvenil',
            'COMANDANCIA' => 'Comandancia',
        ];

        // Check if map key is contained in value or exact match?
        // Use exact match first
        if (isset($map[$value])) {
            return $map[$value];
        }

        return 'Comandancia'; // Default fallback? Or 'Primera Compañía'?
    }

    private function parseDate($value)
    {
        if (!$value || trim($value) === '') return null;
        try {
            // Format in CSV seems to be DD-MM-YYYY
            return \Carbon\Carbon::createFromFormat('d-m-Y', trim($value))->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }
}
