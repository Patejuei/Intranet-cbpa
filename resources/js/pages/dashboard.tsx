import { MODULES, ModuleDefinition } from '@/constants/modules';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Battery, Clock } from 'lucide-react';
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
}: {
    upcomingBatteries?: UpcomingBattery[];
    pendingTickets?: Ticket[];
    respondedTickets?: Ticket[];
    vehiclesStopped?: any[]; // Typed loosely here or import from index.d.ts
    pendingIncidents?: any[];
    vehiclesInWorkshop?: any[];
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
}) {
    const [recent, setRecent] = useState<ModuleDefinition[]>([]);
    const [showAllExpires, setShowAllExpires] = useState(false);

    const { auth } = usePage<SharedData>().props;

    const hasPermission = (module: ModuleDefinition) => {
        const user = auth.user;
        if (!user) return false;

        // Admin, Comandante and Capitan see everything
        if (
            user.role === 'admin' ||
            user.role === 'capitan' ||
            user.role === 'comandante'
        ) {
            return true;
        }

        // Specific Roles check for vehicles
        if (
            module.permission === 'vehicles' &&
            ['cuartelero', 'mechanic'].includes(user.role || '')
        ) {
            return true;
        }

        // Inspector Role Logic
        if (user.role === 'inspector') {
            const dept = (user.department || '').trim();
            const moduleKey = module.permission;

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
        const moduleKey = module.permission;

        return (
            permissions.includes(moduleKey) ||
            permissions.includes(`${moduleKey}.view`) ||
            permissions.includes(`${moduleKey}.edit`)
        );
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Material Menor - CBPA" />
            <div className="flex flex-1 flex-col gap-8 p-4">
                {/* Tickets Pendientes (Comandancia) */}
                {pendingTickets.length > 0 && (
                    <div className="rounded-xl border border-l-4 border-l-yellow-500 bg-card p-6 shadow-sm">
                        <div className="mb-4">
                            <h2 className="flex items-center gap-2 text-xl font-bold">
                                <span className="flex size-3 rounded-full bg-yellow-500" />
                                Tickets Pendientes
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Solicitudes que requieren atención.
                            </p>
                        </div>
                        <div className="space-y-3">
                            {pendingTickets.map((ticket) => (
                                <Link
                                    key={ticket.id}
                                    href={`/tickets/${ticket.id}`}
                                    className="block"
                                >
                                    <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                                        <div>
                                            <p className="font-medium">
                                                {ticket.subject}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {ticket.user.company} -{' '}
                                                {ticket.user.name}
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
                {respondedTickets.length > 0 && (
                    <div className="rounded-xl border border-l-4 border-l-blue-500 bg-card p-6 shadow-sm">
                        <div className="mb-4">
                            <h2 className="flex items-center gap-2 text-xl font-bold">
                                <span className="flex size-3 rounded-full bg-blue-500" />
                                Tickets en Proceso
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Solicitudes con respuesta de Comandancia.
                            </p>
                        </div>
                        <div className="space-y-3">
                            {respondedTickets.map((ticket) => (
                                <Link
                                    key={ticket.id}
                                    href={`/tickets/${ticket.id}`}
                                    className="block"
                                >
                                    <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                                        <div>
                                            <p className="font-medium">
                                                {ticket.subject}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Estado: {ticket.status}
                                            </p>
                                        </div>
                                        <div className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                            Ver Respuesta
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Material Mayor Widgets */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {vehiclesStopped.length > 0 && (
                        <div className="rounded-xl border border-l-4 border-l-red-500 bg-card p-6 shadow-sm">
                            <div className="mb-4">
                                <h2 className="flex items-center gap-2 text-xl font-bold">
                                    <span className="flex size-3 rounded-full bg-red-500" />
                                    Material Fuera de Servicio
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Vehículos detenidos o en taller.
                                </p>
                            </div>
                            <div className="space-y-3">
                                {vehiclesStopped.map((vehicle) => (
                                    <Link
                                        key={vehicle.id}
                                        href={`/vehicles/status/${vehicle.id}`}
                                        className="block"
                                    >
                                        <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                                            <div>
                                                <p className="font-bold">
                                                    {vehicle.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {vehicle.company}
                                                </p>
                                            </div>
                                            <div
                                                className={`rounded px-2 py-1 text-xs font-medium ${vehicle.status === 'Out of Service' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}
                                            >
                                                {vehicle.status ===
                                                'Out of Service'
                                                    ? 'Fuera de Servicio'
                                                    : 'En Taller'}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {pendingIncidents.length > 0 && (
                        <div className="rounded-xl border border-l-4 border-l-orange-500 bg-card p-6 shadow-sm">
                            <div className="mb-4">
                                <h2 className="flex items-center gap-2 text-xl font-bold">
                                    <span className="flex size-3 rounded-full bg-orange-500" />
                                    Incidencias Pendientes
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Novedades reportadas sin resolver.
                                </p>
                            </div>
                            <div className="space-y-3">
                                {pendingIncidents.map((incident) => (
                                    <Link
                                        key={incident.id}
                                        href={`/vehicles/incidents`} // Ideally link to specific incident or filtered view
                                        className="block"
                                    >
                                        <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                                            <div>
                                                <p className="line-clamp-1 font-medium">
                                                    {incident.vehicle.name} -{' '}
                                                    {incident.description}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Reportado:{' '}
                                                    {formatDate(
                                                        incident.created_at,
                                                    )}
                                                </p>
                                            </div>
                                            <div className="rounded bg-orange-100 px-2 py-1 text-xs text-orange-700">
                                                {incident.severity}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Specific Workshop Widget with Order Details */}
                {vehiclesInWorkshop.length > 0 && (
                    <div className="rounded-xl border border-l-4 border-l-yellow-600 bg-card p-6 shadow-sm">
                        <div className="mb-4">
                            <h2 className="flex items-center gap-2 text-xl font-bold">
                                <span className="flex size-3 rounded-full bg-yellow-600" />
                                Unidades en Taller
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Vehículos con orden de trabajo activa.
                            </p>
                        </div>
                        <div className="space-y-3">
                            {vehiclesInWorkshop.map((vehicle) => {
                                const maintenance = vehicle.maintenances?.[0];
                                return (
                                    <Link
                                        key={vehicle.id}
                                        href={`/vehicles/status/${vehicle.id}`}
                                        className="block"
                                    >
                                        <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold">
                                                        {vehicle.name}
                                                    </p>
                                                    <span className="text-xs text-muted-foreground">
                                                        ({vehicle.company})
                                                    </span>
                                                </div>
                                                {maintenance ? (
                                                    <p className="text-xs font-medium text-yellow-700">
                                                        {
                                                            maintenance.workshop_name
                                                        }{' '}
                                                        -{' '}
                                                        {
                                                            maintenance.description
                                                        }
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">
                                                        Sin detalles de orden.
                                                    </p>
                                                )}
                                            </div>
                                            {maintenance?.entry_date && (
                                                <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                                                    Ingreso:{' '}
                                                    {formatDate(
                                                        maintenance.entry_date,
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Documentos por Vencer */}
                {expiringDocuments.length > 0 && (
                    <div className="rounded-xl border border-l-4 border-l-red-600 bg-card p-6 shadow-sm">
                        <div className="mb-4">
                            <h2 className="flex items-center gap-2 text-xl font-bold">
                                <span className="flex size-3 animate-pulse rounded-full bg-red-600" />
                                Vencimiento de Documentación
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Vehículos con documentación próxima a vencer o
                                vencida.
                            </p>
                        </div>
                        <div className="space-y-3">
                            {expiringDocuments
                                .slice(0, showAllExpires ? undefined : 5)
                                .map((vehicle) => (
                                    <Link
                                        key={vehicle.id}
                                        href={`/vehicles/status/${vehicle.id}`}
                                        className="block"
                                    >
                                        <div className="flex flex-col gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold">
                                                    {vehicle.name}
                                                </p>
                                                <span className="text-xs text-muted-foreground">
                                                    {vehicle.company}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                {vehicle.alerts.map(
                                                    (alert, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center justify-between text-sm"
                                                        >
                                                            <span>
                                                                {alert.label}
                                                            </span>
                                                            <span
                                                                className={`font-medium ${alert.status === 'danger' ? 'text-red-600' : 'text-orange-600'}`}
                                                            >
                                                                {alert.date} (
                                                                {alert.days}{' '}
                                                                días)
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
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    {showAllExpires
                                        ? 'Ver menos'
                                        : `Ver más (${expiringDocuments.length - 5} restantes)`}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {upcomingBatteries.length > 0 && (
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary">
                                <Battery className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">
                                    Próximos Cambios de Baterías
                                </h2>
                                <p className="text-muted-foreground">
                                    Equipos que requieren atención pronto
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left font-medium text-muted-foreground">
                                        <th className="pb-2">Fecha</th>
                                        <th className="pb-2">Días</th>
                                        <th className="pb-2">Equipo</th>
                                        <th className="pb-2">Responsable</th>
                                        <th className="pb-2">Compañía</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {upcomingBatteries.map((battery) => {
                                        const days = calculateDaysRemaining(
                                            battery.next_change_date,
                                        );
                                        return (
                                            <tr key={battery.id}>
                                                <td className="py-3">
                                                    {formatDate(
                                                        battery.next_change_date,
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    <span
                                                        className={`rounded px-2 py-1 font-bold ${
                                                            days <= 3
                                                                ? 'bg-destructive/20 text-destructive'
                                                                : 'bg-muted text-muted-foreground'
                                                        }`}
                                                    >
                                                        {days} días
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    {battery.equipment_type}
                                                </td>
                                                <td className="py-3">
                                                    {battery.responsible_name}
                                                </td>
                                                <td className="py-3">
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
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="size-4" />
                            <h2 className="text-sm font-medium tracking-wider uppercase">
                                Visitados Recientemente
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {recent.map((module) => {
                                const Icon = module.icon;
                                return (
                                    <Link
                                        key={module.key}
                                        href={module.href}
                                        className="group relative flex items-center gap-3 overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-md"
                                    >
                                        <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                            <Icon className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="leading-none font-medium">
                                                {module.title}
                                            </h3>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <h2 className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
                        Todos los Módulos
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {MODULES.filter((m) => !m.key.startsWith('admin-')).map(
                            (module) => {
                                if (!hasPermission(module)) return null;

                                const Icon = module.icon;
                                return (
                                    <Link
                                        key={module.key}
                                        href={module.href}
                                        className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                                <Icon className="size-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {module.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
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

                <div className="rounded-xl border bg-muted/40 p-6">
                    <h2 className="mb-2 text-xl font-semibold">
                        Bienvenido al Sistema de Material Menor
                    </h2>
                    <p className="text-muted-foreground">
                        Seleccione una opción de arriba para comenzar sus
                        operaciones.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
