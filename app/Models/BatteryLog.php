<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BatteryLog extends Model
{
    protected $fillable = [
        'change_date',
        'equipment_id',
        'equipment_type',
        'responsible_name',
        'observations',
        'company',
        'next_change_date',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
