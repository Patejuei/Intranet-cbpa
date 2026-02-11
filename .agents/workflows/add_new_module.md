---
description: How to add a new full-stack module to the application
---

# Add New Module Workflow

Follow this checklist to add a new module (e.g., "Inventario", "Bitácoras") to the Intranet application.

## 1. Backend Route

- File: `routes/web.php`
- Action: Define the route group and resource controller.
- **Middleware**: Ensure `auth` and `verified` are applied. If rigid permission is known, use `module:permission_key`.

```php
Route::middleware(['auth', 'verified', 'module:vehicles.new-module'])->group(function () {
    Route::resource('new-module', NewModuleController::class);
});
```

## 2. Frontend Constant Definition (CRITICAL)

- File: `resources/js/constants/modules.tsx`
- Action: Add the module definition.
- **Permission Key**: MUST be granular and unique (e.g., `vehicles.new-module`). Do NOT use generic keys like `vehicles`.

```typescript
{
    key: 'vehicles-new-module',
    title: 'Nuevo Módulo',
    description: 'Descripción breve',
    href: '/vehicles/new-module',
    pattern: /^\/vehicles\/new-module/,
    icon: IconName,
    permission: 'vehicles.new-module', // GRANULAR KEY
},
```

## 3. Sidebar Navigation

- File: `resources/js/components/app-sidebar.tsx`
- Action: Add item to `NAV_GROUPS`.
- **Permission Logic**: Update `hasPermission` function if the new module has special role exclusions (e.g., Block Captains).

## 4. Dashboard Visibility

- File: `resources/js/pages/dashboard.tsx`
- Action: Update `hasPermission` logic in Dashboard.
- **Check**: Ensure the logic handles the granular permission key defined in Step 2.

## 5. Controller Implementation

- Action: Create Controller.
- **Scope Check**: In `index`, `store`, `update`:
    - ALWAYS check `$user->company`.
    - If `cuartelero` or `maquinista`, restrict to their company vehicles.
    - If `comandancia`, allow global view (if applicable).

```php
if ($user->company !== 'Comandancia' && $user->role !== 'admin') {
    // Enforce Company Scope
}
```
