<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkshopSetting extends Model
{
    protected $fillable = ['key', 'value', 'description'];
}
