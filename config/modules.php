<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Active Modules Configuration
    |--------------------------------------------------------------------------
    |
    | This file defines which modules are currently active/visible in the system.
    | Changing these values will hide the modules from the sidebar AND
    | restrict access to their routes via the CheckModuleAccess middleware.
    |
    */

    'enabled' => [
        // Main Modules (Matching Route Middleware)
        'vehicles'    => true,  // Includes Status, Incidents, Logs, Workshop, Checklist, Inventory (Bodega), Renditions
        'users'       => true,  // Administration of users
        'equipment'   => false,  // Material Menor (Includes Inventory, Deliveries, Receptions, Repairs, Equipment)
        'batteries'   => false,
        'tickets'     => false,
        'central'     => false,
        'firefighters' => false,
    ],
];
