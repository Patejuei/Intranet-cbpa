<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user() ? tap($request->user(), function ($user) {
                    if ($user->role === 'maquinista') {
                        $defaults = [
                            // General Vehicles (Edit)
                            'vehicles',
                            'vehicles.view',
                            'vehicles.edit',
                            // Incidents (Edit)
                            'vehicles.incidents',
                            'vehicles.incidents.view',
                            'vehicles.incidents.edit',
                            // Checklist (Edit)
                            'vehicles.checklist',
                            'vehicles.checklist.view',
                            'vehicles.checklist.edit',
                            // Logs/Bitacora (Edit)
                            'vehicles.logs',
                            'vehicles.logs.view',
                            'vehicles.logs.edit',
                            // Inventory (Edit)
                            'vehicles.inventory',
                            'vehicles.inventory.view',
                            'vehicles.inventory.edit',
                            // Workshop (View Only)
                            'vehicles.workshop',
                            'vehicles.workshop.view',
                        ];
                        $user->permissions = array_values(array_unique(array_merge($user->permissions ?? [], $defaults)));
                    }
                }) : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
