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
            'Primera Compañía' => ['B-1', 'RB-1'],
            'Segunda Compañía' => ['B-2', 'R-2', 'BX-2'],
            'Tercera Compañía' => ['B-3', 'Q-3', 'MX-3'],
            'Cuarta Compañía' => ['BH-4', 'UT-4'],
            'Quinta Compañía' => ['B-5', 'RB-5', 'BT-5'],
            'Séptima Compañía' => ['B-7', 'Q-7', 'MX-7'],
            'Octava Compañía' => ['B-8', 'BX-8', 'Z-8'],
            'Novena Compañía' => ['RB-9', 'M-9', 'UT-9'],
            'Décima Compañía' => ['B-10', 'Z-10', 'BX-10'],
            'Comandancia' => ['K-1', 'K-2', 'K-3', 'UT-0', 'X-1', 'S-1'],
        ];

        foreach ($companies as $companyName => $units) {
            foreach ($units as $unitName) {
                // Determine make/model roughly based on unit type for variety
                $isTanker = str_contains($unitName, 'Z') || str_contains($unitName, 'BT');
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
