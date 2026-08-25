import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const { props } = usePage<any>();
    const user = props.auth.user;

    const hasPermission = (module: string) => {
        if (!user) return false;

        // Ayudante: No access to users
        if (user.role === 'ayudante' && module === 'users') return false;

        // Capitan and Ayudante: Revoke Bodega (inventory)
        if (user.role === 'capitan' || user.role === 'ayudante') {
            if (module === 'inventory') return false;
            if (user.role === 'ayudante' && module === 'vehicles.workshop') return false;
            return true; // Default to true for everything else (legacy behavior)
        }

        if (user.role === 'admin' || user.role === 'comandante' || user.role === 'central_operator') return true;

        if (user.role === 'cuartelero') {
            const cuarteleroModules = [
                'vehicles.logs',
                'vehicles.checklist',
                'vehicles.status',
            ];
            if (cuarteleroModules.includes(module)) return true;
        }

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
                'vehicles.logs',
                'vehicles.logs',
                'vehicles.inventory',
                'vehicles.petty-cash',
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
                    'vehicles.checklist',
                    'vehicles.petty-cash',
                    'vehicles',
                    'central',
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
                    'assigned_materials',
                    'vehicles.petty-cash', // Added permission
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

        // Ayudante restriction (cannot edit users, but can edit checklists/logs for his units/company)
        if (user.role === 'ayudante') {
            if (module === 'users') return false; // Cannot edit users
            if (module === 'vehicles.workshop') return false;
            if (module === 'vehicles.status') return false; // Fleet status is read-only
            return true; 
        }

        // Capitan: Read-Only for Workshop
        if (user.role === 'capitan') {
            if (module === 'vehicles.workshop') return false;
            return true;
        }

        if (user.role === 'admin' || user.role === 'comandante' || user.role === 'central_operator') {
            return true;
        }

        if (user.role === 'cuartelero') {
            const editModules = [
                'vehicles.logs',      // bitácoras
                'vehicles.checklist', // checklist
            ];
            if (editModules.includes(module)) return true;
        }

        if (user.role === 'maquinista') {
            // Maquinista Edit permissions
            const editModules = [
                'vehicles.incidents', // ADDED per user request
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
                    'vehicles.petty-cash',
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
                'vehicles.incidents',
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
        if (!user) return false;

        if (user.role === 'ayudante') {
            if (module === 'vehicles.incidents') return false;
            // Allow creation for others (checklists, logs - if driver, users - limited list in controller)
            return canEdit(module);
        }

        if (user.role === 'capitan') {
            if (module === 'vehicles' || module === 'vehicles.status') {
                return false;
            }
        }

        return canEdit(module); // Usually create implies edit rights
    };

    const canDelete = (module: string) => {
        if (!user) return false;

        // Ayudante doesn't have delete permissions
        if (user.role === 'ayudante') return false;

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

    const canConfigureHH = () => {
        if (!user) return false;
        if (user.role === 'admin' || user.role === 'comandante') return true;
        if (
            user.role === 'inspector' &&
            (user.department || '').trim() === 'Material Mayor'
        )
            return true;
        return false;
    };

    const canEditWorkingHours = () => {
        if (!user) return false;
        if (user.role === 'admin' || user.role === 'comandante' || user.role === 'mechanic') return true;
        if (
            user.role === 'inspector' &&
            (user.department || '').trim() === 'Material Mayor'
        )
            return true;
        return false;
    };

    return { hasPermission, canEdit, canCreate, canDelete, canConfigureHH, canEditWorkingHours, user };
}
