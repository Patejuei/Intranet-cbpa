<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\VehicleMaintenance;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VehicleMaintenance>
 */

class WorkshopFactory extends Factory
{
    protected $model = VehicleMaintenance::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checklistOptions = ['Funcional', 'Fallas', 'N/A'];
        $entryChecklist = array('Sistema de frenos (Incluye ABS)' => $this->faker->randomElement($checklistOptions), 'Sistema Eléctrico y luces de emergencia' => $this->faker->randomElement($checklistOptions), 'Motor y sistema de refrigeración' => $this->faker->randomElement($checklistOptions), 'Suspensión y dirección' => $this->faker->randomElement($checklistOptions), 'Cabina de Mando (Tableros, mando, radiocomunicación)' => $this->faker->randomElement($checklistOptions), 'Equipamiento Hidraulico / Bombas de Agua' => $this->faker->randomElement($checklistOptions), 'Escala / Sistema Extensible (si aplica)' => $this->faker->randomElement($checklistOptions), 'Compartimientos de Herramientas' => $this->faker->randomElement($checklistOptions), 'Sistema de carga de agua / estanque' => $this->faker->randomElement($checklistOptions), 'Neumáticos y repuestos' => $this->faker->randomElement($checklistOptions), 'Alarma sonora y luces baliza' => $this->faker->randomElement($checklistOptions), 'Fugas de líquidos' => $this->faker->randomElement($checklistOptions));
        $statusOptions = ['En Taller', 'Trabajando', 'En Espera de Repuestos', 'Pruebas Finales', 'Finalizado', 'Entregado'];
        $status = $this->faker->randomElement($statusOptions);
        $exitDate = null;
        $responsibleName = null;
        $responsibleRut = null;
        if ($status === 'Entregado' || $status === 'Finalizado') {
            $exitDate = $this->faker->dateTimeThisDecade();
        }
        if ($status === 'Entregado') {
            $responsibleName = $this->faker->name();
            $responsibleRut = $this->faker->numerify('########-#');
        }

        return [
            'vehicle_id' => $this->faker->randomElement(\App\Models\Vehicle::all()->pluck('id')->toArray()),
            'workshop_name' => 'Nemesio Vicuña 275, Puente Alto',
            'responsible_person' => $this->faker->name(),
            'entry_date' => $this->faker->dateTimeThisDecade(),
            'mileage_in' => $this->faker->numberBetween(30000, 150000),
            'traction' => $this->faker->randomElement(['4x2', '4x4']),
            'fuel_type' => $this->faker->randomElement(['Diesel', 'Gasolina', 'Eléctrico', 'Otro']),
            'transmission' => $this->faker->randomElement(['Manual', 'Automática']),
            'entry_checklist' => $entryChecklist,
            'status' => $status,
            'exit_date' => $exitDate,
            'withdrawal_responsible_name' => $responsibleName,
            'withdrawal_responsible_rut' => $responsibleRut,
            'working_hours' => $this->faker->numberBetween(1, 100),
            'hour_rate' => $this->faker->numberBetween(8000, 12000),
            'description' => ''
        ];
    }
}
