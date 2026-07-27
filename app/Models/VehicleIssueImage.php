<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleIssueImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_issue_id',
        'image_path',
        'original_name',
        'uploaded_by',
    ];

    public function issue()
    {
        return $this->belongsTo(VehicleIssue::class, 'vehicle_issue_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
