<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PettyCashRendition extends Model
{
  use HasFactory, SoftDeletes;

  protected $fillable = [
    'user_id',
    'amount',
    'description',
    'status', // draft, pending_inspector, pending_comandante, approved, rejected
    'inspector_id',
    'inspector_vised_at',
    'comandante_id',
    'comandante_vised_at',
    'rejected_by',
    'rejection_reason',
    'rejected_at',
  ];

  protected $casts = [
    'inspector_vised_at' => 'datetime',
    'comandante_vised_at' => 'datetime',
    'rejected_at' => 'datetime',
    'amount' => 'integer',
  ];

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function inspector()
  {
    return $this->belongsTo(User::class, 'inspector_id');
  }

  public function comandante()
  {
    return $this->belongsTo(User::class, 'comandante_id');
  }

  public function rejectedBy()
  {
    return $this->belongsTo(User::class, 'rejected_by');
  }

  public function attachments()
  {
    return $this->hasMany(PettyCashAttachment::class, 'rendition_id');
  }
}
