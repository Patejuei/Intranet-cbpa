<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentLog extends Model
{
    protected $fillable = ['item_name', 'serial_number', 'type', 'reason', 'status', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
