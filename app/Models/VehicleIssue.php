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
        'reviewed_at',
        'reviewed_by',
        'sent_to_hq',
        'sent_to_workshop',
        'workshop_read_at',
        'hq_read_at'
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
        'workshop_read_at' => 'datetime',
        'hq_read_at' => 'datetime',
        'sent_to_hq' => 'boolean',
        'sent_to_workshop' => 'boolean',
        'is_stopped' => 'boolean',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function maintenance()
    {
        return $this->belongsTo(VehicleMaintenance::class, 'vehicle_maintenance_id');
    }
}
