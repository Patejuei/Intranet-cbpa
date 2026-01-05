import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const { props } = usePage<any>();
    const user = props.auth.user;

    const hasPermission = (module: string) => {
        if (!user) return false;

        // Capitan: Revoke Bodega (inventory)
        if (user.role === 'capitan') {
            if (module === 'inventory') return false;
            return true; // Default to true for everything else (legacy behavior)
        }

        if (user.role === 'admin' || user.role === 'comandante') return true;

        if (user.role === 'maquinista') {
            const maquinistaModules = [
                'vehicles.logs',
                'vehicles.checklist',
                'vehicles.status',
                'vehicles.incidents',
                // 'vehicles.inventory', // REMOVED per user request (Bodega)
                // 'inventory', // Bodega Global - Explicitly excluded
            ];
            if (maquinistaModules.includes(module)) return true;
        }

        if (user.role === 'mechanic') {
            // ... existing mechanic logic ...
            const mechanicModules = [
                'vehicles.workshop',
                'vehicles.incidents',
                'vehicles.status',
                'vehicles.checklist',
                'vehicles.logs',
                'inventory',
                'vehicles.inventory',
            ];
            if (mechanicModules.includes(module)) return true;
        }

        if (user.role === 'inspector') {
            // ... existing inspector logic ...
            const dept = (user.department || '').trim();
            if (dept === 'Material Mayor') {
                const allowed = [
                    'vehicles.status',
                    'vehicles.incidents',
                    'vehicles.inventory',
                    'vehicles.logs',
                    'vehicles.workshop',
                    'vehicles.checklist',
                    'vehicles',
                ];
                if (
                    allowed.some(
                        (m) => m === module || m.startsWith(module + '.'),
                    )
                )
                    return true;
                if (allowed.includes(module)) return true;
            } else if (dept === 'Material Menor') {
                const allowed = [
                    'inventory',
                    'tickets',
                    'batteries',
                    'deliveries',
                    'reception',
                    'equipment',
                ];
                if (
                    allowed.some(
                        (m) => m === module || m.startsWith(module + '.'),
                    )
                )
                    return true;
                if (allowed.includes(module)) return true;
            }
        }

        const permissions = (user.permissions as string[]) || [];
        return (
            permissions.includes(module) ||
            permissions.includes(`${module}.view`) ||
            permissions.includes(`${module}.edit`) ||
            permissions.includes(`${module}.full`)
        );
    };

    const canEdit = (module: string) => {
        if (!user) return false;

        // Capitan: Read-Only for Workshop
        if (user.role === 'capitan') {
            if (module === 'vehicles.workshop') return false;
            return true;
        }

        if (user.role === 'admin' || user.role === 'comandante') return true;

        if (user.role === 'maquinista') {
            // Maquinista Edit permissions
            const editModules = [
                'vehicles.status', // ADDED per user request
                'vehicles.checklist', // Usually they sign checklists
            ];
            if (editModules.includes(module)) return true;
        }

        if (user.role === 'inspector') {
            const dept = (user.department || '').trim();
            if (dept === 'Material Mayor') {
                const editModules = [
                    'vehicles.status',
                    'vehicles.incidents',
                    'vehicles.inventory',
                    'vehicles.logs',
                    'vehicles.checklist', // ADDED
                ];
                if (editModules.includes(module)) return true;

                const readOnlyList = ['vehicles.workshop'];
                if (readOnlyList.includes(module)) return false;
            } else if (dept === 'Material Menor') {
                const materialMenorModules = [
                    'inventory',
                    'tickets',
                    'batteries',
                    'deliveries',
                    'reception',
                    'equipment',
                ];
                if (materialMenorModules.includes(module)) return true;
            }
        }

        if (user.role === 'mechanic') {
            const readOnlyModules = [
                'vehicles.status',
                'vehicles.checklist',
                'vehicles.logs',
            ];
            if (readOnlyModules.includes(module)) return false;

            const fullAccessModules = [
                'vehicles.workshop',
                'vehicles.incidents',
                'inventory',
                'vehicles.inventory',
            ];
            if (fullAccessModules.includes(module)) return true;
        }

        const permissions = (user.permissions as string[]) || [];
        return (
            permissions.includes(`${module}.edit`) ||
            permissions.includes(`${module}.full`)
        );
    };

    const canCreate = (module: string) => {
        return canEdit(module); // Usually create implies edit rights
    };

    const canDelete = (module: string) => {
        if (!user) return false;
        if (
            user.role === 'admin' ||
            user.role === 'capitan' ||
            user.role === 'comandante'
        )
            return true;

        // Mechanic usually shouldn't delete unless specified?
        // Let's assume canDelete requires 'full' or specific logic.
        // For now, map to canEdit/full logic
        const permissions = (user.permissions as string[]) || [];
        return permissions.includes(`${module}.full`);
    };

    return { hasPermission, canEdit, canCreate, canDelete, user };
}
