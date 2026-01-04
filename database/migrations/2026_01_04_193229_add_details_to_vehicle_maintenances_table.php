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
        Schema::table('vehicle_maintenances', function (Blueprint $table) {
            $table->string('responsible_person')->nullable()->after('workshop_name');
            $table->integer('mileage_in')->nullable()->after('entry_date');
            $table->string('traction')->nullable()->after('mileage_in'); // 4x2, 4x4
            $table->string('fuel_type')->nullable()->after('traction'); // Diesel, Gasolina, Electrico, Otro
            $table->string('transmission')->nullable()->after('fuel_type'); // Manual, Automatica
            $table->json('entry_checklist')->nullable()->after('transmission');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_maintenances', function (Blueprint $table) {
            $table->dropColumn([
                'responsible_person',
                'mileage_in',
                'traction',
                'fuel_type',
                'transmission',
                'entry_checklist'
            ]);
        });
    }
};
