<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialAcquisitionItem extends Model
{
  use HasFactory;

  protected $fillable = [
    'material_acquisition_id',
    'item_name',
    'quantity',
    'details',
    'brand',
    'model',
    'serial_number',
    'inventory_code',
  ];

  public function acquisition()
  {
    return $this->belongsTo(MaterialAcquisition::class, 'material_acquisition_id');
  }
}
