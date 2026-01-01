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
        Schema::create('equipment_logs', function (Blueprint $table) {
            $table->id();
            $table->string('item_name');
            $table->string('serial_number')->nullable();
            $table->enum('type', ['ALTA', 'BAJA']);
            $table->text('reason')->nullable();
            $table->string('status')->default('PENDIENTE');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_logs');
    }
};
