import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Eye, Plus } from 'lucide-react';
import { useState } from 'react';

interface Vehicle {
    id: number;
    name: string;
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
}

export default function VehicleIncidents({
    issues,
    vehicles,
}: {
    issues: any;
    vehicles: Vehicle[];
}) {
    const { auth } = usePage().props as any;
    const [open, setOpen] = useState(false);

    // Review Modal State
    const [reviewOpen, setReviewOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const {
        data: reviewData,
        setData: setReviewData,
        put: putReview,
        processing: reviewProcessing,
        reset: resetReview,
    } = useForm({
        is_stopped: false,
        sent_to_hq: false,
        sent_to_workshop: false,
    });

    const { data, setData, post, processing, errors, reset } = useForm({
        vehicle_id: '',
        description: '',
        severity: 'Low',
        date: format(new Date(), 'yyyy-MM-dd'),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vehicles/incidents', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedIssue) return;

        putReview(`/vehicles/incidents/${selectedIssue.id}`, {
            onSuccess: () => {
                setReviewOpen(false);
                resetReview();
                setSelectedIssue(null);
            },
        });
    };

    const openReview = (issue: Issue) => {
        setSelectedIssue(issue);
        setReviewData({
            is_stopped: issue.is_stopped,
            sent_to_hq: issue.sent_to_hq,
            sent_to_workshop: issue.sent_to_workshop,
        });
        setReviewOpen(true);
    };

    const markAsRead = (issue: Issue) => {
        router.patch(
            `/vehicles/incidents/${issue.id}/mark-read`,
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
                return 'destructive'; // Or warning
            case 'Medium':
                return 'secondary'; // Or yellow-ish
            default:
                return 'outline';
        }
    };

    const isCaptain =
        auth.user.role === 'capitan' ||
        auth.user.role === 'admin' ||
        auth.user.company === 'Comandancia';
    const isWorkshop =
        auth.user.role === 'mechanic' || auth.user.role === 'admin';
    const isHQ =
        auth.user.company === 'Comandancia' || auth.user.role === 'admin';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Material Mayor', href: '/vehicles/dashboard' },
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
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Nueva
                                Incidencia
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
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
                                        <Select
                                            onValueChange={(value) =>
                                                setData('vehicle_id', value)
                                            }
                                            value={data.vehicle_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione unidad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {vehicles.map((v) => (
                                                    <SelectItem
                                                        key={v.id}
                                                        value={v.id.toString()}
                                                    >
                                                        {v.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                                    Media (Reparación necesaria)
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
                                                setData('date', e.target.value)
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

                                    {/* is_stopped removed for generic input */}
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={processing}>
                                        Reportar
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Review Modal for Captains */}
                    <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={handleReviewSubmit}>
                                <DialogHeader>
                                    <DialogTitle>
                                        Revisión de Incidencia
                                    </DialogTitle>
                                    <DialogDescription>
                                        Determinar acciones a seguir para{' '}
                                        {selectedIssue?.vehicle.name}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="flex items-center space-x-2">
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
                                        <Label
                                            htmlFor="review_is_stopped"
                                            className="font-bold text-destructive"
                                        >
                                            Material Fuera de Servicio
                                        </Label>
                                    </div>

                                    <div className="space-y-2 border-t pt-4">
                                        <h4 className="text-sm font-medium">
                                            Notificaciones
                                        </h4>
                                        <div className="flex items-center space-x-2">
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
                                            <Label htmlFor="sent_to_hq">
                                                Reportar a Comandancia
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="sent_to_workshop"
                                                checked={
                                                    reviewData.sent_to_workshop
                                                }
                                                onCheckedChange={(checked) =>
                                                    setReviewData(
                                                        'sent_to_workshop',
                                                        checked as boolean,
                                                    )
                                                }
                                            />
                                            <Label htmlFor="sent_to_workshop">
                                                Reportar a Taller Mecánico
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={reviewProcessing}
                                    >
                                        Guardar Revisión
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
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
                                        <td className="max-w-[300px] truncate p-4 align-middle">
                                            {issue.description}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col gap-1">
                                                {issue.is_stopped && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="w-fit"
                                                    >
                                                        Detenido
                                                    </Badge>
                                                )}
                                                {!issue.reviewed_at && (
                                                    <Badge
                                                        variant="outline"
                                                        className="w-fit border-yellow-500 text-yellow-600"
                                                    >
                                                        Pendiente Revisión
                                                    </Badge>
                                                )}
                                                {issue.reviewed_at && (
                                                    <Badge
                                                        variant="outline"
                                                        className="w-fit border-blue-500 text-blue-600"
                                                    >
                                                        Revisado
                                                    </Badge>
                                                )}
                                                {issue.sent_to_hq && (
                                                    <Badge
                                                        variant={
                                                            issue.hq_read_at
                                                                ? 'secondary'
                                                                : 'outline'
                                                        }
                                                        className="w-fit text-xs"
                                                    >
                                                        {issue.hq_read_at
                                                            ? 'Visto Comandancia'
                                                            : 'Enviado Comandancia'}
                                                    </Badge>
                                                )}
                                                {issue.sent_to_workshop && (
                                                    <Badge
                                                        variant={
                                                            issue.workshop_read_at
                                                                ? 'secondary'
                                                                : 'outline'
                                                        }
                                                        className="w-fit text-xs"
                                                    >
                                                        {issue.workshop_read_at
                                                            ? 'Visto Taller'
                                                            : 'Enviado Taller'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {issue.reporter?.name ||
                                                'Desconocido'}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex gap-2">
                                                {isCaptain && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            openReview(issue)
                                                        }
                                                    >
                                                        Revisar
                                                    </Button>
                                                )}
                                                {isWorkshop &&
                                                    issue.sent_to_workshop &&
                                                    !issue.workshop_read_at && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                markAsRead(
                                                                    issue,
                                                                )
                                                            }
                                                            title="Marcar como Visto"
                                                        >
                                                            <Eye className="mr-1 size-4" />{' '}
                                                            Taller
                                                        </Button>
                                                    )}
                                                {isHQ &&
                                                    issue.sent_to_hq &&
                                                    !issue.hq_read_at && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                markAsRead(
                                                                    issue,
                                                                )
                                                            }
                                                            title="Marcar como Visto"
                                                        >
                                                            <Eye className="mr-1 size-4" />{' '}
                                                            HQ
                                                        </Button>
                                                    )}
                                            </div>
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
            </div>
        </AppLayout>
    );
}
