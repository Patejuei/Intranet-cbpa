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
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }
}
