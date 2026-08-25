<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleIssue;
use App\Models\VehicleIssueImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VehicleIssueTest extends TestCase
{
    use RefreshDatabase;

    private $vehicle;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->vehicle = Vehicle::create([
            'name' => 'B-1',
            'make' => 'Rosenbauer',
            'model' => 'Commander',
            'year' => 2020,
            'plate' => 'AB-CD-12',
            'status' => 'Available',
            'company' => '1a Compañía',
            'type' => 'Bomba',
        ]);
    }

    public function test_author_can_edit_severity_before_review()
    {
        $author = User::create([
            'name' => 'Maquinista 1',
            'email' => 'maq1@test.com',
            'rut' => '11111111-1',
            'password' => bcrypt('password'),
            'role' => 'maquinista',
            'company' => '1a Compañía',
            'is_enabled' => true,
        ]);

        $issue = VehicleIssue::create([
            'vehicle_id' => $this->vehicle->id,
            'reporter_id' => $author->id,
            'description' => 'Fuga de refrigerante',
            'severity' => 'Low',
            'date' => '2026-07-26',
            'status' => 'Open',
            'is_stopped' => false,
            'company' => '1a Compañía',
        ]);

        $response = $this->actingAs($author)
            ->put(route('vehicles.incidents.updateContent', $issue->id), [
                'severity' => 'High',
            ]);

        $response->assertRedirect(route('vehicles.incidents.show', $issue->id));
        $this->assertDatabaseHas('vehicle_issues', [
            'id' => $issue->id,
            'severity' => 'High',
        ]);
    }

    public function test_author_cannot_edit_severity_after_review()
    {
        $author = User::create([
            'name' => 'Maquinista 1',
            'email' => 'maq1@test.com',
            'rut' => '11111111-1',
            'password' => bcrypt('password'),
            'role' => 'maquinista',
            'company' => '1a Compañía',
            'is_enabled' => true,
        ]);

        $captain = User::create([
            'name' => 'Capitán 1',
            'email' => 'cap1@test.com',
            'rut' => '22222222-2',
            'password' => bcrypt('password'),
            'role' => 'capitan',
            'company' => '1a Compañía',
            'is_enabled' => true,
        ]);

        $issue = VehicleIssue::create([
            'vehicle_id' => $this->vehicle->id,
            'reporter_id' => $author->id,
            'description' => 'Fuga de refrigerante',
            'severity' => 'Low',
            'date' => '2026-07-26',
            'status' => 'Open',
            'is_stopped' => false,
            'company' => '1a Compañía',
            'reviewed_at' => now(),
            'reviewed_by' => $captain->id,
        ]);

        $response = $this->actingAs($author)
            ->put(route('vehicles.incidents.updateContent', $issue->id), [
                'severity' => 'High',
            ]);

        $response->assertStatus(403);
    }

    public function test_inspector_can_edit_severity_after_review()
    {
        $author = User::create([
            'name' => 'Maquinista 1',
            'email' => 'maq1@test.com',
            'rut' => '11111111-1',
            'password' => bcrypt('password'),
            'role' => 'maquinista',
            'company' => '1a Compañía',
            'is_enabled' => true,
        ]);

        $inspector = User::create([
            'name' => 'Inspector MM',
            'email' => 'inspector@test.com',
            'rut' => '33333333-3',
            'password' => bcrypt('password'),
            'role' => 'inspector',
            'department' => 'Material Mayor',
            'is_enabled' => true,
        ]);

        $issue = VehicleIssue::create([
            'vehicle_id' => $this->vehicle->id,
            'reporter_id' => $author->id,
            'description' => 'Fuga de refrigerante',
            'severity' => 'Low',
            'date' => '2026-07-26',
            'status' => 'Open',
            'is_stopped' => false,
            'company' => '1a Compañía',
            'reviewed_at' => now(),
            'reviewed_by' => $inspector->id,
        ]);

        $response = $this->actingAs($inspector)
            ->put(route('vehicles.incidents.updateContent', $issue->id), [
                'severity' => 'Critical',
            ]);

        $response->assertRedirect(route('vehicles.incidents.show', $issue->id));
        $this->assertDatabaseHas('vehicle_issues', [
            'id' => $issue->id,
            'severity' => 'Critical',
        ]);
    }

    public function test_cannot_edit_resolved_incidents()
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'rut' => '99999999-9',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_enabled' => true,
        ]);

        $issue = VehicleIssue::create([
            'vehicle_id' => $this->vehicle->id,
            'reporter_id' => 1,
            'description' => 'Fuga de refrigerante',
            'severity' => 'Low',
            'date' => '2026-07-26',
            'status' => 'Resolved',
            'is_stopped' => false,
            'company' => '1a Compañía',
        ]);

        $response = $this->actingAs($admin)
            ->put(route('vehicles.incidents.updateContent', $issue->id), [
                'severity' => 'High',
            ]);

        $response->assertStatus(403);
    }

    public function test_upload_image_restrictions()
    {
        Storage::fake('public');

        $author = User::create([
            'name' => 'Maquinista 1',
            'email' => 'maq1@test.com',
            'rut' => '11111111-1',
            'password' => bcrypt('password'),
            'role' => 'maquinista',
            'company' => '1a Compañía',
            'is_enabled' => true,
        ]);

        $issue = VehicleIssue::create([
            'vehicle_id' => $this->vehicle->id,
            'reporter_id' => $author->id,
            'description' => 'Fuga de refrigerante',
            'severity' => 'Low',
            'date' => '2026-07-26',
            'status' => 'Open',
            'is_stopped' => false,
            'company' => '1a Compañía',
        ]);

        $file = UploadedFile::fake()->image('issue.jpg')->size(100);

        // Upload first image
        $response = $this->actingAs($author)
            ->post(route('vehicles.incidents.images.store', $issue->id), [
                'image' => $file,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('vehicle_issue_images', [
            'vehicle_issue_id' => $issue->id,
            'original_name' => 'issue.jpg',
        ]);

        // Upload second and third images
        VehicleIssueImage::create([
            'vehicle_issue_id' => $issue->id,
            'image_path' => 'dummy2.jpg',
            'original_name' => 'dummy2.jpg',
            'uploaded_by' => $author->id,
        ]);

        VehicleIssueImage::create([
            'vehicle_issue_id' => $issue->id,
            'image_path' => 'dummy3.jpg',
            'original_name' => 'dummy3.jpg',
            'uploaded_by' => $author->id,
        ]);

        // Try to upload fourth image
        $response2 = $this->actingAs($author)
            ->post(route('vehicles.incidents.images.store', $issue->id), [
                'image' => UploadedFile::fake()->image('issue4.jpg'),
            ]);

        $response2->assertSessionHasErrors(['image']);
    }

    public function test_only_author_can_delete_image_before_review()
    {
        $author = User::create([
            'name' => 'Maquinista 1',
            'email' => 'maq1@test.com',
            'rut' => '11111111-1',
            'password' => bcrypt('password'),
            'role' => 'maquinista',
            'company' => '1a Compañía',
            'is_enabled' => true,
        ]);

        $otherUser = User::create([
            'name' => 'Maquinista 2',
            'email' => 'maq2@test.com',
            'rut' => '11111111-2',
            'password' => bcrypt('password'),
            'role' => 'maquinista',
            'company' => '1a Compañía',
            'is_enabled' => true,
        ]);

        $issue = VehicleIssue::create([
            'vehicle_id' => $this->vehicle->id,
            'reporter_id' => $author->id,
            'description' => 'Fuga de refrigerante',
            'severity' => 'Low',
            'date' => '2026-07-26',
            'status' => 'Open',
            'is_stopped' => false,
            'company' => '1a Compañía',
        ]);

        $image = VehicleIssueImage::create([
            'vehicle_issue_id' => $issue->id,
            'image_path' => 'dummy.jpg',
            'original_name' => 'dummy.jpg',
            'uploaded_by' => $author->id,
        ]);

        // Other user tries to delete
        $response = $this->actingAs($otherUser)
            ->delete(route('vehicles.incident-images.destroy', $image->id));

        $response->assertStatus(403);

        // Author deletes
        $response2 = $this->actingAs($author)
            ->delete(route('vehicles.incident-images.destroy', $image->id));

        $response2->assertRedirect();
        $this->assertDatabaseMissing('vehicle_issue_images', [
            'id' => $image->id,
        ]);
    }

    public function test_inspector_of_material_mayor_can_view_all_incidents_regardless_of_sent_to_hq()
    {
        $inspector = User::create([
            'name' => 'Inspector MM',
            'email' => 'inspector@test.com',
            'rut' => '33333333-3',
            'password' => bcrypt('password'),
            'role' => 'inspector',
            'department' => 'Material Mayor',
            'is_enabled' => true,
        ]);

        $issue1 = VehicleIssue::create([
            'vehicle_id' => $this->vehicle->id,
            'reporter_id' => 1,
            'description' => 'Incident 1 sent to hq',
            'severity' => 'Low',
            'date' => '2026-07-26',
            'status' => 'Open',
            'is_stopped' => false,
            'company' => '1a Compañía',
            'sent_to_hq' => true,
        ]);

        $issue2 = VehicleIssue::create([
            'vehicle_id' => $this->vehicle->id,
            'reporter_id' => 1,
            'description' => 'Incident 2 not sent to hq',
            'severity' => 'Low',
            'date' => '2026-07-26',
            'status' => 'Open',
            'is_stopped' => false,
            'company' => '2a Compañía',
            'sent_to_hq' => false,
        ]);

        // Inspector can list both
        $response = $this->actingAs($inspector)->get(route('vehicles.incidents.index'));
        $response->assertStatus(200);

        // Inspector can view both
        $this->actingAs($inspector)->get(route('vehicles.incidents.show', $issue1->id))->assertStatus(200);
        $this->actingAs($inspector)->get(route('vehicles.incidents.show', $issue2->id))->assertStatus(200);

        // Inspector can mark read only $issue1 (sent_to_hq is true)
        $this->actingAs($inspector)->patch(route('vehicles.incidents.markRead', $issue1->id))->assertRedirect();
        $this->assertNotNull($issue1->fresh()->hq_read_at);

        $this->actingAs($inspector)->patch(route('vehicles.incidents.markRead', $issue2->id))->assertRedirect();
        // Since sent_to_hq is false, it should NOT mark as read for inspector (hq_read_at remains null)
        $this->assertNull($issue2->fresh()->hq_read_at);
    }
}
