<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Material;
use App\Models\User;
use App\Models\ReceptionCertificate;
use App\Models\DeliveryCertificate;

class RepairRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'material_id',
        'requested_by',
        'status',
        'description',
        'inspector_id',
        'inspection_date',
        'inspection_observation',
        'reception_certificate_id',
        'provider_name',
        'repair_description',
        'delivery_certificate_id',
        'delivery_date',
        'invoice_number',
        'invoice_path',
        'repair_cost',
        'return_date',
    ];

    protected $casts = [
        'inspection_date' => 'datetime',
        'delivery_date' => 'datetime',
        'return_date' => 'datetime',
    ];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function requester()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function inspector()
    {
        return $this->belongsTo(User::class, 'inspector_id');
    }

    public function receptionCertificate()
    {
        return $this->belongsTo(ReceptionCertificate::class);
    }

    public function deliveryCertificate()
    {
        return $this->belongsTo(DeliveryCertificate::class);
    }
}
