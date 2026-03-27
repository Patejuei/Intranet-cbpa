import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Download, ExternalLink, Fuel, Gauge, MapPin, User as UserIcon } from 'lucide-react';

interface Vehicle {
    id: number;
    name: string;
    company: string;
}

interface Log {
    id: number;
    vehicle: Vehicle;
    driver: { name: string };
    start_km: number;
    end_km: number | null;
    activity_type: string;
    destination: string;
    date: string;
    departure_time: string;
    arrival_time: string;
    fuel_liters: number | null;
    fuel_coupon: string | null;
    receipt_path: string | null;
    observations: string | null;
}

export default function VehicleLogShow({ log }: { log: Log }) {
    const traveledKm = (log.end_km && log.start_km) ? log.end_km - log.start_km : null;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Material Mayor', href: '/vehicles/dashboard' },
                { title: 'Bitácora', href: '/vehicles/logs' },
                { title: `Detalle #${log.id}`, href: `/vehicles/logs/${log.id}` },
            ]}
        >
            <Head title={`Detalle Bitácora #${log.id}`} />
            <div className="flex h-full flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/vehicles/logs">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Detalle de Bitácora #{log.id}</h1>
                        <p className="text-muted-foreground">
                            Registro de movimiento de la unidad {log.vehicle.name}.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Gauge className="h-5 w-5 text-primary" />
                                    Información del Movimiento
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs font-medium uppercase text-muted-foreground">Fecha</p>
                                            <p className="font-semibold">{formatDate(log.date)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs font-medium uppercase text-muted-foreground">Horario</p>
                                            <p className="font-semibold">
                                                {log.departure_time || '--:--'} - {log.arrival_time || '--:--'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <UserIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs font-medium uppercase text-muted-foreground">Conductor/Responsable</p>
                                            <p className="font-semibold">{log.driver?.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs font-medium uppercase text-muted-foreground">Destino</p>
                                            <p className="font-semibold">{log.destination}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Gauge className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs font-medium uppercase text-muted-foreground">Kilometraje</p>
                                            <div className="space-y-1">
                                                <p className="text-sm">Inicio: <span className="font-semibold">{log.start_km} km</span></p>
                                                <p className="text-sm">Término: <span className="font-semibold">{log.end_km ? `${log.end_km} km` : 'En proceso'}</span></p>
                                                {traveledKm !== null && (
                                                    <Badge variant="secondary" className="mt-1">
                                                        Recorrido: {traveledKm} km
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium uppercase text-muted-foreground">Actividad</p>
                                        <Badge className="mt-1" variant="outline">{log.activity_type}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {log.observations && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Observaciones</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap rounded-md bg-muted/50 p-4 text-sm italic">
                                        "{log.observations}"
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Fuel className="h-5 w-5 text-primary" />
                                    Carga de Combustible
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs font-medium uppercase text-muted-foreground">Litros Cargados</p>
                                    <p className="text-lg font-bold">{log.fuel_liters ? `${log.fuel_liters} L` : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium uppercase text-muted-foreground">Nº Cupón / Vale</p>
                                    <p className="font-semibold">{log.fuel_coupon || 'N/A'}</p>
                                </div>

                                {log.receipt_path && (
                                    <div className="mt-6 space-y-3">
                                        <p className="text-xs font-medium uppercase text-muted-foreground">Comprobante de Carga</p>
                                        <div className="group relative overflow-hidden rounded-lg border shadow-sm">
                                            {log.receipt_path.toLowerCase().endsWith('.pdf') ? (
                                                <div className="flex h-32 flex-col items-center justify-center bg-muted text-muted-foreground">
                                                    <Download className="mb-2 h-8 w-8" />
                                                    <span className="text-xs font-medium">Documento PDF</span>
                                                </div>
                                            ) : (
                                                <img 
                                                    src={`/storage/${log.receipt_path}`} 
                                                    alt="Boleta de carga" 
                                                    className="aspect-square h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="secondary" asChild>
                                                        <a href={`/storage/${log.receipt_path}`} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="mr-2 h-4 w-4" /> Ver
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <Button className="w-full" variant="outline" asChild>
                                            <a href={`/storage/${log.receipt_path}`} download={`boleta_${log.id}`}>
                                                <Download className="mr-2 h-4 w-4" /> Descargar Boleta
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
