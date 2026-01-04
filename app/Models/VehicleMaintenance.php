<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleMaintenance extends Model
{
    protected $fillable = [
        'vehicle_id',
        'workshop_name',
        'entry_date',
        'exit_date',
        'description',
        'cost',
        'status',
        'tentative_exit_date',
        'responsible_person',
        'mileage_in',
        'traction',
        'fuel_type',
        'transmission',
        'entry_checklist',
    ];

    protected $casts = [
        'entry_checklist' => 'array',
        'entry_date' => 'date',
        'exit_date' => 'date',
        'tentative_exit_date' => 'date',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function issues()
    {
        return $this->hasMany(VehicleIssue::class);
    }

    public function tasks()
    {
        return $this->hasMany(VehicleMaintenanceTask::class);
    }
}
