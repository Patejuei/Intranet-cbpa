
import { ExportIncidentsDialog } from '@/components/vehicles/export-incidents-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Combobox } from '@/components/ui/combobox';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import  Pagination  from '@/components/Pagination';
import { Textarea } from '@/components/ui/textarea';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Eye, FileSpreadsheet, Plus, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

interface Vehicle {
    id: number;
    name: string;
    company?: string | null;
}

interface Issue {
    id: number;
    vehicle: Vehicle;
    reporter: { name: string };
    description: string;
    severity: string;
    is_stopped: boolean;
    status: string;
    date: string;
    created_at: string;
    reviewed_at?: string;
    reviewed_by?: number;
    sent_to_hq: boolean;
    sent_to_workshop: boolean;
    workshop_read_at?: string;
    hq_read_at?: string;
    reported_to_commander: boolean;
    commander_seen: boolean;
    images_count?: number;
}

export default function VehicleIncidents({
    issues,
    vehicles,
}: {
    issues: any;
    vehicles: Vehicle[];
}) {
    const { canCreate } = usePermissions();
    const [open, setOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<{
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

    const cleanUpPreviews = () => {
        imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        setImagePreviews([]);
        setImageClientError(null);
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            cleanUpPreviews();
            reset();
            clearErrors();
        }
    };

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vehicles/incidents', {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                cleanUpPreviews();
                reset();
            },
        });
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

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Incidencias', href: '/vehicles/incidents' },
            ]}
        >
            <Head title="Registro de Incidencias" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Registro de Incidencias
                        </h1>
                        <p className="text-muted-foreground">
                            Reporte y seguimiento de problemas mecánicos.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {canCreate('vehicles.incidents') && (
                            <Dialog open={open} onOpenChange={handleOpenChange}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" /> Nueva
                                        Incidencia
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
                                    <form onSubmit={handleSubmit}>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Reportar Incidencia
                                            </DialogTitle>
                                            <DialogDescription>
                                                Ingrese los detalles del problema
                                                detectado en la unidad.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="vehicle">
                                                    Vehículo
                                                </Label>
                                                <Combobox
                                                    options={vehicles.map((v) => ({
                                                        value: v.id.toString(),
                                                        label: v.name,
                                                    }))}
                                                    value={data.vehicle_id}
                                                    onChange={(value) =>
                                                        setData('vehicle_id', value)
                                                    }
                                                    placeholder="Seleccione unidad"
                                                    searchPlaceholder="Buscar unidad..."
                                                    searchInDescription={false}
                                                />
                                                {errors.vehicle_id && (
                                                    <p className="text-sm text-destructive">
                                                        {errors.vehicle_id}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="severity">
                                                    Severidad
                                                </Label>
                                                <Select
                                                    onValueChange={(value) =>
                                                        setData('severity', value)
                                                    }
                                                    value={data.severity}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Nivel de Gravedad" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Low">
                                                            Baja (Observación)
                                                        </SelectItem>
                                                        <SelectItem value="Medium">
                                                            Media (Reparación
                                                            necesaria)
                                                        </SelectItem>
                                                        <SelectItem value="High">
                                                            Alta (Riesgo operativo)
                                                        </SelectItem>
                                                        <SelectItem value="Critical">
                                                            Crítica (Inoperativo)
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="date">
                                                    Fecha Detección
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={data.date}
                                                    onChange={(e) =>
                                                        setData(
                                                            'date',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="description">
                                                    Descripción del Problema
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={(e) =>
                                                        setData(
                                                            'description',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Detalle el problema, observaciones, etc."
                                                />
                                                {errors.description && (
                                                    <p className="text-sm text-destructive">
                                                        {errors.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Apartado para adjuntar imágenes */}
                                            <div className="grid gap-2 border-t pt-3">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="incident_images" className="flex items-center gap-1.5 font-medium">
                                                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                        Adjuntar Imágenes (Opcional)
                                                    </Label>
                                                    <span className="text-xs text-muted-foreground">
                                                        {data.images.length}/3 seleccionadas
                                                    </span>
                                                </div>

                                                {data.images.length < 3 && (
                                                    <div className="relative">
                                                        <Input
                                                            id="incident_images"
                                                            type="file"
                                                            multiple
                                                            accept="image/jpeg,image/png,image/webp,image/jpg"
                                                            onChange={handleImageChange}
                                                            className="cursor-pointer file:cursor-pointer"
                                                        />
                                                    </div>
                                                )}

                                                {imageClientError && (
                                                    <p className="text-xs text-destructive font-medium">
                                                        {imageClientError}
                                                    </p>
                                                )}

                                                {errors.images && (
                                                    <p className="text-xs text-destructive font-medium">
                                                        {errors.images}
                                                    </p>
                                                )}

                                                {imagePreviews.length > 0 && (
                                                    <div className="grid grid-cols-3 gap-2 pt-2">
                                                        {imagePreviews.map((preview, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="relative group rounded-md border overflow-hidden aspect-video bg-muted/40"
                                                            >
                                                                <img
                                                                    src={preview}
                                                                    alt={`Vista previa ${idx + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImage(idx)}
                                                                    className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-1 rounded-full transition-opacity opacity-90 hover:opacity-100"
                                                                    title="Quitar imagen"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </button>
                                                                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm truncate max-w-[85%]">
                                                                    {data.images[idx]?.name}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <p className="text-[11px] text-muted-foreground">
                                                    Formatos permitidos: JPEG, PNG, JPG, WEBP. Máx. 3 imágenes (5MB c/u).
                                                </p>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing ? 'Reportando...' : 'Reportar'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => setReportModalOpen(true)}
                        >
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Reporte Excel
                        </Button>
                    </div>
                </div>

                <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Fecha
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Unidad
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Gravedad
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Descripción
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Estado
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Reportado Por
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {issues.data.map((issue: Issue) => (
                                    <tr
                                        key={issue.id}
                                        className="border-b transition-colors hover:bg-muted/50"
                                    >
                                        <td className="p-4 align-middle">
                                            {issue.date}
                                        </td>
                                        <td className="p-4 align-middle font-medium">
                                            {issue.vehicle.name}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge
                                                variant={
                                                    getSeverityColor(
                                                        issue.severity,
                                                    ) as any
                                                }
                                            >
                                                {issue.severity}
                                            </Badge>
                                        </td>
                                        <td className="min-w-[300px] p-4 align-middle">
                                            <div className="flex flex-col gap-1 whitespace-pre-line">
                                                <span>{issue.description}</span>
                                                {issue.images_count ? issue.images_count > 0 ? (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <ImageIcon className="h-3.5 w-3.5" />
                                                        <span>{issue.images_count} {issue.images_count === 1 ? 'imagen' : 'imágenes'}</span>
                                                    </div>
                                                ) : null : null}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col gap-1">
                                                {issue.status === 'Resolved' ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="w-fit border-green-500 bg-green-50 text-green-700"
                                                    >
                                                        Resuelto
                                                    </Badge>
                                                ) : issue.status === 'En Taller' ? (
                                                    <Badge
                                                        variant="secondary"
                                                        className="w-fit bg-blue-100 text-blue-700 hover:bg-blue-100/80"
                                                    >
                                                        En Taller
                                                    </Badge>
                                                ) : !issue.reviewed_at ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="w-fit border-yellow-500 text-yellow-600"
                                                    >
                                                        Pendiente Revisión
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="w-fit border-blue-500 text-blue-600"
                                                    >
                                                        Revisado
                                                    </Badge>
                                                )}
                                                {issue.is_stopped && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="w-fit text-[10px]"
                                                    >
                                                        Detenido
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {issue.reporter?.name ||
                                                'Desconocido'}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                asChild
                                            >
                                                <Link href={`/vehicles/incidents/${issue.id}`}>
                                                    <Eye className="mr-2 size-4" /> Ver
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {issues.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="p-4 text-center text-muted-foreground"
                                        >
                                            No hay incidencias registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination links={issues.links} />

                <ExportIncidentsDialog
                    open={reportModalOpen}
                    onOpenChange={setReportModalOpen}
                    vehicles={vehicles}
                />
            </div>
        </AppLayout>
    );
}
