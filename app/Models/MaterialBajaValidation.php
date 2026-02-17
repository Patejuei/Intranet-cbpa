<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaterialBajaValidation extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_id',
        'inspector_id',
        'is_reparable',
        'evaluation_notes',
        'reception_certificate_path',
        'baja_certificate_path',
    ];

    public function request()
    {
        return $this->belongsTo(MaterialBajaRequest::class, 'request_id');
    }

    public function inspector()
    {
        return $this->belongsTo(User::class, 'inspector_id');
    }
}
