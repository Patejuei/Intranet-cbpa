<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleLog extends Model
{
    protected $fillable = [
        'vehicle_id',
        'driver_id',
        'start_km',
        'end_km',
        'date',
        'activity_type',
        'destination',
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
}
