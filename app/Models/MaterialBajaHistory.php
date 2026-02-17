<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialBajaHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'material_request_id',
        'original_material_id',
        'product_name',
        'code',
        'quantity_removed',
        'approved_by',
        'final_documentation_path',
    ];

    public function request()
    {
        return $this->belongsTo(MaterialBajaRequest::class, 'material_request_id');
    }

    public function originalMaterial()
    {
        return $this->belongsTo(Material::class, 'original_material_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
