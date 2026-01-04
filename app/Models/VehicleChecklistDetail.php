<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\VehicleChecklist;
use App\Models\ChecklistItem;

class VehicleChecklistDetail extends Model
{
    protected $fillable = [
        'vehicle_checklist_id',
        'checklist_item_id',
        'status',
        'notes',
    ];

    public function checklist()
    {
        return $this->belongsTo(VehicleChecklist::class, 'vehicle_checklist_id');
    }

    public function item()
    {
        return $this->belongsTo(ChecklistItem::class, 'checklist_item_id');
    }
}
