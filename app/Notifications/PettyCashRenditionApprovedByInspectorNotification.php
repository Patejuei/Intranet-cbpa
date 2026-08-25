<?php

namespace App\Notifications;

use App\Models\PettyCashRendition;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PettyCashRenditionApprovedByInspectorNotification extends Notification implements ShouldQueue
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
        $this->rendition->loadMissing(['user', 'vehicle', 'inspector']);

        $expenseLabel = match ($this->rendition->expense_type) {
            'repair_supplies' => 'Insumos Reparación',
            'spare_parts' => 'Repuestos',
            'tools' => 'Herramientas',
            'other_tools' => 'Otras Herramientas',
            default => $this->rendition->expense_type
        };

        $subject = sprintf(
            '[Rendición para Validación Final] Doc N° %s ($%s)',
            $this->rendition->invoice_number,
            number_format($this->rendition->amount, 0, ',', '.')
        );

        return (new MailMessage)
            ->subject($subject)
            ->markdown('emails.notifications.rendition_approved', [
                'rendition' => $this->rendition,
                'user' => $this->rendition->user,
                'inspector' => $this->rendition->inspector,
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
            'inspector_id' => $this->rendition->inspector_id,
        ];
    }
}
