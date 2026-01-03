<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentLog extends Model
{
    protected $fillable = [
        'item_name',
        'brand',
        'model',
        'serial_number',
        'inventory_number',
        'category',
        'type',
        'quantity',
        'reason',
        'status',
        'user_id',
        'document_path',
        'material_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
