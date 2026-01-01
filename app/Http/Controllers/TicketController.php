<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Ticket;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index()
    {
        $user = request()->user();
        $query = Ticket::with('user')->latest();

        if ($user->role !== 'admin' && $user->company) {
            $query->whereHas('user', function ($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        return Inertia::render('tickets/index', [
            'tickets' => $query->get()
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
