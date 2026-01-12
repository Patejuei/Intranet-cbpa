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
        Schema::table('delivery_certificates', function (Blueprint $table) {
            $table->string('assignment_type')->default('firefighter')->after('firefighter_id');
        });

        Schema::table('reception_certificates', function (Blueprint $table) {
            $table->string('assignment_type')->default('firefighter')->after('firefighter_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('delivery_certificates', function (Blueprint $table) {
            $table->dropColumn('assignment_type');
        });

        Schema::table('reception_certificates', function (Blueprint $table) {
            $table->dropColumn('assignment_type');
        });
    }
};
