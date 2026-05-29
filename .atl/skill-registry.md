# Project Skill Registry - Intranet-cbpa

## Core Stack
- **Framework**: Laravel 12 (PHP 8.2+)
- **Frontend**: Inertia.js, React 19
- **Build Tool**: Vite 7
- **CSS**: Tailwind 4
- **Testing**: Pest (PHP), No frontend test framework detected in package.json (likely manual/E2E only or rely on Laravel tests).

## Compact Rules (auto-injected)

### Laravel Specialist
- Use `Inertia::render()` for views.
- Models in `app/Models`, Controllers in `app/Http/Controllers` (namespaced by module).
- Always filter by `company` (multi-tenant).
- Use `CompanyScopeTrait` when available.
- Routes in `routes/web.php` and `routes/settings.php`.
- Permissions enforced via `module:*` middleware and `CheckModuleAccess`.

### React Best Practices
- Components in `resources/js/components`.
- Pages in `resources/js/pages`.
- Use `use-permissions` hook for UI-level access control.
- Spanish language for all UI text.
- Use `shadcn/ui` components from `resources/js/components/ui`.
- Use persistent layouts (`app-layout`, `app-sidebar-layout`).

## User Skills

| Skill | Trigger | Purpose |
|-------|---------|---------|
| laravel-specialist | `.php`, `app/`, `routes/`, `database/` | Backend logic, models, controllers |
| responsive-design | `.tsx`, `resources/js/` | Responsive UI implementation |
| shadcn-ui | `.tsx`, `resources/js/components/ui/` | UI component usage |
| vercel-react-best-practices | `.tsx`, `resources/js/` | React performance and architecture |

## Project Instructions (from AGENTS.MD)
- **Permissions**: Multi-company and multi-role. Non-admin users see only their company's data.
- **Language**: Spanish only.
- **Critical Flows**: Vehicle checklists, material bajas, petty cash renditions, support tickets.
- **PDFs**: Generated via Blade templates in `resources/views/pdf/` + DOMPDF.
