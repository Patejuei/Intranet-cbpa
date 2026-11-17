import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Image as ImageIcon,
    Plus,
    Trash2,
    Truck,
    Upload,
} from 'lucide-react';

interface Vehicle {
    id: number;
    name: string;
    company?: string | null;
}

export default function VehicleIncidentCreate({
    vehicles,
}: {
    vehicles: Vehicle[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        vehicle_id: string;
        description: string;
        severity: string;
        date: string;
        images: File[];
    }>({
        vehicle_id: '',
        description: '',
        severity: 'Low',
        date: format(new Date(), 'yyyy-MM-dd'),
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageClientError, setImageClientError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        setImageClientError(null);

        if (data.images.length + files.length > 3) {
            setImageClientError('Solo se pueden adjuntar hasta 3 imágenes en total.');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        const validFiles: File[] = [];

        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                setImageClientError('Formato no permitido. Solo se aceptan JPEG, PNG, JPG y WEBP.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setImageClientError('Cada imagen no debe superar los 5MB.');
                return;
            }
            validFiles.push(file);
        }

        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setData('images', [...data.images, ...validFiles]);
        setImagePreviews((prev) => [...prev, ...newPreviews]);
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        const nextImages = data.images.filter((_, i) => i !== index);
        const nextPreviews = imagePreviews.filter((_, i) => i !== index);
        setData('images', nextImages);
        setImagePreviews(nextPreviews);
        setImageClientError(null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vehicles/incidents');
    };

    const severityOptions = [
        {
            value: 'Low',
            label: 'Baja',
            desc: 'Observación menor, unidad totalmente operativa',
            color: 'border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400',
        },
        {
            value: 'Medium',
            label: 'Media',
            desc: 'Reparación requerida, requiere seguimiento',
            color: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400',
        },
        {
            value: 'High',
            label: 'Alta',
            desc: 'Riesgo operativo, evaluar disponibilidad',
            color: 'border-orange-500/30 bg-orange-500/5 text-orange-600 dark:text-orange-400',
        },
        {
            value: 'Critical',
            label: 'Crítica',
            desc: 'Falla grave, unidad queda inoperativa',
            color: 'border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400',
        },
    ];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Incidencias', href: '/vehicles/incidents' },
                { title: 'Reportar Incidencia', href: '/vehicles/incidents/create' },
            ]}
        >
            <Head title="Reportar Incidencia de Vehículo" />

            <div className="flex h-full flex-col gap-6 p-4 sm:p-6">
                <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Reportar Incidencia
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Registro de fallas, observaciones y novedades en unidades institucionales.
                        </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/vehicles/incidents">
                            <ArrowLeft className="mr-2 size-4" />
                            Volver a Incidencias
                        </Link>
                    </Button>
                </div>

                <div className="mx-auto w-full max-w-3xl">
                    <Card className="rounded-2xl border border-border/70 bg-card shadow-xs">
                        <CardHeader className="border-b border-border/60 pb-5">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                                    <AlertTriangle className="size-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">
                                        Nueva Incidencia Operativa
                                    </CardTitle>
                                    <CardDescription>
                                        Ingrese el desperfecto o problema detectado. Se notificará a los mandos correspondientes.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Unidad y Fecha */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicle" className="flex items-center gap-1.5 text-sm font-medium">
                                            <Truck className="size-3.5 text-muted-foreground" />
                                            Vehículo Afectado <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            onValueChange={(val) => setData('vehicle_id', val)}
                                            value={data.vehicle_id}
                                        >
                                            <SelectTrigger id="vehicle" className="h-10">
                                                <SelectValue placeholder="Seleccione unidad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {vehicles.map((v) => (
                                                    <SelectItem
                                                        key={v.id}
                                                        value={v.id.toString()}
                                                    >
                                                        {v.name} {v.company ? `(${v.company})` : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.vehicle_id && (
                                            <p className="text-xs font-medium text-destructive">
                                                {errors.vehicle_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date" className="flex items-center gap-1.5 text-sm font-medium">
                                            <Calendar className="size-3.5 text-muted-foreground" />
                                            Fecha de Detección <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            className="h-10"
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                            onClick={(e) => e.currentTarget.showPicker?.()}
                                        />
                                        {errors.date && (
                                            <p className="text-xs font-medium text-destructive">
                                                {errors.date}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Severidad con tarjetas segmentadas */}
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-1.5 text-sm font-medium">
                                        <AlertTriangle className="size-3.5 text-muted-foreground" />
                                        Nivel de Severidad <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {severityOptions.map((opt) => {
                                            const isSelected = data.severity === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setData('severity', opt.value)}
                                                    className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                                                        isSelected
                                                            ? `${opt.color} ring-2 ring-primary/40 border-primary font-medium`
                                                            : 'border-border/70 hover:bg-muted/30 text-muted-foreground'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between w-full mb-1">
                                                        <span className="text-sm font-semibold text-foreground">
                                                            {opt.label}
                                                        </span>
                                                        {isSelected && (
                                                            <CheckCircle2 className="size-4 text-primary" />
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground leading-snug">
                                                        {opt.desc}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.severity && (
                                        <p className="text-xs font-medium text-destructive">
                                            {errors.severity}
                                        </p>
                                    )}
                                </div>

                                {/* Descripción del Problema */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="flex items-center gap-1.5 text-sm font-medium">
                                        <FileText className="size-3.5 text-muted-foreground" />
                                        Descripción del Problema <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Detalle de forma precisa el síntoma, ruido, fuga, falla o anomalía observada..."
                                        className="min-h-[110px] resize-y rounded-xl"
                                    />
                                    {errors.description && (
                                        <p className="text-xs font-medium text-destructive">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* Evidencias Fotográficas */}
                                <div className="rounded-xl border border-border/70 bg-muted/20 p-4 transition-colors sm:p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <ImageIcon className="size-4 text-primary" />
                                                <Label htmlFor="images" className="text-sm font-semibold cursor-pointer">
                                                    Fotografías de Respaldo
                                                </Label>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Hasta 3 imágenes (máx 5MB c/u en JPG, PNG o WEBP).
                                            </p>
                                        </div>
                                        <span className="text-xs font-mono font-medium text-muted-foreground">
                                            {data.images.length}/3 fotos
                                        </span>
                                    </div>

                                    {data.images.length < 3 && (
                                        <div>
                                            <Input
                                                id="images"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                                multiple
                                                onChange={handleImageChange}
                                                className="h-10 cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted/80"
                                            />
                                        </div>
                                    )}

                                    {imageClientError && (
                                        <p className="text-xs font-medium text-destructive">
                                            {imageClientError}
                                        </p>
                                    )}
                                    {errors.images && (
                                        <p className="text-xs font-medium text-destructive">
                                            {errors.images}
                                        </p>
                                    )}

                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-3 gap-3 pt-2">
                                            {imagePreviews.map((src, index) => (
                                                <div
                                                    key={index}
                                                    className="group relative aspect-video overflow-hidden rounded-xl border border-border/70 bg-background shadow-2xs"
                                                >
                                                    <img
                                                        src={src}
                                                        alt={`Evidencia ${index + 1}`}
                                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute right-1.5 top-1.5 rounded-lg bg-black/70 p-1 text-white hover:bg-destructive transition-colors"
                                                        title="Eliminar imagen"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Botones de acción */}
                                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            reset();
                                            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
                                            setImagePreviews([]);
                                            setImageClientError(null);
                                        }}
                                        disabled={processing}
                                        className="h-10"
                                    >
                                        Limpiar Formulario
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-10 gap-2 px-6 shadow-xs"
                                    >
                                        <Plus className="size-4" />
                                        Reportar Incidencia
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
