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
        if (!Schema::hasColumn('users', 'signature_path')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('signature_path')->nullable()->after('is_enabled');
            });
        }

        if (Schema::hasTable('vehicle_maintenances')) {
            Schema::table('vehicle_maintenances', function (Blueprint $table) {
                if (!Schema::hasColumn('vehicle_maintenances', 'receiver_user_id')) {
                    $table->unsignedBigInteger('receiver_user_id')->nullable()->after('entry_checklist');
                    $table->foreign('receiver_user_id')->references('id')->on('users')->nullOnDelete();
                }

                if (!Schema::hasColumn('vehicle_maintenances', 'finalizer_user_id')) {
                    $table->unsignedBigInteger('finalizer_user_id')->nullable()->after('receiver_user_id'); // Assuming receiver_user_id exists now from previous block or just after created
                    $table->foreign('finalizer_user_id')->references('id')->on('users')->nullOnDelete();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'signature_path')) {
                $table->dropColumn('signature_path');
            }
        });

        if (Schema::hasTable('vehicle_maintenances')) {
            Schema::table('vehicle_maintenances', function (Blueprint $table) {
                if (Schema::hasColumn('vehicle_maintenances', 'receiver_user_id')) {
                    $table->dropForeign(['receiver_user_id']);
                    $table->dropColumn('receiver_user_id');
                }
                if (Schema::hasColumn('vehicle_maintenances', 'finalizer_user_id')) {
                    $table->dropForeign(['finalizer_user_id']);
                    $table->dropColumn('finalizer_user_id');
                }
            });
        }
    }
};
