import { Badge } from '@/components/ui/badge';
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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';

interface Vehicle {
    id: number;
    name: string;
}

interface Log {
    id: number;
    vehicle: Vehicle;
    driver: { name: string };
    start_km: number;
    end_km: number;
    activity_type: string;
    destination: string;
    date: string;
}

export default function VehicleLogs({
    logs,
    vehicles,
}: {
    logs: any;
    vehicles: Vehicle[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        vehicle_id: '',
        start_km: '',
        end_km: '',
        activity_type: '',
        destination: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        fuel_liters: '',
        fuel_coupon: '',
        has_fuel: false,
        receipt: null as File | null,
        observations: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vehicles/logs', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Material Mayor', href: '/vehicles/dashboard' },
                { title: 'Bitácora', href: '/vehicles/logs' },
            ]}
        >
            <Head title="Bitácora de Máquinas" />
            <div className="flex h-full flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        Bitácora del Material Mayor
                    </h1>
                    <p className="text-muted-foreground">
                        Control de kilometraje y movimientos de las unidades.
                    </p>
                </div>

                <Tabs defaultValue="register" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                        <TabsTrigger value="register">
                            Registrar Movimiento
                        </TabsTrigger>
                        <TabsTrigger value="history">Ver Bitácoras</TabsTrigger>
                    </TabsList>

                    <TabsContent value="register">
                        <Card>
                            <CardHeader>
                                <CardTitle>Nueva Entrada de Bitácora</CardTitle>
                                <CardDescription>
                                    Registre la salida o movimiento de una
                                    unidad.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={submit}
                                    className="max-w-2xl space-y-4"
                                >
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="vehicle">
                                                Vehículo
                                            </Label>
                                            <Select
                                                onValueChange={(val) =>
                                                    setData('vehicle_id', val)
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

                                        <div className="space-y-2">
                                            <Label htmlFor="date">Fecha</Label>
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
                                            {errors.date && (
                                                <p className="text-sm text-destructive">
                                                    {errors.date}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="start_km">
                                                Kilometraje Inicio
                                            </Label>
                                            <Input
                                                type="number"
                                                value={data.start_km}
                                                onChange={(e) =>
                                                    setData(
                                                        'start_km',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {errors.start_km && (
                                                <p className="text-sm text-destructive">
                                                    {errors.start_km}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="end_km">
                                                Kilometraje Fin (Opcional)
                                            </Label>
                                            <Input
                                                type="number"
                                                value={data.end_km}
                                                onChange={(e) =>
                                                    setData(
                                                        'end_km',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {errors.end_km && (
                                                <p className="text-sm text-destructive">
                                                    {errors.end_km}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="activity">
                                            Tipo de Actividad
                                        </Label>
                                        <Select
                                            onValueChange={(val) =>
                                                setData('activity_type', val)
                                            }
                                            value={data.activity_type}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Emergencia">
                                                    Emergencia (10-0)
                                                </SelectItem>
                                                <SelectItem value="Academia">
                                                    Academia / Ejercicio
                                                </SelectItem>
                                                <SelectItem value="Tramite">
                                                    Trámite Administrativo
                                                </SelectItem>
                                                <SelectItem value="Taller">
                                                    Traslado a Taller
                                                </SelectItem>
                                                <SelectItem value="CargaCombustible">
                                                    Carga de Combustible
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.activity_type && (
                                            <p className="text-sm text-destructive">
                                                {errors.activity_type}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-4 rounded-lg border p-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="fuel-mode"
                                                checked={data.has_fuel}
                                                onCheckedChange={(checked) =>
                                                    setData('has_fuel', checked)
                                                }
                                            />
                                            <Label htmlFor="fuel-mode">
                                                ¿Fue a Cargar Combustible?
                                            </Label>
                                        </div>
                                    </div>

                                    {data.has_fuel && (
                                        <div className="space-y-4 rounded-lg border p-4">
                                            <h3 className="font-semibold">
                                                Detalle de Carga
                                            </h3>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="fuel_liters">
                                                        Litros Cargados
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={data.fuel_liters}
                                                        onChange={(e) =>
                                                            setData(
                                                                'fuel_liters',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="0.0"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="fuel_coupon">
                                                        Nº Cupón / Vale
                                                    </Label>
                                                    <Input
                                                        value={data.fuel_coupon}
                                                        onChange={(e) =>
                                                            setData(
                                                                'fuel_coupon',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Nº Documento"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="receipt">
                                                    Fotografía Boleta/Vale
                                                </Label>
                                                <Input
                                                    id="receipt"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) =>
                                                        setData(
                                                            'receipt',
                                                            e.target.files
                                                                ? e.target
                                                                      .files[0]
                                                                : null,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="destination">
                                            Destino / Detalle
                                        </Label>
                                        <Input
                                            value={data.destination}
                                            onChange={(e) =>
                                                setData(
                                                    'destination',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Dirección o lugar de destino"
                                        />
                                        {errors.destination && (
                                            <p className="text-sm text-destructive">
                                                {errors.destination}
                                            </p>
                                        )}
                                    </div>

                                    <Button type="submit" disabled={processing}>
                                        Registrar Movimiento
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history">
                        <Card>
                            <CardHeader>
                                <CardTitle>Historial de Bitácoras</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50">
                                            <tr className="border-b">
                                                <th className="h-12 px-4 text-left font-medium">
                                                    Fecha
                                                </th>
                                                <th className="h-12 px-4 text-left font-medium">
                                                    Unidad
                                                </th>
                                                <th className="h-12 px-4 text-left font-medium">
                                                    Actividad
                                                </th>
                                                <th className="h-12 px-4 text-left font-medium">
                                                    Destino
                                                </th>
                                                <th className="h-12 px-4 text-left font-medium">
                                                    Km Salida
                                                </th>
                                                <th className="h-12 px-4 text-left font-medium">
                                                    Km Llegada
                                                </th>
                                                <th className="h-12 px-4 text-left font-medium">
                                                    Conductor
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.data.map((log: Log) => (
                                                <tr
                                                    key={log.id}
                                                    className="border-b hover:bg-muted/50"
                                                >
                                                    <td className="p-4">
                                                        {log.date}
                                                    </td>
                                                    <td className="p-4 font-medium">
                                                        {log.vehicle.name}
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge variant="outline">
                                                            {log.activity_type}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4">
                                                        {log.destination}
                                                    </td>
                                                    <td className="p-4">
                                                        {log.start_km}
                                                    </td>
                                                    <td className="p-4">
                                                        {log.end_km || '-'}
                                                    </td>
                                                    <td className="p-4">
                                                        {log.driver?.name}
                                                    </td>
                                                </tr>
                                            ))}
                                            {logs.data.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="p-4 text-center text-muted-foreground"
                                                    >
                                                        No hay registros.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
