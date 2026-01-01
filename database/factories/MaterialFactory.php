<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Material>
 */
class MaterialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_name' => $this->faker->words(3, true),
            'brand' => $this->faker->company,
            'model' => $this->faker->word,
            'code' => $this->faker->unique()->bothify('MAT-####'),
            'stock_quantity' => $this->faker->numberBetween(0, 100),
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
            'category' => $this->faker->randomElement(['EPP', 'Herramientas', 'Mangueras', 'Rescate', 'Telecomunicaciones']),
        ];
    }
}
