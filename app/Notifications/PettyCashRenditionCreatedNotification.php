<?php

namespace App\Notifications;

use App\Models\PettyCashRendition;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PettyCashRenditionCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public PettyCashRendition $rendition;

    /**
     * Create a new notification instance.
     */
    public function __construct(PettyCashRendition $rendition)
    {
        $this->rendition = $rendition;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $this->rendition->loadMissing(['user', 'vehicle']);

        $expenseLabel = match ($this->rendition->expense_type) {
            'repair_supplies' => 'Insumos Reparación',
            'spare_parts' => 'Repuestos',
            'tools' => 'Herramientas',
            'other_tools' => 'Otras Herramientas',
            default => $this->rendition->expense_type
        };

        $subject = sprintf(
            '[Rendición Ingresada] Requiere Aprobación - Doc N° %s ($%s)',
            $this->rendition->invoice_number,
            number_format($this->rendition->amount, 0, ',', '.')
        );

        return (new MailMessage)
            ->subject($subject)
            ->markdown('emails.notifications.rendition_created', [
                'rendition' => $this->rendition,
                'user' => $this->rendition->user,
                'vehicle' => $this->rendition->vehicle,
                'expenseLabel' => $expenseLabel,
                'url' => route('vehicles.renditions.show', $this->rendition->id),
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'rendition_id' => $this->rendition->id,
            'amount' => $this->rendition->amount,
            'invoice_number' => $this->rendition->invoice_number,
        ];
    }
}
