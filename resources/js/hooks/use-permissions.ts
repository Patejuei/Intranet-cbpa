import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const { props } = usePage<any>();
    const user = props.auth.user;

    const hasPermission = (module: string) => {
        if (!user) return false;
        if (user.role === 'admin' || user.role === 'capitan') return true;

        if (user.role === 'maquinista') {
            // Maquinista implicit permissions
            const maquinistaModules = [
                'vehicles.logs',
                'vehicles.checklist',
                'vehicles.status',
                'vehicles.incidents',
                'vehicles.inventory', // Maybe? Check middleware.
            ];
            if (maquinistaModules.includes(module)) return true;
        }

        if (user.role === 'mechanic') {
            // Mechanic has access to these modules
            const mechanicModules = [
                'vehicles.workshop',
                'vehicles.incidents',
                'vehicles.status',
                'vehicles.checklist',
                'vehicles.logs',
                'inventory',
                'vehicles.inventory', // Just in case
            ];
            if (mechanicModules.includes(module)) return true;
        }

        if (user.role === 'inspector') {
            const dept = (user.department || '').trim();
            console.log('hasPermission check:', {
                module,
                dept,
                role: user.role,
            });

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
        // Check for exact match or .view/.edit/.full
        return (
            permissions.includes(module) ||
            permissions.includes(`${module}.view`) ||
            permissions.includes(`${module}.edit`) ||
            permissions.includes(`${module}.full`)
        );
    };

    const canEdit = (module: string) => {
        if (!user) return false;
        if (user.role === 'admin' || user.role === 'capitan') return true;

        if (user.role === 'inspector') {
            const dept = (user.department || '').trim();

            if (dept === 'Material Mayor') {
                const editModules = [
                    'vehicles.status',
                    'vehicles.incidents',
                    'vehicles.inventory',
                    'vehicles.logs',
                ];

                // Strict Edit Check
                const canEditList = [
                    'vehicles.status',
                    'vehicles.incidents',
                    'vehicles.inventory',
                ];

                if (canEditList.includes(module)) return true;

                // Read only for others in department
                const readOnlyList = [
                    'vehicles.workshop',
                    'vehicles.checklist',
                    'vehicles.logs',
                ];
                if (readOnlyList.includes(module)) return false;
            } else if (dept === 'Material Menor') {
                // "Edicion en todos los modulos de Material Menor"
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
            // Read-only modules for mechanic
            const readOnlyModules = [
                'vehicles.status',
                'vehicles.checklist',
                'vehicles.logs',
            ];
            if (readOnlyModules.includes(module)) return false;

            // Full access modules for mechanic
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
        if (user.role === 'admin' || user.role === 'capitan') return true;

        // Mechanic usually shouldn't delete unless specified?
        // Let's assume canDelete requires 'full' or specific logic.
        // For now, map to canEdit/full logic
        const permissions = (user.permissions as string[]) || [];
        return permissions.includes(`${module}.full`);
    };

    return { hasPermission, canEdit, canCreate, canDelete, user };
}
