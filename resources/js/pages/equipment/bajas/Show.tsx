import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { SharedData, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, Eye, FileText } from 'lucide-react';

// Types
interface MaterialBajaRequest {
    id: number;
    user: User;
    material: {
        id: number;
        product_name: string;
        code: string;
        serial_number: string;
        stock_quantity: number;
    };
    quantity: number;
    reason: string;
    images: string; // JSON string
    status:
        | 'PENDIENTE'
        | 'VALIDADO'
        | 'APROBADO'
        | 'RECHAZADO'
        | 'EN_REPARACION';
    created_at: string;
    validation?: {
        is_reparable: boolean;
        evaluation_notes: string;
        inspector: User;
        created_at: string;
    };
    history?: {
        approved_by: number;
        created_at: string;
    };
}

interface Props extends SharedData {
    bajaRequest: MaterialBajaRequest;
}

export default function ShowBaja({ auth, bajaRequest }: Props) {
    const images = bajaRequest.images
        ? (JSON.parse(bajaRequest.images) as string[])
        : [];

    // Validation Form (Inspector)
    const {
        data: valData,
        setData: setValData,
        post: postVal,
        processing: valProcessing,
        errors: valErrors,
    } = useForm({
        is_reparable: false,
        evaluation_notes: '',
    });

    // Approval Form (Secretary)
    const { post: postApprove, processing: approveProcessing } = useForm({});

    const handleValidationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postVal(`/equipment/bajas/${bajaRequest.id}/validate`);
    };

    const handleApprove = () => {
        if (
            confirm(
                '¿Está seguro de aprobar esta baja? Se descontará el stock permanentemente.',
            )
        ) {
            postApprove(`/equipment/bajas/${bajaRequest.id}/approve`);
        }
    };

    const isInspector =
        auth.user.role === 'inspector_material_menor' ||
        auth.user.role === 'admin';
    const isSecretary =
        auth.user.role === 'secretaria_adquisiciones' ||
        auth.user.role === 'admin';

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDIENTE':
                return (
                    <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    >
                        Pendiente de Validación
                    </Badge>
                );
            case 'VALIDADO':
                return (
                    <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                    >
                        Validado / Esperando Aprobación
                    </Badge>
                );
            case 'APROBADO':
                return (
                    <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 hover:bg-green-100"
                    >
                        Baja Aprobada
                    </Badge>
                );
            case 'RECHAZADO':
                return (
                    <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800 hover:bg-red-100"
                    >
                        Rechazado
                    </Badge>
                );
            case 'EN_REPARACION':
                return (
                    <Badge
                        variant="outline"
                        className="bg-orange-100 text-orange-800 hover:bg-orange-100"
                    >
                        En Reparación
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Solicitudes de Baja', href: '/equipment/bajas' },
                {
                    title: `Solicitud #${bajaRequest.id}`,
                    href: `/equipment/bajas/${bajaRequest.id}`,
                },
            ]}
        >
            <Head title={`Solicitud de Baja #${bajaRequest.id}`} />

            <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 md:p-8">
                {/* Header Info */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h2 className="mb-1 text-3xl font-bold tracking-tight">
                            Solicitud de Baja #{bajaRequest.id}
                        </h2>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="size-4" />
                            <span>
                                {new Date(
                                    bajaRequest.created_at,
                                ).toLocaleString()}
                            </span>
                            <span>•</span>
                            <span>
                                Solicitado por: {bajaRequest.user.name} (
                                {bajaRequest.user.company})
                            </span>
                        </div>
                    </div>
                    <div>
                        {getStatusBadge(bajaRequest.status)}
                        {bajaRequest.status === 'APROBADO' && (
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="ml-2"
                            >
                                <a
                                    href={`/equipment/bajas/${bajaRequest.id}/baja-certificate`}
                                    target="_blank"
                                >
                                    <FileText className="mr-2 size-4" />
                                    Certificado de Baja
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Left Column: Request Details */}
                    <div className="col-span-1 space-y-6 md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalle del Material</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Producto
                                        </Label>
                                        <p className="text-lg font-medium">
                                            {bajaRequest.material.product_name}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Código Interno
                                        </Label>
                                        <p className="font-mono">
                                            {bajaRequest.material.code || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Número de Serie
                                        </Label>
                                        <p className="font-mono">
                                            {bajaRequest.material
                                                .serial_number || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Cantidad a dar de baja
                                        </Label>
                                        <p className="font-medium">
                                            {bajaRequest.quantity} unidades
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <Label className="mb-1 block text-muted-foreground">
                                        Motivo de la Baja
                                    </Label>
                                    <div className="rounded-md border bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                                        {bajaRequest.reason}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Images Carousel/Grid */}
                        {images.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Evidencia Fotográfica</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                        {images.map((img, idx) => (
                                            <a
                                                key={idx}
                                                href={img}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative block aspect-square overflow-hidden rounded-md border"
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Evidencia ${idx + 1}`}
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Eye className="size-8 text-white" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Validation Details (If validated) */}
                        {bajaRequest.validation && (
                            <Card className="border-blue-200 bg-blue-50/20">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="size-5 text-blue-600" />
                                        <CardTitle>
                                            Evaluación Técnica
                                        </CardTitle>
                                    </div>
                                    <CardDescription>
                                        Realizada por{' '}
                                        {bajaRequest.validation.inspector.name}{' '}
                                        el{' '}
                                        {new Date(
                                            bajaRequest.validation.created_at,
                                        ).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="rounded border bg-white p-2">
                                            <Label className="text-xs text-muted-foreground">
                                                Estado Físico
                                            </Label>
                                            <p
                                                className={`font-semibold ${bajaRequest.validation.is_reparable ? 'text-orange-600' : 'text-red-600'}`}
                                            >
                                                {bajaRequest.validation
                                                    .is_reparable
                                                    ? 'REPARABLE'
                                                    : 'DESECHABLE (NO REPARABLE)'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Notas de Evaluación
                                        </Label>
                                        <p className="mt-1 text-sm">
                                            {bajaRequest.validation
                                                .evaluation_notes ||
                                                'Sin observaciones.'}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <a
                                            href={`/equipment/bajas/${bajaRequest.id}/reception-certificate`}
                                            target="_blank"
                                        >
                                            <FileText className="mr-2 size-4" />
                                            Descargar Acta de Recepción
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Actions */}
                    <div className="space-y-6">
                        {/* 1. Inspector Validation Form */}
                        {bajaRequest.status === 'PENDIENTE' && isInspector && (
                            <Card className="border-l-4 border-l-yellow-500 shadow-md">
                                <CardHeader>
                                    <CardTitle>
                                        Validación de Inspector
                                    </CardTitle>
                                    <CardDescription>
                                        Evalúe el material para determinar si
                                        procede la baja o reparación.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleValidationSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label>Diagnóstico</Label>
                                            <div className="flex flex-col gap-2">
                                                <label className="flex cursor-pointer items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                                                    <input
                                                        type="radio"
                                                        name="is_reparable"
                                                        checked={
                                                            valData.is_reparable ===
                                                            true
                                                        }
                                                        onChange={() =>
                                                            setValData(
                                                                'is_reparable',
                                                                true,
                                                            )
                                                        }
                                                        className="size-4"
                                                    />
                                                    <div className="grid">
                                                        <span className="font-medium">
                                                            Es Reparable
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Se enviará a
                                                            reparación (No se da
                                                            de baja del
                                                            inventario)
                                                        </span>
                                                    </div>
                                                </label>
                                                <label className="flex cursor-pointer items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                                                    <input
                                                        type="radio"
                                                        name="is_reparable"
                                                        checked={
                                                            valData.is_reparable ===
                                                            false
                                                        }
                                                        onChange={() =>
                                                            setValData(
                                                                'is_reparable',
                                                                false,
                                                            )
                                                        }
                                                        className="size-4"
                                                    />
                                                    <div className="grid">
                                                        <span className="font-medium">
                                                            Es Desechable
                                                            (Irreparable)
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Se recomienda la
                                                            baja definitiva
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>
                                                Observaciones de Inspección
                                            </Label>
                                            <Textarea
                                                value={valData.evaluation_notes}
                                                onChange={(e) =>
                                                    setValData(
                                                        'evaluation_notes',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Detalles sobre la falla, costo de reparación vs reemplazo, etc."
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={valProcessing}
                                        >
                                            Registrar Validación
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* 2. Secretary Approval */}
                        {bajaRequest.status === 'VALIDADO' && isSecretary && (
                            <Card className="border-l-4 border-l-blue-500 shadow-md">
                                <CardHeader>
                                    <CardTitle>Aprobación Final</CardTitle>
                                    <CardDescription>
                                        El inspector ha validado este material
                                        como <strong>DESECHABLE</strong>.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <AlertCircle className="mb-2 size-8 text-blue-500" />
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        Al aprobar, se descontarán{' '}
                                        <strong>{bajaRequest.quantity}</strong>{' '}
                                        unidades del inventario de forma
                                        permanente y se generará el registro
                                        histórico.
                                    </p>
                                    <Button
                                        onClick={handleApprove}
                                        className="w-full"
                                        disabled={approveProcessing}
                                    >
                                        Aprobar Baja Definitiva
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Status timeline or other info could go here */}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
