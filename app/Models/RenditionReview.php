<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RenditionReview extends Model
{
    public $timestamps = false;

    protected $table = 'rendition_reviews';

    protected $fillable = [
        'rendition_id',
        'user_id',
        'action',
        'step',
        'comment',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function rendition()
    {
        return $this->belongsTo(PettyCashRendition::class, 'rendition_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
