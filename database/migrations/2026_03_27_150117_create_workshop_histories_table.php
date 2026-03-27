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
        Schema::create('workshop_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workshop_inventory_id')->constrained('workshop_inventory')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('type'); // 'ALTA', 'ADD', 'REMOVE', 'EDIT', etc.
            $table->integer('quantity_change');
            $table->integer('current_balance');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workshop_histories');
    }
};
