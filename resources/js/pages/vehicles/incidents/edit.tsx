import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, AlertTriangle, Calendar, User, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Vehicle {
    id: number;
    name: string;
    company: string;
}

interface Issue {
    id: number;
    vehicle: Vehicle;
    reporter: { name: string };
    description: string;
    severity: string;
    date: string;
    created_at: string;
}

export default function VehicleIncidentEdit({ incident }: { incident: Issue }) {
    const { data, setData, put, processing, errors } = useForm({
        severity: incident.severity,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/vehicles/incidents/${incident.id}/content`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Incidencias', href: '/vehicles/incidents' },
                { title: `Detalle #${incident.id}`, href: `/vehicles/incidents/${incident.id}` },
                { title: 'Editar', href: `/vehicles/incidents/${incident.id}/edit` },
            ]}
        >
            <Head title={`Editar Incidencia #${incident.id}`} />

            <div className="flex h-full flex-col gap-6 p-4 lg:p-8 max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href={`/vehicles/incidents/${incident.id}`}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Editar Incidencia #{incident.id}</h1>
                        <p className="text-muted-foreground text-sm">
                            Modifique el nivel de gravedad de la incidencia reportada para la unidad{' '}
                            <span className="font-semibold text-foreground">{incident.vehicle.name}</span>.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Read-only details card */}
                    <Card className="md:col-span-2 border-none shadow-md ring-1 ring-border">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Detalles del Reporte (Lectura)
                            </CardTitle>
                            <CardDescription>Estos datos no pueden modificarse para mantener la trazabilidad.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        Fecha Detección
                                    </span>
                                    <p className="text-sm font-medium flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        {formatDate(incident.date)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                        Reportado Por
                                    </span>
                                    <p className="text-sm font-medium flex items-center gap-1.5">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        {incident.reporter?.name || 'Sistema'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-1 pt-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                    Descripción del Problema
                                </span>
                                <div className="rounded-lg bg-muted/40 p-3 text-sm leading-relaxed whitespace-pre-line border border-border">
                                    {incident.description}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Edit Form Card */}
                    <Card className="border-none shadow-md ring-1 ring-border">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                Nivel de Gravedad
                            </CardTitle>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="severity">Gravedad</Label>
                                    <Select
                                        onValueChange={(value) => setData('severity', value)}
                                        value={data.severity}
                                    >
                                        <SelectTrigger id="severity" className="w-full">
                                            <SelectValue placeholder="Seleccione severidad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Baja (Observación)</SelectItem>
                                            <SelectItem value="Medium">Media (Reparación necesaria)</SelectItem>
                                            <SelectItem value="High">Alta (Riesgo operativo)</SelectItem>
                                            <SelectItem value="Critical">Crítica (Inoperativo)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.severity && (
                                        <p className="text-xs text-destructive font-medium">{errors.severity}</p>
                                    )}
                                </div>
                            </CardContent>
                            <div className="p-6 pt-0 flex flex-col gap-2">
                                <Button type="submit" disabled={processing} className="w-full">
                                    <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                                </Button>
                                <Button variant="outline" asChild className="w-full">
                                    <Link href={`/vehicles/incidents/${incident.id}`}>
                                        Cancelar
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
