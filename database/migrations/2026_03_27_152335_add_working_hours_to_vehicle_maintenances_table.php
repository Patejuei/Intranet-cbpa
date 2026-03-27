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
            $table->decimal('working_hours', 10, 2)->default(0)->after('description');
            $table->integer('hour_rate')->default(0)->after('working_hours');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_maintenances', function (Blueprint $table) {
            $table->dropColumn(['working_hours', 'hour_rate']);
        });
    }
};
