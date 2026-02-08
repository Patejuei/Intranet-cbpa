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
    invoice_number: string;
    invoice_date: string;
    supplier_rut: string;
    expense_type: string;
    user: { name: string };
    vehicle?: { name: string; company: string };
    inspector?: { name: string };
    inspector_vised_at?: string;
    rejected_by?: { name: string };
    rejection_reason?: string;
    rejected_at?: string;
    attachments: Attachment[];
}

interface Props {
    rendition: Rendition;
}

export default function RenditionShow({ rendition }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        action: '',
        rejection_reason: '',
    });

    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

    const handleApprove = () => {
        if (
            confirm('¿Confirma que los datos son correctos y PROCEDE A RENDIR?')
        ) {
            setData('action', 'validate');
            post(`/vehicles/renditions/${rendition.id}/validate`, {
                onSuccess: () => reset(),
            });
        }
    };

    const handleReject = () => {
        setData('action', 'reject');
        post(`/vehicles/renditions/${rendition.id}/validate`, {
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

    const getExpenseLabel = (type: string) => {
        const map: Record<string, string> = {
            repair_supplies: 'Insumos Reparación',
            spare_parts: 'Repuestos',
            tools: 'Herramientas',
            other_tools: 'Otras Herramientas',
        };
        return map[type] || type;
    };

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
                                            {rendition.status === 'rendido' && (
                                                <Badge className="bg-green-100 text-green-700">
                                                    Rendido / OK
                                                </Badge>
                                            )}
                                            {rendition.status ===
                                                'pending_validation' && (
                                                <Badge
                                                    variant="outline"
                                                    className="border-orange-200 text-orange-600"
                                                >
                                                    Pendiente Validación
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
                                            <a
                                                key={file.id}
                                                href={`/vehicles/renditions/${rendition.id}/attachments/${file.id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted transition-all hover:ring-2 hover:ring-primary"
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
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {rendition.status === 'pending_validation' && (
                            <Card className="border-blue-100 bg-blue-50/50">
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Validación
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-2">
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={handleApprove}
                                        disabled={processing}
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Validar y Rendir
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() =>
                                            setIsRejectDialogOpen(true)
                                        }
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
                                    {(rendition.status === 'rendido' ||
                                        rendition.status === 'rejected') && (
                                        <div className="relative">
                                            <div
                                                className={`absolute -left-[21px] flex h-3 w-3 items-center justify-center rounded-full ring-4 ring-background ${rendition.status === 'rendido' ? 'bg-green-500' : 'bg-red-500'}`}
                                            />
                                            <p className="text-sm font-medium">
                                                {rendition.status === 'rendido'
                                                    ? 'Validado / Rendido'
                                                    : 'Rechazado'}
                                            </p>
                                            {rendition.inspector ? (
                                                <>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <User className="h-3 w-3" />{' '}
                                                        {
                                                            rendition.inspector
                                                                .name
                                                        }
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />{' '}
                                                        {new Date(
                                                            rendition.inspector_vised_at!,
                                                        ).toLocaleString()}
                                                    </div>
                                                </>
                                            ) : rendition.rejected_by ? (
                                                <>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <User className="h-3 w-3" />{' '}
                                                        {
                                                            rendition
                                                                .rejected_by
                                                                .name
                                                        }
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-red-500">
                                                        {
                                                            rendition.rejection_reason
                                                        }
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />{' '}
                                                        {new Date(
                                                            rendition.rejected_at!,
                                                        ).toLocaleString()}
                                                    </div>
                                                </>
                                            ) : null}
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
                                value={data.rejection_reason}
                                onChange={(e) =>
                                    setData('rejection_reason', e.target.value)
                                }
                                placeholder="Ej: Falta información..."
                            />
                            {errors.rejection_reason && (
                                <p className="text-sm text-red-500">
                                    {errors.rejection_reason}
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
            </div>
        </AuthenticatedLayout>
    );
}
