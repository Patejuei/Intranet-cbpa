<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = ['subject', 'description', 'company', 'priority', 'status', 'user_id', 'image_path', 'reported_to_commander', 'commander_seen'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function messages()
    {
        return $this->hasMany(TicketMessage::class);
    }
}
