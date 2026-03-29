<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DutyLog extends Model
{
    protected $fillable = [
        'user_id',
        'vehicle_id',
        'start_time',
        'end_time',
        'is_primary',
        'company',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_primary' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}
