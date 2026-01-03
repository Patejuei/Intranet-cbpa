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
        Schema::table('tickets', function (Blueprint $table) {
            if (Schema::hasColumn('tickets', 'title') && !Schema::hasColumn('tickets', 'subject')) {
                $table->renameColumn('title', 'subject');
            }
            if (!Schema::hasColumn('tickets', 'company')) {
                $table->string('company')->after('user_id');
            }
            if (!Schema::hasColumn('tickets', 'image_path')) {
                $table->string('image_path')->nullable()->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->renameColumn('subject', 'title');
            $table->dropColumn(['company', 'image_path']);
        });
    }
};
