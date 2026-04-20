import ActionOtpVerificationModal from '@/components/action-otp-verification-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useOtpAction } from '@/hooks/use-otp-action';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Eye,
    FileText,
    History,
    Megaphone,
    ShieldAlert,
    User as UserIcon,
    Wrench,
} from 'lucide-react';
import { useState } from 'react';

interface Vehicle {
    id: number;
    name: string;
    company: string;
}

interface Issue {
    id: number;
    vehicle: Vehicle;
    reporter: { name: string };
    reviewer?: { name: string };
    description: string;
    severity: string;
    is_stopped: boolean;
    status: string;
    date: string;
    created_at: string;
    reviewed_at?: string;
    sent_to_hq: boolean;
    sent_to_workshop: boolean;
    workshop_read_at?: string;
    hq_read_at?: string;
    reported_to_commander: boolean;
    commander_seen: boolean;
}

export default function VehicleIncidentShow({ incident }: { incident: Issue }) {
    const { auth } = usePage().props as any;
    const { isOtpModalOpen, performWithOtp, handleVerified, closeOtpModal } =
        useOtpAction();
    const [reviewOpen, setReviewOpen] = useState(false);

    const {
        data: reviewData,
        setData: setReviewData,
        put: putReview,
        processing: reviewProcessing,
        reset: resetReview,
    } = useForm({
        is_stopped: incident.is_stopped,
        sent_to_hq: incident.sent_to_hq,
        sent_to_workshop: incident.sent_to_workshop,
        reported_to_commander: incident.reported_to_commander,
        status: incident.status,
    });

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performWithOtp(() => {
            putReview(`/vehicles/incidents/${incident.id}`, {
                onSuccess: () => {
                    setReviewOpen(false);
                },
            });
        });
    };

    const markAsRead = () => {
        router.patch(
            `/vehicles/incidents/${incident.id}/mark-read`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical':
                return 'destructive';
            case 'High':
                return 'destructive';
            case 'Medium':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const canReview =
        auth.user.role === 'capitan' ||
        auth.user.role === 'comandante' ||
        auth.user.role === 'admin' ||
        auth.user.role === 'ayudante' ||
        (auth.user.role === 'inspector' &&
            auth.user.department === 'Material Mayor');

    const isWorkshop =
        auth.user.role === 'mechanic' || auth.user.role === 'admin';
    const isHQ =
        (auth.user.role === 'inspector' &&
            auth.user.department === 'Material Mayor') ||
        auth.user.role === 'admin';

    const showWorkshopRead =
        isWorkshop && incident.sent_to_workshop && !incident.workshop_read_at;
    const showHQRead = isHQ && incident.sent_to_hq && !incident.hq_read_at;
    const showCommanderRead =
        auth.user.role === 'comandante' &&
        incident.reported_to_commander &&
        !incident.commander_seen;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Incidencias', href: '/vehicles/incidents' },
                {
                    title: `Detalle #${incident.id}`,
                    href: `/vehicles/incidents/${incident.id}`,
                },
            ]}
        >
            <Head
                title={`Incidencia #${incident.id} - ${incident.vehicle.name}`}
            />
            <div className="flex h-full flex-col gap-6 p-4 lg:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="rounded-full"
                        >
                            <Link href="/vehicles/incidents">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">
                                    Incidencia #{incident.id}
                                </h1>
                                <Badge
                                    variant={
                                        getSeverityColor(
                                            incident.severity,
                                        ) as any
                                    }
                                >
                                    {incident.severity}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Reporte de la unidad{' '}
                                <span className="font-semibold text-foreground">
                                    {incident.vehicle.name}
                                </span>
                                .
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {canReview && (
                            <Button
                                onClick={() => setReviewOpen(true)}
                                className="bg-primary shadow-lg transition-all hover:scale-105"
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />{' '}
                                Revisar Novedad
                            </Button>
                        )}
                        {(showWorkshopRead ||
                            showHQRead ||
                            showCommanderRead) && (
                            <Button
                                variant="outline"
                                onClick={markAsRead}
                                className="border-primary text-primary hover:bg-primary/5"
                            >
                                <Eye className="mr-2 h-4 w-4" /> Marcar como
                                Visto
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card className="overflow-hidden border-none shadow-md ring-1 ring-border">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Detalle del Reporte
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-full bg-primary/10 p-2">
                                            <Calendar className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                Fecha Detección
                                            </p>
                                            <p className="text-lg font-semibold">
                                                {formatDate(incident.date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-full bg-primary/10 p-2">
                                            <UserIcon className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                Reportado Por
                                            </p>
                                            <p className="text-lg font-semibold">
                                                {incident.reporter?.name ||
                                                    'Sistema'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-full bg-primary/10 p-2">
                                            <History className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                Fecha Registro
                                            </p>
                                            <p className="font-medium text-muted-foreground">
                                                {formatDate(
                                                    incident.created_at,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="mb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                            Estado Actual
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {incident.is_stopped && (
                                                <Badge
                                                    variant="destructive"
                                                    className="px-3 py-1 text-xs tracking-tighter uppercase shadow-sm"
                                                >
                                                    FUERA DE SERVICIO
                                                </Badge>
                                            )}
                                            {incident.status === 'Resolved' && (
                                                <Badge className="border-green-500 bg-green-50 px-3 py-1 text-xs tracking-tighter text-green-700 uppercase shadow-sm hover:bg-green-100">
                                                    RESUELTO
                                                </Badge>
                                            )}
                                            {incident.status ===
                                                'En Taller' && (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-blue-100 px-3 py-1 text-xs tracking-tighter text-blue-700 uppercase shadow-sm hover:bg-blue-200"
                                                >
                                                    EN TALLER
                                                </Badge>
                                            )}
                                            {incident.status !== 'Resolved' &&
                                                incident.status !==
                                                    'En Taller' &&
                                                (!incident.reviewed_at ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-yellow-500 bg-yellow-50 px-3 py-1 text-xs tracking-tighter text-yellow-700 uppercase shadow-sm hover:bg-yellow-100"
                                                    >
                                                        PENDIENTE REVISIÓN
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-blue-500 bg-blue-50 px-3 py-1 text-xs tracking-tighter text-blue-700 uppercase shadow-sm hover:bg-blue-100"
                                                    >
                                                        REVISADO
                                                    </Badge>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-muted/30 p-4 ring-1 ring-border">
                                        <p className="mb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                            Descripción
                                        </p>
                                        <p className="text-sm leading-relaxed whitespace-pre-line">
                                            {incident.description}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {(incident.reviewed_at || incident.reviewer) && (
                            <Card className="overflow-hidden border-none shadow-md ring-1 ring-border">
                                <CardHeader className="bg-blue-50/50 dark:bg-blue-950/10">
                                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                        <ShieldAlert className="h-5 w-5" />
                                        Información de la Revisión
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                Revisado Por
                                            </p>
                                            <p className="font-semibold">
                                                {incident.reviewer?.name ||
                                                    'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                Fecha de Revisión
                                            </p>
                                            <p className="font-semibold">
                                                {incident.reviewed_at
                                                    ? formatDate(
                                                          incident.reviewed_at,
                                                      )
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                            Acciones Tomadas
                                        </p>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2 text-sm">
                                                <div
                                                    className={`size-2 rounded-full ${incident.sent_to_hq ? 'bg-green-500' : 'bg-muted'}`}
                                                />
                                                Reportado a Material Mayor
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <div
                                                    className={`size-2 rounded-full ${incident.sent_to_workshop ? 'bg-green-500' : 'bg-muted'}`}
                                                />
                                                Reportado a Taller Mecánico
                                            </li>
                                            <li className="flex items-center gap-2 text-sm">
                                                <div
                                                    className={`size-2 rounded-full ${incident.reported_to_commander ? 'bg-green-500' : 'bg-muted'}`}
                                                />
                                                Reportado a Comandancia
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card className="overflow-hidden border-none shadow-md ring-1 ring-border">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2">
                                    <Megaphone className="h-5 w-5 text-primary" />
                                    Notificaciones y Vistos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5 p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border-b pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">
                                                <History className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <span className="text-sm font-medium">
                                                Material Mayor
                                            </span>
                                        </div>
                                        {incident.sent_to_hq ? (
                                            incident.hq_read_at ? (
                                                <Badge
                                                    variant="outline"
                                                    className="border-green-200 bg-green-50 text-green-700"
                                                >
                                                    VISTO
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className="animate-pulse border-yellow-200 bg-yellow-50 text-yellow-700"
                                                >
                                                    ENVIADO
                                                </Badge>
                                            )
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">
                                                No aplica
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between border-b pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">
                                                <Wrench className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <span className="text-sm font-medium">
                                                Taller Mecánico
                                            </span>
                                        </div>
                                        {incident.sent_to_workshop ? (
                                            incident.workshop_read_at ? (
                                                <Badge
                                                    variant="outline"
                                                    className="border-green-200 bg-green-50 text-green-700"
                                                >
                                                    VISTO
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className="animate-pulse border-yellow-200 bg-yellow-50 text-yellow-700"
                                                >
                                                    ENVIADO
                                                </Badge>
                                            )
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">
                                                No aplica
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pb-1">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">
                                                <AlertCircle className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <span className="text-sm font-medium">
                                                Comandancia
                                            </span>
                                        </div>
                                        {incident.reported_to_commander ? (
                                            incident.commander_seen ? (
                                                <Badge
                                                    variant="outline"
                                                    className="border-green-200 bg-green-50 text-green-700"
                                                >
                                                    VISTO
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className="animate-pulse border-yellow-200 bg-yellow-50 text-yellow-700"
                                                >
                                                    ENVIADO
                                                </Badge>
                                            )
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">
                                                No aplica
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Review Modal */}
                <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <form onSubmit={handleReviewSubmit}>
                            <DialogHeader>
                                <DialogTitle>
                                    Revisión de Incidencia
                                </DialogTitle>
                                <DialogDescription>
                                    Determine acciones a seguir para la unidad{' '}
                                    {incident.vehicle.name}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-6">
                                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="review_is_stopped"
                                            checked={reviewData.is_stopped}
                                            onCheckedChange={(checked) =>
                                                setReviewData(
                                                    'is_stopped',
                                                    checked as boolean,
                                                )
                                            }
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label
                                                htmlFor="review_is_stopped"
                                                className="text-sm font-bold tracking-wide text-destructive uppercase"
                                            >
                                                Material Fuera de Servicio
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Marcar si el vehículo no puede
                                                operar.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                                    <h4 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                        Estado de la Novedad
                                    </h4>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="status_resolved"
                                                checked={
                                                    reviewData.status ===
                                                    'Resolved'
                                                }
                                                onCheckedChange={(checked) =>
                                                    setReviewData(
                                                        'status',
                                                        checked
                                                            ? 'Resolved'
                                                            : 'Open',
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor="status_resolved"
                                                className="text-sm font-medium text-green-700 dark:text-green-500"
                                            >
                                                Marcar como RESUELTO
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                                    <h4 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                        Notificaciones
                                    </h4>
                                    <div className="grid gap-4">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="sent_to_hq"
                                                checked={reviewData.sent_to_hq}
                                                onCheckedChange={(checked) =>
                                                    setReviewData(
                                                        'sent_to_hq',
                                                        checked as boolean,
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor="sent_to_hq"
                                                className="text-sm font-medium"
                                            >
                                                Reportar a Material Mayor
                                            </Label>
                                        </div>

                                        {(auth.user.role === 'admin' ||
                                            (auth.user.role === 'inspector' &&
                                                auth.user.department ===
                                                    'Material Mayor') ||
                                            auth.user.role ===
                                                'comandante') && (
                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id="sent_to_workshop"
                                                    checked={
                                                        reviewData.sent_to_workshop
                                                    }
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        setReviewData(
                                                            'sent_to_workshop',
                                                            checked as boolean,
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor="sent_to_workshop"
                                                    className="text-sm font-medium"
                                                >
                                                    Reportar a Taller Mecánico
                                                </Label>
                                            </div>
                                        )}

                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="reported_to_commander"
                                                checked={
                                                    reviewData.reported_to_commander
                                                }
                                                onCheckedChange={(checked) =>
                                                    setReviewData(
                                                        'reported_to_commander',
                                                        checked as boolean,
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor="reported_to_commander"
                                                className="text-sm font-medium"
                                            >
                                                Reportar a Comandancia
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="-mx-6 -mb-6 bg-muted/30 p-4">
                                <Button
                                    type="submit"
                                    disabled={reviewProcessing}
                                    className="w-full"
                                >
                                    Guardar Revisión y Notificar
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <ActionOtpVerificationModal
                    isOpen={isOtpModalOpen}
                    onClose={closeOtpModal}
                    onVerified={handleVerified}
                />
            </div>
        </AppLayout>
    );
}
