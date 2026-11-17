import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Download,
    ExternalLink,
    Fuel,
    Gauge,
    Hash,
    MapPin,
    Receipt,
    Route,
    Truck,
    User as UserIcon,
} from 'lucide-react';

interface Vehicle {
    id: number;
    name: string;
    company: string;
}

interface Log {
    id: number;
    vehicle: Vehicle;
    driver: { name: string };
    start_km: number;
    end_km: number | null;
    activity_type: string;
    destination: string;
    movement_key: string | null;
    date: string;
    departure_time: string;
    arrival_time: string;
    fuel_liters: number | null;
    fuel_coupon: string | null;
    receipt_path: string | null;
    observations: string | null;
}

export default function VehicleLogShow({ log }: { log: Log }) {
    const traveledKm = log.end_km && log.start_km ? log.end_km - log.start_km : null;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Bitácora', href: '/vehicles/logs' },
                { title: `Movimiento #${log.id}`, href: `/vehicles/logs/${log.id}` },
            ]}
        >
            <Head title={`Detalle Bitácora #${log.id}`} />

            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
                {/* Back button */}
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-foreground"
                        asChild
                    >
                        <Link href="/vehicles/logs">
                            <ArrowLeft className="size-4" />
                            <span>Volver a la bitácora</span>
                        </Link>
                    </Button>
                </div>

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Registro de Movimiento #{log.id}
                            </h1>
                            <Badge
                                variant="outline"
                                className="border-primary/30 bg-primary/10 text-primary font-semibold text-xs"
                            >
                                {log.activity_type}
                            </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                            Unidad <span className="font-semibold text-foreground">{log.vehicle.name}</span> ({log.vehicle.company}) — Realizado el{' '}
                            {formatDate(log.date)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Movement Details */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card className="rounded-2xl border border-border/70 shadow-xs">
                            <CardHeader className="pb-3 pt-5 px-5 sm:px-6">
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                                    <Route className="size-4 text-primary" />
                                    <span>Información del Trayecto</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-5 p-5 sm:p-6 sm:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                            <Calendar className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                Fecha de Salida
                                            </p>
                                            <p className="text-sm font-semibold text-foreground">
                                                {formatDate(log.date)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                            <Clock className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                Horario
                                            </p>
                                            <p className="text-sm font-semibold text-foreground">
                                                {log.departure_time || '--:--'} — {log.arrival_time || '--:--'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                            <UserIcon className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                Maquinista / Conductor
                                            </p>
                                            <p className="text-sm font-semibold text-foreground">
                                                {log.driver?.name || 'No especificado'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                            <MapPin className="size-4" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                Destino
                                            </p>
                                            <p className="text-sm font-semibold text-foreground">
                                                {log.destination}
                                            </p>
                                        </div>
                                    </div>

                                    {log.movement_key && (
                                        <div className="flex items-start gap-3">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                                <Hash className="size-4" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Clave Radial
                                                </p>
                                                <p className="text-sm font-mono font-bold text-primary">
                                                    {log.movement_key}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 rounded-xl border border-border/60 bg-muted/15 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Gauge className="size-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                                Kilometraje
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Inicial:{' '}
                                                <span className="font-semibold text-foreground font-mono">
                                                    {log.start_km.toLocaleString('es-CL')} km
                                                </span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Final:{' '}
                                                <span className="font-semibold text-foreground font-mono">
                                                    {log.end_km
                                                        ? `${log.end_km.toLocaleString('es-CL')} km`
                                                        : 'En recorrido'}
                                                </span>
                                            </p>

                                            {traveledKm !== null && (
                                                <div className="pt-2">
                                                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                                        Recorrido: {traveledKm.toLocaleString('es-CL')} km
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {log.observations && (
                            <Card className="rounded-2xl border border-border/70 shadow-xs">
                                <CardHeader className="pb-2 pt-5 px-5 sm:px-6">
                                    <CardTitle className="text-sm font-semibold uppercase tracking-wider text-foreground">
                                        Observaciones de la Bitácora
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-5 pb-5 sm:px-6">
                                    <p className="rounded-xl border border-border/60 bg-muted/20 p-4 text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap italic">
                                        "{log.observations}"
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Fuel Card */}
                    <div className="space-y-6">
                        <Card className="rounded-2xl border border-border/70 shadow-xs">
                            <CardHeader className="pb-3 pt-5 px-5 sm:px-6">
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                                    <Fuel className="size-4 text-primary" />
                                    <span>Carga de Combustible</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 px-5 pb-5 sm:px-6">
                                <div className="rounded-xl border border-border/60 bg-muted/15 p-4 space-y-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Litros Cargados
                                    </p>
                                    <p className="text-2xl font-bold text-foreground font-mono">
                                        {log.fuel_liters ? `${log.fuel_liters} L` : 'Sin carga'}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Nº Cupón / Vale
                                    </p>
                                    <p className="text-sm font-mono font-semibold text-foreground">
                                        {log.fuel_coupon || 'No registrado'}
                                    </p>
                                </div>

                                {log.receipt_path && (
                                    <div className="space-y-3 pt-2 border-t border-border/50">
                                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                            Comprobante Digital
                                        </p>
                                        <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs">
                                            {log.receipt_path.toLowerCase().endsWith('.pdf') ? (
                                                <div className="flex h-32 flex-col items-center justify-center bg-muted/30 text-muted-foreground p-3 text-center">
                                                    <Download className="mb-2 size-6 text-primary opacity-75" />
                                                    <span className="text-xs font-medium">Documento PDF</span>
                                                </div>
                                            ) : (
                                                <img
                                                    src={`/storage/${log.receipt_path}`}
                                                    alt="Boleta de carga"
                                                    className="aspect-square h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                />
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition duration-200 group-hover:opacity-100 backdrop-blur-xs">
                                                <Button size="sm" variant="secondary" asChild className="gap-1.5 shadow-xs">
                                                    <a
                                                        href={`/storage/${log.receipt_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="size-3.5" />
                                                        <span>Ver</span>
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>

                                        <Button className="w-full gap-2 shadow-xs" variant="outline" size="sm" asChild>
                                            <a
                                                href={`/storage/${log.receipt_path}`}
                                                download={`boleta_carga_${log.id}`}
                                            >
                                                <Download className="size-4" />
                                                <span>Descargar Boleta</span>
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}