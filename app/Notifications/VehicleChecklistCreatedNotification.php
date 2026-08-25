<?php

namespace App\Notifications;

use App\Models\VehicleChecklist;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VehicleChecklistCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public VehicleChecklist $checklist;

    /**
     * Create a new notification instance.
     */
    public function __construct(VehicleChecklist $checklist)
    {
        $this->checklist = $checklist;
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
        $this->checklist->loadMissing(['vehicle', 'user', 'details.item']);
        $vehicle = $this->checklist->vehicle;

        $urgentCount = $this->checklist->details->where('status', 'urgent')->count();
        $nextMaintCount = $this->checklist->details->where('status', 'next_maint')->count();
        $okCount = $this->checklist->details->where('status', 'ok')->count();

        $subject = sprintf(
            '[Checklist Realizado] Pendiente de Visación - %s (%s)',
            $vehicle->name ?? 'Unidad',
            $vehicle->company ?? 'CBPA'
        );

        return (new MailMessage)
            ->subject($subject)
            ->markdown('emails.notifications.checklist_created', [
                'checklist' => $this->checklist,
                'vehicle' => $vehicle,
                'user' => $this->checklist->user,
                'urgentCount' => $urgentCount,
                'nextMaintCount' => $nextMaintCount,
                'okCount' => $okCount,
                'url' => route('vehicles.checklists.show', $this->checklist->id),
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
            'checklist_id' => $this->checklist->id,
            'vehicle_id' => $this->checklist->vehicle_id,
            'user_id' => $this->checklist->user_id,
        ];
    }
}
