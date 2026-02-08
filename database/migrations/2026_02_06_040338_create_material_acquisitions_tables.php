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
        Schema::create('material_acquisitions', function (Blueprint $table) {
            $table->id();
            $table->string('company'); // Requesting Company (e.g., 'Segunda Compañía')

            // Statuses: 
            // 'requested': Initial request by Captain
            // 'purchased': Entered by Secretary (Alta Pendiente)
            // 'received': Physically received by Secretary
            // 'completed': Entered into Inventory by Inspector
            // 'rejected': Cancelled
            $table->enum('status', ['requested', 'purchased', 'received', 'completed', 'rejected'])->default('requested');

            // Purchase/Invoice Details (Can be null initially)
            $table->string('invoice_number')->nullable();
            $table->date('invoice_date')->nullable();
            $table->string('supplier_rut')->nullable();
            $table->string('supplier_name')->nullable();
            $table->string('document_path')->nullable(); // Invoice PDF

            $table->timestamps();
        });

        Schema::create('material_acquisition_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('material_acquisition_id')->constrained()->onDelete('cascade');

            $table->string('item_name');
            $table->integer('quantity');
            $table->text('details')->nullable(); // Observations/Description

            // Inspector Fields (Nullable until 'completed')
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('serial_number')->nullable(); // For individual items
            $table->string('inventory_code')->nullable(); // e.g., EXT-001

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_acquisition_items');
        Schema::dropIfExists('material_acquisitions');
    }
};
