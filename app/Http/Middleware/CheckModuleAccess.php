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
