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
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
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

interface Rendition {
    id: number;
    amount: number;
    description: string;
    status: string;
    created_at: string;
    user: { name: string };
    inspector?: { name: string };
    inspector_vised_at?: string;
    comandante?: { name: string };
    comandante_vised_at?: string;
    rejected_by?: { name: string };
    rejection_reason?: string;
    rejected_at?: string;
    attachments: Attachment[];
}

interface Props {
    rendition: Rendition;
    canVisaInspector: boolean; // Computed in backend
    canVisaComandante: boolean; // Computed in backend
}

export default function PettyCashShow({
    rendition,
    canVisaInspector,
    canVisaComandante,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        action: '', // approve, reject
        reason: '',
    });

    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    const handleApprove = () => {
        if (confirm('¿Está seguro de VISAR esta rendición?')) {
            setData('action', 'approve');
            post(`/vehicles/petty-cash/${rendition.id}/review`, {
                onSuccess: () => reset(),
            });
        }
    };

    const handleReject = () => {
        setData('action', 'reject');
        post(`/vehicles/petty-cash/${rendition.id}/review`, {
            onSuccess: () => {
                setIsRejectDialogOpen(false);
                reset();
            },
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { title: 'Caja Chica', href: '/vehicles/petty-cash' },
                { title: `Rendición #${rendition.id}`, href: '#' },
            ]}
        >
            <Head title={`Rendición #${rendition.id}`} />

            <div className="flex flex-1 flex-col gap-8 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/vehicles/petty-cash">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Rendición #{rendition.id}
                        </h1>
                        <p className="text-muted-foreground">
                            Solicitado por {rendition.user.name} el{' '}
                            {new Date(
                                rendition.created_at,
                            ).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Left Column: Details */}
                    <div className="space-y-6 md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalles de la Rendición</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">
                                            Monto Solicitado
                                        </Label>
                                        <div className="text-2xl font-bold">
                                            {formatCurrency(rendition.amount)}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-muted-foreground">
                                            Estado Actual
                                        </Label>
                                        <div>
                                            {rendition.status ===
                                                'approved' && (
                                                <Badge className="bg-green-100 text-green-700">
                                                    Liberado a Pago
                                                </Badge>
                                            )}
                                            {rendition.status ===
                                                'pending_inspector' && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-orange-200 text-orange-600"
                                                >
                                                    Pendiente Inspector
                                                </Badge>
                                            )}
                                            {rendition.status ===
                                                'pending_comandante' && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-blue-200 text-blue-600"
                                                >
                                                    Pendiente Comandante
                                                </Badge>
                                            )}
                                            {rendition.status ===
                                                'rejected' && (
                                                <Badge variant="destructive">
                                                    Rechazado
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">
                                        Descripción
                                    </Label>
                                    <p className="text-sm">
                                        {rendition.description ||
                                            'Sin descripción.'}
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label className="text-muted-foreground">
                                        Comprobantes Adjuntos
                                    </Label>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                        {rendition.attachments.map((file) => (
                                            <a
                                                key={file.id}
                                                href={`/vehicles/petty-cash/${rendition.id}/attachments/${file.id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted transition-all hover:ring-2 hover:ring-primary"
                                            >
                                                {file.mime_type?.startsWith(
                                                    'image/',
                                                ) ? (
                                                    <img
                                                        src={`/vehicles/petty-cash/${rendition.id}/attachments/${file.id}`}
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
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Timeline & Actions */}
                    <div className="space-y-6">
                        {/* Approval Actions */}
                        {(rendition.status === 'pending_inspector' ||
                            rendition.status === 'pending_comandante') && (
                            <Card className="border-blue-100 bg-blue-50/50">
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Acciones Requeridas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    {/* Inspector Action */}
                                    {rendition.status === 'pending_inspector' &&
                                        canVisaInspector && (
                                            <>
                                                <Button
                                                    className="w-full bg-green-600 hover:bg-green-700"
                                                    onClick={handleApprove}
                                                    disabled={processing}
                                                >
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    Visar como Inspector
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="w-full"
                                                    onClick={() =>
                                                        setIsRejectDialogOpen(
                                                            true,
                                                        )
                                                    }
                                                    disabled={processing}
                                                >
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Rechazar
                                                </Button>
                                            </>
                                        )}

                                    {/* Comandante Action */}
                                    {rendition.status ===
                                        'pending_comandante' &&
                                        canVisaComandante && (
                                            <>
                                                <Button
                                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                                    onClick={handleApprove}
                                                    disabled={processing}
                                                >
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    Visar y Liberar a Pago
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="w-full"
                                                    onClick={() =>
                                                        setIsRejectDialogOpen(
                                                            true,
                                                        )
                                                    }
                                                    disabled={processing}
                                                >
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Rechazar
                                                </Button>
                                            </>
                                        )}

                                    {/* Unauthorized Message */}
                                    {((rendition.status ===
                                        'pending_inspector' &&
                                        !canVisaInspector) ||
                                        (rendition.status ===
                                            'pending_comandante' &&
                                            !canVisaComandante)) && (
                                        <p className="text-center text-sm text-muted-foreground">
                                            No tiene permisos para visar en esta
                                            etapa.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Línea de Tiempo
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6 border-l-2 border-muted pl-4">
                                    {/* Created */}
                                    <div className="relative">
                                        <div className="absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
                                        <p className="text-sm font-medium">
                                            Solicitud Creada
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <User className="h-3 w-3" />
                                            {rendition.user.name}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {new Date(
                                                rendition.created_at,
                                            ).toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Inspector Visa */}
                                    {(rendition.inspector_vised_at ||
                                        rendition.rejected_at) && (
                                        <div className="relative">
                                            <div
                                                className={`absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full ring-4 ring-background ${
                                                    rendition.rejected_at &&
                                                    !rendition.comandante_vised_at // Logic: if rejected at this stage
                                                        ? 'bg-red-500'
                                                        : 'bg-green-500'
                                                }`}
                                            />
                                            <p className="text-sm font-medium">
                                                Revisión Inspector
                                            </p>
                                            {rendition.inspector ? (
                                                <>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <User className="h-3 w-3" />
                                                        {
                                                            rendition.inspector
                                                                .name
                                                        }
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(
                                                            rendition.inspector_vised_at!,
                                                        ).toLocaleString()}
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-xs text-red-500">
                                                    Rechazado por{' '}
                                                    {
                                                        rendition.rejected_by
                                                            ?.name
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Comandante Visa */}
                                    {(rendition.comandante_vised_at ||
                                        (rendition.rejected_at &&
                                            rendition.inspector_vised_at)) && (
                                        <div className="relative">
                                            <div
                                                className={`absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full ring-4 ring-background ${
                                                    rendition.status ===
                                                    'approved'
                                                        ? 'bg-green-500'
                                                        : 'bg-red-500'
                                                }`}
                                            />
                                            <p className="text-sm font-medium">
                                                Revisión Comandante
                                            </p>
                                            {rendition.comandante ? (
                                                <>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <User className="h-3 w-3" />
                                                        {
                                                            rendition.comandante
                                                                .name
                                                        }
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(
                                                            rendition.comandante_vised_at!,
                                                        ).toLocaleString()}
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-xs text-red-500">
                                                    Rechazado por{' '}
                                                    {
                                                        rendition.rejected_by
                                                            ?.name
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Final Status */}
                                    {rendition.status === 'approved' && (
                                        <div className="relative">
                                            <div className="absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full bg-green-500 ring-4 ring-background" />
                                            <p className="text-sm font-bold text-green-700">
                                                Liberado a Pago
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
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
                            Indique el motivo del rechazo. El solicitante será
                            notificado.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label>Motivo</Label>
                        <Textarea
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            placeholder="Ej: Falta boleta, monto incorrecto..."
                        />
                        {errors.reason && (
                            <p className="text-sm text-red-500">
                                {errors.reason}
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
        </AuthenticatedLayout>
    );
}
