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
        Schema::table('vehicle_maintenance_external_works', function (Blueprint $table) {
            $table->string('supplier_rut')->nullable();
            $table->string('invoice_number')->nullable();
            $table->string('invoice_image_path')->nullable();
            $table->string('entry_image_path')->nullable();
            $table->string('exit_image_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_maintenance_external_works', function (Blueprint $table) {
            $table->dropColumn([
                'supplier_rut',
                'invoice_number',
                'invoice_image_path',
                'entry_image_path',
                'exit_image_path'
            ]);
        });
    }
};
