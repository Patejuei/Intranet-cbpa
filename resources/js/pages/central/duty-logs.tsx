import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { usePermissions } from '@/hooks/use-permissions';
import { Combobox } from '@/components/ui/combobox';
import { useMemo } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface Vehicle {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    driver_vehicles?: Vehicle[];
}

interface Duty {
    id: number;
    user: User;
    vehicle: Vehicle;
    start_time: string;
    is_primary: boolean;
}

export default function DutyLogs({
    activeDuties = [],
    vehicles = [],
    drivers = [],
}: {
    activeDuties: Duty[];
    vehicles: Vehicle[];
    drivers: User[];
}) {
    const { canEdit } = usePermissions();

    const { data, setData, post, processing, reset, errors } = useForm({
        user_id: '',
        vehicle_ids: [] as string[],
        is_primary: true,
    });

    const selectedDriverId = data.user_id;
    
    // Filtro de vehículos de forma sencilla fuera de useMemo si da problemas
    const selectedDriver = drivers.find(d => String(d.id) === String(selectedDriverId));
    const assignedVehicles = (selectedDriver as any)?.driver_vehicles || (selectedDriver as any)?.driverVehicles || [];

    const handleToggle = (vId: string) => {
        const current = [...data.vehicle_ids];
        const vIdStr = String(vId);
        
        let newIds: string[];
        if (current.includes(vIdStr)) {
            newIds = current.filter(id => id !== vIdStr);
        } else {
            newIds = [...current, vIdStr];
        }
        
        setData('vehicle_ids', newIds);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/central/duty/start', {
            onSuccess: () => reset(),
        });
    };

    const endDuty = (id: number) => {
        post(`/central/duty/${id}/end`);
    };

    const driverOptions = useMemo(() => {
        return drivers.map(d => ({
            value: String(d.id),
            label: d.name,
            description: (d as any).driver_vehicles ? (d as any).driver_vehicles.map((v: any) => v.name).join(', ') : ''
        }));
    }, [drivers]);

    const breadcrumbs = [
        { title: 'Central de Alarmas', href: '/central/duty' },
        { title: 'Puestas en Servicio', href: '/central/duty' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Puestas en Servicio" />
            <div className="flex h-full flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Puestas en Servicio</h1>
                </div>

                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                        <TabsTrigger value="active">Conductores Activos</TabsTrigger>
                        {canEdit('central') && (
                            <TabsTrigger value="register">Registrar Entrada</TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="active">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {activeDuties.map((duty) => (
                                <Card key={duty.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">
                                                {duty.vehicle.name}
                                            </CardTitle>
                                            <Badge variant={duty.is_primary ? 'default' : 'secondary'}>
                                                {duty.is_primary ? 'Primario' : 'Secundario'}
                                            </Badge>
                                        </div>
                                        <CardDescription>
                                            Iniciado: {duty.start_time ? format(new Date(duty.start_time), 'dd/MM/yyyy HH:mm') : '---'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-medium">{duty.user.name}</p>
                                        {canEdit('central') && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="mt-4 w-full"
                                                onClick={() => endDuty(duty.id)}
                                                disabled={processing}
                                            >
                                                Finalizar Servicio
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {canEdit('central') && (
                        <TabsContent value="register">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Nueva Puesta en Servicio</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={submit} className="max-w-4xl space-y-8">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-4">
                                                <Label className="text-base font-bold">1. Seleccionar Conductor</Label>
                                                <Combobox
                                                    options={driverOptions}
                                                    value={data.user_id}
                                                    onChange={(val) => {
                                                        // Usando el formato de objeto de setData para evitar problemas de callbacks
                                                        setData({
                                                            ...data,
                                                            user_id: val,
                                                            vehicle_ids: []
                                                        });
                                                    }}
                                                    placeholder="Buscar conductor..."
                                                />
                                                {errors.user_id && <p className="text-sm text-destructive">{errors.user_id}</p>}

                                                <div className="flex items-center space-x-3 pt-2">
                                                    <Switch
                                                        id="primary-mode"
                                                        checked={data.is_primary}
                                                        onCheckedChange={(checked) => setData('is_primary', checked)}
                                                    />
                                                    <Label htmlFor="primary-mode" className="font-semibold cursor-pointer">
                                                        ¿Es Conductor Primario?
                                                    </Label>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="text-base font-bold">2. Unidades Disponibles</Label>
                                                {!selectedDriverId ? (
                                                    <div className="rounded-lg border border-dashed p-10 text-center bg-muted/20 text-muted-foreground">
                                                        Seleccione un conductor primero.
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                        {assignedVehicles.length > 0 ? (
                                                            assignedVehicles.map((v: Vehicle) => {
                                                                const isSelected = data.vehicle_ids.includes(String(v.id));
                                                                return (
                                                                    <Button
                                                                        key={v.id}
                                                                        type="button"
                                                                        variant={isSelected ? "default" : "outline"}
                                                                        className={`h-auto justify-start p-4 text-left ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                                                                        onClick={() => handleToggle(String(v.id))}
                                                                    >
                                                                        <div className="flex w-full items-center gap-3">
                                                                            {isSelected ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5 opacity-40" />}
                                                                            <span className="font-semibold leading-tight">{v.name}</span>
                                                                        </div>
                                                                    </Button>
                                                                );
                                                            })
                                                        ) : (
                                                            <div className="col-span-full rounded-lg border border-dashed p-10 text-center bg-muted/20 text-muted-foreground">
                                                                Este conductor no tiene asignaciones.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {errors.vehicle_ids && <p className="text-sm text-destructive">{errors.vehicle_ids}</p>}
                                            </div>
                                        </div>

                                        <Button 
                                            type="submit" 
                                            className="w-full md:w-auto md:min-w-[200px]"
                                            size="lg"
                                            disabled={processing || !data.user_id || data.vehicle_ids.length === 0}
                                        >
                                            Registrar {data.vehicle_ids.length} Puestas en Servicio
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </AppLayout>
    );
}
