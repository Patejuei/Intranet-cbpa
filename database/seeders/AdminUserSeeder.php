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
        \App\Models\User::create([
            'name' => 'Administrador',
            'email' => 'admin@cbpa.cl',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'admin',
            'permissions' => ['batteries', 'equipment', 'tickets', 'admin'],
            'company' => 'Comandancia'
        ]);
    }
}
