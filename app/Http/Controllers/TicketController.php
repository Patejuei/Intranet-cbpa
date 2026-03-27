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
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && $user->role !== 'secretaria_adquisiciones' && $user->role !== 'inspector' && !in_array('tickets.view', $user->permissions ?? []) && !in_array('tickets.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $query = Ticket::with('user');
        $this->applyCompanyScope($query, request());

        // Comandancia roles only see tickets reported to them (and admin sees all)
        if ($user->company === 'Comandancia' && $user->role !== 'admin' && $user->role !== 'inspector') {
            $query->where('reported_to_commander', true);
        }

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
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && $user->role !== 'secretaria_adquisiciones' && $user->role !== 'inspector' && !in_array('tickets.edit', $user->permissions ?? [])) {
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
            'reported_to_commander' => false,
            'commander_seen' => false,
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('tickets', 'public');
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
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && $user->role !== 'secretaria_adquisiciones' && $user->role !== 'inspector' && !in_array('tickets.view', $user->permissions ?? []) && !in_array('tickets.edit', $user->permissions ?? [])) {
            abort(403);
        }

        // Authorization: User must be Comandancia OR belong to the ticket's company
        if ($user->company !== 'Comandancia' && $user->role !== 'admin' && $ticket->company !== $user->company) {
            abort(403);
        }
        
        if ($user->company === 'Comandancia' && $user->role !== 'admin' && $user->role !== 'inspector' && !$ticket->reported_to_commander) {
            abort(403, 'Ticket not reported to comandancia yet.');
        }

        $ticket->load(['messages.user', 'user']);

        return Inertia::render('tickets/show', [
            'ticket' => $ticket
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && $user->role !== 'secretaria_adquisiciones' && $user->role !== 'inspector' && !in_array('tickets.edit', $user->permissions ?? [])) {
            abort(403);
        }

        if ($user->company !== 'Comandancia' && $ticket->company !== $user->company) {
            abort(403);
        }
        
        if ($user->company === 'Comandancia' && $user->role !== 'admin' && $user->role !== 'inspector' && !$ticket->reported_to_commander) {
            abort(403, 'Ticket not reported to comandancia yet.');
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

        return redirect()->back();
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && $user->role !== 'secretaria_adquisiciones' && $user->role !== 'inspector' && !in_array('tickets.edit', $user->permissions ?? [])) {
            abort(403);
        }

        // Allow Comandancia OR Admin OR Capitan to update status?
        // Let's keep it restricted as before, or maybe Capitan can resolve it if it hasn't been escalated.
        if ($user->company !== 'Comandancia' && $user->role !== 'capitan' && $user->role !== 'admin') {
            abort(403, 'No tienes permisos para cambiar el estado.');
        }

        $validated = $request->validate([
            'status' => 'required|in:ABIERTO,EN_PROCESO,CERRADO',
        ]);

        $ticket->update(['status' => $validated['status']]);

        return redirect()->back();
    }

    public function reportToCommander(Request $request, Ticket $ticket)
    {
        $user = request()->user();
        
        // Only Capitán (or Admin) can report to Comandante
        if ($user->role !== 'capitan' && $user->role !== 'admin') {
            abort(403, 'Solo el Capitán puede reportar al Comandante.');
        }

        if ($user->role !== 'admin' && $ticket->company !== $user->company) {
            abort(403, 'No puedes reportar un ticket de otra compañía.');
        }

        $ticket->update([
            'reported_to_commander' => true,
            'commander_seen' => false,
        ]);

        return redirect()->back();
    }

    public function markAsSeenByCommander(Request $request, Ticket $ticket)
    {
        $user = request()->user();

        if ($user->role !== 'comandante' && $user->role !== 'admin') {
            abort(403, 'Solo el Comandante puede marcar el ticket como visto.');
        }

        $ticket->update([
            'commander_seen' => true,
        ]);

        return redirect()->back();
    }
}
