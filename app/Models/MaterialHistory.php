<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialHistory extends Model
{
  use HasFactory;

  protected $fillable = [
    'material_id',
    'user_id',
    'type', // 'INITIAL', 'ADD', 'REMOVE', 'DELIVERY', 'RECEPTION', 'MAINTENANCE', 'EDIT'
    'quantity_change',
    'current_balance',
    'reference_type',
    'reference_id',
    'description',
  ];

  public function material()
  {
    return $this->belongsTo(Material::class);
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function reference()
  {
    return $this->morphTo();
  }
}
