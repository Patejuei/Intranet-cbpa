# Skill Registry - Intranet CBPA

## Compact Rules

### Project Standards (Laravel/React/Inertia)
- **Language**: Spanish (Spanish) for UI and docs.
- **Routing**: Group by module (`prefix('vehicles')`, `module:vehicles`).
- **Controllers**: Use Inertia for views, JSON for auxiliary APIs. Namespace by module.
- **Frontend**: One-to-one mapping between `Inertia::render` and `resources/js/pages/`.
- **UI**: Reuse shadcn/Radix components in `resources/js/components/ui/`.
- **Permissions**: Use `use-permissions` hook and `module:*` middleware.
- **Multi-company**: Always filter queries by user's company unless global admin.

### Testing
- **Backend**: Use Pest for PHP tests (`php artisan test`).
- **Frontend**: No dedicated runner detected yet.

## Registered User Skills

| Skill | Trigger | Description |
|-------|---------|-------------|
| sdd-explore | `/sdd-explore <topic>` | Explore and investigate ideas before committing to a change. |
| sdd-propose | `/sdd-propose` | Create a change proposal with intent, scope, and approach. |
| sdd-spec | `/sdd-spec` | Write specifications with requirements and scenarios (delta specs). |
| sdd-design | `/sdd-design` | Create technical design document with architecture decisions. |
| sdd-tasks | `/sdd-tasks` | Break down a change into an implementation task checklist. |
| sdd-apply | `/sdd-apply` | Implement tasks from the change following specs and design. |
| sdd-verify | `/sdd-verify` | Validate implementation matches specs, design, and tasks. |
| sdd-archive | `/sdd-archive` | Sync delta specs to main specs and archive change. |
| laravel-specialist | Laravel models, controllers | Specialist rules for Laravel 10+ |
| shadcn-ui | shadcn components, Radix | Guide for accessible React components |
| responsive-design | Building layouts | Modern responsive design patterns |
| vercel-react-best-practices | React components | Performance optimization for React |

## Project Instructions
Include context from: [AGENTS.md](file:///c:/xampp/htdocs/intranet-cbpa/AGENTS.md)
