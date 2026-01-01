<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Material extends Model
{
    use HasFactory;

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
