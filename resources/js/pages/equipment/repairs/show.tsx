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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    FileText,
    Truck,
    UserCheck,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
// import { route } from 'ziggy-js';

// Define the interface for the repair request prop
interface RepairRequest {
    id: number;
    material: {
        product_name: string;
        serial_number: string;
        brand: string;
        model: string;
    };
    requester: {
        name: string;
    };
    status: string;
    description: string;
    created_at: string;
    inspector?: {
        name: string;
    };
    inspection_date?: string;
    inspection_observation?: string;
    provider_name?: string;
    repair_description?: string;
    delivery_date?: string;
    invoice_number?: string;
    repair_cost?: number;
    invoice_path?: string;
    return_date?: string;
}

export default function RepairRequestShow({
    repairRequest,
}: {
    repairRequest: RepairRequest;
}) {
    const { auth } = usePage<any>().props;
    const userRole = (auth.user as any).role;
    const userDepartment = (auth.user as any).department;

    const isInspector =
        userRole === 'admin' ||
        (userRole === 'inspector' && userDepartment === 'Material Menor');

    // Updated role check for Acquisitions (formerly secretaria_compras, now secretaria_adquisiciones)
    const isAcquisitions =
        userRole === 'admin' || userRole === 'secretaria_adquisiciones';

    // Forms for different actions
    const receiveForm = useForm({});
    const evaluateForm = useForm({
        status: '',
        observation: '',
    });
    const sendProviderForm = useForm({
        provider_name: '',
        repair_description: '',
    });
    const finishForm = useForm({
        invoice_number: '',
        repair_cost: '',
        invoice_file: null as File | null,
    });

    const [isEvaluateOpen, setIsEvaluateOpen] = useState(false);
    const [isSendProviderOpen, setIsSendProviderOpen] = useState(false);
    const [isFinishOpen, setIsFinishOpen] = useState(false);

    const getStatusColor = (status: string) => {
        /* ... same as index ... */
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'RECEIVED_BY_INSPECTOR':
                return 'bg-blue-100 text-blue-800';
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'SENT_TO_PROVIDER':
                return 'bg-purple-100 text-purple-800';
            case 'FINISHED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        /* ... same as index ... */
        switch (status) {
            case 'PENDING':
                return 'Solicitado';
            case 'RECEIVED_BY_INSPECTOR':
                return 'Recepcionado';
            case 'APPROVED':
                return 'Aprobado';
            case 'REJECTED':
                return 'Rechazado';
            case 'SENT_TO_PROVIDER':
                return 'En Taller';
            case 'FINISHED':
                return 'Finalizado';
            default:
                return status;
        }
    };

    // Actions

    const handleReceive = () => {
        if (confirm('¿Confirmar recepción del material para inspección?')) {
            receiveForm.post(`/repairs/${repairRequest.id}/receive`);
        }
    };

    const handleEvaluate = (status: 'APPROVED' | 'REJECTED') => {
        evaluateForm.setData('status', status);
        evaluateForm.post(`/repairs/${repairRequest.id}/evaluate`, {
            onSuccess: () => setIsEvaluateOpen(false),
        });
    };

    const handleSendProvider = () => {
        sendProviderForm.post(`/repairs/${repairRequest.id}/send-provider`, {
            onSuccess: () => setIsSendProviderOpen(false),
        });
    };

    const handleFinish = () => {
        finishForm.post(`/repairs/${repairRequest.id}/finish`, {
            onSuccess: () => setIsFinishOpen(false),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Reparaciones',
            href: '/repairs',
        },
        {
            title: `Solicitud #${repairRequest.id}`,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Solicitud #${repairRequest.id}`} />

            <div className="py-12">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:px-6 lg:grid-cols-3 lg:px-8">
                    <div className="flex items-center justify-between lg:col-span-3">
                        <h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">
                            Detalle de Solicitud #{repairRequest.id}
                        </h2>
                        <Button variant="outline" size="sm" asChild>
                            <a href="/repairs">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                <span className="ml-2">Volver</span>
                            </a>
                        </Button>
                    </div>

                    {/* Main Info */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Información del Material</span>
                                    <Badge
                                        className={getStatusColor(
                                            repairRequest.status,
                                        )}
                                    >
                                        {getStatusLabel(repairRequest.status)}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label className="text-muted-foreground">
                                        Material
                                    </Label>
                                    <p className="font-medium">
                                        {repairRequest.material.product_name}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Marca / Modelo
                                    </Label>
                                    <p className="font-medium">
                                        {repairRequest.material.brand} /{' '}
                                        {repairRequest.material.model}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        N° Serie
                                    </Label>
                                    <p className="font-medium">
                                        {repairRequest.material.serial_number ||
                                            '-'}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">
                                        Solicitado por
                                    </Label>
                                    <p className="font-medium">
                                        {repairRequest.requester.name}
                                    </p>
                                </div>
                                <div className="sm:col-span-2">
                                    <Label className="text-muted-foreground">
                                        Descripción del Problema
                                    </Label>
                                    <p className="mt-1 rounded-md border p-3 text-sm">
                                        {repairRequest.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Inspector Evaluation */}
                        {(repairRequest.status !== 'PENDING' ||
                            repairRequest.inspection_date) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Evaluación Técnica</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="text-muted-foreground">
                                                Inspector
                                            </Label>
                                            <p className="font-medium">
                                                {repairRequest.inspector?.name}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">
                                                Fecha Inspección
                                            </Label>
                                            <p className="font-medium">
                                                {formatDate(
                                                    repairRequest.inspection_date,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Observación
                                        </Label>
                                        <p className="mt-1 rounded-md border p-3 text-sm">
                                            {repairRequest.inspection_observation ||
                                                'Sin observaciones.'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Provider & Repair Info */}
                        {['SENT_TO_PROVIDER', 'FINISHED'].includes(
                            repairRequest.status,
                        ) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gestión de Reparación</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="text-muted-foreground">
                                                Proveedor
                                            </Label>
                                            <p className="font-medium">
                                                {repairRequest.provider_name}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">
                                                Fecha Envío
                                            </Label>
                                            <p className="font-medium">
                                                {formatDate(
                                                    repairRequest.delivery_date,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label className="text-muted-foreground">
                                                Trabajo Solicitado
                                            </Label>
                                            <p className="mt-1 rounded-md border p-3 text-sm">
                                                {
                                                    repairRequest.repair_description
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a
                                                href={`/repairs/${repairRequest.id}/provider-act`}
                                                target="_blank"
                                            >
                                                <FileText className="mr-2 h-4 w-4" />
                                                Descargar Acta de Entrega
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Closure Info */}
                        {repairRequest.status === 'FINISHED' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Cierre de Reparación</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label className="text-muted-foreground">
                                                Costo Total
                                            </Label>
                                            <p className="font-mono text-lg font-medium text-green-700">
                                                $
                                                {repairRequest.repair_cost?.toLocaleString(
                                                    'es-CL',
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">
                                                Fecha Retorno
                                            </Label>
                                            <p className="font-medium">
                                                {formatDate(
                                                    repairRequest.return_date,
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">
                                                N° Factura
                                            </Label>
                                            <p className="font-medium">
                                                {repairRequest.invoice_number}
                                            </p>
                                        </div>
                                        {repairRequest.invoice_path && (
                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Factura
                                                </Label>
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={`/storage/${repairRequest.invoice_path}`}
                                                        target="_blank"
                                                    >
                                                        Ver Documento
                                                    </a>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Actions Panel */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {/* Inspector: Receive */}
                                {isInspector &&
                                    repairRequest.status === 'PENDING' && (
                                        <Button
                                            className="w-full"
                                            onClick={handleReceive}
                                            disabled={receiveForm.processing}
                                        >
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            Recepcionar Material
                                        </Button>
                                    )}

                                {/* Inspector: Evaluate */}
                                {isInspector &&
                                    repairRequest.status ===
                                        'RECEIVED_BY_INSPECTOR' && (
                                        <Dialog
                                            open={isEvaluateOpen}
                                            onOpenChange={setIsEvaluateOpen}
                                        >
                                            <DialogTrigger asChild>
                                                <Button className="w-full">
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    Evaluar Solicitud
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Evaluación Técnica
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Determine si el material
                                                        se repara o se da de
                                                        baja.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <Label>Observación</Label>
                                                    <Textarea
                                                        value={
                                                            evaluateForm.data
                                                                .observation
                                                        }
                                                        onChange={(e) =>
                                                            evaluateForm.setData(
                                                                'observation',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Detalle técnico..."
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleEvaluate(
                                                                'REJECTED',
                                                            )
                                                        }
                                                        disabled={
                                                            evaluateForm.processing
                                                        }
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Dar de Baja
                                                    </Button>
                                                    <Button
                                                        onClick={() =>
                                                            handleEvaluate(
                                                                'APPROVED',
                                                            )
                                                        }
                                                        disabled={
                                                            evaluateForm.processing
                                                        }
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Aprobar Reparación
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}

                                {/* Acquisitions: Send to Provider */}
                                {isAcquisitions &&
                                    repairRequest.status === 'APPROVED' && (
                                        <Dialog
                                            open={isSendProviderOpen}
                                            onOpenChange={setIsSendProviderOpen}
                                        >
                                            <DialogTrigger asChild>
                                                <Button className="w-full">
                                                    <Truck className="mr-2 h-4 w-4" />
                                                    Enviar a Proveedor
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Gestionar Envío
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div>
                                                        <Label>
                                                            Nombre Proveedor
                                                        </Label>
                                                        <Input
                                                            className="w-full"
                                                            value={
                                                                sendProviderForm
                                                                    .data
                                                                    .provider_name
                                                            }
                                                            onChange={(e) =>
                                                                sendProviderForm.setData(
                                                                    'provider_name',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>
                                                            Descripción del
                                                            Trabajo
                                                        </Label>
                                                        <Textarea
                                                            value={
                                                                sendProviderForm
                                                                    .data
                                                                    .repair_description
                                                            }
                                                            onChange={(e) =>
                                                                sendProviderForm.setData(
                                                                    'repair_description',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Instrucciones para el proveedor..."
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        onClick={
                                                            handleSendProvider
                                                        }
                                                        disabled={
                                                            sendProviderForm.processing
                                                        }
                                                    >
                                                        Generar Acta
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}

                                {/* Acquisitions: Finish */}
                                {isAcquisitions &&
                                    repairRequest.status ===
                                        'SENT_TO_PROVIDER' && (
                                        <Dialog
                                            open={isFinishOpen}
                                            onOpenChange={setIsFinishOpen}
                                        >
                                            <DialogTrigger asChild>
                                                <Button
                                                    className="w-full"
                                                    variant="outline"
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Finalizar Reparación
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Registrar Factura y
                                                        Costo
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div>
                                                        <Label>
                                                            N° Factura
                                                        </Label>
                                                        <Input
                                                            className="w-full"
                                                            value={
                                                                finishForm.data
                                                                    .invoice_number
                                                            }
                                                            onChange={(e) =>
                                                                finishForm.setData(
                                                                    'invoice_number',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>
                                                            Costo Total ($)
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            className="w-full"
                                                            value={
                                                                finishForm.data
                                                                    .repair_cost
                                                            }
                                                            onChange={(e) =>
                                                                finishForm.setData(
                                                                    'repair_cost',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>
                                                            Archivo Factura
                                                            (PDF/Img)
                                                        </Label>
                                                        <input
                                                            type="file"
                                                            className="w-full text-sm"
                                                            onChange={(e) =>
                                                                finishForm.setData(
                                                                    'invoice_file',
                                                                    e.target
                                                                        .files
                                                                        ? e
                                                                              .target
                                                                              .files[0]
                                                                        : null,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        onClick={handleFinish}
                                                        disabled={
                                                            finishForm.processing
                                                        }
                                                    >
                                                        Finalizar
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}

                                {/* Fallback if no actions */}
                                {!isInspector &&
                                    !isAcquisitions &&
                                    repairRequest.status === 'PENDING' && (
                                        <p className="text-center text-sm text-gray-500">
                                            Esperando recepción por Inspector.
                                        </p>
                                    )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
