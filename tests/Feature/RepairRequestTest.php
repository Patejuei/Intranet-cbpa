<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Material;
use App\Models\RepairRequest;
use App\Models\ReceptionCertificate;
use App\Models\Firefighter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RepairRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_captain_can_create_repair_request()
    {
        $user = User::factory()->create(['role' => 'capitan']);
        $material = Material::factory()->create();

        $response = $this->actingAs($user)
            ->post(route('equipment.repairs.store'), [
                'material_id' => $material->id,
                'description' => 'Broken handle',
            ]);

        $response->assertRedirect(route('equipment.repairs.index'));
        $this->assertDatabaseHas('repair_requests', [
            'material_id' => $material->id,
            'description' => 'Broken handle',
            'status' => 'PENDING',
            'requested_by' => $user->id,
        ]);
    }

    public function test_can_list_repair_requests()
    {
        $user = User::factory()->create(['role' => 'capitan']);
        RepairRequest::factory()->count(3)->create();

        $response = $this->actingAs($user)
            ->get(route('equipment.repairs.index'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($page) => $page
                ->component('equipment/repairs/index')
                ->has('requests', 3)
        );
    }

    public function test_inspector_can_receive_repair_request()
    {
        $requester = User::factory()->create(['role' => 'capitan', 'rut' => '12345678-9']);
        // Create matching firefighter for reception logic
        Firefighter::factory()->create(['rut' => '12345678-9']);

        $inspector = User::factory()->create(['role' => 'inspector', 'department' => 'Material Menor']);
        $repairRequest = RepairRequest::factory()->create([
            'requested_by' => $requester->id,
            'status' => 'PENDING'
        ]);

        $response = $this->actingAs($inspector)
            ->post(route('equipment.repairs.receive', $repairRequest->id));

        $response->assertRedirect();
        $this->assertDatabaseHas('repair_requests', [
            'id' => $repairRequest->id,
            'status' => 'RECEIVED_BY_INSPECTOR',
            'inspector_id' => $inspector->id,
        ]);

        $updatedRequest = RepairRequest::find($repairRequest->id);
        $this->assertNotNull($updatedRequest->reception_certificate_id);
    }

    public function test_inspector_can_evaluate_repair_request()
    {
        $inspector = User::factory()->create(['role' => 'inspector', 'department' => 'Material Menor']);
        $repairRequest = RepairRequest::factory()->create([
            'status' => 'RECEIVED_BY_INSPECTOR',
            'inspector_id' => $inspector->id
        ]);

        $response = $this->actingAs($inspector)
            ->post(route('equipment.repairs.evaluate', $repairRequest->id), [
                'status' => 'APPROVED',
                'observation' => 'Fixable',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('repair_requests', [
            'id' => $repairRequest->id,
            'status' => 'APPROVED',
            'inspection_observation' => 'Fixable',
        ]);
    }

    public function test_acquisitions_can_send_to_provider()
    {
        $acquisitions = User::factory()->create(['role' => 'secretaria_adquisiciones']);
        $repairRequest = RepairRequest::factory()->create([
            'status' => 'APPROVED'
        ]);

        $response = $this->actingAs($acquisitions)
            ->post(route('equipment.repairs.send_provider', $repairRequest->id), [
                'provider_name' => 'Repair Shop Inc.',
                'repair_description' => 'Fix handle',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('repair_requests', [
            'id' => $repairRequest->id,
            'status' => 'SENT_TO_PROVIDER',
            'provider_name' => 'Repair Shop Inc.',
            'repair_description' => 'Fix handle',
        ]);
    }

    public function test_acquisitions_can_finish_repair_request()
    {
        $acquisitions = User::factory()->create(['role' => 'secretaria_adquisiciones']);
        $repairRequest = RepairRequest::factory()->create([
            'status' => 'SENT_TO_PROVIDER'
        ]);

        // Mock file upload if needed, or omit file for simplicity as it's nullable in validation but handled in controller
        // Controller validates 'invoice_file' => 'nullable|file|mimes:pdf,jpg,png'

        $response = $this->actingAs($acquisitions)
            ->post(route('equipment.repairs.finish', $repairRequest->id), [
                'invoice_number' => 'INV-123',
                'repair_cost' => 15000,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('repair_requests', [
            'id' => $repairRequest->id,
            'status' => 'FINISHED',
            'invoice_number' => 'INV-123',
            'repair_cost' => 15000,
        ]);
    }
}
