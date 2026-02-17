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
        Schema::create('material_baja_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Captain
            $table->foreignId('material_id')->constrained('materials')->onDelete('cascade');
            $table->integer('quantity');
            $table->text('reason');
            $table->longText('images')->nullable(); // Base64 images
            $table->enum('status', ['PENDIENTE', 'VALIDADO', 'APROBADO', 'RECHAZADO', 'EN_REPARACION'])->default('PENDIENTE');
            $table->timestamps();
        });

        Schema::create('material_baja_validations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')->constrained('material_baja_requests')->onDelete('cascade');
            $table->foreignId('inspector_id')->constrained('users')->onDelete('cascade');
            $table->boolean('is_reparable')->default(false);
            $table->text('evaluation_notes')->nullable();
            $table->string('reception_certificate_path')->nullable();
            $table->string('baja_certificate_path')->nullable();
            $table->timestamps();
        });

        Schema::create('material_baja_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('material_request_id')->constrained('material_baja_requests')->onDelete('cascade');
            $table->foreignId('original_material_id')->nullable()->constrained('materials')->onDelete('set null');
            $table->string('product_name');
            $table->string('code')->nullable();
            $table->integer('quantity_removed');
            $table->foreignId('approved_by')->constrained('users')->onDelete('cascade');
            $table->string('final_documentation_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_baja_histories');
        Schema::dropIfExists('material_baja_validations');
        Schema::dropIfExists('material_baja_requests');
    }
};
