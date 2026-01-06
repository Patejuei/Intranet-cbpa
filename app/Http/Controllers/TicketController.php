<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Ticket;
use Inertia\Inertia;

class TicketController extends Controller
{
    use \App\Traits\CompanyScopeTrait;

    public function index()
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('tickets.view', $user->permissions ?? []) && !in_array('tickets.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $query = Ticket::with('user');
        $this->applyCompanyScope($query, request());

        // For Comandancia, maybe default to "Pending" or show all? 
        // Let frontend handle tabs. We return all relevant tickets.

        return Inertia::render('tickets/index', [
            'tickets' => $query->latest()->paginate(10)
        ]);
    }

    public function create()
    {
        return Inertia::render('tickets/create');
    }

    public function store(Request $request)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('tickets.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'priority' => 'required|in:BAJA,MEDIA,ALTA',
            'message' => 'required|string',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:10240',
        ]);

        $ticket = Ticket::create([
            'subject' => $validated['subject'],
            'description' => $validated['message'],
            'priority' => $validated['priority'],
            'status' => 'ABIERTO',
            'user_id' => $request->user()->id,
            'company' => $request->user()->company,
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('tickets', 'public');
            // Update ticket generic image path if we want a thumbnail, 
            // or just rely on the first message's image?
            // The plan said Ticket has image_path. I'll save it there too for list view.
            $ticket->update(['image_path' => $imagePath]);
        }

        \App\Models\TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
            'image_path' => $imagePath,
        ]);

        return redirect()->route('tickets.index');
    }

    public function show(Ticket $ticket)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('tickets.view', $user->permissions ?? []) && !in_array('tickets.edit', $user->permissions ?? [])) {
            abort(403);
        }

        // Authorization: User must be Comandancia OR belong to the ticket's company
        if ($user->company !== 'Comandancia' && $ticket->company !== $user->company) {
            abort(403);
        }

        $ticket->load(['messages.user', 'user']);

        return Inertia::render('tickets/show', [
            'ticket' => $ticket
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('tickets.edit', $user->permissions ?? [])) {
            abort(403);
        }

        if ($user->company !== 'Comandancia' && $ticket->company !== $user->company) {
            abort(403);
        }

        $validated = $request->validate([
            'message' => 'required|string',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:10240',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('tickets', 'public');
        }

        \App\Models\TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'message' => $validated['message'],
            'image_path' => $imagePath,
        ]);

        // If Comandancia replies, maybe update status to EN_PROCESO?
        if ($user->company === 'Comandancia' && $ticket->status === 'ABIERTO') {
            $ticket->update(['status' => 'EN_PROCESO']);
        }

        return redirect()->back();
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('tickets.edit', $user->permissions ?? [])) {
            abort(403);
        }

        if ($user->company !== 'Comandancia') {
            abort(403, 'Solo Comandancia puede cambiar el estado.');
        }

        $validated = $request->validate([
            'status' => 'required|in:ABIERTO,EN_PROCESO,CERRADO',
        ]);

        $ticket->update(['status' => $validated['status']]);

        return redirect()->back();
    }
}
