<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleLog extends Model
{
    protected $fillable = [
        'vehicle_id',
        'driver_id',
        'obac_id',
        'obac_name',
        'start_km',
        'end_km',
        'date',
        'departure_time',
        'arrival_time',
        'activity_type',
        'destination',
        'movement_key',
        'fuel_liters',
        'fuel_coupon',
        'receipt_path',
        'observations',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function obac()
    {
        return $this->belongsTo(Firefighter::class, 'obac_id');
    }
}
