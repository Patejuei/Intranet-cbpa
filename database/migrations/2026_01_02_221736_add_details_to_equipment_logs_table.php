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
            $table->string('brand')->nullable()->after('item_name');
            $table->string('model')->nullable()->after('brand');
            $table->string('document_path')->nullable()->after('reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('equipment_logs', function (Blueprint $table) {
            $table->dropColumn(['brand', 'model', 'document_path']);
        });
    }
};
