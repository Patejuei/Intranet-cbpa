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
        Schema::create('checklist_items', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('vehicle_checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // The user performing the checklist
            $table->string('status')->default('Pending'); // Pending, Partially Reviewed, Completed

            $table->foreignId('captain_id')->nullable()->constrained('users')->onDelete('set null');
            $table->dateTime('captain_reviewed_at')->nullable();

            $table->foreignId('machinist_id')->nullable()->constrained('users')->onDelete('set null');
            $table->dateTime('machinist_reviewed_at')->nullable();

            $table->timestamps();
        });

        Schema::create('vehicle_checklist_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_checklist_id')->constrained()->onDelete('cascade');
            $table->foreignId('checklist_item_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['ok', 'urgent', 'next_maint']);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_checklist_details');
        Schema::dropIfExists('vehicle_checklists');
        Schema::dropIfExists('checklist_items');
    }
};
