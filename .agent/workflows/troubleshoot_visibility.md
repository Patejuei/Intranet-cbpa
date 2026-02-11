---
description: Checklist for fixing missing modules in Sidebar or Dashboard
---

# Troubleshoot Visibility Workflow

If a user cannot see a module they should have access to:

## 1. Check Module Definition

- File: `resources/js/constants/modules.tsx`
- **Key**: Verify the `key` and `permission` strings.
- **Issue**: Is it using a generic key (e.g., `vehicles`) when the code expects specific (e.g., `vehicles.status`)?

## 2. Check Sidebar Logic

- File: `resources/js/components/app-sidebar.tsx` -> `hasPermission()`
- **Exclusions**: Is there an explicit rule blocking this role?
- **Inclusions**: Is the module missing from the `allowed` list for this role?

## 3. Check Dashboard Logic

- File: `resources/js/pages/dashboard.tsx` -> `hasPermission()`
- **Sync**: Is this logic identical to `app-sidebar.tsx`? (It should be).
- **Prefixes**: Does it check `startsWith('vehicles')` or exact match?

## 4. Check Database Permissions

- Table: `users` (specifically `permissions` column/json).
- **Override**: Does the user have the explicit permission key in their `permissions` array? (This usually overrides role logic).

## 5. Check Backend Route

- File: `routes/web.php`
- **Middleware**: Is `module:xyz` middleware blocking access? (This creates a 403, but shouldn't hide the sidebar link technically, unless the frontend checks it too).
