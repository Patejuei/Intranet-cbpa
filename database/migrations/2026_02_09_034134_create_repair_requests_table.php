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
        Schema::create('repair_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('material_id')->constrained('materials')->onDelete('cascade');
            $table->foreignId('requested_by')->constrained('users');
            $table->string('status')->default('PENDING'); // PENDING, APPROVED, REJECTED, SENT_TO_PROVIDER, FINISHED
            $table->text('description'); // Problem description

            // Inspector fields
            $table->foreignId('inspector_id')->nullable()->constrained('users');
            $table->dateTime('inspection_date')->nullable();
            $table->text('inspection_observation')->nullable();
            $table->unsignedBigInteger('reception_certificate_id')->nullable(); // Should link to reception_certificates if you want FK constraint

            // Acquisitions fields
            $table->string('provider_name')->nullable();
            $table->text('repair_description')->nullable(); // Instructions for provider
            $table->unsignedBigInteger('delivery_certificate_id')->nullable(); // For sending to provider
            $table->dateTime('delivery_date')->nullable();

            // Closure fields
            $table->string('invoice_number')->nullable();
            $table->string('invoice_path')->nullable(); // Path to invoice file
            $table->integer('repair_cost')->nullable();
            $table->dateTime('return_date')->nullable(); // When it came back fixed

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repair_requests');
    }
};
