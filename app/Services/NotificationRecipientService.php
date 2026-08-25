<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification as NotificationFacade;

class NotificationRecipientService
{
    /**
     * Obtiene los capitanes activos de una compañía específica.
     */
    public static function getCaptainsForCompany(string $company): Collection
    {
        return User::where('company', $company)
            ->where('role', 'capitan')
            ->where(function ($q) {
                $q->where('is_enabled', true)
                  ->orWhereNull('is_enabled');
            })
            ->whereNotNull('email')
            ->get();
    }

    /**
     * Obtiene los maquinistas activos de una compañía específica.
     */
    public static function getMachinistsForCompany(string $company): Collection
    {
        return User::where('company', $company)
            ->where('role', 'maquinista')
            ->where(function ($q) {
                $q->where('is_enabled', true)
                  ->orWhereNull('is_enabled');
            })
            ->whereNotNull('email')
            ->get();
    }

    /**
     * Obtiene los comandantes activos.
     */
    public static function getCommanders(): Collection
    {
        return User::where('role', 'comandante')
            ->where(function ($q) {
                $q->where('is_enabled', true)
                  ->orWhereNull('is_enabled');
            })
            ->whereNotNull('email')
            ->get();
    }

    /**
     * Obtiene los inspectores de Material Mayor activos.
     */
    public static function getMaterialMayorInspectors(): Collection
    {
        return User::where('role', 'inspector')
            ->where('department', 'Material Mayor')
            ->where(function ($q) {
                $q->where('is_enabled', true)
                  ->orWhereNull('is_enabled');
            })
            ->whereNotNull('email')
            ->get();
    }

    /**
     * Obtiene los mecánicos del Taller activos.
     */
    public static function getMechanics(): Collection
    {
        return User::where('role', 'mechanic')
            ->where(function ($q) {
                $q->where('is_enabled', true)
                  ->orWhereNull('is_enabled');
            })
            ->whereNotNull('email')
            ->get();
    }

    /**
     * Obtiene la Secretaria de Adquisiciones activa.
     */
    public static function getAcquisitionSecretaries(): Collection
    {
        return User::where('role', 'secretaria_adquisiciones')
            ->where(function ($q) {
                $q->where('is_enabled', true)
                  ->orWhereNull('is_enabled');
            })
            ->whereNotNull('email')
            ->get();
    }

    /**
     * Envía una notificación de forma segura a una colección o array de usuarios,
     * previniendo que un fallo de conexión SMTP interrumpa el flujo del usuario.
     *
     * @param iterable|User $recipients
     * @param Notification $notification
     */
    public static function safeNotify($recipients, Notification $notification): void
    {
        try {
            if ($recipients instanceof User) {
                $recipients = collect([$recipients]);
            } elseif (is_array($recipients)) {
                $recipients = collect($recipients);
            }

            // Filtrar duplicados por email y validar que tengan email
            $validRecipients = collect($recipients)
                ->filter(fn ($user) => $user && !empty($user->email))
                ->unique('email')
                ->values();

            if ($validRecipients->isNotEmpty()) {
                NotificationFacade::send($validRecipients, $notification);
            }
        } catch (\Throwable $e) {
            Log::error('Error al enviar notificación por correo: ' . $e->getMessage(), [
                'notification' => get_class($notification),
                'exception' => $e,
            ]);
        }
    }
}
