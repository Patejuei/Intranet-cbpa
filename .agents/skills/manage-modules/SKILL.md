# Skill: Manage System Modules

This skill provides instructions on how to enable or disable system modules (Material Menor, Tickets, Central de Alarmas, etc.) in the intranet.

## Overview

The intranet uses a central configuration file to control module visibility and access. This allows administrators to hide entire sections of the system without deleting any code, and reactivate them when needed.

## How to Toggle Modules

### 1. Configuration File
All module statuses are defined in:
`config/modules.php`

### 2. Enabling a Module
To make a module visible and accessible:
1. Open `config/modules.php`.
2. Locate the module key in the `enabled` array.
3. Set its value to `true`.

Example (Enabling Tickets):
```php
'tickets' => true,
```

### 3. Disabling a Module
To hide a module and block direct access:
1. Open `config/modules.php`.
2. Set its value to `false`.

## Supported Modules

| Name | Key | Description |
|------|-----|-------------|
| Material Mayor | `vehicles` | Includes Units, Incidents, Logs, Workshop, Checklist, Inventory, Renditions. |
| User Admin | `users` | User management under Administration. |
| Material Menor | `equipment` | Includes Inventory, Deliveries, Receptions, Repairs, etc. |
| Batteries | `batteries` | Battery log tracking. |
| Tickets | `tickets` | Support ticket system. |
| Central | `central` | Alarm center shift management and reports. |
| Firefighters | `firefighters` | Firefighter database management. |

## technical Details

- **Backend Access**: Controlled via `App\Http\Middleware\CheckModuleAccess`. If a module is `false` in config, the middleware returns a 403 error.
- **Frontend Sidebar**: `AppSidebar.tsx` filters navigation items based on this config passed via Inertia.
- **Dashboard**: `dashboard.tsx` hides widgets and module cards if the associated module is disabled.
