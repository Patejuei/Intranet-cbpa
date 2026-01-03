import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Wrench,
} from 'lucide-react';

interface Vehicle {
    id: number;
    name: string;
    make: string;
    model: string;
    year: number;
    plate: string;
    status: 'Operative' | 'Workshop' | 'Out of Service';
    company: string;
    issues?: any[];
    maintenances?: any[];
}

export default function VehicleShow({ vehicle }: { vehicle: Vehicle }) {
    const activeIssue = vehicle.issues?.[0];
    const activeMaintenance = vehicle.maintenances?.[0];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Operative':
                return 'bg-green-100 text-green-800';
            case 'Workshop':
                return 'bg-yellow-100 text-yellow-800';
            case 'Out of Service':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Material Mayor', href: '/vehicles/status' },
                { title: vehicle.name, href: `/vehicles/status/${vehicle.id}` },
            ]}
        >
            <Head title={`Detalle ${vehicle.name}`} />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/vehicles/status">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-bold">
                            {vehicle.name}
                            <Badge className={getStatusColor(vehicle.status)}>
                                {vehicle.status === 'Operative'
                                    ? 'En Servicio'
                                    : vehicle.status === 'Workshop'
                                      ? 'En Taller'
                                      : 'Fuera de Servicio'}
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground">
                            {vehicle.company} - {vehicle.make} {vehicle.model}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Main Info */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Información del Vehículo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Patente
                                    </label>
                                    <p className="text-lg font-semibold">
                                        {vehicle.plate}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Año
                                    </label>
                                    <p className="text-lg font-semibold">
                                        {vehicle.year}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Marca
                                    </label>
                                    <p className="text-lg font-semibold">
                                        {vehicle.make}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Modelo
                                    </label>
                                    <p className="text-lg font-semibold">
                                        {vehicle.model}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Details Widget */}
                    <div className="space-y-6">
                        {vehicle.status === 'Operative' && (
                            <Card className="border-green-200 bg-green-50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-green-800">
                                        <CheckCircle2 className="h-5 w-5" />
                                        Unidad Operativa
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-green-700">
                                        La unidad se encuentra operativa y
                                        disponible para el servicio.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {vehicle.status === 'Out of Service' && activeIssue && (
                            <Card className="border-red-200 bg-red-50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-red-800">
                                        <AlertCircle className="h-5 w-5" />
                                        Fuera de Servicio
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-sm font-medium text-red-900">
                                        Motivo:
                                    </p>
                                    <p className="text-sm text-red-800">
                                        {activeIssue.description}
                                    </p>
                                    <div className="mt-2 flex gap-2 text-xs text-red-700">
                                        <Calendar className="h-3 w-3" />{' '}
                                        {activeIssue.date
                                            ? new Date(
                                                  activeIssue.date,
                                              ).toLocaleDateString()
                                            : new Date(
                                                  activeIssue.created_at,
                                              ).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {vehicle.status === 'Workshop' && activeMaintenance && (
                            <Card className="border-yellow-200 bg-yellow-50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-yellow-800">
                                        <Wrench className="h-5 w-5" />
                                        En Taller
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-sm font-medium text-yellow-900">
                                        Taller:{' '}
                                        {activeMaintenance.workshop_name}
                                    </p>
                                    <p className="text-sm text-yellow-800">
                                        {activeMaintenance.description}
                                    </p>
                                    <div className="mt-2 flex gap-2 text-xs text-yellow-700">
                                        <Calendar className="h-3 w-3" />{' '}
                                        Ingreso:{' '}
                                        {new Date(
                                            activeMaintenance.entry_date,
                                        ).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
