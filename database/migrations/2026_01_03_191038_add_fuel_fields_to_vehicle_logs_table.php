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
        Schema::table('vehicle_logs', function (Blueprint $table) {
            $table->decimal('fuel_liters', 8, 2)->nullable()->after('destination');
            $table->string('fuel_coupon')->nullable()->after('fuel_liters');
            $table->string('receipt_path')->nullable()->after('fuel_coupon');
            $table->text('observations')->nullable()->after('receipt_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_logs', function (Blueprint $table) {
            $table->dropColumn(['fuel_liters', 'fuel_coupon', 'receipt_path', 'observations']);
        });
    }
};
