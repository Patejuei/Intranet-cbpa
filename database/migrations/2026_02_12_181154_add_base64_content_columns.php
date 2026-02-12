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
        Schema::table('petty_cash_attachments', function (Blueprint $table) {
            $table->longText('file_content')->nullable()->after('file_path');
        });

        Schema::table('materials', function (Blueprint $table) {
            $table->longText('document_content')->nullable()->after('document_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('petty_cash_attachments', function (Blueprint $table) {
            $table->dropColumn('file_content');
        });

        Schema::table('materials', function (Blueprint $table) {
            $table->dropColumn('document_content');
        });
    }
};
