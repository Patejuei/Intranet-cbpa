<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Firefighter>
 */
class FirefighterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'general_registry_number' => $this->faker->unique()->numberBetween(1000, 9999),
            'full_name' => $this->faker->name,
            'rut' => $this->faker->unique()->numerify('##.###.###-#'),
            'company' => $this->faker->randomElement([
                'Primera Compañía',
                'Segunda Compañía',
                'Tercera Compañía',
                'Cuarta Compañía',
                'Quinta Compañía',
                'Sexta Compañía',
                'Séptima Compañía',
                'Octava Compañía',
                'Novena Compañía',
                'Brigada Juvenil',
                'Comandancia'
            ]),
        ];
    }
}
