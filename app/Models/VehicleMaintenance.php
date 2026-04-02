<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Database\Factories\WorkshopFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

#[UseFactory(WorkshopFactory::class)]
class VehicleMaintenance extends Model
{
    use HasFactory;
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
        'receiver_user_id',
        'finalizer_user_id',
        'working_hours',
        'hour_rate',
    ];

    protected $casts = [
        'entry_checklist' => 'array',
        'entry_date' => 'date',
        'exit_date' => 'date',
        'tentative_exit_date' => 'date',
        'working_hours' => 'decimal:2',
        'hour_rate' => 'integer',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function receiverUser()
    {
        return $this->belongsTo(User::class, 'receiver_user_id');
    }

    public function finalizerUser()
    {
        return $this->belongsTo(User::class, 'finalizer_user_id');
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

    public function externalWorks()
    {
        return $this->hasMany(VehicleMaintenanceExternalWork::class);
    }

    public function getLaborCostAttribute()
    {
        return $this->working_hours * $this->hour_rate;
    }
}
