import ActionOtpVerificationModal from '@/components/action-otp-verification-modal';
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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useOtpAction } from '@/hooks/use-otp-action';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    FileText,
    Receipt,
    Truck,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface Attachment {
    id: number;
    file_path: string;
    file_name: string;
    mime_type: string;
}

interface Review {
    id: number;
    action: 'approved' | 'rejected';
    step: 'inspector' | 'secretary';
    comment: string | null;
    created_at: string;
    user: { name: string };
}

interface Rendition {
    id: number;
    amount: number;
    description: string;
    status: string;
    created_at: string;
    invoice_number: string;
    invoice_date: string;
    supplier_rut: string;
    expense_type: string;
    user: { name: string };
    vehicle?: { name: string; company: string };
    inspector?: { name: string };
    inspector_vised_at?: string;
    secretary?: { name: string };
    secretary_vised_at?: string;
    rejected_by?: { name: string };
    rejection_reason?: string;
    rejected_at?: string;
    attachments: Attachment[];
    reviews?: Review[];
}

interface Props {
    rendition: Rendition;
    canReview: boolean;
    userRole: string;
    userDepartment: string;
}

export default function RenditionShow({ rendition, canReview, userRole, userDepartment }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        action: 'approve',
        comment: '',
    });

    const { isOtpModalOpen, performWithOtp, handleVerified, closeOtpModal } = useOtpAction();
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    const handleApprove = () => {
        const confirmMsg =
            rendition.status === 'pending_inspector'
                ? '¿Confirma visar esta rendición y derivarla a Secretaría de Adquisiciones?'
                : '¿Confirma validar y aprobar definitivamente esta rendición?';

        if (confirm(confirmMsg)) {
            setData('action', 'approve');
            performWithOtp(() => {
                post(`/vehicles/renditions/${rendition.id}/review`, {
                    onSuccess: () => reset(),
                });
            });
        }
    };

    const handleReject = () => {
        setData('action', 'reject');
        performWithOtp(() => {
            post(`/vehicles/renditions/${rendition.id}/review`, {
                onSuccess: () => {
                    setIsRejectDialogOpen(false);
                    reset();
                },
            });
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
        }).format(amount);
    };

    const getExpenseLabel = (type: string) => {
        const map: Record<string, string> = {
            repair_supplies: 'Insumos Reparación',
            spare_parts: 'Repuestos',
            tools: 'Herramientas',
            other_tools: 'Otras Herramientas',
        };
        return map[type] || type;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending_inspector':
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 font-medium text-[11px]"
                    >
                        Pendiente Inspector
                    </Badge>
                );
            case 'pending_secretary':
                return (
                    <Badge
                        variant="outline"
                        className="border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300 font-medium text-[11px]"
                    >
                        Pendiente Secretaria
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 font-semibold text-[11px]"
                    >
                        Aprobado
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge
                        variant="outline"
                        className="border-red-500/30 bg-red-500/10 text-red-700 dark:border-red-500/35 dark:bg-red-500/20 dark:text-red-300 font-semibold text-[11px]"
                    >
                        Rechazado
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary" className="text-[11px]">
                        {status}
                    </Badge>
                );
        }
    };

    const getReviewCardTitle = () => {
        if (rendition.status === 'pending_inspector') {
            return 'Visación Inspector de Material Mayor';
        }
        if (rendition.status === 'pending_secretary') {
            return 'Validación de Secretaría de Adquisiciones';
        }
        return 'Revisión y Aprobación';
    };

    const getApproveButtonLabel = () => {
        if (rendition.status === 'pending_inspector') {
            return 'Aprobar y Derivar a Secretaría';
        }
        if (rendition.status === 'pending_secretary') {
            return 'Validar y Aprobar Definitivo';
        }
        return 'Aprobar Rendición';
    };

    const getStepLabel = (step: string) => {
        return step === 'inspector' ? 'Inspector M.M.' : 'Secretaría de Adquisiciones';
    };

    const getActionLabel = (action: string) => {
        return action === 'approved' ? 'Aprobó' : 'Rechazó';
    };

    const sortedReviews = [...(rendition.reviews || [])].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                {
                    title: 'Rendiciones',
                    href: '/vehicles/renditions',
                },
                { title: `Rendición #${rendition.id}`, href: '#' },
            ]}
        >
            <Head title={`Rendición #${rendition.id}`} />

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
                {/* Back button */}
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-foreground"
                        asChild
                    >
                        <Link href="/vehicles/renditions">
                            <ArrowLeft className="size-4" />
                            <span>Volver al listado de rendiciones</span>
                        </Link>
                    </Button>
                </div>

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Receipt className="size-5" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    Rendición #{rendition.id}
                                </h1>
                                {getStatusBadge(rendition.status)}
                            </div>
                            <p className="text-xs text-muted-foreground sm:text-sm">
                                Ingresada por <span className="font-semibold text-foreground">{rendition.user.name}</span> el{' '}
                                {new Date(rendition.created_at).toLocaleDateString('es-CL', {
                                    dateStyle: 'long',
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column: Details & Attachments */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card className="rounded-2xl border border-border/70 shadow-xs">
                            <CardHeader className="pb-3 pt-5 px-5 sm:px-6">
                                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-foreground">
                                    Detalles de la Rendición
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 px-5 pb-5 sm:px-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/60 bg-muted/20 p-4">
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Monto Total Rendido
                                        </span>
                                        <div className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
                                            {formatCurrency(rendition.amount)}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs">
                                            <Calendar className="size-3.5 text-muted-foreground" />
                                            <span className="text-muted-foreground">Fecha Doc.:</span>
                                            <span className="font-semibold text-foreground">
                                                {rendition.invoice_date
                                                    ? new Date(rendition.invoice_date).toLocaleDateString('es-CL', {
                                                          timeZone: 'UTC',
                                                          dateStyle: 'short',
                                                      })
                                                    : '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                                    <div className="space-y-1">
                                        <span className="font-medium text-muted-foreground">Destino / Carro:</span>
                                        <p className="text-sm font-semibold text-foreground">
                                            {rendition.vehicle
                                                ? `${rendition.vehicle.name} (${rendition.vehicle.company})`
                                                : 'Taller / General'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="font-medium text-muted-foreground">Tipo de Gasto:</span>
                                        <p className="text-sm font-semibold text-foreground">
                                            {getExpenseLabel(rendition.expense_type)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="font-medium text-muted-foreground">Proveedor (RUT):</span>
                                        <p className="text-sm font-semibold text-foreground">
                                            {rendition.supplier_rut || '-'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="font-medium text-muted-foreground">Nº Documento / Factura:</span>
                                        <p className="text-sm font-mono font-semibold text-foreground">
                                            #{rendition.invoice_number}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Concepto o Justificación del Gasto
                                    </Label>
                                    <p className="rounded-xl border border-border/60 bg-muted/20 p-4 text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                        {rendition.description}
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Comprobantes y Facturas Digitalizadas ({rendition.attachments.length})
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {rendition.attachments.map((file) => (
                                            <div
                                                key={file.id}
                                                className="group relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs transition hover:border-primary/50"
                                            >
                                                <a
                                                    href={`/vehicles/renditions/${rendition.id}/attachments/${file.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="block h-full w-full"
                                                >
                                                    {file.mime_type?.startsWith('image/') ? (
                                                        <img
                                                            src={`/vehicles/renditions/${rendition.id}/attachments/${file.id}`}
                                                            alt={file.file_name}
                                                            className="h-full w-full object-cover transition group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full flex-col items-center justify-center p-3 text-center text-xs text-muted-foreground">
                                                            <FileText className="mb-2 size-8 text-primary opacity-80" />
                                                            <span className="line-clamp-2 text-[11px] font-medium text-foreground">
                                                                {file.file_name}
                                                            </span>
                                                        </div>
                                                    )}
                                                </a>
                                                <a
                                                    href={`/vehicles/renditions/${rendition.id}/attachments/${file.id}?download=1`}
                                                    download={file.file_name}
                                                    className="absolute bottom-2 right-2 rounded-lg bg-background/90 p-1.5 text-foreground opacity-0 shadow-xs backdrop-blur-sm transition hover:bg-background group-hover:opacity-100"
                                                    title="Descargar archivo"
                                                >
                                                    <Download className="size-4" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Actions & History */}
                    <div className="space-y-6">
                        {canReview && (
                            <Card className="rounded-2xl border border-primary/25 bg-primary/5 shadow-xs">
                                <CardHeader className="pb-3 pt-5 px-5 sm:px-6">
                                    <CardTitle className="text-sm font-semibold uppercase tracking-wider text-foreground">
                                        {getReviewCardTitle()}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 px-5 pb-5 sm:px-6">
                                    <Button
                                        className="w-full gap-2 shadow-xs"
                                        onClick={handleApprove}
                                        disabled={processing}
                                    >
                                        <CheckCircle2 className="size-4" />
                                        <span>{getApproveButtonLabel()}</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full gap-2 border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:border-red-500/40 dark:text-red-400"
                                        onClick={() => setIsRejectDialogOpen(true)}
                                        disabled={processing}
                                    >
                                        <XCircle className="size-4" />
                                        <span>Rechazar Rendición</span>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* History Timeline */}
                        <Card className="rounded-2xl border border-border/70 shadow-xs">
                            <CardHeader className="pb-3 pt-5 px-5 sm:px-6 border-b border-border/60">
                                <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                                    <Clock className="size-4 text-primary" />
                                    <span>Trazabilidad y Visaciones</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 sm:p-6">
                                <div className="space-y-5 border-l-2 border-border/60 pl-4">
                                    {/* Entry */}
                                    <div className="relative">
                                        <div className="absolute -left-[23px] top-1 size-3.5 rounded-full bg-primary border-2 border-background" />
                                        <p className="text-xs font-bold text-foreground">
                                            Rendición Ingresada
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {rendition.user.name}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/70">
                                            {new Date(rendition.created_at).toLocaleString('es-CL', {
                                                dateStyle: 'short',
                                                timeStyle: 'short',
                                            })}
                                        </p>
                                    </div>

                                    {/* Reviews */}
                                    {sortedReviews.map((review) => (
                                        <div key={review.id} className="relative">
                                            <div
                                                className={`absolute -left-[23px] top-1 size-3.5 rounded-full border-2 border-background ${
                                                    review.action === 'approved' ? 'bg-emerald-500' : 'bg-red-500'
                                                }`}
                                            />
                                            <p className="text-xs font-bold text-foreground">
                                                {getStepLabel(review.step)} — {getActionLabel(review.action)}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">
                                                {review.user.name}
                                            </p>
                                            {review.comment && (
                                                <p className="mt-1 rounded-md bg-muted/40 p-2 text-xs text-destructive">
                                                    "{review.comment}"
                                                </p>
                                            )}
                                            <p className="text-[10px] text-muted-foreground/70">
                                                {new Date(review.created_at).toLocaleString('es-CL', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short',
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Reject Dialog */}
                <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
                                <XCircle className="size-5" />
                                <span>Rechazar Rendición</span>
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Ingrese el motivo o causal del rechazo para que el usuario pueda corregir la rendición.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-2 py-2">
                            <Label htmlFor="comment" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Motivo del Rechazo <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="comment"
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                                placeholder="Indique las observaciones o motivos por los que no procede la rendición..."
                                className="min-h-[100px] text-sm"
                                required
                            />
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsRejectDialogOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={processing || !data.comment.trim()}
                            >
                                Confirmar Rechazo
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <ActionOtpVerificationModal
                    isOpen={isOtpModalOpen}
                    onClose={closeOtpModal}
                    onVerified={handleVerified}
                />
            </div>
        </AuthenticatedLayout>
    );
}