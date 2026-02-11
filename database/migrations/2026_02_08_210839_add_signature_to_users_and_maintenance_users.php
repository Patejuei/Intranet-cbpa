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
        Schema::table('users', function (Blueprint $table) {
            $table->string('signature_path')->nullable()->after('is_enabled');
        });

        Schema::table('vehicle_maintenances', function (Blueprint $table) {
            $table->unsignedBigInteger('receiver_user_id')->nullable()->after('entry_checklist');
            $table->unsignedBigInteger('finalizer_user_id')->nullable()->after('receiver_user_id');

            $table->foreign('receiver_user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreign('finalizer_user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('signature_path');
        });

        Schema::table('vehicle_maintenances', function (Blueprint $table) {
            $table->dropForeign(['receiver_user_id']);
            $table->dropForeign(['finalizer_user_id']);
            $table->dropColumn(['receiver_user_id', 'finalizer_user_id']);
        });
    }
};
