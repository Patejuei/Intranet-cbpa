<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model; // Pivot or Model? It has an ID, so Model is fine.

class AssignedMaterial extends Model
{
  use HasFactory;

  protected $fillable = [
    'firefighter_id',
    'material_id',
    'quantity',
  ];

  public function firefighter()
  {
    return $this->belongsTo(Firefighter::class);
  }

  public function material()
  {
    return $this->belongsTo(Material::class);
  }
}
