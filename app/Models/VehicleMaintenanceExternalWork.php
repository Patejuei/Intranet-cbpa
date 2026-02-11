<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleMaintenanceExternalWork extends Model
{
    protected $fillable = [
        'vehicle_maintenance_id',
        'description',
        'provider',
        'cost',
    ];

    public function maintenance()
    {
        return $this->belongsTo(VehicleMaintenance::class, 'vehicle_maintenance_id');
    }
}
