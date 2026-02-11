<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicle_maintenance_external_works', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_maintenance_id')->constrained('vehicle_maintenances', 'id', 'vm_ext_works_vm_id_fk')->onDelete('cascade');
            $table->text('description'); // Work description
            $table->string('provider'); // Where the work was sent
            $table->integer('cost'); // Price of the work
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_maintenance_external_works');
    }
};
