<?php

namespace App\Notifications;

use App\Models\VehicleMaintenance;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VehicleMaintenanceFinalizedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public VehicleMaintenance $maintenance;

    /**
     * Create a new notification instance.
     */
    public function __construct(VehicleMaintenance $maintenance)
    {
        $this->maintenance = $maintenance;
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
        $this->maintenance->loadMissing(['vehicle', 'tasks', 'finalizerUser', 'externalWorks']);
        $vehicle = $this->maintenance->vehicle;

        $subject = sprintf(
            '[Taller Mecánico] Orden de Trabajo Finalizada - %s lista para entrega',
            $vehicle->name ?? 'Unidad'
        );

        return (new MailMessage)
            ->subject($subject)
            ->markdown('emails.notifications.maintenance_finalized', [
                'maintenance' => $this->maintenance,
                'vehicle' => $vehicle,
                'finalizerUser' => $this->maintenance->finalizerUser,
                'tasks' => $this->maintenance->tasks,
                'url' => route('vehicles.workshop.show', $this->maintenance->id),
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
            'maintenance_id' => $this->maintenance->id,
            'vehicle_id' => $this->maintenance->vehicle_id,
            'status' => $this->maintenance->status,
        ];
    }
}
