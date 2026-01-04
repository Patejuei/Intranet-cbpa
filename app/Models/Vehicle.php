<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'make',
        'model',
        'year',
        'plate',
        'status',
        'company',
        'type',
        'technical_review_expires_at',
        'circulation_permit_expires_at',
        'insurance_expires_at',
    ];

    protected $casts = [
        'technical_review_expires_at' => 'date',
        'circulation_permit_expires_at' => 'date',
        'insurance_expires_at' => 'date',
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
