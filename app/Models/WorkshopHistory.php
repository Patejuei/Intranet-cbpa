<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\WorkshopInventory; // Assuming WorkshopInventory is in the same namespace
use App\Models\User; // Assuming User is in App\Models

class WorkshopHistory extends Model
{
  protected $fillable = [
    'workshop_inventory_id',
    'user_id',
    'type',
    'quantity_change',
    'current_balance',
    'description',
  ];

  public function inventory()
  {
    return $this->belongsTo(WorkshopInventory::class, 'workshop_inventory_id');
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
