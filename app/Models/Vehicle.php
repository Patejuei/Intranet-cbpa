<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'name',
        'make',
        'model',
        'year',
        'plate',
        'status',
        'company',
    ];

    public function logs()
    {
        return $this->hasMany(VehicleLog::class);
    }

    public function issues()
    {
        return $this->hasMany(VehicleIssue::class);
    }

    public function maintenances()
    {
        return $this->hasMany(VehicleMaintenance::class);
    }
}
