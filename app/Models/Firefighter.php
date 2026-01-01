<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\DeliveryCertificate; // Added this line

class Firefighter extends Model
{
    protected $fillable = [
        'general_registry_number',
        'full_name',
        'rut',
        'company',
    ];

    public function deliveryCertificates()
    {
        return $this->hasMany(DeliveryCertificate::class);
    }
}
