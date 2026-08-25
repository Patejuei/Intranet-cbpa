<?php

namespace App\Notifications;

use App\Models\VehicleIssue;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VehicleIssueCreatedNotification extends Notification implements ShouldQueue
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
        $this->issue->loadMissing(['vehicle', 'reporter']);
        $vehicle = $this->issue->vehicle;

        $subject = sprintf(
            '[Incidencia] Nueva incidencia reportada - %s (%s)',
            $vehicle->name ?? 'Unidad',
            $vehicle->company ?? 'CBPA'
        );

        return (new MailMessage)
            ->subject($subject)
            ->markdown('emails.notifications.issue_created', [
                'issue' => $this->issue,
                'vehicle' => $vehicle,
                'reporter' => $this->issue->reporter,
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
            'severity' => $this->issue->severity,
        ];
    }
}
