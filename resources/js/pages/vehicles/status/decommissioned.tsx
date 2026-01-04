import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface Vehicle {
    id: number;
    name: string;
    plate: string;
    make: string;
    model: string;
    company: string;
    deleted_at: string;
}

export default function DecommissionedVehicles({
    vehicles,
}: {
    vehicles: Vehicle[];
}) {
    const restoreVehicle = (id: number) => {
        if (confirm('¿Está seguro de restaurar este vehículo?')) {
            router.patch(`/vehicles/${id}/restore`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Material Mayor', href: '/vehicles/dashboard' },
                { title: 'Estado de Carros', href: '/vehicles/status' },
                { title: 'Dados de Baja', href: '/vehicles/decommissioned' },
            ]}
        >
            <Head title="Vehículos Dados de Baja" />
            <div className="flex h-full flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/vehicles/status">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Vehículos Dados de Baja
                        </h1>
                        <p className="text-muted-foreground">
                            Historial de unidades retiradas del servicio.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Unidades</CardTitle>
                        <CardDescription>
                            Estos vehículos no aparecen en los listados activos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Unidad</TableHead>
                                    <TableHead>Patente</TableHead>
                                    <TableHead>Marca/Modelo</TableHead>
                                    <TableHead>Compañía</TableHead>
                                    <TableHead>Fecha Baja</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicles.map((vehicle) => (
                                    <TableRow key={vehicle.id}>
                                        <TableCell className="font-medium">
                                            {vehicle.name}
                                        </TableCell>
                                        <TableCell>{vehicle.plate}</TableCell>
                                        <TableCell>
                                            {vehicle.make} {vehicle.model}
                                        </TableCell>
                                        <TableCell>{vehicle.company}</TableCell>
                                        <TableCell>
                                            {new Date(
                                                vehicle.deleted_at,
                                            ).toLocaleDateString('es-CL')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    restoreVehicle(vehicle.id)
                                                }
                                            >
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                Restaurar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {vehicles.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No hay vehículos dados de baja.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
