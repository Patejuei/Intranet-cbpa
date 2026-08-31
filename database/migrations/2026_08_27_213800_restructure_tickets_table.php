<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->string('category')->nullable()->after('status');
            $table->foreignId('assigned_to')->nullable()->after('company')->constrained('users')->nullOnDelete();
            $table->dropColumn(['reported_to_commander', 'commander_seen']);
        });
    }

    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropForeign(['assigned_to']);
            $table->dropColumn(['category', 'assigned_to']);
            $table->boolean('reported_to_commander')->default(false);
            $table->boolean('commander_seen')->default(false);
        });
    }
};
