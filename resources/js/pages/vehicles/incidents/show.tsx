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
import { Input } from '@/components/ui/input';
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
    Image as ImageIcon,
    Trash2,
    Download,
    Upload,
    Loader2,
    Pencil,
} from 'lucide-react';
import { useState } from 'react';

interface Vehicle {
    id: number;
    name: string;
    company: string;
}

interface VehicleIssueImage {
    id: number;
    image_path: string;
    original_name: string;
    uploaded_by: number;
    created_at: string;
    updated_at: string;
    uploader?: {
        id: number;
        name: string;
    };
}

interface Issue {
    id: number;
    vehicle: Vehicle;
    reporter: { name: string };
    reporter_id: number;
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
    commander_seen_at?: string;
    images?: VehicleIssueImage[];
}

export default function VehicleIncidentShow({
    incident,
    canEdit,
    canDeleteImages,
}: {
    incident: Issue;
    canEdit: boolean;
    canDeleteImages: boolean;
}) {
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

    const [uploadOpen, setUploadOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Size check (5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setUploadError('La imagen no debe pesar más de 5MB.');
            setFile(null);
            setPreviewUrl(null);
            return;
        }

        // Format check
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!allowedTypes.includes(selectedFile.type)) {
            setUploadError('Formato no permitido. Solo se aceptan JPEG, PNG, JPG y WEBP.');
            setFile(null);
            setPreviewUrl(null);
            return;
        }

        setUploadError(null);
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        router.post(`/vehicles/incidents/${incident.id}/images`, formData as any, {
            onSuccess: () => {
                setUploadOpen(false);
                setFile(null);
                setPreviewUrl(null);
                setUploadError(null);
            },
            onError: (err: any) => {
                setUploadError(err.image || 'Error al subir la imagen.');
            },
            onFinish: () => {
                setUploading(false);
            },
        });
    };

    const handleDeleteImage = (imageId: number) => {
        if (!confirm('¿Está seguro de que desea eliminar esta imagen?')) return;

        router.delete(`/vehicles/incident-images/${imageId}`, {
            preserveScroll: true,
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

    const getSeverityDetails = (severity: string) => {
        switch (severity) {
            case 'Critical':
                return {
                    label: 'Crítica',
                    description: 'La unidad queda inoperativa de forma inmediata y requiere atención mecánica urgente.',
                    colorClass: 'text-red-700 bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900',
                    badgeColor: 'bg-red-500 hover:bg-red-500/90 text-white',
                    icon: AlertCircle,
                };
            case 'High':
                return {
                    label: 'Alta',
                    description: 'Existe un riesgo operativo significativo. Se requiere inspección y reparación prioritaria.',
                    colorClass: 'text-orange-700 bg-orange-50/50 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900',
                    badgeColor: 'bg-orange-500 hover:bg-orange-500/90 text-white',
                    icon: ShieldAlert,
                };
            case 'Medium':
                return {
                    label: 'Media',
                    description: 'Se detecta una anomalía que requiere reparación, pero no impide el funcionamiento básico.',
                    colorClass: 'text-amber-700 bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900',
                    badgeColor: 'bg-amber-500 hover:bg-amber-500/90 text-white',
                    icon: AlertCircle,
                };
            case 'Low':
            default:
                return {
                    label: 'Baja',
                    description: 'Observación menor o detalle estético. Se registrará para futuros mantenimientos.',
                    colorClass: 'text-slate-700 bg-slate-50/50 border-slate-200 dark:bg-slate-950/20 dark:text-slate-400 dark:border-slate-800',
                    badgeColor: 'bg-slate-500 hover:bg-slate-500/90 text-white',
                    icon: Eye,
                };
        }
    };

    const formatDateTime = (dateString: string | null | undefined): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const d = date.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        const t = date.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${d} ${t}`;
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
                        {canEdit && (
                            <Button
                                variant="outline"
                                asChild
                                className="transition-all hover:scale-105 border-primary text-primary hover:bg-primary/5"
                            >
                                <Link href={`/vehicles/incidents/${incident.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" /> Editar Incidencia
                                </Link>
                            </Button>
                        )}
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

                        <Card className="overflow-hidden border-none shadow-md ring-1 ring-border">
                            <CardHeader className="bg-muted/30 flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5 text-primary" />
                                    Imágenes Adjuntas ({incident.images?.length || 0}/3)
                                </CardTitle>
                                {canEdit && (incident.images?.length ?? 0) < 3 && (
                                    <Button
                                        size="sm"
                                        onClick={() => setUploadOpen(true)}
                                        className="transition-all hover:scale-105"
                                    >
                                        <Upload className="mr-2 h-4 w-4" /> Añadir Imagen
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="p-6">
                                {!incident.images || incident.images.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                        <ImageIcon className="h-10 w-10 mb-2 stroke-1" />
                                        <p className="text-sm">No hay imágenes adjuntas a esta incidencia.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        {incident.images.map((img) => (
                                            <div
                                                key={img.id}
                                                className="group relative overflow-hidden rounded-lg border bg-muted/20 p-2 ring-1 ring-border"
                                            >
                                                <div className="aspect-video relative overflow-hidden rounded-md bg-black/5">
                                                    <img
                                                        src={`/storage/${img.image_path}`}
                                                        alt={img.original_name}
                                                        className="h-full w-full object-cover cursor-zoom-in transition-all duration-300 group-hover:scale-105"
                                                        onClick={() => setSelectedImage(img)}
                                                    />
                                                </div>
                                                <div className="mt-2 space-y-1">
                                                    <p className="truncate text-xs font-semibold text-foreground" title={img.original_name}>
                                                        {img.original_name}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        Subido por: {img.uploader?.name || 'Desconocido'}
                                                    </p>
                                                </div>
                                                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="h-8 w-8 bg-white/90 shadow-sm backdrop-blur hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900"
                                                        asChild
                                                    >
                                                        <a
                                                            href={`/vehicles/incident-images/${img.id}/download`}
                                                            download
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                    {canDeleteImages && (
                                                        <Button
                                                            size="icon"
                                                            variant="destructive"
                                                            className="h-8 w-8 shadow-sm"
                                                            onClick={() => handleDeleteImage(img.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                        {/* Recuadro de Gravedad Reportada */}
                        <Card className="overflow-hidden border-none shadow-md ring-1 ring-border">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5 text-primary" />
                                    Gravedad Reportada
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {(() => {
                                    const details = getSeverityDetails(incident.severity);
                                    const SeverityIcon = details.icon;
                                    return (
                                        <div className={`flex flex-col gap-4 rounded-xl border p-4 ${details.colorClass}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <SeverityIcon className="h-5 w-5" />
                                                    <span className="text-sm font-semibold uppercase tracking-wider">
                                                        Nivel de Riesgo
                                                    </span>
                                                </div>
                                                <Badge className={`px-2.5 py-0.5 text-xs font-bold uppercase ${details.badgeColor}`}>
                                                    {details.label}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium leading-relaxed">
                                                {details.description}
                                            </p>
                                        </div>
                                    );
                                })()}
                            </CardContent>
                        </Card>

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
                                                <div className="flex flex-col items-end gap-0.5">
                                                    <Badge
                                                        variant="outline"
                                                        className="border-green-200 bg-green-50 text-green-700"
                                                    >
                                                        VISTO
                                                    </Badge>
                                                    <span className="text-[10px] text-muted-foreground font-medium">
                                                        {formatDateTime(incident.hq_read_at)}
                                                    </span>
                                                </div>
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
                                                <div className="flex flex-col items-end gap-0.5">
                                                    <Badge
                                                        variant="outline"
                                                        className="border-green-200 bg-green-50 text-green-700"
                                                    >
                                                        VISTO
                                                    </Badge>
                                                    <span className="text-[10px] text-muted-foreground font-medium">
                                                        {formatDateTime(incident.workshop_read_at)}
                                                    </span>
                                                </div>
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
                                                <div className="flex flex-col items-end gap-0.5">
                                                    <Badge
                                                        variant="outline"
                                                        className="border-green-200 bg-green-50 text-green-700"
                                                    >
                                                        VISTO
                                                    </Badge>
                                                    {incident.commander_seen_at && (
                                                        <span className="text-[10px] text-muted-foreground font-medium">
                                                            {formatDateTime(incident.commander_seen_at)}
                                                        </span>
                                                    )}
                                                </div>
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

                {/* Upload Image Dialog */}
                <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                    <DialogContent className="sm:max-w-[450px]">
                        <form onSubmit={handleUploadSubmit}>
                            <DialogHeader>
                                <DialogTitle>Añadir Imagen</DialogTitle>
                                <DialogDescription>
                                    Cargue una imagen de la incidencia (máx. 5MB, formatos: JPEG, PNG, JPG, WEBP).
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="image_file">Seleccionar Archivo</Label>
                                    <Input
                                        id="image_file"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        capture="environment"
                                        onChange={handleFileChange}
                                        className="cursor-pointer"
                                    />
                                    {uploadError && (
                                        <p className="text-sm text-destructive font-medium">{uploadError}</p>
                                    )}
                                </div>
                                {previewUrl && (
                                    <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted/30">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setUploadOpen(false);
                                        setFile(null);
                                        setPreviewUrl(null);
                                        setUploadError(null);
                                    }}
                                    disabled={uploading}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={uploading || !file}>
                                    {uploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Subiendo...
                                        </>
                                    ) : (
                                        'Subir Imagen'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Lightbox / Preview Dialog */}
                <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                    <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
                        {selectedImage && (
                            <div className="relative flex flex-col items-center justify-center">
                                <img
                                    src={`/storage/${selectedImage.image_path}`}
                                    alt={selectedImage.original_name}
                                    className="max-h-[80vh] w-auto rounded-lg object-contain"
                                />
                                <div className="mt-4 rounded-lg bg-black/60 px-4 py-2 text-center text-white backdrop-blur-sm">
                                    <p className="text-sm font-semibold">{selectedImage.original_name}</p>
                                    <p className="text-xs text-white/80">Subido por: {selectedImage.uploader?.name || 'Desconocido'}</p>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
