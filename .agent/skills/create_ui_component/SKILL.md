---
description: Create or update UI components using Shadcn/UI standards, Tailwind CSS v4, and Semantic Theme Variables for consistent Dark Mode support.
---

# Create UI Component Skill

Follow these guidelines whenever creating or modifying UI components to ensure consistency, accessibility, and proper Dark Mode support.

## 1. Core Principles

- **Use Shadcn/UI Components**: Always prefer existing UI components (Button, Card, Input, Label, Select, Badge) over raw HTML elements.
- **Semantic Colors Only**: **NEVER** hardcode hex values or use specific color palettes (e.g., `bg-slate-900`, `text-gray-100`) for structural elements. Use semantic utility classes that map to the CSS variables defined in `app.css`.
- **Dark Mode Strategy**: Rely on the `dark:` variant ONLY for specific overrides not covered by the semantic system. The semantic classes (`bg-background`, `text-foreground`, `border-border`) automatically handle light/dark mode switching.

## 2. Component Structure

### Container

Use `Card` components for forms and major sections to ensure proper background and border styling in both modes.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyComponent() {
    return (
        <Card className="border-border bg-card text-card-foreground">
            <CardHeader>
                <CardTitle>Title</CardTitle>
            </CardHeader>
            <CardContent>{/* Content */}</CardContent>
        </Card>
    );
}
```

### Typography

Use standard text utilities combined with semantic colors.

- **Primary Text**: `text-foreground` (Default)
- **Secondary/Muted Text**: `text-muted-foreground`
- **Headings**: `font-semibold tracking-tight`

### Interactive Elements

Use `Button`, `Input`, `Select` components. They are pre-styled to use `--primary`, `--secondary`, `--input`, and `--ring` variables.

## 3. Color Reference (Semantic vs Tailwind)

| Semantic Class            | Use Case                   | Implementation (Light/Dark) |
| :------------------------ | :------------------------- | :-------------------------- |
| `bg-background`           | Page background            | `#f2f2f2` / `#262626`       |
| `bg-card`                 | Container/Card background  | `#ffffff` / `#1f1f1f`       |
| `text-foreground`         | Primary text               | `#262626` / `#f2f2f2`       |
| `text-muted-foreground`   | Secondary text, captions   | `#737373` / `#a3a3a3`       |
| `border-border`           | Default borders            | `#e5e5e5` / `#404040`       |
| `bg-primary`              | Primary actions/highlights | `#bf984e` (Gold)            |
| `text-primary-foreground` | Text on primary bg         | `#ffffff`                   |

### ❌ AVOID (Deprecated/Hardcoded)

- `bg-white` (Okay for specific light-only areas, but `bg-card` is preferred)
- `bg-gray-100` / `bg-gray-800`
- `text-gray-900` / `text-white`
- `border-gray-200` / `border-gray-700`

### ✅ USE (Semantic)

- `bg-card`
- `bg-muted`
- `text-foreground`
- `border-border`
- `border-input`

## 4. Icons

Use **Lucide React** icons.

```tsx
import { Check, Settings, User } from 'lucide-react';

<Check className="size-4" />;
```

## 5. Form Example

```tsx
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

<div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="user@example.com" />
    <Button type="submit">Save</Button>
</div>;
```

## 6. Grid & Layout

Use standard Tailwind Grid/Flex utilities. Responsive prefixes (`sm:`, `md:`, `lg:`) work as expected.

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {/* Items */}
</div>
```
