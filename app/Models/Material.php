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
        'serial_number',
        'stock_quantity',
        'company',
        'category',
        'document_path',
    ];
    public function logs()
    {
        return $this->hasMany(EquipmentLog::class);
    }

    public function history()
    {
        return $this->hasMany(MaterialHistory::class)->orderBy('created_at', 'desc');
    }
}
