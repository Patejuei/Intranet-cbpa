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
        if (!Schema::hasTable('vehicles')) {
            Schema::create('vehicles', function (Blueprint $table) {
                $table->id();
                $table->string('name'); // B-1, R-2
                $table->string('make')->nullable();
                $table->string('model')->nullable();
                $table->integer('year')->nullable();
                $table->string('plate')->unique()->nullable();
                $table->string('status')->default('Operative'); // Operative, Workshop, Out of Service
                $table->string('company'); // Primera Compañía, Comandancia
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('vehicle_logs')) {
            Schema::create('vehicle_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
                $table->foreignId('driver_id')->nullable()->constrained('users');
                $table->integer('start_km');
                $table->integer('end_km')->nullable();
                $table->date('date');
                $table->string('activity_type'); // Emergency, Academy, Maintenance, Fuel
                $table->string('destination')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('vehicle_issues')) {
            Schema::create('vehicle_issues', function (Blueprint $table) {
                $table->id();
                $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
                $table->foreignId('reporter_id')->nullable()->constrained('users');
                $table->text('description');
                $table->string('severity')->default('Low'); // Low, Medium, High, Critical
                $table->boolean('is_stopped')->default(false);
                $table->string('status')->default('Open'); // Open, In Progress, Resolved
                $table->date('date');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('vehicle_maintenances')) {
            Schema::create('vehicle_maintenances', function (Blueprint $table) {
                $table->id();
                $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
                $table->string('workshop_name');
                $table->date('entry_date');
                $table->date('exit_date')->nullable();
                $table->text('description');
                $table->decimal('cost', 10, 2)->nullable();
                $table->string('status')->default('In Workshop'); // In Workshop, Completed
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('vehicle_inventories')) {
            Schema::create('vehicle_inventories', function (Blueprint $table) {
                $table->id();
                $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
                $table->string('item_name');
                $table->integer('quantity');
                $table->string('condition')->default('Good'); // Good, Fair, Poor
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_inventories');
        Schema::dropIfExists('vehicle_maintenances');
        Schema::dropIfExists('vehicle_issues');
        Schema::dropIfExists('vehicle_logs');
        Schema::dropIfExists('vehicles');
    }
};
