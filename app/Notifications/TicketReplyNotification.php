<?php

namespace App\Notifications;

use App\Models\Ticket;
use App\Models\TicketMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketReplyNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public Ticket $ticket;
    public TicketMessage $ticketMessage;

    public function __construct(Ticket $ticket, TicketMessage $ticketMessage)
    {
        $this->ticket = $ticket;
        $this->ticketMessage = $ticketMessage;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $this->ticketMessage->loadMissing('user');
        $this->ticket->loadMissing('user');

        $subject = sprintf(
            '[Soporte] Nueva respuesta en ticket #%d - %s',
            $this->ticket->id,
            $this->ticket->subject
        );

        return (new MailMessage)
            ->subject($subject)
            ->markdown('emails.notifications.ticket-reply', [
                'ticket' => $this->ticket,
                'reply' => $this->ticketMessage,
                'replier' => $this->ticketMessage->user,
                'url' => route('tickets.show', $this->ticket->id),
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'message_id' => $this->ticketMessage->id,
            'replier' => $this->ticketMessage->user->name ?? 'Usuario',
        ];
    }
}
