<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryItem extends Model
{
    protected $fillable = [
        'delivery_certificate_id',
        'material_id',
        'quantity',
    ];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}
