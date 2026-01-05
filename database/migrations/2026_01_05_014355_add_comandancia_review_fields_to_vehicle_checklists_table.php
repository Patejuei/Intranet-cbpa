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
        Schema::table('vehicle_checklists', function (Blueprint $table) {
            $table->foreignId('commander_id')->nullable()->constrained('users');
            $table->timestamp('commander_reviewed_at')->nullable();
            $table->foreignId('inspector_id')->nullable()->constrained('users');
            $table->timestamp('inspector_reviewed_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_checklists', function (Blueprint $table) {
            $table->dropForeign(['commander_id']);
            $table->dropColumn('commander_id');
            $table->dropColumn('commander_reviewed_at');
            $table->dropForeign(['inspector_id']);
            $table->dropColumn('inspector_id');
            $table->dropColumn('inspector_reviewed_at');
        });
    }
};
