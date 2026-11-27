import { SortableTableHead } from '@/components/SortableTableHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { useClientTableFilter } from '@/hooks/use-client-table-filter';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    ClipboardList,
    DollarSign,
    Eye,
    FileText,
    RotateCcw,
    Wrench,
    FileDown,
} from 'lucide-react';
import { useState } from 'react';
import { ReportModal } from '@/components/report-modal';

interface Vehicle {
    id: number;
    name: string;
    make: string;
    model: string;
    year: number;
    plate: string;
    status: 'Operative' | 'Workshop' | 'Out of Service';
    company: string;
    technical_review_expires_at?: string;
    circulation_permit_expires_at?: string;
    insurance_expires_at?: string;
    coupon_number?: string | null;
    issues?: {
        id: number;
        description: string;
        status: string;
        date: string;
        created_at: string;
        severity: string;
    }[];
    maintenances?: {
        id: number;
        workshop_name: string;
        entry_date: string;
        exit_date: string | null;
        description: string;
        cost: number;
        status: string;
        tasks?: {
            id: number;
            description: string;
            is_completed: boolean;
            cost: number;
        }[];
        issues?: {
            id: number;
            description: string;
            status: string;
        }[];
    }[];
}

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            role: string;
            company: string;
        };
    };
    [key: string]: any;
}

export default function VehicleShow({
    vehicle,
    totalMaintenanceCost,
}: {
    vehicle: Vehicle;
    totalMaintenanceCost?: number;
}) {
    const allProps = usePage<PageProps>().props;
    const { canEdit } = usePermissions();
    const activeIssue = vehicle.issues?.[0];
    const activeMaintenance = vehicle.maintenances?.[0];

    const {
        filteredItems: filteredMaintenances,
        filters: maintFilters,
        setFilter: setMaintFilter,
        setSort: setMaintSort,
        clearFilters: clearMaintFilters,
        hasActiveFilters: hasActiveMaintFilters,
        getUniqueOptions: getMaintOptions,
    } = useClientTableFilter(vehicle.maintenances || [], {
        accessors: {
            entry_date: (m) => m.entry_date,
            workshop_name: (m) => m.workshop_name,
            description: (m) => m.description,
            status: (m) => m.status,
            cost: (m) => m.cost,
        },
        exactMatchColumns: ['status'],
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Operative':
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20';
            case 'Workshop':
                return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20';
            case 'Out of Service':
                return 'bg-destructive/10 text-destructive border border-destructive/20';
            default:
                return 'bg-muted text-muted-foreground border border-border/40';
        }
    };

    const checkExpiration = (dateStr?: string) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { status: 'expired', days: diffDays };
        if (diffDays <= 30) return { status: 'warning', days: diffDays };
        return { status: 'ok', days: diffDays };
        return { status: 'ok', days: diffDays };
    };

    const [docModalOpen, setDocModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [checklistReportModalOpen, setChecklistReportModalOpen] = useState(false);

    const formatDateForInput = (dateStr?: string) => {
        if (!dateStr) return '';
        return dateStr.split('T')[0];
    };

    const {
        data: docData,
        setData: setDocData,
        patch: patchDocs,
        processing: processingDocs,
        errors: docErrors,
        reset: resetDocs,
    } = useForm({
        technical_review_expires_at: formatDateForInput(
            vehicle.technical_review_expires_at,
        ),
        circulation_permit_expires_at: formatDateForInput(
            vehicle.circulation_permit_expires_at,
        ),
        insurance_expires_at: formatDateForInput(vehicle.insurance_expires_at),
    });

    const submitDocuments = (e: React.FormEvent) => {
        e.preventDefault();
        patchDocs(`/vehicles/${vehicle.id}/documents`, {
            onSuccess: () => {
                setDocModalOpen(false);
            },
        });
    };

    const documents = [
        {
            label: 'Revisión Técnica',
            date: vehicle.technical_review_expires_at,
            check: checkExpiration(vehicle.technical_review_expires_at),
        },
        {
            label: 'Permiso de Circulación',
            date: vehicle.circulation_permit_expires_at,
            check: checkExpiration(vehicle.circulation_permit_expires_at),
        },
        {
            label: 'Seguro Obligatorio',
            date: vehicle.insurance_expires_at,
            check: checkExpiration(vehicle.insurance_expires_at),
        },
    ];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Material Mayor', href: '/vehicles/status' },
                { title: vehicle.name, href: `/vehicles/status/${vehicle.id}` },
            ]}
        >
            <Head title={`Detalle ${vehicle.name}`} />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/vehicles/status">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="flex items-center gap-3 text-2xl font-bold">
                                {vehicle.name}
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shrink-0 ${getStatusColor(vehicle.status)}`}
                                >
                                    {vehicle.status === 'Operative'
                                        ? 'En Servicio'
                                        : vehicle.status === 'Workshop'
                                          ? 'En Taller'
                                          : 'Fuera de Servicio'}
                                </span>
                            </h1>
                            <p className="text-muted-foreground">
                                {vehicle.company} - {vehicle.make}{' '}
                                {vehicle.model}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link
                                href={`/vehicles/logs?vehicle_id=${vehicle.id}`}
                            >
                                <ClipboardList className="mr-2 h-4 w-4" />
                                Ver Bitácora
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link
                                href={`/vehicles/checklists?vehicle_id=${vehicle.id}`}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Ver Checklists
                            </Link>
                        </Button>
                        {/* Edit Button (Admin/Captain/Inspector with perms) */}
                        {allProps.auth?.user &&
                            (allProps.auth.user.role === 'admin' ||
                                allProps.auth.user.role === 'capitan' ||
                                canEdit('vehicles.status')) && (
                                <Button asChild>
                                    <Link href={`/vehicles/${vehicle.id}/edit`}>
                                        <Wrench className="mr-2 h-4 w-4" />
                                        Editar Unidad
                                    </Link>
                                </Button>
                            )}

                        {/* Documents Update Button (Permission Based) */}
                        {canEdit('vehicles.status') && (
                            <Dialog
                                open={docModalOpen}
                                onOpenChange={(open) => {
                                    setDocModalOpen(open);
                                    if (open) {
                                        setDocData({
                                            technical_review_expires_at:
                                                formatDateForInput(
                                                    vehicle.technical_review_expires_at,
                                                ),
                                            circulation_permit_expires_at:
                                                formatDateForInput(
                                                    vehicle.circulation_permit_expires_at,
                                                ),
                                            insurance_expires_at:
                                                formatDateForInput(
                                                    vehicle.insurance_expires_at,
                                                ),
                                        });
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="secondary">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Actualizar Vencimientos
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Actualizar Documentación
                                        </DialogTitle>
                                        <DialogDescription>
                                            Modifique las fechas de vencimiento
                                            de los documentos del vehículo.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={submitDocuments}>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="technical_review">
                                                    Revisión Técnica
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={
                                                        docData.technical_review_expires_at
                                                    }
                                                    onChange={(e) =>
                                                        setDocData(
                                                            'technical_review_expires_at',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {docErrors.technical_review_expires_at && (
                                                    <span className="text-sm text-destructive">
                                                        {
                                                            docErrors.technical_review_expires_at
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="circulation_permit">
                                                    Permiso de Circulación
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={
                                                        docData.circulation_permit_expires_at
                                                    }
                                                    onChange={(e) =>
                                                        setDocData(
                                                            'circulation_permit_expires_at',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {docErrors.circulation_permit_expires_at && (
                                                    <span className="text-sm text-destructive">
                                                        {
                                                            docErrors.circulation_permit_expires_at
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="insurance">
                                                    Seguro Obligatorio
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={
                                                        docData.insurance_expires_at
                                                    }
                                                    onChange={(e) =>
                                                        setDocData(
                                                            'insurance_expires_at',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {docErrors.insurance_expires_at && (
                                                    <span className="text-sm text-destructive">
                                                        {
                                                            docErrors.insurance_expires_at
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="submit"
                                                disabled={processingDocs}
                                            >
                                                Guardar Cambios
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Reportes
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setReportModalOpen(true)}>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Reporte Unidad
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setChecklistReportModalOpen(true)}>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Reporte Checklist
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Document Alerts - Opción 1: Superficie Semántica en Cards */}
                {documents.some(
                    (d) =>
                        d.check?.status === 'expired' ||
                        d.check?.status === 'warning',
                ) && (
                    <div className="grid gap-4 md:grid-cols-3">
                        {documents.map((doc, idx) => {
                            if (!doc.check || doc.check.status === 'ok')
                                return null;
                            const isExpired = doc.check.status === 'expired';
                            return (
                                <Card
                                    key={idx}
                                    className={`rounded-2xl border p-5 shadow-xs transition-all ${
                                        isExpired
                                            ? 'border-red-500/25 dark:border-red-500/35 bg-card hover:border-red-500/50'
                                            : 'border-amber-500/25 dark:border-amber-500/35 bg-card hover:border-amber-500/50'
                                    }`}
                                >
                                    <div className="flex items-start gap-3.5">
                                        <div
                                            className={`rounded-xl p-2.5 shrink-0 ${
                                                isExpired
                                                    ? 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                                                    : 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                            }`}
                                        >
                                            <AlertCircle className="size-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`text-sm font-semibold tracking-tight ${
                                                    isExpired
                                                        ? 'text-red-600 dark:text-red-400'
                                                        : 'text-amber-600 dark:text-amber-400'
                                                }`}
                                            >
                                                {doc.label}{' '}
                                                {isExpired ? 'Vencido' : 'Por Vencer'}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Vence: {formatDate(doc.date!)}
                                            </p>
                                            <div className="mt-2.5">
                                                <span
                                                    className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold font-mono border ${
                                                        isExpired
                                                            ? 'border-red-500/20 dark:border-red-500/35 bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                                                            : 'border-amber-500/20 dark:border-amber-500/35 bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                                                    }`}
                                                >
                                                    {Math.abs(doc.check.days)} días{' '}
                                                    {isExpired ? 'atrasado' : 'restantes'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Main Info */}
                    <Card className="md:col-span-2 rounded-2xl border border-border/70 bg-card shadow-xs">
                        <CardHeader className="border-b border-border/40 pb-3">
                            <CardTitle className="text-base font-semibold text-foreground">Información del Vehículo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Patente
                                    </label>
                                    <p className="text-lg font-semibold">
                                        {vehicle.plate}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Año
                                    </label>
                                    <p className="text-lg font-semibold">
                                        {vehicle.year}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Marca
                                    </label>
                                    <p className="text-lg font-semibold">
                                        {vehicle.make}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Modelo
                                    </label>
                                    <p className="text-lg font-semibold">
                                        {vehicle.model}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Cupón Combustible
                                    </label>
                                    <p className="text-lg font-semibold">
                                        {vehicle.coupon_number || 'No asignado'}
                                    </p>
                                </div>
                            </div>

                            <hr className="my-4" />
                            <h3 className="mb-2 font-medium">Documentación</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {documents.map((doc, idx) => (
                                    <div key={idx}>
                                        <label className="text-xs font-medium text-muted-foreground">
                                            {doc.label}
                                        </label>
                                        <p className="text-sm font-semibold">
                                            {doc.date
                                                ? formatDate(doc.date)
                                                : 'No registrado'}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Total Cost for Command */}
                            {allProps.auth?.user &&
                                (allProps.auth.user.company === 'Comandancia' ||
                                    allProps.auth.user.role === 'admin') && (
                                    <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5 shadow-xs">
                                        <div className="mb-1.5 flex items-center gap-2 text-primary">
                                            <DollarSign className="size-5" />
                                            <span className="font-semibold text-sm">
                                                Inversión Total en Mantenimiento
                                            </span>
                                        </div>
                                        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                            $
                                            {(
                                                totalMaintenanceCost || 0
                                            ).toLocaleString('es-CL')}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Suma histórica de todos los trabajos realizados.
                                        </p>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {/* Status Details Widget */}
                    <div className="space-y-6">
                        {vehicle.status === 'Operative' && (
                            <Card className="rounded-2xl border border-emerald-500/25 bg-card p-5 shadow-xs">
                                <CardHeader className="p-0 pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base font-bold text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 className="size-5 shrink-0" />
                                        Unidad Operativa
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        La unidad se encuentra operativa y disponible para el servicio.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {vehicle.status === 'Out of Service' && activeIssue && (
                            <Card className="rounded-2xl border border-red-500/25 dark:border-red-500/35 bg-card p-5 shadow-xs">
                                <CardHeader className="p-0 pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base font-bold text-red-600 dark:text-red-400">
                                        <AlertCircle className="size-5 shrink-0" />
                                        Fuera de Servicio
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Motivo:
                                    </p>
                                    <p className="text-sm text-foreground leading-relaxed">
                                        {activeIssue.description}
                                    </p>
                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar className="size-3.5" />
                                        <span>
                                            {activeIssue.date
                                                ? formatDate(activeIssue.date)
                                                : formatDate(
                                                      activeIssue.created_at,
                                                  )}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {(vehicle.status === 'Workshop' ||
                            (vehicle.status === 'Out of Service' &&
                                !activeIssue &&
                                activeMaintenance)) &&
                            (activeMaintenance ? (
                                <Card className="rounded-2xl border border-amber-500/25 bg-card p-5 shadow-xs">
                                    <CardHeader className="p-0 pb-3">
                                        <CardTitle className="flex items-center gap-2 text-base font-bold text-amber-600 dark:text-amber-400">
                                            <Wrench className="size-5 shrink-0" />
                                            En Taller (
                                            {activeMaintenance.status ===
                                            'Scheduled'
                                                ? 'Agendado'
                                                : 'En Proceso'}
                                            )
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 space-y-4">
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">
                                                {
                                                    activeMaintenance.workshop_name
                                                }
                                            </p>
                                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                                                {activeMaintenance.description}
                                            </p>
                                            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Calendar className="size-3.5" />
                                                <span>
                                                    Ingreso:{' '}
                                                    {formatDate(
                                                        activeMaintenance.entry_date,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Tasks List */}
                                        {activeMaintenance.tasks &&
                                            activeMaintenance.tasks.length >
                                                0 && (
                                                <div className="rounded-xl border border-border/50 bg-muted/20 p-3.5">
                                                    <h4 className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                        Tareas
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {activeMaintenance.tasks.map(
                                                            (task) => (
                                                                <div
                                                                    key={
                                                                        task.id
                                                                    }
                                                                    className="flex items-start gap-2 text-xs sm:text-sm"
                                                                >
                                                                    {task.is_completed ? (
                                                                        <CheckCircle2 className="mt-0.5 size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                                    ) : (
                                                                        <div className="mt-0.5 size-3.5 rounded-full border-2 border-border shrink-0" />
                                                                    )}
                                                                    <span
                                                                        className={
                                                                            task.is_completed
                                                                                ? 'text-muted-foreground line-through opacity-70'
                                                                                : 'font-medium text-foreground'
                                                                        }
                                                                    >
                                                                        {
                                                                            task.description
                                                                        }
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* Incidents Linked (Solved/Pending in this context) */}
                                        {activeMaintenance.issues &&
                                            activeMaintenance.issues.length >
                                                0 && (
                                                <div className="rounded-xl border border-border/50 bg-muted/20 p-3.5">
                                                    <h4 className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                                        Incidencias Asociadas
                                                    </h4>
                                                    <ul className="list-disc pl-4 text-xs sm:text-sm text-foreground space-y-1">
                                                        {activeMaintenance.issues.map(
                                                            (issue) => (
                                                                <li
                                                                    key={
                                                                        issue.id
                                                                    }
                                                                >
                                                                    {
                                                                        issue.description
                                                                    }
                                                                    {issue.status ===
                                                                        'Resolved' && (
                                                                        <span className="ml-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                                            (Solucionado)
                                                                        </span>
                                                                    )}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="rounded-2xl border border-amber-500/25 bg-card p-5 shadow-xs">
                                    <CardHeader className="p-0 pb-3">
                                        <CardTitle className="flex items-center gap-2 text-base font-bold text-amber-600 dark:text-amber-400">
                                            <Wrench className="size-5 shrink-0" />
                                            En Taller
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            No hay información detallada de la
                                            orden de trabajo.
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </div>

                {/* Maintenance History */}
                {vehicle.maintenances && vehicle.maintenances.length > 0 && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between gap-4">
                            <CardTitle>
                                Historial de Órdenes de Trabajo
                            </CardTitle>
                            {hasActiveMaintFilters && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearMaintFilters}
                                    className="gap-1.5 shrink-0"
                                >
                                    <RotateCcw className="size-3.5" />
                                    <span>Limpiar filtros</span>
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b bg-muted/50">
                                        <tr>
                                            <SortableTableHead
                                                column="entry_date"
                                                label="Fecha Ingreso"
                                                sortKey={maintFilters.sort}
                                                sortDirection={
                                                    maintFilters.direction
                                                }
                                                onSort={setMaintSort}
                                                filterType="text"
                                                filterValue={
                                                    maintFilters.entry_date
                                                }
                                                filterPlaceholder="YYYY-MM-DD..."
                                                onFilterChange={(val) =>
                                                    setMaintFilter(
                                                        'entry_date',
                                                        val,
                                                    )
                                                }
                                                className="p-2 py-3"
                                            />
                                            <SortableTableHead
                                                column="workshop_name"
                                                label="Taller"
                                                sortKey={maintFilters.sort}
                                                sortDirection={
                                                    maintFilters.direction
                                                }
                                                onSort={setMaintSort}
                                                filterType="text"
                                                filterValue={
                                                    maintFilters.workshop_name
                                                }
                                                filterPlaceholder="Filtrar taller..."
                                                onFilterChange={(val) =>
                                                    setMaintFilter(
                                                        'workshop_name',
                                                        val,
                                                    )
                                                }
                                                className="p-2 py-3"
                                            />
                                            <SortableTableHead
                                                column="description"
                                                label="Trabajo"
                                                sortKey={maintFilters.sort}
                                                sortDirection={
                                                    maintFilters.direction
                                                }
                                                onSort={setMaintSort}
                                                filterType="text"
                                                filterValue={
                                                    maintFilters.description
                                                }
                                                filterPlaceholder="Filtrar trabajo..."
                                                onFilterChange={(val) =>
                                                    setMaintFilter(
                                                        'description',
                                                        val,
                                                    )
                                                }
                                                className="p-2 py-3"
                                            />
                                            <SortableTableHead
                                                column="status"
                                                label="Estado"
                                                sortKey={maintFilters.sort}
                                                sortDirection={
                                                    maintFilters.direction
                                                }
                                                onSort={setMaintSort}
                                                filterType="select"
                                                filterValue={
                                                    maintFilters.status
                                                }
                                                filterOptions={getMaintOptions(
                                                    'status',
                                                )}
                                                onFilterChange={(val) =>
                                                    setMaintFilter(
                                                        'status',
                                                        val,
                                                    )
                                                }
                                                className="p-2 py-3"
                                            />
                                            {allProps.auth.user.company ===
                                                'Comandancia' && (
                                                <SortableTableHead
                                                    column="cost"
                                                    label="Costo"
                                                    sortKey={maintFilters.sort}
                                                    sortDirection={
                                                        maintFilters.direction
                                                    }
                                                    onSort={setMaintSort}
                                                    className="p-2 py-3"
                                                />
                                            )}
                                            {allProps.auth.user.role !==
                                                'cuartelero' && (
                                                <th className="p-2 py-3 font-medium">
                                                    Ver
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMaintenances.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="p-6 text-center text-muted-foreground"
                                                >
                                                    No se encontraron órdenes con los filtros aplicados.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredMaintenances.map((m) => (
                                            <tr
                                                key={m.id}
                                                className="border-b transition-colors hover:bg-muted/20"
                                            >
                                                <td className="p-2 py-3">
                                                    {formatDate(m.entry_date)}
                                                </td>
                                                <td className="p-2 py-3">
                                                    {m.workshop_name}
                                                </td>
                                                <td className="p-2 py-3">
                                                    {m.description}
                                                </td>
                                                <td className="p-2 py-3">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            [
                                                                'Finalizado',
                                                                'Entregado',
                                                            ].includes(m.status)
                                                                ? 'border-green-200 bg-green-50 text-green-700'
                                                                : 'border-yellow-200 bg-yellow-50 text-yellow-700'
                                                        }
                                                    >
                                                        {m.status}
                                                    </Badge>
                                                </td>
                                                {allProps.auth.user.company ===
                                                    'Comandancia' && (
                                                    <td className="p-2 py-3">
                                                        {m.cost > 0
                                                            ? `$${m.cost.toLocaleString('es-CL')}`
                                                            : '-'}
                                                    </td>
                                                )}
                                                {allProps.auth.user.role !==
                                                    'cuartelero' && (
                                                    <td className="p-2 py-3">
                                                        <Link
                                                            href={`/vehicles/workshop/${m.id}`}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="cursor-pointer"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                )}
                                            </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
            
            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                title={`Reporte de Unidad: ${vehicle.name}`}
                route={`/vehicles/${vehicle.id}/reports/vehicle`}
                type="pdf"
                includeOptions={[
                    { id: 'main_data', label: 'Datos Principales' },
                    { id: 'workshop', label: 'Trabajos en Taller' },
                    { id: 'investment', label: 'Inversión Total' },
                    { id: 'logs', label: 'Horas y Kilómetros' },
                    { id: 'exits', label: 'Estadísticas de Salidas' },
                    { id: 'drivers', label: 'Estadísticas de Conductores' },
                ]}
            />

            <ReportModal
                isOpen={checklistReportModalOpen}
                onClose={() => setChecklistReportModalOpen(false)}
                title={`Reporte de Checklist: ${vehicle.name}`}
                route={`/vehicles/${vehicle.id}/reports/checklist`}
                type="pdf"
                includeOptions={[
                    { id: 'summary', label: 'Resumen General' },
                    { id: 'status_stats', label: 'Estadísticas por Estado' },
                    { id: 'charts', label: 'Gráficos de Problemas (Ítems)' },
                    { id: 'history', label: 'Historial de Checklists' },
                ]}
            />
        </AppLayout>
    );
}
