---
description: Standard pattern for Role-Based Access Control and Company Scoping
---

# Manage Permissions Workflow

Use this guide to ensure consistent security across the application.

## 1. Frontend Permissions (Visibility)

### `modules.tsx`

- Define granular permissions for each module (e.g., `vehicles.logs`, `vehicles.status`). **Avoid generic 'vehicles' key.**

### `app-sidebar.tsx` & `dashboard.tsx`

- Use the `hasPermission(module)` helper.
- **Role Exclusions**: If a role (e.g., Captain) is blocked from a specific module, explicitly return `false` at the top of the function.
- **Role Inclusions**: If a role has specific access (e.g., Cuartelero to Status), explicitly return `true` for those keys.

```typescript
if (user.role === 'capitan' && restricted.includes(module.permission))
    return false;
if (user.role === 'cuartelero' && allowed.includes(module.permission))
    return true;
```

## 2. Backend Permissions (Enforcement)

### Middleware

- Use `module:permission.key` in `routes/web.php` for coarse-grained access blocking.

### Controller Logic (Company Scope)

- **CRITICAL**: Never trust the frontend.
- In `index`, `store`, `update`, `destroy`:
- **Read**: Filter queries by `$user->company` unless Admin/Comandancia.
- **Write**: Validate that target `vehicle_id` (or other resource) belongs to `$user->company`.

```php
$user = request()->user();
if ($user->company !== 'Comandancia' && $user->role !== 'admin') {
     // 1. Filter Lists
     $query->where('company', $user->company);

     // 2. Validate Actions
     $vehicle = Vehicle::findOrFail($id);
     if ($vehicle->company !== $user->company) abort(403);
}
```

## 3. Special Cases (Mechanic/Inspector)

- **Mechanic**: often needs access to ALL vehicles (or Workshop ones), but might be restricted from Inventory.
- **Inspector**: often needs access based on Department ('Material Mayor' vs 'Material Menor'). Check `$user->department`.
