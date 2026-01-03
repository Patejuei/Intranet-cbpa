<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = [
            'Primera Compañía' => ['B-1', 'R-1', 'BX-1'],
            'Segunda Compañía' => ['B-2', 'RX-2', 'Z-2'],
            'Tercera Compañía' => ['B-3', 'PT-3', 'BX-3'],
            'Cuarta Compañía' => ['B-4', 'R-4', 'M-4'],
            'Quinta Compañía' => ['B-5', 'BX-5', 'Z-5'],
            'Sexta Compañía' => ['B-6', 'RX-6', 'UT-6'],
            'Séptima Compañía' => ['B-7', 'R-7', 'Z-7'],
            'Octava Compañía' => ['B-8', 'BX-8', 'J-8'],
            'Novena Compañía' => ['B-9', 'R-9', 'Z-9'],
            'Décima Compañía' => ['B-10', 'Q-10', 'Z-10'], // Added Decima
            'Comandancia' => ['K-1', 'K-2', 'K-3', 'H-1', 'X-1', 'LT-1'],
        ];

        foreach ($companies as $companyName => $units) {
            foreach ($units as $unitName) {
                // Determine make/model roughly based on unit type for variety
                $isTanker = str_contains($unitName, 'Z');
                $isRescue = str_contains($unitName, 'R');
                $isLadder = str_contains($unitName, 'M') || str_contains($unitName, 'Q');

                $make = $isTanker ? 'Mercedes Benz' : ($isRescue ? 'Rosenbauer' : ($isLadder ? 'Magirus' : 'Renault'));
                $model = $isTanker ? 'Actros' : ($isRescue ? 'AT' : ($isLadder ? 'M32L' : 'Midlum'));

                \App\Models\Vehicle::create([
                    'name' => $unitName,
                    'make' => $make,
                    'model' => $model,
                    'year' => rand(2010, 2024),
                    'plate' => strtoupper(fake()->bothify('??##-##')),
                    'status' => 'Operative',
                    'company' => $companyName,
                ]);
            }
        }
    }
}
