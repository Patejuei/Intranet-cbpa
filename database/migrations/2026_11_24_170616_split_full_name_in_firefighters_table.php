<?php

use App\Models\Firefighter;
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
        Schema::table('firefighters', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('general_registry_number');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('paternal_last_name')->nullable()->after('middle_name');
            $table->string('maternal_last_name')->nullable()->after('paternal_last_name');
        });

        DB::table('firefighters')
            ->select('id', 'full_name')
            ->orderBy('id')
            ->chunkById(100, function ($firefighters) {
                foreach ($firefighters as $firefighter) {
                    $parts = Firefighter::splitFullName((string) $firefighter->full_name);

                    DB::table('firefighters')
                        ->where('id', $firefighter->id)
                        ->update([
                            'first_name' => $parts['first_name'],
                            'middle_name' => $parts['middle_name'],
                            'paternal_last_name' => $parts['paternal_last_name'],
                            'maternal_last_name' => $parts['maternal_last_name'],
                            'full_name' => Firefighter::buildFullName($parts),
                        ]);
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('firefighters', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'middle_name',
                'paternal_last_name',
                'maternal_last_name',
            ]);
        });
    }
};
