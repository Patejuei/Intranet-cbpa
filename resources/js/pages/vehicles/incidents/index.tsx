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
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
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
}

export default function VehicleIncidents({
    issues,
    vehicles,
}: {
    issues: any;
    vehicles: Vehicle[];
}) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        vehicle_id: '',
        description: '',
        severity: 'Low',
        is_stopped: false,
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
                                            id="date"
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
                                            placeholder="Detalle el problema..."
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-destructive">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_stopped"
                                            checked={data.is_stopped}
                                            onCheckedChange={(checked) =>
                                                setData(
                                                    'is_stopped',
                                                    checked as boolean,
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor="is_stopped"
                                            className="font-medium text-destructive"
                                        >
                                            Material Detenido (Fuera de
                                            Servicio)
                                        </Label>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={processing}>
                                        Reportar
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
                                            {issue.is_stopped && (
                                                <Badge
                                                    variant="destructive"
                                                    className="mr-2"
                                                >
                                                    Detenido
                                                </Badge>
                                            )}
                                            {issue.status}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {issue.reporter?.name ||
                                                'Desconocido'}
                                        </td>
                                    </tr>
                                ))}
                                {issues.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
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
