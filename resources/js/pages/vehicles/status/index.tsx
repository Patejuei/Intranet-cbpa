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
    year: number;
    plate: string;
    status: 'Operative' | 'Workshop' | 'Out of Service';
    company: string;
    coupon_number?: string | null;
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
                return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
            case 'Workshop':
                return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
            case 'Out of Service':
                return 'bg-destructive/10 text-destructive border-destructive/20';
            default:
                return 'bg-muted text-muted-foreground border-border/40';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Operative':
                return <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />;
            case 'Workshop':
                return <Wrench className="size-3.5 text-amber-600 dark:text-amber-400" />;
            case 'Out of Service':
                return <AlertCircle className="size-3.5 text-destructive" />;
            default:
                return null;
        }
    };

    const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => (
        <Link href={`/vehicles/status/${vehicle.id}`} className="group block h-full">
            <Card className="h-full rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-primary/50 hover:shadow-sm active:scale-[0.99] flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between gap-2 pb-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                            {vehicle.name}
                        </CardTitle>
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border whitespace-nowrap shrink-0 ${getStatusColor(vehicle.status)}`}
                        >
                            {getStatusIcon(vehicle.status)}
                            {vehicle.status === 'Operative'
                                ? 'En Servicio'
                                : vehicle.status === 'Workshop'
                                  ? 'En Taller'
                                  : 'Fuera de Servicio'}
                        </span>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground font-medium truncate pb-3" title={`${vehicle.make} ${vehicle.model}`}>
                        {vehicle.make} {vehicle.model}
                    </CardDescription>
                    <div className="space-y-1.5 py-2 border-t border-border/40">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">PPU:</span>
                            <span className="font-mono font-medium text-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/40">
                                {vehicle.plate}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Cupón:</span>
                            <span className="font-medium text-foreground">
                                {vehicle.coupon_number || '-'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="pt-3 border-t border-border/40">
                    <Button variant="outline" size="sm" className="w-full text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                        Ver Detalles
                    </Button>
                </div>
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
            <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Estado de la Flota
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {isComandancia
                                ? auth.user?.role === 'cuartelero'
                                    ? 'Vehículos asignados agrupados por compañía.'
                                    : 'Vista General de todas las compañías.'
                                : `Vehículos de ${userCompany}`}
                        </p>
                    </div>
                    {canCreate('vehicles.status') && (
                        <Button asChild>
                            <Link href="/vehicles/create">
                                <Plus className="mr-2 size-4" />
                                Nuevo Vehículo
                            </Link>
                        </Button>
                    )}
                </div>

                {isComandancia && groupedVehicles ? (
                    <Accordion type="multiple" className="w-full space-y-4">
                        {Object.entries(groupedVehicles).map(
                            ([company, companyVehicles]) => (
                                <AccordionItem
                                    key={company}
                                    value={company}
                                    className="rounded-2xl border border-border/70 bg-card px-4 sm:px-6 shadow-xs overflow-hidden"
                                >
                                    <AccordionTrigger className="py-4 hover:no-underline text-foreground">
                                        <div className="flex items-center gap-3">
                                            <span className="text-base sm:text-lg font-semibold tracking-tight">
                                                {company}
                                            </span>
                                            <Badge variant="outline" className="border-border/60 font-medium">
                                                {companyVehicles.length} {companyVehicles.length === 1 ? 'Unidad' : 'Unidades'}
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2 pb-5">
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
