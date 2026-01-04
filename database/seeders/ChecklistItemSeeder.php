<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ChecklistItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            'Motor / Transmisión' => [
                'Revisión de perdidas de aceite por motor y transmisión',
                'Estado de mangueras del sistema de refrigeración',
                'Recorrido del pedal de embrague',
                'Control de nivel de Liquido refrigerante del motor',
                'Control de nivel de líquido de frenos',
            ],
            'Suspensión / Dirección' => [
                'Control de nivel de líquido de dirección hidraulica',
                'Estado de dirección al conducir',
                'Estado Visual de Neumáticos',
            ],
            'Electricidad' => [
                'Estado de Batería',
                'Estado de Operación de Luces de Emergencia',
                'Estado de Luces de Freno',
                'Estado de Luces Intermitentes',
                'Estado de Luces delanteras y traseras',
            ],
            'Carrocería' => [
                'Estado entrada / salida de Agua',
                'Funcionamiento de Limpia Parabrisas',
                'Estado de plumillas de limpia parabrisas',
                'Estado de Luces interiores y funcionamiento de climatizador A/C',
                'Funcionamiento de cerraduras de puertas y acceso exterior',
            ],
        ];

        foreach ($items as $category => $names) {
            foreach ($names as $name) {
                \App\Models\ChecklistItem::firstOrCreate([
                    'category' => $category,
                    'name' => $name,
                ]);
            }
        }

        // Create Machinist Role User
        $email = 'maquinista@cbpa.cl';
        if (!\App\Models\User::where('email', $email)->exists()) {
            \App\Models\User::create([
                'name' => 'Maquinista Test',
                'email' => $email,
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'mechanic', // Mapping 'machinist' to 'mechanic' or new role. User asked for 'maquinista' (new role).
                // Let's use 'mechanic' if it exists or 'machinist' if we can add new ones. 
                // Previous code checks `['cuartelero', 'mechanic'].includes(user.role)`
                // Let's stick to 'machinist' as requested and ensure frontend supports it.
                'role' => 'machinist',
                'company' => 'Comandancia',
                'permissions' => json_encode(['vehicles']),
            ]);
        }
    }
}
