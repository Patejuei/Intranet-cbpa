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
        Schema::table('vehicle_issues', function (Blueprint $table) {
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('sent_to_hq')->default(false);
            $table->boolean('sent_to_workshop')->default(false);
            $table->timestamp('workshop_read_at')->nullable();
            $table->timestamp('hq_read_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicle_issues', function (Blueprint $table) {
            //
        });
    }
};
