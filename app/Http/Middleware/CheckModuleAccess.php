<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckModuleAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $module): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'Unauthorized.');
        }

        // Admin and Capitan have access to everything
        if ($user->role === 'admin' || $user->role === 'capitan') {
            return $next($request);
        }

        // Roles with implicit module access
        if ($module === 'vehicles' && in_array($user->role, ['cuartelero', 'mechanic'])) {
            return $next($request);
        }

        // Inspector Role Logic
        if ($user->role === 'inspector') {
            if ($user->department === 'Material Mayor') {
                $materialMayorAccess = [
                    'vehicles', // General access to vehicles group
                    'vehicles.status',
                    'vehicles.incidents',
                    'vehicles.inventory',
                    'vehicles.workshop',
                    'vehicles.checklist',
                    'vehicles.logs',
                ];

                // Allow if module is in the list.
                // Note: This middleware mainly checks "Can Access", strict edit/view is handled in frontend or separate middleware if needed.
                // However, the prompt implies "Read Only" for some. 
                // Since this middleware is "CheckModuleAccess", simple existence in list is enough to ENTER the route.
                // Controller/Frontend will handle ReadOnly state.
                if (in_array($module, $materialMayorAccess)) {
                    return $next($request);
                }
            } elseif ($user->department === 'Material Menor') {
                $materialMenorAccess = [
                    'inventory',
                    'tickets',
                    'batteries',
                    'deliveries',
                    'reception',
                    'equipment', // Group name if used
                ];
                if (in_array($module, $materialMenorAccess)) {
                    return $next($request);
                }
            }
        }

        // Check specific permission
        $permissions = $user->permissions ?? [];

        // Allow if user has exact module permission OR .view OR .edit suffix
        if (
            in_array($module, $permissions) ||
            in_array($module . '.view', $permissions) ||
            in_array($module . '.edit', $permissions)
        ) {
            return $next($request);
        }

        abort(403, 'No tienes permiso para acceder a este módulo.');
    }
}
