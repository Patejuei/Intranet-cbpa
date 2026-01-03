<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReceptionCertificate extends Model
{
  protected $fillable = [
    'firefighter_id',
    'user_id',
    'date',
    'observations',
    'company',
    'correlative',
  ];

  protected $casts = [
    'date' => 'datetime',
  ];

  public function firefighter()
  {
    return $this->belongsTo(Firefighter::class);
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function items()
  {
    return $this->hasMany(ReceptionItem::class);
  }
}
