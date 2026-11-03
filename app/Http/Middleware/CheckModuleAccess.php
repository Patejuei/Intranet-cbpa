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
                'vehicles.inventory',
                'vehicles.petty-cash',
                'vehicles.renditions',
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
                    'vehicles.logs',
                    'vehicles.petty-cash',
                    'vehicles.renditions',
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

        // Ticket module: explicit access for allowed roles or users with existing tickets
        if ($module === 'tickets') {
            if ($user->role === 'capitan' || $user->company === 'Comandancia') {
                return $next($request);
            }
            if ($user->role === 'secretaria_adquisiciones') {
                return $next($request);
            }
            if ($user->role === 'inspector' && trim($user->department ?? '') === 'Material Menor') {
                return $next($request);
            }
            if (\App\Models\Ticket::where('user_id', $user->id)->exists()) {
                return $next($request);
            }
        }

        // Check specific permission
        $permissions = $user->permissions ?? [];
        $isWriteRequest = !in_array($request->method(), ['GET', 'HEAD', 'OPTIONS']);

        $targetModules = $this->resolveTargetModules($request, $module);

        if ($isWriteRequest) {
            // Write requests: need base module or specific submodule .edit or .full
            foreach ($targetModules as $target) {
                if (
                    in_array($target, $permissions) ||
                    in_array($target . '.edit', $permissions) ||
                    in_array($target . '.full', $permissions)
                ) {
                    return $next($request);
                }
            }
        } else {
            // Read requests: can have base or specific submodule, .view, .edit or .full
            foreach ($targetModules as $target) {
                if (
                    in_array($target, $permissions) ||
                    in_array($target . '.view', $permissions) ||
                    in_array($target . '.edit', $permissions) ||
                    in_array($target . '.full', $permissions)
                ) {
                    return $next($request);
                }
            }
        }

        abort(403, 'No tienes permiso para acceder a este módulo o realizar esta acción.');
    }

    /**
     * Resolve target submodules based on request path and base module.
     *
     * @param Request $request
     * @param string $module
     * @return array<int, string>
     */
    private function resolveTargetModules(Request $request, string $module): array
    {
        $targetModules = [$module];

        if ($module === 'vehicles') {
            $path = $request->path();
            $segments = explode('/', trim($path, '/'));
            $section = $segments[1] ?? 'status';

            switch ($section) {
                case 'logs':
                    $targetModules[] = 'vehicles.logs';
                    break;
                case 'checklists':
                    $targetModules[] = 'vehicles.checklist';
                    $targetModules[] = 'vehicles.checklists';
                    break;
                case 'incidents':
                case 'incident-images':
                    $targetModules[] = 'vehicles.incidents';
                    break;
                case 'workshop':
                    $targetModules[] = 'vehicles.workshop';
                    break;
                case 'inventory':
                    $targetModules[] = 'vehicles.inventory';
                    break;
                case 'renditions':
                    $targetModules[] = 'vehicles.renditions';
                    $targetModules[] = 'vehicles.petty-cash';
                    break;
                case 'status':
                case 'create':
                case 'decommissioned':
                    $targetModules[] = 'vehicles.status';
                    break;
                case 'reports':
                    $reportType = $segments[2] ?? '';
                    if ($reportType === 'incidents') {
                        $targetModules[] = 'vehicles.incidents';
                    } elseif ($reportType === 'workshop') {
                        $targetModules[] = 'vehicles.workshop';
                    } elseif ($reportType === 'checklists') {
                        $targetModules[] = 'vehicles.checklist';
                    } else {
                        $targetModules[] = 'vehicles.status';
                    }
                    break;
                default:
                    $targetModules[] = 'vehicles.status';
                    break;
            }
        } elseif ($module === 'equipment') {
            $path = $request->path();
            $segments = explode('/', trim($path, '/'));
            $section = $segments[0] ?? '';

            if (in_array($section, ['inventory', 'materials'])) {
                $targetModules[] = 'inventory';
            } elseif ($section === 'deliveries') {
                $targetModules[] = 'deliveries';
            } elseif ($section === 'receptions') {
                $targetModules[] = 'reception';
                $targetModules[] = 'receptions';
            } elseif ($section === 'repairs') {
                $targetModules[] = 'equipment';
            }
        }

        return array_unique($targetModules);
    }
}
