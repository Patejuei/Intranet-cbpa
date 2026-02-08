<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialAcquisition extends Model
{
  use HasFactory;

  protected $fillable = [
    'company',
    'status',
    'invoice_number',
    'invoice_date',
    'supplier_rut',
    'supplier_name',
    'document_path',
  ];

  public function items()
  {
    return $this->hasMany(MaterialAcquisitionItem::class);
  }
}
