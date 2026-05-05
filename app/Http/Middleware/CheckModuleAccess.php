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
        // Global Check: Module must be enabled in config/modules.php
        // We use the base module name (e.g., 'vehicles' even if 'vehicles.status' is requested)
        $baseModule = explode('.', $module)[0];
        $isEnabled = config("modules.enabled.{$baseModule}", true);

        if (!$isEnabled) {
            abort(403, 'Este módulo está temporalmente desactivado por el administrador.');
        }

        $user = $request->user();

        // Admin User Management Restriction
        if ($module === 'users' && $user->role !== 'admin') {
            abort(403, 'Solo el Administrador del sistema puede acceder a este módulo.');
        }

        // Admin and Comandante have access to everything else
        if ($user->role === 'admin' || $user->role === 'comandante') {
            return $next($request);
        }

        if ($user->role === 'central_operator') {
            return $next($request);
        }

        // Roles with implicit module access
        if ($module === 'vehicles' && in_array($user->role, ['cuartelero', 'mechanic', 'secretaria_adquisiciones'])) {
            return $next($request);
        }

        // Secretaria de Adquisiciones Access
        if ($user->role === 'secretaria_adquisiciones') {
            $allowed = [
                'inventory',
                'batteries',
                'equipment',
                'deliveries',
                'tickets',
                'reception',
                'vehicles.renditions',
            ];
            if (in_array($module, $allowed)) {
                return $next($request);
            }
        }

        // Mechanic Implicit Access (mirrors frontend use-permissions.ts)
        if ($user->role === 'mechanic') {
            $mechanicModules = [
                'vehicles.workshop',
                'vehicles.incidents',
                'vehicles.status',
                'vehicles.checklist',
                'vehicles.logs',
                'vehicles.logs',
                'vehicles.logs',
                'vehicles.inventory',
                'vehicles.petty-cash',
            ];
            if (in_array($module, $mechanicModules)) {
                return $next($request);
            }
        }

        // Bodega (inventory) Restriction for Maquinista and Capitan
        if ($module === 'inventory' && in_array($user->role, ['maquinista', 'capitan'])) {
            abort(403, 'No tienes permiso para acceder a este módulo.');
        }

        // Inspector Role Logic
        if ($user->role === 'inspector') {
            $dept = trim($user->department ?? ''); // Robust check

            if ($dept === 'Material Mayor') {
                $materialMayorAccess = [
                    'vehicles', // General access to vehicles group
                    'vehicles.status',
                    'vehicles.incidents',
                    'vehicles.inventory',
                    'vehicles.workshop',
                    'vehicles.checklist',
                    'vehicles.checklist',
                    'vehicles.logs',
                    'vehicles.petty-cash',
                ];

                // Allow if module is in the list.
                if (in_array($module, $materialMayorAccess)) {
                    return $next($request);
                }
            } elseif ($dept === 'Material Menor') {
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
            
            if ($module === 'central') {
                return $next($request);
            }
        }

        // Capitan and Ayudante default access
        if ($user->role === 'capitan' || $user->role === 'ayudante') {
            if ($module === 'central' || $module === 'inventory') {
                // For 'central', we allow but filtering happens in controller
                // Wait, if I return $next here, they get access.
                return $next($request);
            }
            return $next($request); // Capitan and Ayudante usually have broad access anyway
        }

        // Check specific permission
        $permissions = $user->permissions ?? [];
        $isWriteRequest = !in_array($request->method(), ['GET', 'HEAD', 'OPTIONS']);

        if ($isWriteRequest) {
            // Write requests: need base module, .edit or .full
            if (
                in_array($module, $permissions) ||
                in_array($module . '.edit', $permissions) ||
                in_array($module . '.full', $permissions)
            ) {
                return $next($request);
            }
        } else {
            // Read requests: can have base, .view, .edit or .full
            if (
                in_array($module, $permissions) ||
                in_array($module . '.view', $permissions) ||
                in_array($module . '.edit', $permissions) ||
                in_array($module . '.full', $permissions)
            ) {
                return $next($request);
            }
        }

        abort(403, 'No tienes permiso para acceder a este módulo o realizar esta acción.');
    }
}
