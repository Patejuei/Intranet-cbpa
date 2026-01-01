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
        Schema::table('battery_logs', function (Blueprint $table) {
            // Drop old columns if they exist (or we can just leave them nullable, but cleaner to drop/rename)
            $table->dropColumn(['unit_name', 'battery_code', 'action', 'notes']);

            // Add new required columns
            $table->date('change_date');
            $table->string('equipment_id'); // ID del equipo
            $table->enum('equipment_type', ['Equipo de Respiracion', 'Toma presion', 'Saturometro']);
            $table->string('responsible_name');
            $table->text('observations')->nullable();
            $table->string('company');
            $table->date('next_change_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('battery_logs', function (Blueprint $table) {
            //
        });
    }
};
