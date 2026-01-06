import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Plus, Wrench } from 'lucide-react';

interface Vehicle {
    id: number;
    name: string; // e.g., B-1
    make: string;
    model: string;
    plate: string;
    status: 'Operative' | 'Workshop' | 'Out of Service';
    company: string;
}

interface PageProps {
    groupedVehicles?: Record<string, Vehicle[]>;
    vehicles?: Vehicle[];
    isComandancia: boolean;
    userCompany?: string;
    auth: {
        user: {
            role: string;
        };
    };
}

import { usePermissions } from '@/hooks/use-permissions';

export default function VehicleStatus({
    groupedVehicles,
    vehicles,
    isComandancia,
    userCompany,
    auth,
}: PageProps) {
    const { canCreate } = usePermissions();
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Operative':
                return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'Workshop':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            case 'Out of Service':
                return 'bg-red-100 text-red-800 hover:bg-red-100';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Operative':
                return <CheckCircle2 className="h-4 w-4 text-green-600" />;
            case 'Workshop':
                return <Wrench className="h-4 w-4 text-yellow-600" />;
            case 'Out of Service':
                return <AlertCircle className="h-4 w-4 text-red-600" />;
            default:
                return null;
        }
    };

    const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => (
        <Link href={`/vehicles/status/${vehicle.id}`}>
            <Card className="h-full transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold">
                            {vehicle.name}
                        </CardTitle>
                        <Badge
                            variant="secondary"
                            className={getStatusColor(vehicle.status)}
                        >
                            <span className="flex items-center gap-1">
                                {getStatusIcon(vehicle.status)}
                                {vehicle.status === 'Operative'
                                    ? 'En Servicio'
                                    : vehicle.status === 'Workshop'
                                      ? 'En Taller'
                                      : 'Fuera de Servicio'}
                            </span>
                        </Badge>
                    </div>
                    <CardDescription>
                        {vehicle.make} {vehicle.model}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-2 text-sm text-muted-foreground">
                        PPU: {vehicle.plate}
                    </p>
                    <Button variant="outline" className="w-full">
                        Ver Detalles
                    </Button>
                </CardContent>
            </Card>
        </Link>
    );

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Estado de Carros', href: '/vehicles/status' },
            ]}
        >
            <Head title="Estado de Carros" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Estado de la Flota
                        </h1>
                        <p className="text-muted-foreground">
                            {isComandancia
                                ? 'Vista General de todas las compañías.'
                                : `Vehículos de ${userCompany}`}
                        </p>
                    </div>
                    {canCreate('vehicles.status') && (
                        <Button asChild>
                            <Link href="/vehicles/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Vehículo
                            </Link>
                        </Button>
                    )}
                </div>

                {isComandancia && groupedVehicles ? (
                    <Accordion type="multiple" className="w-full space-y-4">
                        {Object.entries(groupedVehicles).map(
                            ([company, companyVehicles], index) => (
                                <AccordionItem
                                    key={company}
                                    value={company}
                                    className="rounded-lg border px-4"
                                >
                                    <AccordionTrigger className="py-4 hover:no-underline">
                                        <div className="flex items-center gap-4">
                                            <span className="text-lg font-semibold">
                                                {company}
                                            </span>
                                            <Badge variant="outline">
                                                {companyVehicles.length}{' '}
                                                Unidades
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 pb-4">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                            {companyVehicles.map((vehicle) => (
                                                <VehicleCard
                                                    key={vehicle.id}
                                                    vehicle={vehicle}
                                                />
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ),
                        )}
                    </Accordion>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {vehicles?.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
