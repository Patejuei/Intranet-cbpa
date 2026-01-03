<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('material_histories', function (Blueprint $table) {
      $table->id();
      $table->foreignId('material_id')->constrained('materials')->onDelete('cascade');
      $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Who made the changes
      $table->string('type'); // 'INITIAL', 'ADD', 'REMOVE', 'DELIVERY', 'RECEPTION', 'MAINTENANCE', 'EDIT'
      $table->integer('quantity_change'); // e.g. +5, -2
      $table->integer('current_balance'); // Snapshot after change
      $table->nullableMorphs('reference'); // For linking to DeliveryCertificate, ReceptionCertificate, Log, etc.
      $table->text('description')->nullable();
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('material_histories');
  }
};
