import { MODULES, ModuleDefinition } from '@/constants/modules';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    Battery,
    CheckCircle2,
    Clock,
    FileText,
    Receipt,
    ShieldAlert,
    Ticket as TicketIcon,
    Truck,
    Wrench,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Principal',
        href: '/dashboard',
    },
];

const RECENT_MODULES_KEY = 'recent_modules';

interface UpcomingBattery {
    id: number;
    equipment_type: string;
    responsible_name: string;
    next_change_date: string;
    company: string;
}

interface Ticket {
    id: number;
    subject: string;
    status: string;
    created_at: string;
    user: { name: string; company: string };
}

export default function Dashboard({
    upcomingBatteries = [],
    pendingTickets = [],
    respondedTickets = [],
    vehiclesStopped = [],
    pendingIncidents = [],
    vehiclesInWorkshop = [],
    expiringDocuments = [],
    pendingPettyCash = [],
    criticalStockItems = [],
    pendingChecklists = [], // Added
}: {
    upcomingBatteries?: UpcomingBattery[];
    pendingTickets?: Ticket[];
    respondedTickets?: Ticket[];
    vehiclesStopped?: any[]; // Typed loosely here or import from index.d.ts
    pendingIncidents?: any[];
    vehiclesInWorkshop?: any[];
    pendingChecklists?: any[]; // Added
    expiringDocuments?: {
        id: number;
        name: string;
        company: string;
        alerts: {
            label: string;
            date: string;
            days: number;
            status: 'warning' | 'danger';
        }[];
    }[];
    pendingPettyCash?: {
        id: number;
        amount: number;
        description: string;
        created_at: string;
        user: { name: string };
    }[];
    criticalStockItems?: any[];
}) {
    const [recent, setRecent] = useState<ModuleDefinition[]>([]);
    const [showAllExpires, setShowAllExpires] = useState(false);

    const { auth, enabledModules = {} } = usePage<any>().props;

    const isModuleEnabled = (permission?: string) => {
        if (!permission) return true;
        const baseModule = permission.split('.')[0];
        // Special case for dashboard/profile or undefined
        if (['dashboard', 'profile'].includes(baseModule)) return true;
        return !!enabledModules[baseModule];
    };

    const hasPermission = (module: ModuleDefinition) => {
        if (!isModuleEnabled(module.permission)) return false;
        const user = auth.user;
        if (!user) return false;

        // Admin and Comandante have full access
        if (user.role === 'admin' || user.role === 'comandante') return true;

        // Ayudante: No access to users
        if (user.role === 'ayudante' && module.permission === 'users') return false;

        const moduleKey = module.permission;

        // Capitan and Ayudante Restrictions
        if (user.role === 'capitan' || user.role === 'ayudante') {
            const restricted = [
                'vehicles.inventory', 
                'vehicles.renditions',
                'vehicles.workshop'
            ];
            
            if (user.role === 'ayudante' && restricted.includes(moduleKey)) return false;
            if (user.role === 'capitan' && (moduleKey === 'vehicles.inventory' || moduleKey === 'vehicles.renditions')) return false;

            return true;
        }

        // Maquinista Restrictions
        if (user.role === 'maquinista') {
            const restricted = ['vehicles.inventory', 'vehicles.petty-cash'];
            if (restricted.includes(moduleKey)) return false;
            return true;
        }

        // Specific Roles check for vehicles
        // Specific Roles check for vehicles
        if (
            moduleKey.startsWith('vehicles') &&
            ['mechanic'].includes(user.role || '')
        ) {
            return true;
        }

        if (user.role === 'cuartelero') {
            const allowed = [
                'vehicles.status',
                'vehicles.incidents',
                'vehicles.logs',
                'vehicles.checklist',
            ];
            if (allowed.includes(moduleKey)) return true;
        }

        // Inspector Role Logic
        if (user.role === 'inspector') {
            const dept = (user.department || '').trim();
            // const moduleKey = module.permission; // Removed duplicate

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
                        (m) => m === moduleKey || m.startsWith(moduleKey + '.'),
                    )
                )
                    return true;
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
                        (m) => m === moduleKey || m.startsWith(moduleKey + '.'),
                    )
                )
                    return true;
            }
        }

        // Check explicit permissions
        const permissions = user.permissions || [];
        // const moduleKey = module.permission; // Removed duplicate

        return (
            permissions.includes(moduleKey) ||
            permissions.includes(`${moduleKey}.view`) ||
            permissions.includes(`${moduleKey}.edit`)
        );
    };

    const canAccessModule = (permissionKey: string) => {
        return hasPermission({
            key: permissionKey,
            title: '',
            href: '',
            icon: () => null,
            permission: permissionKey,
        } as any);
    };

    useEffect(() => {
        try {
            const stored = localStorage.getItem(RECENT_MODULES_KEY);
            if (stored) {
                const keys: string[] = JSON.parse(stored);
                const modules = keys
                    .map((key) => MODULES.find((m) => m.key === key))
                    .filter(
                        (m): m is ModuleDefinition => !!m && hasPermission(m),
                    );
                setRecent(modules);
            }
        } catch (e) {
            console.error('Error loading recent modules', e);
        }
    }, [auth.user]);

    const calculateDaysRemaining = (dateStr: string) => {
        const today = new Date();
        const target = new Date(dateStr);
        const diffTime = target.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const canSeeCriticalStock =
        ['admin', 'comandante', 'mechanic'].includes(auth.user?.role || '') ||
        (auth.user?.role === 'inspector' &&
            (auth.user?.department || '').trim() === 'Material Mayor');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Intranet - CBPA" />
            {/* Header de Bienvenida Minimalista */}
            <div className="mx-4 sm:mx-6 my-4 sm:my-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        Bienvenido, {auth.user?.name || 'Voluntario'}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {auth.user?.company ? `${auth.user.company} • ` : ''}
                        {auth.user?.role ? `${auth.user.role.toUpperCase()} • ` : ''}
                        Intranet Institucional del Cuerpo de Bomberos de Puente Alto
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 px-4 sm:px-6 md:grid-cols-2">
                {/* Critical Stock Alert */}
                {canSeeCriticalStock && criticalStockItems && criticalStockItems.length > 0 && (
                    <div className="rounded-2xl border border-destructive/30 bg-card p-5 sm:p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-destructive/10 p-2 text-destructive">
                                    <AlertCircle className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                                        Stock Crítico en Taller
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Ítems con stock bajo o nulo
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                                {criticalStockItems.length} alerta{criticalStockItems.length > 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {criticalStockItems.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-muted/40"
                                >
                                    <span className="font-medium text-sm text-foreground">
                                        {item.name}
                                    </span>
                                    <span className="rounded-md bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
                                        Stock: {item.stock} / Mín: {item.min_stock}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Petty Cash Pending (Inspector/Comandante) */}
                {canAccessModule('vehicles.renditions') && pendingPettyCash.length > 0 && (
                    <div className="rounded-2xl border border-blue-500/30 bg-card p-5 sm:p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                                    <Receipt className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                                        Rendiciones Pendientes
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Rendiciones pendientes de revisión o validación
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                                {pendingPettyCash.length}
                            </span>
                        </div>
                        <div className="space-y-2.5">
                            {pendingPettyCash.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/vehicles/renditions/${item.id}`}
                                    className="block group"
                                >
                                    <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-3.5 transition-all hover:bg-muted/40 hover:border-border active:scale-[0.99] sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                                {item.user.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                {item.description || 'Sin descripción'}
                                            </p>
                                        </div>
                                        <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-1">
                                            <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                                                {new Intl.NumberFormat(
                                                    'es-CL',
                                                    {
                                                        style: 'currency',
                                                        currency: 'CLP',
                                                    },
                                                ).format(item.amount)}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground">
                                                {formatDate(item.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pending Checklists Widget */}
                {canAccessModule('vehicles.checklist') && pendingChecklists.length > 0 && (
                    <div className="rounded-2xl border border-cyan-500/30 bg-card p-5 sm:p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-600 dark:text-cyan-400">
                                    <CheckCircle2 className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                                        Checklists Pendientes
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Revisiones de material mayor pendientes de firma
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                                {pendingChecklists.length}
                            </span>
                        </div>
                        <div className="space-y-2.5">
                            {pendingChecklists.map((checklist: any) => (
                                <Link
                                    key={checklist.id}
                                    href={`/vehicles/checklists/${checklist.id}`}
                                    className="block group"
                                >
                                    <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-3.5 transition-all hover:bg-muted/40 hover:border-border active:scale-[0.99] sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                                {checklist.vehicle.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Realizado por: {checklist.user.name}
                                            </p>
                                        </div>
                                        <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-1">
                                            <span className="rounded-md bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                                                Revisar
                                            </span>
                                            <span className="text-[11px] text-muted-foreground">
                                                {formatDate(checklist.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tickets Pendientes (Comandancia) */}
                {isModuleEnabled('tickets') && canAccessModule('tickets') && pendingTickets.length > 0 && (
                    <div className="rounded-2xl border border-amber-500/30 bg-card p-5 sm:p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                                    <TicketIcon className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                                        Tickets Pendientes
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Solicitudes que requieren atención
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                {pendingTickets.length}
                            </span>
                        </div>
                        <div className="space-y-2.5">
                            {pendingTickets.map((ticket) => (
                                <Link
                                    key={ticket.id}
                                    href={`/tickets/${ticket.id}`}
                                    className="block group"
                                >
                                    <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-3.5 transition-all hover:bg-muted/40 hover:border-border active:scale-[0.99] sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                                {ticket.subject}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {ticket.user.company} • {ticket.user.name}
                                            </p>
                                        </div>
                                        <div className="font-mono text-xs text-muted-foreground">
                                            {formatDate(ticket.created_at)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tickets Respondidos (Compañías) */}
                {isModuleEnabled('tickets') && canAccessModule('tickets') && respondedTickets.length > 0 && (
                    <div className="rounded-2xl border border-blue-500/30 bg-card p-5 sm:p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                                    <TicketIcon className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                                        Tickets en Proceso
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Solicitudes con respuesta de Comandancia
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                                {respondedTickets.length}
                            </span>
                        </div>
                        <div className="space-y-2.5">
                            {respondedTickets.map((ticket) => (
                                <Link
                                    key={ticket.id}
                                    href={`/tickets/${ticket.id}`}
                                    className="block group"
                                >
                                    <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-3.5 transition-all hover:bg-muted/40 hover:border-border active:scale-[0.99] sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                                {ticket.subject}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Estado: {ticket.status}
                                            </p>
                                        </div>
                                        <div className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                                            Ver Respuesta
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Material Mayor Widgets */}
                {canAccessModule('vehicles.status') && vehiclesStopped.length > 0 && (
                    <div className="rounded-2xl border border-destructive/30 bg-card p-5 sm:p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-destructive/10 p-2 text-destructive">
                                    <Truck className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                                        Material Fuera de Servicio
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Vehículos detenidos o en taller
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                                {vehiclesStopped.length}
                            </span>
                        </div>
                        <div className="space-y-2.5">
                            {vehiclesStopped.map((vehicle) => (
                                <Link
                                    key={vehicle.id}
                                    href={`/vehicles/status/${vehicle.id}`}
                                    className="block group"
                                >
                                    <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-3.5 transition-all hover:bg-muted/40 hover:border-border active:scale-[0.99] sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                                                {vehicle.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {vehicle.company}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                                                vehicle.status === 'Out of Service'
                                                    ? 'bg-destructive/10 text-destructive'
                                                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                                            }`}
                                        >
                                            {vehicle.status === 'Out of Service'
                                                ? 'Fuera de Servicio'
                                                : 'En Taller'}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {canAccessModule('vehicles.incidents') && pendingIncidents.length > 0 && (
                    <div className="rounded-2xl border border-amber-500/30 bg-card p-5 sm:p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                                    <AlertTriangle className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                                        Incidencias Pendientes
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Novedades reportadas sin resolver
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                {pendingIncidents.length}
                            </span>
                        </div>
                        <div className="space-y-2.5">
                            {pendingIncidents.map((incident) => (
                                <Link
                                    key={incident.id}
                                    href={`/vehicles/incidents/${incident.id}`}
                                    className="block group"
                                >
                                    <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-3.5 transition-all hover:bg-muted/40 hover:border-border active:scale-[0.99] sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="line-clamp-1 font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                                {incident.vehicle.name} • {incident.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Reportado: {formatDate(incident.created_at)}
                                            </p>
                                        </div>
                                        <span className="rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                                            {incident.severity}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Documentos por Vencer */}
                {expiringDocuments.length > 0 &&
                    (auth.user.role === 'admin' ||
                        auth.user.role === 'capitan' ||
                        auth.user.role === 'maquinista' ||
                        auth.user.role === 'comandante' ||
                        auth.user.role === 'cuartelero' ||
                        (auth.user.role === 'inspector' &&
                            auth.user.department === 'Material Mayor')) && (
                        <div className="rounded-2xl border border-destructive/30 bg-card p-5 sm:p-6 shadow-xs">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-destructive/10 p-2 text-destructive">
                                        <ShieldAlert className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                                            Vencimiento de Documentación
                                        </h2>
                                        <p className="text-xs text-muted-foreground">
                                            Vehículos con documentación próxima a vencer o vencida
                                        </p>
                                    </div>
                                </div>
                                <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                                    {expiringDocuments.length}
                                </span>
                            </div>
                            <div className="space-y-2.5">
                                {expiringDocuments
                                    .slice(0, showAllExpires ? undefined : 5)
                                    .map((vehicle) => (
                                        <Link
                                            key={vehicle.id}
                                            href={`/vehicles/status/${vehicle.id}`}
                                            className="block group"
                                        >
                                            <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-3.5 transition-all hover:bg-muted/40 hover:border-border active:scale-[0.99]">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                                                        {vehicle.name}
                                                    </p>
                                                    <span className="text-xs text-muted-foreground">
                                                        {vehicle.company}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1.5 pt-1">
                                                    {vehicle.alerts.map(
                                                        (alert, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center justify-between text-xs"
                                                            >
                                                                <span className="text-muted-foreground">
                                                                    {alert.label}
                                                                </span>
                                                                <span
                                                                    className={`font-semibold rounded px-1.5 py-0.5 ${
                                                                        alert.status === 'danger'
                                                                            ? 'bg-destructive/10 text-destructive'
                                                                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                                                                    }`}
                                                                >
                                                                    {alert.date} ({alert.days} días)
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                            {expiringDocuments.length > 5 && (
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() =>
                                            setShowAllExpires(!showAllExpires)
                                        }
                                        className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                                    >
                                        {showAllExpires
                                            ? 'Ver menos'
                                            : `Ver más (${expiringDocuments.length - 5} restantes)`}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                {/* Specific Workshop Widget with Order Details */}
                {canAccessModule('vehicles.workshop') && vehiclesInWorkshop.length > 0 && (
                    <div className="rounded-2xl border border-amber-500/30 bg-card p-5 sm:p-6 shadow-xs">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                                    <Wrench className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                                        Unidades en Taller
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Vehículos con orden de trabajo activa
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                {vehiclesInWorkshop.length}
                            </span>
                        </div>
                        <div className="space-y-2.5">
                            {vehiclesInWorkshop.map((vehicle) => {
                                const maintenance = vehicle.maintenances?.[0];
                                return (
                                    <Link
                                        key={vehicle.id}
                                        href={
                                            maintenance
                                                ? `/vehicles/workshop/${maintenance.id}`
                                                : `/vehicles/status/${vehicle.id}`
                                        }
                                        className="block group"
                                    >
                                        <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 p-3.5 transition-all hover:bg-muted/40 hover:border-border active:scale-[0.99] sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                                                        {vehicle.name}
                                                    </p>
                                                    <span className="text-xs text-muted-foreground">
                                                        ({vehicle.company})
                                                    </span>
                                                </div>
                                                {maintenance ? (
                                                    <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mt-0.5">
                                                        {maintenance.workshop_name} - {maintenance.description}
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        Sin detalles de orden.
                                                    </p>
                                                )}
                                            </div>
                                            {maintenance?.entry_date && (
                                                <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                                                    Ingreso: {formatDate(maintenance.entry_date)}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {isModuleEnabled('batteries') && canAccessModule('batteries') && upcomingBatteries.length > 0 && (
                <div className="mx-4 sm:mx-6 my-4 sm:my-6 rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                            <Battery className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                                Próximos Cambios de Baterías
                            </h2>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Equipos que requieren reemplazo próximo de baterías
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-border/50">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/60 bg-muted/30 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">Días</th>
                                    <th className="px-4 py-3">Equipo</th>
                                    <th className="px-4 py-3">Responsable</th>
                                    <th className="px-4 py-3">Compañía</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {upcomingBatteries.map((battery) => {
                                    const days = calculateDaysRemaining(
                                        battery.next_change_date,
                                    );
                                    return (
                                        <tr key={battery.id} className="transition-colors hover:bg-muted/20">
                                            <td className="px-4 py-3 font-mono text-xs">
                                                {formatDate(battery.next_change_date)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                                                        days <= 3
                                                            ? 'bg-destructive/10 text-destructive'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {days} días
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                {battery.equipment_type}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {battery.responsible_name}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {battery.company}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {recent.length > 0 && (
                <div className="space-y-3 px-4 sm:px-6 my-4 sm:my-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="size-4 text-primary" />
                        <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Visitados Recientemente
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {recent.map((module) => {
                            const Icon = module.icon;
                            return (
                                <Link
                                    key={module.key}
                                    href={module.href}
                                    className="group relative flex items-center gap-3.5 overflow-hidden rounded-xl border border-border/70 bg-card p-4 shadow-xs transition-all hover:border-primary/50 hover:shadow-sm active:scale-[0.99]"
                                >
                                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <Icon className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                            {module.title}
                                        </h3>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="my-6 space-y-4 px-4 sm:px-6">
                <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Todos los Módulos
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {MODULES.filter((m) => !m.key.startsWith('admin-')).map(
                        (module) => {
                            if (!hasPermission(module)) return null;

                            const Icon = module.icon;
                            return (
                                <Link
                                    key={module.key}
                                    href={module.href}
                                    className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs transition-all hover:border-primary/50 hover:shadow-sm active:scale-[0.99]"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-xl bg-primary/10 p-3 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-xs shrink-0">
                                            <Icon className="size-6" />
                                        </div>
                                        <div className="space-y-1 min-w-0">
                                            <h3 className="text-base font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                                                {module.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                                {module.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        },
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
