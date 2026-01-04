<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleChecklistDetail;

class VehicleChecklist extends Model
{
    protected $fillable = [
        'vehicle_id',
        'user_id',
        'status',
        'captain_id',
        'captain_reviewed_at',
        'machinist_id',
        'machinist_reviewed_at',
    ];

    protected $casts = [
        'captain_reviewed_at' => 'datetime',
        'machinist_reviewed_at' => 'datetime',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function captain()
    {
        return $this->belongsTo(User::class, 'captain_id');
    }

    public function machinist()
    {
        return $this->belongsTo(User::class, 'machinist_id');
    }

    public function details()
    {
        return $this->hasMany(VehicleChecklistDetail::class);
    }
}
