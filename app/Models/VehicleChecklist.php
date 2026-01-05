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
        'general_observations',
        'captain_id',
        'captain_reviewed_at',
        'machinist_id',
        'machinist_reviewed_at',
        'commander_id',
        'commander_reviewed_at',
        'inspector_id',
        'inspector_reviewed_at',
    ];

    protected $casts = [
        'captain_reviewed_at' => 'datetime',
        'machinist_reviewed_at' => 'datetime',
        'commander_reviewed_at' => 'datetime',
        'inspector_reviewed_at' => 'datetime',
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

    public function commander()
    {
        return $this->belongsTo(User::class, 'commander_id');
    }

    public function inspector()
    {
        return $this->belongsTo(User::class, 'inspector_id');
    }

    public function details()
    {
        return $this->hasMany(VehicleChecklistDetail::class);
    }
}
