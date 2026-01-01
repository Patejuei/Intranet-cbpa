<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = [
        'product_name',
        'brand',
        'model',
        'code',
        'stock_quantity',
        'company',
        'category',
    ];
}
