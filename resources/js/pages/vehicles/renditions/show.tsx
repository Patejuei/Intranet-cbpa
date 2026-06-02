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
import AuthenticatedLayout from '@/layouts/app-layout';
import { useOtpAction } from '@/hooks/use-otp-action';
import ActionOtpVerificationModal from '@/components/action-otp-verification-modal';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Download,
    FileText,
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
        action: '',
        comment: '',
    });

    const { isOtpModalOpen, performWithOtp, handleVerified, closeOtpModal } = useOtpAction();
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    const handleApprove = () => {
        const confirmMsg = rendition.status === 'pending_inspector'
            ? '¿Confirma aprobar esta rendición y pasarla a Secretaría de Adquisiciones?'
            : '¿Confirma validar y aprobar esta rendición?';

        if (confirm(confirmMsg)) {
            performWithOtp(() => {
                post(`/vehicles/renditions/${rendition.id}/review`, {
                    data: { action: 'approve', comment: '' },
                    onSuccess: () => reset(),
                });
            });
        }
    };

    const handleReject = () => {
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
                        className="border-orange-200 text-orange-600"
                    >
                        Pendiente Inspector
                    </Badge>
                );
            case 'pending_secretary':
                return (
                    <Badge
                        variant="outline"
                        className="border-blue-200 text-blue-600"
                    >
                        Pendiente Secretaria
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge className="bg-green-100 text-green-700">
                        Aprobado
                    </Badge>
                );
            case 'rejected':
                return <Badge variant="destructive">Rechazado</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getReviewCardTitle = () => {
        if (rendition.status === 'pending_inspector') {
            return 'Revisión Inspector Material Mayor';
        }
        if (rendition.status === 'pending_secretary') {
            return 'Validación Secretaria Adquisiciones';
        }
        return 'Revisión';
    };

    const getApproveButtonLabel = () => {
        if (rendition.status === 'pending_inspector') {
            return 'Aprobar y Pasar a Secretaría';
        }
        if (rendition.status === 'pending_secretary') {
            return 'Validar y Aprobar';
        }
        return 'Aprobar';
    };

    const getStepLabel = (step: string) => {
        return step === 'inspector' ? 'Inspector' : 'Secretaria';
    };

    const getActionLabel = (action: string) => {
        return action === 'approved' ? 'Aprobado' : 'Rechazado';
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

            <div className="flex flex-1 flex-col gap-8 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/vehicles/renditions">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Rendición #{rendition.id}
                        </h1>
                        <p className="text-muted-foreground">
                            Ingresada por {rendition.user.name} el{' '}
                            {new Date(
                                rendition.created_at,
                            ).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-6 md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Información de la Rendición
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">
                                            Estado
                                        </Label>
                                        <div>
                                            {getStatusBadge(rendition.status)}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">
                                            Monto Total
                                        </Label>
                                        <div className="text-2xl font-bold">
                                            {formatCurrency(rendition.amount)}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Unidad
                                        </Label>
                                        <div className="font-medium">
                                            {rendition.vehicle
                                                ? `${rendition.vehicle.name} (${rendition.vehicle.company})`
                                                : '-'}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Tipo de Gasto
                                        </Label>
                                        <div className="font-medium">
                                            {getExpenseLabel(
                                                rendition.expense_type,
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Proveedor (RUT)
                                        </Label>
                                        <div className="font-medium">
                                            {rendition.supplier_rut}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Nº Factura
                                        </Label>
                                        <div className="font-medium">
                                            {rendition.invoice_number}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Fecha Factura
                                        </Label>
                                        <div className="font-medium">
                                            {rendition.invoice_date
                                                ? new Date(
                                                      rendition.invoice_date,
                                                  ).toLocaleDateString(
                                                      'es-CL',
                                                      { timeZone: 'UTC' },
                                                  )
                                                : '-'}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">
                                        Concepto / Descripción
                                    </Label>
                                    <p className="rounded-md border bg-muted/20 p-3 text-sm">
                                        {rendition.description}
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label className="text-muted-foreground">
                                        Archivos Adjuntos
                                    </Label>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                        {rendition.attachments.map((file) => (
                                            <div
                                                key={file.id}
                                                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                                            >
                                                <a
                                                    href={`/vehicles/renditions/${rendition.id}/attachments/${file.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="block h-full w-full transition-all hover:ring-2 hover:ring-primary"
                                                >
                                                    {file.mime_type?.startsWith(
                                                        'image/',
                                                    ) ? (
                                                        <img
                                                            src={`/vehicles/renditions/${rendition.id}/attachments/${file.id}`}
                                                            alt={file.file_name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full flex-col items-center justify-center p-2 text-center text-xs text-muted-foreground">
                                                            <FileText className="mb-2 h-8 w-8" />
                                                            {file.file_name}
                                                        </div>
                                                    )}
                                                </a>
                                                <a
                                                    href={`/vehicles/renditions/${rendition.id}/attachments/${file.id}?download=1`}
                                                    download={file.file_name}
                                                    className="absolute bottom-2 right-2 rounded-md bg-background/80 p-1.5 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:bg-background group-hover:opacity-100"
                                                    title="Descargar"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {canReview && (
                            <Card className="border-blue-100 bg-blue-50/50">
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {getReviewCardTitle()}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={() => {
                                            setData('action', 'approve');
                                            handleApprove();
                                        }}
                                        disabled={processing}
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        {getApproveButtonLabel()}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => {
                                            setData('action', 'reject');
                                            setIsRejectDialogOpen(true);
                                        }}
                                        disabled={processing}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Rechazar
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Historial
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6 border-l-2 border-muted pl-4">
                                    {/* Entry: Ingresado */}
                                    <div className="relative">
                                        <div className="absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
                                        <p className="text-sm font-medium">
                                            Ingresado
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <User className="h-3 w-3" />{' '}
                                            {rendition.user.name}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />{' '}
                                            {new Date(
                                                rendition.created_at,
                                            ).toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Dynamic reviews */}
                                    {sortedReviews.map((review) => (
                                        <div key={review.id} className="relative">
                                            <div
                                                className={`absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full ring-4 ring-background ${review.action === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}
                                            />
                                            <p className="text-sm font-medium">
                                                {getStepLabel(review.step)} — {getActionLabel(review.action)}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <User className="h-3 w-3" />{' '}
                                                {review.user.name}
                                            </div>
                                            {review.comment && (
                                                <div className="flex items-center gap-1 text-xs text-red-500">
                                                    {review.comment}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />{' '}
                                                {new Date(
                                                    review.created_at,
                                                ).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Pending steps */}
                                    {rendition.status === 'pending_inspector' && (
                                        <>
                                            <div className="relative">
                                                <div className="absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full bg-gray-300 ring-4 ring-background" />
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Revisión Inspector
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Esperando...
                                                </p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full bg-gray-300 ring-4 ring-background" />
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Validación Secretaria
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Esperando...
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    {rendition.status === 'pending_secretary' && (
                                        <div className="relative">
                                            <div className="absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full bg-gray-300 ring-4 ring-background" />
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Validación Secretaria
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Esperando...
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Dialog
                    open={isRejectDialogOpen}
                    onOpenChange={setIsRejectDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Rechazar Rendición</DialogTitle>
                            <DialogDescription>
                                Indique el motivo del rechazo.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                            <Label>Motivo</Label>
                            <Textarea
                                value={data.comment}
                                onChange={(e) =>
                                    setData('comment', e.target.value)
                                }
                                placeholder="Ej: Falta información..."
                            />
                            {errors.comment && (
                                <p className="text-sm text-red-500">
                                    {errors.comment}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="secondary"
                                onClick={() => setIsRejectDialogOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={processing}
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
