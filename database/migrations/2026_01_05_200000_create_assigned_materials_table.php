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
    Schema::create('assigned_materials', function (Blueprint $table) {
      $table->id();
      $table->foreignId('firefighter_id')->constrained()->onDelete('cascade');
      $table->foreignId('material_id')->constrained('materials')->onDelete('cascade');
      $table->integer('quantity')->default(0);
      $table->timestamps();

      // Unique constraint to avoid duplicates, we'll just increment quantity
      $table->unique(['firefighter_id', 'material_id']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('assigned_materials');
  }
};
