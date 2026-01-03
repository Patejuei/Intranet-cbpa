<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleIssue extends Model
{
    protected $fillable = [
        'vehicle_id',
        'reporter_id',
        'description',
        'severity',
        'is_stopped',
        'status',
        'date',
        'vehicle_maintenance_id',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function maintenance()
    {
        return $this->belongsTo(VehicleMaintenance::class, 'vehicle_maintenance_id');
    }
}
