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
        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('type')->nullable()->after('company');
            $table->date('technical_review_expires_at')->nullable()->after('type');
            $table->date('circulation_permit_expires_at')->nullable()->after('technical_review_expires_at');
            $table->date('insurance_expires_at')->nullable()->after('circulation_permit_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn([
                'type',
                'technical_review_expires_at',
                'circulation_permit_expires_at',
                'insurance_expires_at'
            ]);
        });
    }
};
