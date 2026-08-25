<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'rut',
        'password',
        'company',
        'role',
        'permissions',
        'department',
        'is_enabled',
        'signature_path',
        'two_factor_secret',
        'two_factor_confirmed_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'permissions' => 'array',
            'is_enabled' => 'boolean',
        ];
    }

    public function getPermissionsAttribute($value)
    {
        $perms = is_string($value) ? json_decode($value, true) : $value;
        if (!is_array($perms)) {
            $perms = [];
        }

        if ($this->role === 'inspector') {
            $dept = trim($this->department ?? '');
            if ($dept === 'Material Menor') {
                $perms = array_merge($perms, [
                    'inventory.view', 'inventory.edit',
                    'tickets.view', 'tickets.edit',
                    'batteries.view', 'batteries.edit',
                    'deliveries.view', 'deliveries.edit',
                    'reception.view', 'reception.edit',
                    'equipment.view', 'equipment.edit'
                ]);
            } elseif ($dept === 'Material Mayor') {
                $perms = array_merge($perms, [
                    'vehicles.view', 'vehicles.edit',
                    'vehicles.status.view', 'vehicles.status.edit',
                    'vehicles.incidents.view', 'vehicles.incidents.edit',
                    'vehicles.inventory.view', 'vehicles.inventory.edit',
                    'vehicles.logs.view', 'vehicles.logs.edit',
                    'vehicles.checklist.view', 'vehicles.checklist.edit',
                    'vehicles.petty-cash.view', 'vehicles.petty-cash.edit'
                ]);
            }
        }

        return array_values(array_unique($perms));
    }

    public function driverVehicles()
    {
        return $this->belongsToMany(Vehicle::class, 'driver_vehicle');
    }
}
