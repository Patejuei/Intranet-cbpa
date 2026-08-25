<?php

namespace Tests\Feature;

use App\Models\ChecklistItem;
use App\Models\PettyCashRendition;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleChecklist;
use App\Models\VehicleIssue;
use App\Models\VehicleMaintenance;
use App\Notifications\PettyCashRenditionApprovedByInspectorNotification;
use App\Notifications\PettyCashRenditionCreatedNotification;
use App\Notifications\VehicleChecklistCreatedNotification;
use App\Notifications\VehicleIssueCreatedNotification;
use App\Notifications\VehicleIssueReviewedNotification;
use App\Notifications\VehicleMaintenanceFinalizedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    private User $captain;
    private User $machinist;
    private User $commander;
    private User $inspectorMM;
    private User $mechanic;
    private User $secretary;
    private Vehicle $companyVehicle;
    private Vehicle $comandanciaVehicle;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Usuarios con roles
        $this->captain = User::create([
            'name' => 'Capitán 1',
            'email' => 'capitan@test.cl',
            'rut' => '11111111-1',
            'password' => bcrypt('password'),
            'role' => 'capitan',
            'company' => 'Primera Compañía',
            'is_enabled' => true,
            'two_factor_confirmed_at' => now(),
        ]);

        $this->machinist = User::create([
            'name' => 'Maquinista 1',
            'email' => 'maquinista@test.cl',
            'rut' => '22222222-2',
            'password' => bcrypt('password'),
            'role' => 'maquinista',
            'company' => 'Primera Compañía',
            'is_enabled' => true,
            'two_factor_confirmed_at' => now(),
        ]);

        $this->commander = User::create([
            'name' => 'Comandante',
            'email' => 'comandante@test.cl',
            'rut' => '33333333-3',
            'password' => bcrypt('password'),
            'role' => 'comandante',
            'company' => 'Comandancia',
            'is_enabled' => true,
            'two_factor_confirmed_at' => now(),
        ]);

        $this->inspectorMM = User::create([
            'name' => 'Inspector Material Mayor',
            'email' => 'inspector.mm@test.cl',
            'rut' => '44444444-4',
            'password' => bcrypt('password'),
            'role' => 'inspector',
            'department' => 'Material Mayor',
            'company' => 'Comandancia',
            'is_enabled' => true,
            'two_factor_confirmed_at' => now(),
        ]);

        $this->mechanic = User::create([
            'name' => 'Mecánico Taller',
            'email' => 'mecanico@test.cl',
            'rut' => '55555555-5',
            'password' => bcrypt('password'),
            'role' => 'mechanic',
            'company' => 'Comandancia',
            'is_enabled' => true,
            'two_factor_confirmed_at' => now(),
        ]);

        $this->secretary = User::create([
            'name' => 'Secretaria Adquisiciones',
            'email' => 'secretaria@test.cl',
            'rut' => '66666666-6',
            'password' => bcrypt('password'),
            'role' => 'secretaria_adquisiciones',
            'company' => 'Comandancia',
            'is_enabled' => true,
            'two_factor_confirmed_at' => now(),
        ]);

        // 2. Vehículos
        $this->companyVehicle = Vehicle::create([
            'name' => 'B-1',
            'make' => 'Rosenbauer',
            'model' => 'Commander',
            'year' => 2020,
            'plate' => 'B1-1234',
            'status' => 'Operative',
            'company' => 'Primera Compañía',
            'type' => 'Bomba',
        ]);

        $this->comandanciaVehicle = Vehicle::create([
            'name' => 'K-1',
            'make' => 'Chevrolet',
            'model' => 'Tahoe',
            'year' => 2022,
            'plate' => 'K1-5678',
            'status' => 'Operative',
            'company' => 'Comandancia',
            'type' => 'Comandancia',
        ]);
    }

    public function test_vehicle_issue_creation_notifies_company_captain()
    {
        Notification::fake();

        $response = $this->actingAs($this->machinist)
            ->post(route('vehicles.incidents.store'), [
                'vehicle_id' => $this->companyVehicle->id,
                'description' => 'Fuga de aceite detectada en motor',
                'severity' => 'High',
                'date' => '2026-08-25',
            ]);

        $response->assertRedirect();

        Notification::assertSentTo(
            [$this->captain],
            VehicleIssueCreatedNotification::class,
            function ($notification) {
                return $notification->issue->vehicle_id === $this->companyVehicle->id;
            }
        );

        Notification::assertNotSentTo(
            [$this->commander, $this->inspectorMM, $this->mechanic],
            VehicleIssueCreatedNotification::class
        );
    }

    public function test_vehicle_issue_creation_for_comandancia_notifies_commander_and_inspector_mm()
    {
        Notification::fake();

        $response = $this->actingAs($this->commander)
            ->post(route('vehicles.incidents.store'), [
                'vehicle_id' => $this->comandanciaVehicle->id,
                'description' => 'Problema en sistema eléctrico',
                'severity' => 'Medium',
                'date' => '2026-08-25',
            ]);

        $response->assertRedirect();

        Notification::assertSentTo(
            [$this->commander, $this->inspectorMM],
            VehicleIssueCreatedNotification::class
        );

        Notification::assertNotSentTo(
            [$this->captain],
            VehicleIssueCreatedNotification::class
        );
    }

    public function test_vehicle_issue_review_notifies_selected_entities()
    {
        Notification::fake();

        $issue = VehicleIssue::create([
            'vehicle_id' => $this->companyVehicle->id,
            'reporter_id' => $this->machinist->id,
            'description' => 'Falla en frenos',
            'severity' => 'Critical',
            'date' => '2026-08-25',
            'status' => 'Open',
            'is_stopped' => false,
        ]);

        // Simular sesión OTP requerida para revisión
        $response = $this->actingAs($this->captain)
            ->withSession(['otp_verified' => true, 'otp_verified_at' => now()->timestamp])
            ->put(route('vehicles.incidents.update', $issue->id), [
                'is_stopped' => true,
                'sent_to_hq' => true,
                'sent_to_workshop' => true,
                'reported_to_commander' => false,
                'status' => 'In Review',
            ]);

        $response->assertRedirect();

        // Debe notificar a Inspector MM y Mecánico, pero no a Comandante (reported_to_commander es false)
        Notification::assertSentTo(
            [$this->inspectorMM, $this->mechanic],
            VehicleIssueReviewedNotification::class
        );

        Notification::assertNotSentTo(
            [$this->commander],
            VehicleIssueReviewedNotification::class
        );
    }

    public function test_vehicle_issue_image_upload_does_not_trigger_review_notification()
    {
        Storage::fake('public');
        Notification::fake();

        $issue = VehicleIssue::create([
            'vehicle_id' => $this->companyVehicle->id,
            'reporter_id' => $this->machinist->id,
            'description' => 'Falla en frenos',
            'severity' => 'High',
            'date' => '2026-08-25',
            'status' => 'Open',
            'is_stopped' => false,
        ]);

        $file = UploadedFile::fake()->image('falla.jpg')->size(100);

        $response = $this->actingAs($this->machinist)
            ->post(route('vehicles.incidents.images.store', $issue->id), [
                'image' => $file,
            ]);

        $response->assertRedirect();

        Notification::assertNothingSent();
    }

    public function test_checklist_creation_for_company_vehicle_notifies_captain_and_machinist()
    {
        Notification::fake();

        $item = ChecklistItem::create([
            'name' => 'Nivel de Aceite',
            'category' => 'Motor',
            'is_active' => true,
        ]);

        $this->machinist->driverVehicles()->attach($this->companyVehicle->id);

        $response = $this->actingAs($this->machinist)
            ->post(route('vehicles.checklists.store'), [
                'vehicle_id' => $this->companyVehicle->id,
                'general_observations' => 'Todo en orden tras guardia nocturna',
                'details' => [
                    [
                        'item_id' => $item->id,
                        'status' => 'ok',
                        'notes' => 'Nivel adecuado',
                    ],
                ],
            ]);

        $response->assertRedirect();

        Notification::assertSentTo(
            [$this->captain, $this->machinist],
            VehicleChecklistCreatedNotification::class
        );

        Notification::assertNotSentTo(
            [$this->commander, $this->inspectorMM],
            VehicleChecklistCreatedNotification::class
        );
    }

    public function test_checklist_creation_for_comandancia_notifies_commander_and_inspector_mm()
    {
        Notification::fake();

        $item = ChecklistItem::create([
            'name' => 'Luces de emergencia',
            'category' => 'Electricidad',
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->commander)
            ->post(route('vehicles.checklists.store'), [
                'vehicle_id' => $this->comandanciaVehicle->id,
                'general_observations' => 'Checklist semanal Comandancia',
                'details' => [
                    [
                        'item_id' => $item->id,
                        'status' => 'ok',
                        'notes' => 'Operativo',
                    ],
                ],
            ]);

        $response->assertRedirect();

        Notification::assertSentTo(
            [$this->commander, $this->inspectorMM],
            VehicleChecklistCreatedNotification::class
        );

        Notification::assertNotSentTo(
            [$this->captain, $this->machinist],
            VehicleChecklistCreatedNotification::class
        );
    }

    public function test_rendition_store_notifies_material_mayor_inspector()
    {
        Storage::fake('public');
        Notification::fake();

        $file = UploadedFile::fake()->create('boleta.pdf', 200, 'application/pdf');

        $response = $this->actingAs($this->mechanic)
            ->post(route('vehicles.renditions.store'), [
                'supplier_rut' => '76123456-7',
                'invoice_date' => '2026-08-25',
                'invoice_number' => 'FAC-9988',
                'expense_type' => 'repair_supplies',
                'description' => 'Grasa y lubricantes multipropósito',
                'amount' => 45000,
                'vehicle_id' => $this->companyVehicle->id,
                'attachments' => [$file],
            ]);

        $response->assertRedirect();

        Notification::assertSentTo(
            [$this->inspectorMM],
            PettyCashRenditionCreatedNotification::class
        );

        Notification::assertNotSentTo(
            [$this->secretary],
            PettyCashRenditionCreatedNotification::class
        );
    }

    public function test_rendition_inspector_approval_notifies_acquisition_secretary()
    {
        Notification::fake();

        $rendition = PettyCashRendition::create([
            'user_id' => $this->mechanic->id,
            'supplier_rut' => '76123456-7',
            'invoice_date' => '2026-08-25',
            'invoice_number' => 'FAC-9988',
            'expense_type' => 'repair_supplies',
            'description' => 'Grasa y lubricantes',
            'amount' => 45000,
            'status' => 'pending_inspector',
        ]);

        $response = $this->actingAs($this->inspectorMM)
            ->withSession(['otp_verified' => true, 'otp_verified_at' => now()->timestamp])
            ->post(route('vehicles.renditions.review', $rendition->id), [
                'action' => 'approve',
            ]);

        $response->assertRedirect();

        Notification::assertSentTo(
            [$this->secretary],
            PettyCashRenditionApprovedByInspectorNotification::class
        );
    }

    public function test_workshop_maintenance_finalization_notifies_captain()
    {
        Notification::fake();

        $maintenance = VehicleMaintenance::create([
            'vehicle_id' => $this->companyVehicle->id,
            'workshop_name' => 'Taller Central CBPA',
            'description' => 'Mantenimiento y cambio de pastillas de freno',
            'entry_date' => '2026-08-20',
            'status' => 'Trabajando',
            'responsible_person' => 'Mecánico Jefe',
            'mileage_in' => 50000,
            'traction' => '4x2',
            'fuel_type' => 'Diesel',
            'transmission' => 'Manual',
            'receiver_user_id' => $this->mechanic->id,
        ]);

        $response = $this->actingAs($this->mechanic)
            ->put(route('vehicles.workshop.update', $maintenance->id), [
                'status' => 'Finalizado',
            ]);

        $response->assertRedirect();

        Notification::assertSentTo(
            [$this->captain],
            VehicleMaintenanceFinalizedNotification::class
        );

        Notification::assertNotSentTo(
            [$this->commander, $this->inspectorMM],
            VehicleMaintenanceFinalizedNotification::class
        );
    }
}
