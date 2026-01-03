import {
    AlertTriangle,
    Battery,
    Box,
    Clipboard,
    FileText,
    HardHat,
    List,
    Package,
    Ticket,
    Truck,
    Users,
    Wrench,
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
        key: 'reception',
        title: 'Actas de Recepción',
        description: 'Devolución de materiales',
        href: '/receptions',
        pattern: /^\/receptions/,
        icon: Clipboard,
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
    {
        key: 'vehicles-status',
        title: 'Estado Material Mayor',
        description: 'Estado y ubicación de la flota',
        href: '/vehicles/status',
        pattern: /^\/vehicles\/status/,
        icon: Truck,
    },
    {
        key: 'vehicles-logs',
        title: 'Bitácoras',
        description: 'Movimientos y combustible',
        href: '/vehicles/logs',
        pattern: /^\/vehicles\/logs/,
        icon: Clipboard,
    },
    {
        key: 'vehicles-incidents',
        title: 'Incidencias',
        description: 'Reporte de fallas y novedades',
        href: '/vehicles/incidents',
        pattern: /^\/vehicles\/incidents/,
        icon: AlertTriangle,
    },
    {
        key: 'vehicles-workshop',
        title: 'Taller Mecánico',
        description: 'Gestión de mantenciones',
        href: '/vehicles/workshop',
        pattern: /^\/vehicles\/workshop/,
        icon: Wrench,
    },
    {
        key: 'vehicles-inventory',
        title: 'Inventario de Unidades',
        description: 'Equipamiento en carros',
        href: '/vehicles/inventory',
        pattern: /^\/vehicles\/inventory/,
        icon: List,
    },
];
