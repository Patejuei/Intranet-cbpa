<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DispatchLog extends Model
{
    protected $fillable = [
        'vehicle_id',
        'departure_time',
        'return_time',
        'destination',
        'notes',
        'company',
    ];

    protected $casts = [
        'departure_time' => 'datetime',
        'return_time' => 'datetime',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
