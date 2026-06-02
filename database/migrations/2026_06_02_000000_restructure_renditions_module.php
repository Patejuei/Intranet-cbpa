<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Migrate existing data to new status values (before changing ENUM)
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("UPDATE petty_cash_renditions SET status = 'pending_inspector' WHERE status = 'pending_validation'");
            DB::statement("UPDATE petty_cash_renditions SET status = 'approved' WHERE status = 'rendido'");
            DB::statement("UPDATE petty_cash_renditions SET status = 'pending_inspector' WHERE status = 'draft'");
            DB::statement("UPDATE petty_cash_renditions SET status = 'pending_secretary' WHERE status = 'pending_comandante'");
        }

        // Step 2: Modify status ENUM to new values
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE petty_cash_renditions MODIFY COLUMN status ENUM('pending_inspector', 'pending_secretary', 'approved', 'rejected') DEFAULT 'pending_inspector'");
        }

        // Step 3: Rename comandante columns to secretary
        Schema::table('petty_cash_renditions', function (Blueprint $table) {
            $table->renameColumn('comandante_id', 'secretary_id');
            $table->renameColumn('comandante_vised_at', 'secretary_vised_at');
        });

        // Step 4: Create rendition_reviews audit table
        Schema::create('rendition_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rendition_id')->constrained('petty_cash_renditions')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users');
            $table->enum('action', ['approved', 'rejected']);
            $table->enum('step', ['inspector', 'secretary']);
            $table->text('comment')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rendition_reviews');

        // Revert column renames
        Schema::table('petty_cash_renditions', function (Blueprint $table) {
            $table->renameColumn('secretary_id', 'comandante_id');
            $table->renameColumn('secretary_vised_at', 'comandante_vised_at');
        });

        // Revert status ENUM
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE petty_cash_renditions MODIFY COLUMN status ENUM('draft', 'pending_inspector', 'pending_comandante', 'approved', 'rejected', 'pending_validation', 'rendido') DEFAULT 'pending_validation'");
        }

        // Revert data migrations
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("UPDATE petty_cash_renditions SET status = 'pending_validation' WHERE status = 'pending_inspector'");
            DB::statement("UPDATE petty_cash_renditions SET status = 'pending_comandante' WHERE status = 'pending_secretary'");
        }
    }
};
