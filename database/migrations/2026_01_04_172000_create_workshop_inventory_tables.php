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
    Schema::create('workshop_inventory', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->string('sku')->nullable()->unique();
      $table->enum('category', ['insumo', 'repuesto'])->default('repuesto');
      $table->integer('stock')->default(0);
      $table->integer('min_stock')->default(0);
      $table->integer('unit_cost')->default(0); // Store in CLP (no decimals usually needed for CLP, or use decimal if crucial)
      $table->string('location')->nullable();
      $table->text('compatibility')->nullable(); // Description of compatible vehicles
      $table->text('description')->nullable();
      $table->timestamps();
    });

    Schema::create('vehicle_maintenance_items', function (Blueprint $table) {
      $table->id();
      $table->foreignId('maintenance_id')->constrained('vehicle_maintenances')->onDelete('cascade');
      $table->foreignId('inventory_item_id')->constrained('workshop_inventory')->onDelete('restrict');
      $table->integer('quantity');
      $table->integer('unit_cost'); // Cost at the moment of usage
      $table->integer('total_cost'); // quantity * unit_cost
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('vehicle_maintenance_items');
    Schema::dropIfExists('workshop_inventory');
  }
};
