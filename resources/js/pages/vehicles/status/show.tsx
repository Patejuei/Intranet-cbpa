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
import { Label } from '@/components/ui/label';
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
    FileText,
    Wrench,
} from 'lucide-react';

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
    const activeIssue = vehicle.issues?.[0];
    const activeMaintenance = vehicle.maintenances?.[0];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Operative':
                return 'bg-green-100 text-green-800';
            case 'Workshop':
                return 'bg-yellow-100 text-yellow-800';
            case 'Out of Service':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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

    const {
        data: docData,
        setData: setDocData,
        patch: patchDocs,
        processing: processingDocs,
        errors: docErrors,
    } = useForm({
        technical_review_expires_at: vehicle.technical_review_expires_at || '',
        circulation_permit_expires_at:
            vehicle.circulation_permit_expires_at || '',
        insurance_expires_at: vehicle.insurance_expires_at || '',
    });

    const submitDocuments = (e: React.FormEvent) => {
        e.preventDefault();
        patchDocs(`/vehicles/${vehicle.id}/documents`, {
            onSuccess: () => {
                // optional toast or close dialog logic if handled manually
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
                                <Badge
                                    className={getStatusColor(vehicle.status)}
                                >
                                    {vehicle.status === 'Operative'
                                        ? 'En Servicio'
                                        : vehicle.status === 'Workshop'
                                          ? 'En Taller'
                                          : 'Fuera de Servicio'}
                                </Badge>
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
                        {allProps.auth?.user &&
                            (allProps.auth.user.role === 'admin' ||
                                allProps.auth.user.role === 'capitan') && (
                                <Button asChild>
                                    <Link href={`/vehicles/${vehicle.id}/edit`}>
                                        <Wrench className="mr-2 h-4 w-4" />
                                        Editar Unidad
                                    </Link>
                                </Button>
                            )}
                        {allProps.auth?.user &&
                            (allProps.auth.user.role === 'admin' ||
                                allProps.auth.user.role === 'capitan' ||
                                ((allProps.auth.user as any).permissions &&
                                    (
                                        allProps.auth.user as any
                                    ).permissions.includes(
                                        'vehicles.edit',
                                    ))) && (
                                <Dialog>
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
                                                Modifique las fechas de
                                                vencimiento de los documentos
                                                del vehículo.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={submitDocuments}>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="technical_review">
                                                        Revisión Técnica
                                                    </Label>
                                                    <Input
                                                        id="technical_review"
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
                                                        id="circulation_permit"
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
                                                        id="insurance"
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
                    </div>
                </div>

                {/* Document Alerts */}
                {documents.some(
                    (d) =>
                        d.check?.status === 'expired' ||
                        d.check?.status === 'warning',
                ) && (
                    <div className="grid gap-4 md:grid-cols-3">
                        {documents.map((doc, idx) => {
                            if (!doc.check || doc.check.status === 'ok')
                                return null;
                            return (
                                <Card
                                    key={idx}
                                    className={`border-l-4 ${doc.check.status === 'expired' ? 'border-l-red-500 bg-red-50' : 'border-l-yellow-500 bg-yellow-50'}`}
                                >
                                    <CardContent className="pt-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle
                                                className={`h-5 w-5 ${doc.check.status === 'expired' ? 'text-red-600' : 'text-yellow-600'}`}
                                            />
                                            <div>
                                                <p
                                                    className={`font-semibold ${doc.check.status === 'expired' ? 'text-red-700' : 'text-yellow-700'}`}
                                                >
                                                    {doc.label}{' '}
                                                    {doc.check.status ===
                                                    'expired'
                                                        ? 'Vencido'
                                                        : 'Por Vencer'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Vence:{' '}
                                                    {formatDate(doc.date!)}{' '}
                                                    <span className="font-medium">
                                                        (
                                                        {Math.abs(
                                                            doc.check.days,
                                                        )}{' '}
                                                        días{' '}
                                                        {doc.check.status ===
                                                        'expired'
                                                            ? 'atrasado'
                                                            : 'restantes'}
                                                        )
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Main Info */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Información del Vehículo</CardTitle>
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
                                    <div className="mt-4 rounded-md bg-blue-50 p-4">
                                        <div className="mb-1 flex items-center gap-2 text-blue-800">
                                            <DollarSign className="h-5 w-5" />
                                            <span className="font-bold">
                                                Inversión Total en Mantenimiento
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-900">
                                            $
                                            {(
                                                totalMaintenanceCost || 0
                                            ).toLocaleString('es-CL')}
                                        </p>
                                        <p className="mt-1 text-xs text-blue-700">
                                            Suma histórica de todas los trabajos
                                            realizados.
                                        </p>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {/* Status Details Widget */}
                    <div className="space-y-6">
                        {vehicle.status === 'Operative' && (
                            <Card className="border-green-200 bg-green-50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-green-800">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Unidad Operativa
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-green-700">
                                        La unidad se encuentra operativa y
                                        disponible para el servicio.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {vehicle.status === 'Out of Service' && activeIssue && (
                            <Card className="border-red-200 bg-red-50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-red-800">
                                        <AlertCircle className="h-5 w-5" />
                                        Fuera de Servicio
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-sm font-medium text-red-900">
                                        Motivo:
                                    </p>
                                    <p className="text-sm text-red-800">
                                        {activeIssue.description}
                                    </p>
                                    <div className="mt-2 flex gap-2 text-xs text-red-700">
                                        <Calendar className="h-3 w-3" />{' '}
                                        {activeIssue.date
                                            ? formatDate(activeIssue.date)
                                            : formatDate(
                                                  activeIssue.created_at,
                                              )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {(vehicle.status === 'Workshop' ||
                            (vehicle.status === 'Out of Service' &&
                                !activeIssue &&
                                activeMaintenance)) &&
                            (activeMaintenance ? (
                                <Card className="border-yellow-200 bg-yellow-50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2 text-yellow-800">
                                            <Wrench className="h-5 w-5" />
                                            En Taller (
                                            {activeMaintenance.status ===
                                            'Scheduled'
                                                ? 'Agendado'
                                                : 'En Proceso'}
                                            )
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm font-semibold text-yellow-900">
                                                {
                                                    activeMaintenance.workshop_name
                                                }
                                            </p>
                                            <p className="text-sm text-yellow-800">
                                                {activeMaintenance.description}
                                            </p>
                                            <div className="mt-1 flex gap-2 text-xs text-yellow-700">
                                                <Calendar className="h-3 w-3" />{' '}
                                                Ingreso:{' '}
                                                {formatDate(
                                                    activeMaintenance.entry_date,
                                                )}
                                            </div>
                                        </div>

                                        {/* Tasks List */}
                                        {activeMaintenance.tasks &&
                                            activeMaintenance.tasks.length >
                                                0 && (
                                                <div className="rounded-md bg-white/50 p-3">
                                                    <h4 className="mb-2 text-xs font-bold tracking-wider text-yellow-900 uppercase">
                                                        Tareas
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {activeMaintenance.tasks.map(
                                                            (task) => (
                                                                <div
                                                                    key={
                                                                        task.id
                                                                    }
                                                                    className="flex items-start gap-2 text-sm"
                                                                >
                                                                    {task.is_completed ? (
                                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
                                                                    ) : (
                                                                        <div className="mt-0.5 h-4 w-4 rounded-full border-2 border-slate-300" />
                                                                    )}
                                                                    <span
                                                                        className={
                                                                            task.is_completed
                                                                                ? 'text-slate-700 line-through opacity-70'
                                                                                : 'font-medium text-slate-800'
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
                                                <div className="rounded-md bg-white/50 p-3">
                                                    <h4 className="mb-2 text-xs font-bold tracking-wider text-yellow-900 uppercase">
                                                        Incidencias Asociadas
                                                    </h4>
                                                    <ul className="list-disc pl-4 text-sm text-slate-700">
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
                                                                        <span className="ml-2 text-xs font-bold text-green-600">
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
                                <Card className="border-yellow-200 bg-yellow-50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2 text-yellow-800">
                                            <Wrench className="h-5 w-5" />
                                            En Taller
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-yellow-800">
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
                        <CardHeader>
                            <CardTitle>
                                Historial de Órdenes de Trabajo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b bg-muted/50">
                                        <tr>
                                            <th className="p-2 py-3 font-medium">
                                                Fecha Ingreso
                                            </th>
                                            <th className="p-2 py-3 font-medium">
                                                Taller
                                            </th>
                                            <th className="p-2 py-3 font-medium">
                                                Trabajo
                                            </th>
                                            <th className="p-2 py-3 font-medium">
                                                Estado
                                            </th>
                                            <th className="p-2 py-3 text-right font-medium">
                                                Costo
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicle.maintenances.map((m) => (
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
                                                <td className="p-2 py-3 text-right">
                                                    {m.cost > 0
                                                        ? `$${m.cost.toLocaleString('es-CL')}`
                                                        : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
