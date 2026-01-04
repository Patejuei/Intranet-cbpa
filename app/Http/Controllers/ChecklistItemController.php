<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChecklistItem;

class ChecklistItemController extends Controller
{
    public function index()
    {
        return \App\Models\ChecklistItem::where('is_active', true)
            ->get()
            ->groupBy('category');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'name' => 'required|string',
        ]);

        \App\Models\ChecklistItem::create($validated);

        return back()->with('success', 'Item creado.');
    }

    public function destroy(\App\Models\ChecklistItem $checklistItem)
    {
        $checklistItem->update(['is_active' => false]);
        return back()->with('success', 'Item eliminado.');
    }
}
