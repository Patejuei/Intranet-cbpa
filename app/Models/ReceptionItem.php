<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReceptionItem extends Model
{
  protected $fillable = [
    'reception_certificate_id',
    'material_id',
    'quantity',
  ];

  public function material()
  {
    return $this->belongsTo(Material::class);
  }
}
