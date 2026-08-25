<?php

namespace App\Notifications;

use App\Models\VehicleIssue;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VehicleIssueReviewedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public VehicleIssue $issue;

    /**
     * Create a new notification instance.
     */
    public function __construct(VehicleIssue $issue)
    {
        $this->issue = $issue;
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
        $this->issue->loadMissing(['vehicle', 'reviewer', 'reporter']);
        $vehicle = $this->issue->vehicle;

        $subject = sprintf(
            '[Incidencia Derivada] Revisión de Incidencia - %s (%s)',
            $vehicle->name ?? 'Unidad',
            $vehicle->company ?? 'CBPA'
        );

        $destinations = [];
        if ($this->issue->sent_to_hq) {
            $destinations[] = 'Material Mayor';
        }
        if ($this->issue->sent_to_workshop) {
            $destinations[] = 'Taller Mecánico';
        }
        if ($this->issue->reported_to_commander) {
            $destinations[] = 'Comandancia';
        }

        return (new MailMessage)
            ->subject($subject)
            ->markdown('emails.notifications.issue_reviewed', [
                'issue' => $this->issue,
                'vehicle' => $vehicle,
                'reviewer' => $this->issue->reviewer,
                'reporter' => $this->issue->reporter,
                'destinations' => $destinations,
                'url' => route('vehicles.incidents.show', $this->issue->id),
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
            'issue_id' => $this->issue->id,
            'vehicle_id' => $this->issue->vehicle_id,
            'reviewed_by' => $this->issue->reviewed_by,
        ];
    }
}
