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
            $table->date('tentative_exit_date')->nullable()->after('entry_date');
        });

        Schema::table('vehicle_issues', function (Blueprint $table) {
            $table->foreignId('vehicle_maintenance_id')->nullable()->constrained('vehicle_maintenances')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_issues', function (Blueprint $table) {
            $table->dropForeign(['vehicle_maintenance_id']);
            $table->dropColumn('vehicle_maintenance_id');
        });

        Schema::table('vehicle_maintenances', function (Blueprint $table) {
            $table->dropColumn('tentative_exit_date');
        });
    }
};
