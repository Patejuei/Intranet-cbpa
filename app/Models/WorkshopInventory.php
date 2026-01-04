<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkshopInventory extends Model
{
  protected $table = 'workshop_inventory';

  protected $fillable = [
    'name',
    'sku',
    'category',
    'stock',
    'min_stock',
    'unit_cost',
    'location',
    'compatibility',
    'description',
  ];

  protected $casts = [
    'stock' => 'integer',
    'min_stock' => 'integer',
    'unit_cost' => 'integer',
    'compatibility' => 'array',
  ];
}
