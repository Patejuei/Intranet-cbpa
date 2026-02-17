<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialBajaRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'material_id',
        'quantity',
        'reason',
        'images',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function validation()
    {
        return $this->hasOne(MaterialBajaValidation::class, 'request_id');
    }

    public function history()
    {
        return $this->hasOne(MaterialBajaHistory::class, 'material_request_id');
    }
}
