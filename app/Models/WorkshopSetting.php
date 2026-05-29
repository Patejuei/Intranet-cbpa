<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkshopSetting extends Model
{
    protected $fillable = ['key', 'value', 'description'];

    public static function getDefaultHourRate(): int
    {
        return (int) (self::where('key', 'default_hour_rate')->first()?->value ?? 0);
    }
}
