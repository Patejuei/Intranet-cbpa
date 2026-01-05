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
        Schema::create('petty_cash_renditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Mechanic/Creator
            $table->integer('amount'); // In CLP
            $table->text('description')->nullable();

            // Status: draft, pending_inspector, pending_comandante, approved, rejected
            $table->enum('status', ['draft', 'pending_inspector', 'pending_comandante', 'approved', 'rejected'])->default('draft');

            $table->foreignId('inspector_id')->nullable()->constrained('users'); // Who vised as Inspector
            $table->timestamp('inspector_vised_at')->nullable();

            $table->foreignId('comandante_id')->nullable()->constrained('users'); // Who vised as Comandante
            $table->timestamp('comandante_vised_at')->nullable();

            $table->foreignId('rejected_by')->nullable()->constrained('users');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('rejected_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('petty_cash_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rendition_id')->constrained('petty_cash_renditions')->onDelete('cascade');
            $table->string('file_path');
            $table->string('file_name');
            $table->string('mime_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('petty_cash_attachments');
        Schema::dropIfExists('petty_cash_renditions');
    }
};
