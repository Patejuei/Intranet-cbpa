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
        Schema::table('equipment_logs', function (Blueprint $table) {
            $table->string('invoice_number')->nullable()->after('material_id');
            $table->date('invoice_date')->nullable()->after('invoice_number');
            $table->string('supplier_rut')->nullable()->after('invoice_date');
            $table->string('supplier_name')->nullable()->after('supplier_rut');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('equipment_logs', function (Blueprint $table) {
            //
        });
    }
};
