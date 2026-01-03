<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleMaintenanceTask extends Model
{
  protected $fillable = [
    'description',
    'is_completed',
    'cost',
    'vehicle_maintenance_id',
  ];

  protected $casts = [
    'is_completed' => 'boolean',
  ];

  public function maintenance()
  {
    return $this->belongsTo(VehicleMaintenance::class, 'vehicle_maintenance_id');
  }
}
