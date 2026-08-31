<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketCreatedConfirmationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public Ticket $ticket;

    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $this->ticket->loadMissing('user');

        $subject = sprintf(
            '[Soporte] Ticket #%d creado exitosamente - %s',
            $this->ticket->id,
            $this->ticket->subject
        );

        return (new MailMessage)
            ->subject($subject)
            ->markdown('emails.notifications.ticket-created', [
                'ticket' => $this->ticket,
                'url' => route('tickets.show', $this->ticket->id),
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'subject' => $this->ticket->subject,
        ];
    }
}
