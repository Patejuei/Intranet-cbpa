<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleMaintenance extends Model
{
    protected $fillable = [
        'vehicle_id',
        'workshop_name',
        'entry_date',
        'exit_date',
        'description',
        'cost',
        'status',
        'tentative_exit_date',
        'responsible_person',
        'mileage_in',
        'traction',
        'fuel_type',
        'transmission',
        'entry_checklist',
        'withdrawal_responsible_name',
        'withdrawal_responsible_rut',
    ];

    protected $casts = [
        'entry_checklist' => 'array',
        'entry_date' => 'date',
        'exit_date' => 'date',
        'tentative_exit_date' => 'date',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function issues()
    {
        return $this->hasMany(VehicleIssue::class);
    }

    public function tasks()
    {
        return $this->hasMany(VehicleMaintenanceTask::class);
    }

    public function items()
    {
        return $this->belongsToMany(WorkshopInventory::class, 'vehicle_maintenance_items', 'maintenance_id', 'inventory_item_id')
            ->withPivot('quantity', 'unit_cost', 'total_cost')
            ->withTimestamps();
    }
}
