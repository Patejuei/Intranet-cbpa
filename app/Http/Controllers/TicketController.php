<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Ticket;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index()
    {
        return Inertia::render('tickets/index', [
            'tickets' => Ticket::with('user')->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'priority' => 'required|in:BAJA,MEDIA,ALTA',
        ]);

        Ticket::create($validated + ['user_id' => $request->user()->id]);
        return redirect()->back();
    }
}
