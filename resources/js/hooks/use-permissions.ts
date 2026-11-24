import { usePage } from '@inertiajs/react';

export function usePermissions() {
    const { props } = usePage<any>();
    const user = props.auth.user;

    const hasPermission = (module: string) => {
        if (!user) return false;

        // Tickets is enabled for all authenticated users
        if (module === 'tickets') return true;

        // Special restriction for Users and Firefighters Administration (Admin only)
        if (module === 'users' || module === 'firefighters') return user.role === 'admin';

        // Ayudante: No access to users
        if (user.role === 'ayudante' && module === 'users') return false;

        // Capitan and Ayudante Restrictions
        if (user.role === 'capitan' || user.role === 'ayudante') {
            const restricted = [
                'inventory',
                'vehicles.inventory',
                'vehicles.petty-cash',
                'vehicles.renditions',
            ];
            if (user.role === 'ayudante') {
                restricted.push('vehicles.workshop', 'users');
            }
            if (restricted.includes(module)) return false;
            return true;
        }

        if (user.role === 'admin' || user.role === 'comandante' || user.role === 'central_operator') return true;

        if (user.role === 'secretaria_adquisiciones') {
            const allowed = [
                'inventory',
                'batteries',
                'equipment',
                'deliveries',
                'tickets',
                'reception',
                'vehicles.renditions',
                'vehicles.petty-cash',
            ];
            return allowed.includes(module);
        }

        if (user.role === 'cuartelero') {
            const cuarteleroModules = [
                'vehicles.logs',
                'vehicles.checklist',
                'vehicles.status',
                'vehicles.incidents',
            ];
            return cuarteleroModules.includes(module);
        }

        if (user.role === 'maquinista') {
            const maquinistaModules = [
                'vehicles.logs',
                'vehicles.checklist',
                'vehicles.status',
                'vehicles.incidents',
                'vehicles.workshop',
            ];
            return maquinistaModules.includes(module);
        }

        if (user.role === 'mechanic') {
            const mechanicModules = [
                'vehicles.workshop',
                'vehicles.incidents',
                'vehicles.status',
                'vehicles.checklist',
                'vehicles.logs',
                'vehicles.inventory',
                'vehicles.renditions',
                'vehicles.petty-cash',
            ];
            return mechanicModules.includes(module);
        }

        if (user.role === 'inspector') {
            const dept = (user.department || '').trim();
            if (dept === 'Material Mayor') {
                const allowed = [
                    'vehicles.status',
                    'vehicles.incidents',
                    'vehicles.inventory',
                    'vehicles.logs',
                    'vehicles.workshop',
                    'vehicles.checklist',
                    'vehicles.renditions',
                    'vehicles.petty-cash',
                    'vehicles',
                    'central',
                ];
                return allowed.some(
                    (m) => m === module || m.startsWith(module + '.'),
                );
            } else if (dept === 'Material Menor') {
                const allowed = [
                    'inventory',
                    'tickets',
                    'batteries',
                    'deliveries',
                    'reception',
                    'equipment',
                    'assigned_materials',
                ];
                return allowed.some(
                    (m) => m === module || m.startsWith(module + '.'),
                );
            }
            return false;
        }

        const permissions = (user.permissions as string[]) || [];
        return (
            permissions.includes(module) ||
            permissions.includes(`${module}.view`) ||
            permissions.includes(`${module}.edit`) ||
            permissions.includes(`${module}.full`) ||
            (module === 'tickets' && !!user.has_tickets)
        );
    };

    const canEdit = (module: string) => {
        if (!user) return false;

        if (module === 'tickets') return true;

        // Special restriction for Users and Firefighters Administration (Admin only)
        if (module === 'users' || module === 'firefighters') return user.role === 'admin';

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
            if (module === 'vehicles.status') return false; // Fleet status is read-only
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
            if (module === 'vehicles.logs') {
                return Boolean(user.is_driver);
            }
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
                    'vehicles.renditions',
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

        if (user.role === 'secretaria_adquisiciones') {
            const secModules = [
                'inventory',
                'tickets',
                'batteries',
                'deliveries',
                'reception',
                'equipment',
                'vehicles.renditions',
                'vehicles.petty-cash',
            ];
            if (secModules.includes(module)) return true;
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
                'vehicles.inventory',
                'vehicles.renditions',
                'vehicles.petty-cash',
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

        if (module === 'tickets') return true;

        if (module === 'vehicles.logs') {
            if (user.role === 'admin') return true;
            return Boolean(user.is_driver) && canEdit(module);
        }

        if (user.role === 'ayudante' || user.role === 'cuartelero') {
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

        if (module === 'tickets' || module === 'users' || module === 'firefighters') return user.role === 'admin';

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
