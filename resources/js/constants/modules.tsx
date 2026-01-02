import {
    Battery,
    Box,
    FileText,
    HardHat,
    Package,
    Ticket,
    Users,
} from 'lucide-react';

export type ModuleDefinition = {
    key: string;
    title: string;
    description: string;
    href: string;
    pattern: RegExp;
    icon: any; // Lucide Icon
};

export const MODULES: ModuleDefinition[] = [
    {
        key: 'batteries',
        title: 'Control de Baterías',
        description: 'Registro de cambios y cargas',
        href: '/batteries',
        pattern: /^\/batteries/,
        icon: Battery,
    },
    {
        key: 'equipment',
        title: 'Material Menor',
        description: 'Altas y bajas de equipamiento',
        href: '/equipment',
        pattern: /^\/equipment/,
        icon: Box,
    },
    {
        key: 'tickets',
        title: 'Ticketera',
        description: 'Solicitudes y reportes',
        href: '/tickets',
        pattern: /^\/tickets/,
        icon: Ticket,
    },
    {
        key: 'deliveries',
        title: 'Actas de Entrega',
        description: 'Historial de entregas',
        href: '/deliveries',
        pattern: /^\/deliveries/,
        icon: FileText,
    },
    {
        key: 'inventory',
        title: 'Inventario',
        description: 'Gestión de stock',
        href: '/inventory',
        pattern: /^\/inventory/,
        icon: Package,
    },
    {
        key: 'admin-users',
        title: 'Gestión Usuarios',
        description: 'Administración del sistema',
        href: '/admin/users',
        pattern: /^\/admin\/users/,
        icon: Users,
    },
    {
        key: 'admin-firefighters',
        title: 'Bomberos',
        description: 'Registro de personal',
        href: '/admin/firefighters',
        pattern: /^\/admin\/firefighters/,
        icon: HardHat,
    },
];
