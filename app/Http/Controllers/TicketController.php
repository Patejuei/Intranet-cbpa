<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketMessage;
use App\Notifications\TicketCreatedConfirmationNotification;
use App\Notifications\TicketReceivedNotification;
use App\Notifications\TicketReplyNotification;
use App\Services\NotificationRecipientService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    /**
     * Categorías configurables para los tickets de soporte.
     * Para agregar o modificar categorías, editar este array.
     */
    public const CATEGORIES = [
        'error_plataforma'      => 'Error en la Plataforma',
        'solicitud_acceso'      => 'Solicitud de Acceso',
        'solicitud_usuario'     => 'Solicitud/Actualización de Usuario',
        'recuperacion_password' => 'Recuperación de Contraseña',
        'consulta_general'      => 'Consulta General',
        'problema_modulo'       => 'Problema con Módulo',
        'otro'                  => 'Otro',
    ];

    /**
     * Verifica si el usuario tiene acceso al módulo de tickets.
     */
    private function canAccessTickets(): bool
    {
        $user = request()->user();

        return $user->role === 'admin'
            || $user->role === 'capitan'
            || $user->role === 'comandante'
            || $user->role === 'secretaria_adquisiciones'
            || ($user->role === 'inspector' && trim($user->department ?? '') === 'Material Menor')
            || $user->company === 'Comandancia'
            || Ticket::where('user_id', $user->id)->exists();
    }

    /**
     * Verifica si el usuario puede crear tickets.
     * Los usuarios con acceso excepcional (solo dueños de tickets) no pueden crear nuevos.
     */
    private function canCreateTickets(): bool
    {
        $user = request()->user();

        return $user->role === 'admin'
            || $user->role === 'capitan'
            || $user->role === 'comandante'
            || $user->role === 'secretaria_adquisiciones'
            || ($user->role === 'inspector' && trim($user->department ?? '') === 'Material Menor')
            || $user->company === 'Comandancia';
    }

    public function index()
    {
        if (! $this->canAccessTickets()) {
            abort(403);
        }

        $user = request()->user();
        $query = Ticket::with(['user', 'assignedTo']);

        $isStandardManager = in_array($user->role, ['capitan', 'secretaria_adquisiciones'])
            || ($user->role === 'inspector' && trim($user->department ?? '') === 'Material Menor');

        // Admin ve todos los tickets
        // Comandancia ve todos los tickets
        // Gestores estándar ven los de su compañía
        // Usuarios con acceso excepcional solo ven sus propios tickets
        if ($user->role !== 'admin' && $user->company !== 'Comandancia') {
            if ($isStandardManager) {
                $query->where('company', $user->company);
            } else {
                $query->where('user_id', $user->id);
            }
        }

        return Inertia::render('tickets/index', [
            'tickets' => $query->latest()->paginate(15),
            'categories' => self::CATEGORIES,
            'can_create' => $this->canCreateTickets(),
        ]);
    }

    public function create()
    {
        if (! $this->canCreateTickets()) {
            abort(403);
        }

        return Inertia::render('tickets/create', [
            'categories' => self::CATEGORIES,
        ]);
    }

    public function store(Request $request)
    {
        if (! $this->canCreateTickets()) {
            abort(403);
        }

        $user = $request->user();

        $rules = [
            'subject'  => 'required|string|max:255',
            'category' => 'required|string|in:' . implode(',', array_keys(self::CATEGORIES)),
            'priority' => 'required|in:BAJA,MEDIA,ALTA',
            'message'  => 'required|string',
            'image'    => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:10240',
        ];

        if ($user->role === 'admin') {
            $rules['requester_email'] = 'required|email|exists:users,email';
        }

        $validated = $request->validate($rules, [
            'requester_email.required' => 'Debe ingresar el correo electrónico del solicitante.',
            'requester_email.email'    => 'Debe ingresar un correo electrónico válido.',
            'requester_email.exists'   => 'El correo ingresado no corresponde a ningún usuario registrado en la plataforma.',
        ]);

        if ($user->role === 'admin') {
            $requester = \App\Models\User::where('email', $validated['requester_email'])->firstOrFail();
            $assignedTo = $user->id; // El admin que crea el ticket queda como asignado responsable
        } else {
            $requester = $user;
            $assignedTo = null;
        }

        $ticket = Ticket::create([
            'subject'     => $validated['subject'],
            'description' => $validated['message'],
            'category'    => $validated['category'],
            'priority'    => $validated['priority'],
            'status'      => 'ABIERTO',
            'user_id'     => $requester->id,
            'company'     => $requester->company ?? 'Comandancia',
            'assigned_to' => $assignedTo,
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('tickets', 'public');
            $ticket->update(['image_path' => $imagePath]);
        }

        TicketMessage::create([
            'ticket_id'  => $ticket->id,
            'user_id'    => $user->id,
            'message'    => $validated['message'],
            'image_path' => $imagePath,
        ]);

        // Notificar al solicitante/creador (confirmación con enlace directo)
        NotificationRecipientService::safeNotify(
            $requester,
            new TicketCreatedConfirmationNotification($ticket)
        );

        // Si no fue creado por admin, notificar a los administradores
        if ($user->role !== 'admin') {
            $admins = NotificationRecipientService::getAdmins();
            NotificationRecipientService::safeNotify(
                $admins,
                new TicketReceivedNotification($ticket)
            );
        }

        return redirect()->route('tickets.index');
    }

    public function show(Ticket $ticket)
    {
        if (! $this->canAccessTickets()) {
            abort(403);
        }

        $user = request()->user();

        $isStandardManager = in_array($user->role, ['capitan', 'secretaria_adquisiciones'])
            || ($user->role === 'inspector' && trim($user->department ?? '') === 'Material Menor');

        // Admin y Comandancia ven cualquier ticket
        // Gestores estándar ven tickets de su compañía
        // Usuarios con acceso excepcional solo ven sus propios tickets
        if ($user->role !== 'admin' && $user->company !== 'Comandancia') {
            if ($isStandardManager && $ticket->company !== $user->company) {
                abort(403);
            } elseif (! $isStandardManager && $ticket->user_id !== $user->id) {
                abort(403);
            }
        }

        $ticket->load(['messages.user', 'user', 'assignedTo']);

        return Inertia::render('tickets/show', [
            'ticket'     => $ticket,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        if (! $this->canAccessTickets()) {
            abort(403);
        }

        $user = request()->user();

        $isStandardManager = in_array($user->role, ['capitan', 'secretaria_adquisiciones'])
            || ($user->role === 'inspector' && trim($user->department ?? '') === 'Material Menor');

        // Admin y Comandancia pueden responder cualquier ticket
        // Gestores estándar pueden responder tickets de su compañía
        // Usuarios con acceso excepcional solo pueden responder sus propios tickets
        if ($user->role !== 'admin' && $user->company !== 'Comandancia') {
            if ($isStandardManager && $ticket->company !== $user->company) {
                abort(403);
            } elseif (! $isStandardManager && $ticket->user_id !== $user->id) {
                abort(403);
            }
        }

        $validated = $request->validate([
            'message' => 'required|string',
            'image'   => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:10240',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('tickets', 'public');
        }

        $ticketMessage = TicketMessage::create([
            'ticket_id'  => $ticket->id,
            'user_id'    => $user->id,
            'message'    => $validated['message'],
            'image_path' => $imagePath,
        ]);

        // Determinar a quién notificar
        if ($user->role === 'admin') {
            // Admin responde → notificar al creador del ticket
            NotificationRecipientService::safeNotify(
                $ticket->user,
                new TicketReplyNotification($ticket, $ticketMessage)
            );
        } else {
            // Creador responde → notificar al admin asignado, o a todos los admins si no hay asignado
            if ($ticket->assigned_to) {
                NotificationRecipientService::safeNotify(
                    $ticket->assignedTo,
                    new TicketReplyNotification($ticket, $ticketMessage)
                );
            } else {
                $admins = NotificationRecipientService::getAdmins();
                NotificationRecipientService::safeNotify(
                    $admins,
                    new TicketReplyNotification($ticket, $ticketMessage)
                );
            }
        }

        return redirect()->back();
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $user = request()->user();

        if ($user->role !== 'admin') {
            abort(403, 'Solo el administrador puede cambiar el estado del ticket.');
        }

        $validated = $request->validate([
            'status' => 'required|in:ABIERTO,EN_PROCESO,CERRADO',
        ]);

        $ticket->update(['status' => $validated['status']]);

        return redirect()->back();
    }

    public function assignToMe(Request $request, Ticket $ticket)
    {
        $user = request()->user();

        if ($user->role !== 'admin') {
            abort(403, 'Solo el administrador puede asignarse tickets.');
        }

        $ticket->update(['assigned_to' => $user->id]);

        return redirect()->back();
    }
}
