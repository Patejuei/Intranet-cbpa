<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $exists = \Illuminate\Support\Facades\DB::table('users')->where('email', 'admin@cbpa.cl')->exists();

        if (!$exists) {
            \Illuminate\Support\Facades\DB::table('users')->insert([
                'name' => 'Administrador',
                'email' => 'admin@cbpa.cl',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'admin',
                'permissions' => json_encode(['batteries', 'equipment', 'tickets', 'admin']),
                'company' => 'Comandancia',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
