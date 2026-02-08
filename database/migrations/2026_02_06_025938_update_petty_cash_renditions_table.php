<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('petty_cash_renditions', function (Blueprint $table) {
            $table->string('supplier_rut')->nullable()->after('user_id'); // Made nullable initially to avoid issues with existing data, but intended to be required.
            $table->enum('expense_type', ['repair_supplies', 'spare_parts', 'tools', 'other_tools'])->nullable()->after('supplier_rut');
            $table->string('invoice_number')->nullable()->after('expense_type');
            $table->date('invoice_date')->nullable()->after('invoice_number');
            $table->foreignId('vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete()->after('invoice_date');

            // For stock integration
            $table->unsignedBigInteger('stock_item_id')->nullable()->after('vehicle_id');
        });

        // Update status enum
        DB::statement("ALTER TABLE petty_cash_renditions MODIFY COLUMN status ENUM('draft', 'pending_inspector', 'pending_comandante', 'approved', 'rejected', 'pending_validation', 'rendido') DEFAULT 'pending_validation'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('petty_cash_renditions', function (Blueprint $table) {
            $table->dropForeign(['vehicle_id']);
            $table->dropColumn(['supplier_rut', 'expense_type', 'invoice_number', 'invoice_date', 'vehicle_id', 'stock_item_id']);
        });

        // Revert status enum (Warning: Data loss if new statuses were used)
        DB::statement("ALTER TABLE petty_cash_renditions MODIFY COLUMN status ENUM('draft', 'pending_inspector', 'pending_comandante', 'approved', 'rejected') DEFAULT 'draft'");
    }
};
