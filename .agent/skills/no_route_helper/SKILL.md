---
description: Guidelines for handling frontend routing without the Laravel route() helper.
---

# No Route Helper

## Description

This project avoids using the Laravel `route()` helper (Ziggy) in frontend React/Inertia components due to reliability issues. Instead, use hardcoded relative or absolute paths, or a custom safe-typed helper if available.

## Rules

1.  **Do NOT use `route('route.name')`** in `.tsx` or `.jsx` files.
2.  **Use static strings** for paths where possible (e.g., `href="/equipment/bajas"`).
3.  **Construct dynamic paths** using template literals (e.g., `href={\`/equipment/bajas/\${id}\`}`).
4.  **Backend Redirects**: Ensure Controllers redirect to valid URL strings, not `route()` names if meant for Inertia matching, though backend `route()` is generally safe, consistency is key. If the user explicitly requested "no route()", verify if this applies to backend redirects too. usually it applies to Frontend.
    - _Clarification_: The user said "don't use route() function because it always brings problems". This usually refers to the client-side Ziggy integration. Backend `route()` is standard Laravel. I will prioritize removing it from Frontend.

## Example

**BAD:**

```tsx
<Link href={route('equipment.bajas.create')}>Crear Solicitud</Link>
```

**GOOD:**

```tsx
<Link href="/equipment/bajas/create">Crear Solicitud</Link>
```
