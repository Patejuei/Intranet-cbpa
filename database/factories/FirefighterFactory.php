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
        $firstName = $this->faker->firstName;
        $middleName = $this->faker->boolean(70) ? $this->faker->firstName : null;
        $paternalLastName = $this->faker->lastName;
        $maternalLastName = $this->faker->lastName;

        return [
            'general_registry_number' => $this->faker->unique()->numberBetween(1000, 9999),
            'first_name' => $firstName,
            'middle_name' => $middleName,
            'paternal_last_name' => $paternalLastName,
            'maternal_last_name' => $maternalLastName,
            'full_name' => trim(implode(' ', array_filter([$firstName, $middleName, $paternalLastName, $maternalLastName]))),
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
