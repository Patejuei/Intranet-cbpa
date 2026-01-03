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
