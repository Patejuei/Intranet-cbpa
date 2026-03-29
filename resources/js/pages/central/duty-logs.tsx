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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { usePermissions } from '@/hooks/use-permissions';
import { Combobox } from '@/components/ui/combobox';
import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, Circle, Clock } from 'lucide-react';

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
        start_time: '',
    });

    const [endingDuty, setEndingDuty] = useState<Duty | null>(null);
    const { 
        data: endData, 
        setData: setEndData, 
        post: postEnd, 
        processing: processingEnd, 
        reset: resetEnd, 
        errors: endErrors 
    } = useForm({
        end_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    });

    const [sortConfig, setSortConfig] = useState<{
        key: 'vehicle' | 'user' | 'start_time';
        direction: 'asc' | 'desc';
    }>({ key: 'start_time', direction: 'desc' });

    const sortedDuties = useMemo(() => {
        const items = [...activeDuties];
        items.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (sortConfig.key === 'vehicle') {
                aValue = a.vehicle.name;
                bValue = b.vehicle.name;
            } else if (sortConfig.key === 'user') {
                aValue = a.user.name;
                bValue = b.user.name;
            } else if (sortConfig.key === 'start_time') {
                aValue = new Date(a.start_time).getTime();
                bValue = new Date(b.start_time).getTime();
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return items;
    }, [activeDuties, sortConfig]);

    const handleSort = (key: 'vehicle' | 'user' | 'start_time') => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const SortIcon = ({ column }: { column: typeof sortConfig.key }) => {
        if (sortConfig.key !== column) return <ArrowUpDown className="ml-2 h-3 w-3" />;
        return sortConfig.direction === 'asc' ? (
            <ArrowUp className="ml-2 h-3 w-3 text-primary" />
        ) : (
            <ArrowDown className="ml-2 h-3 w-3 text-primary" />
        );
    };

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

    const handleEndDutyClick = (duty: Duty) => {
        setEndData('end_time', format(new Date(), "yyyy-MM-dd'T'HH:mm"));
        setEndingDuty(duty);
    };

    const submitEndDuty = (e: React.FormEvent) => {
        e.preventDefault();
        if (!endingDuty) return;
        
        postEnd(`/central/duty/${endingDuty.id}/end`, {
            onSuccess: () => {
                setEndingDuty(null);
                resetEnd();
            },
        });
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
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Puestas en Servicio</h1>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row items-start">
                    {/* Panel Izquierdo: Formulario de Registro */}
                    {canEdit('central') && (
                        <div className="w-full lg:w-[380px] shrink-0 sticky top-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Nueva Puesta en Servicio</CardTitle>
                                    <CardDescription>
                                        Registra la entrada de un conductor a una o más unidades.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={submit} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="font-semibold flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    1. Conductor
                                                </Label>
                                                <Combobox
                                                    options={driverOptions}
                                                    value={data.user_id}
                                                    onChange={(val) => {
                                                        setData({
                                                            ...data,
                                                            user_id: val,
                                                            vehicle_ids: []
                                                        });
                                                    }}
                                                    placeholder="Buscar conductor..."
                                                />
                                                {errors.user_id && <p className="text-sm text-destructive">{errors.user_id}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold opacity-70">Hora de Ingreso (Opcional)</Label>
                                                <Input 
                                                    type="datetime-local" 
                                                    value={data.start_time}
                                                    onChange={(e) => setData('start_time', e.target.value)}
                                                    className="h-9"
                                                />
                                                <p className="text-[10px] text-muted-foreground">Si se deja vacío usará la hora actual.</p>
                                            </div>

                                            <div className="flex items-center space-x-3 py-2 border-y border-dashed">
                                                <Switch
                                                    id="primary-mode"
                                                    checked={data.is_primary}
                                                    onCheckedChange={(checked) => setData('is_primary', checked)}
                                                />
                                                <Label htmlFor="primary-mode" className="font-medium cursor-pointer text-sm">
                                                    Conductor Primario
                                                </Label>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="font-semibold">2. Unidades Disponibles</Label>
                                                {!selectedDriverId ? (
                                                    <div className="rounded-lg border border-dashed p-6 text-center bg-muted/20 text-muted-foreground text-sm italic">
                                                        Seleccione un conductor primero.
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 gap-1.5">
                                                        {assignedVehicles.length > 0 ? (
                                                            assignedVehicles.map((v: Vehicle) => {
                                                                const isSelected = data.vehicle_ids.includes(String(v.id));
                                                                return (
                                                                    <Button
                                                                        key={v.id}
                                                                        type="button"
                                                                        variant={isSelected ? "default" : "outline"}
                                                                        className={`h-auto justify-start px-2 py-1.5 text-left transition-all ${isSelected ? 'ring-1 ring-primary' : ''}`}
                                                                        onClick={() => handleToggle(String(v.id))}
                                                                    >
                                                                        <div className="flex w-full items-center gap-2">
                                                                            {isSelected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5 opacity-40" />}
                                                                            <span className="font-medium text-xs">{v.name}</span>
                                                                        </div>
                                                                    </Button>
                                                                );
                                                            })
                                                        ) : (
                                                            <div className="rounded-lg border border-dashed p-6 text-center bg-muted/20 text-muted-foreground text-sm italic">
                                                                Sin asignaciones configuradas.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {errors.vehicle_ids && <p className="text-sm text-destructive">{errors.vehicle_ids}</p>}
                                            </div>
                                        </div>

                                        <Button 
                                            type="submit" 
                                            className="w-full"
                                            disabled={processing || !data.user_id || data.vehicle_ids.length === 0}
                                        >
                                            Registrar {data.vehicle_ids.length > 0 ? `(${data.vehicle_ids.length})` : ''} Puesta en Servicio
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Panel Derecho: Tabla de Conductores Activos */}
                    <div className="flex-1 w-full flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                Conductores Activos
                                <Badge variant="secondary" className="rounded-full px-2">
                                    {activeDuties.length}
                                </Badge>
                            </h2>
                        </div>
                        
                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead 
                                            className="font-bold cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => handleSort('vehicle')}
                                        >
                                            <div className="flex items-center">
                                                Unidad
                                                <SortIcon column="vehicle" />
                                            </div>
                                        </TableHead>
                                        <TableHead 
                                            className="font-bold cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => handleSort('user')}
                                        >
                                            <div className="flex items-center">
                                                Conductor
                                                <SortIcon column="user" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="font-bold">Tipo</TableHead>
                                        <TableHead 
                                            className="font-bold cursor-pointer hover:bg-muted/50 transition-colors"
                                            onClick={() => handleSort('start_time')}
                                        >
                                            <div className="flex items-center">
                                                Hora de Inicio
                                                <SortIcon column="start_time" />
                                            </div>
                                        </TableHead>
                                        {canEdit('central') && (
                                            <TableHead className="text-right font-bold">Acciones</TableHead>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedDuties.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={canEdit('central') ? 5 : 4}
                                                className="h-32 text-center text-muted-foreground italic"
                                            >
                                                No hay conductores activos en este momento.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        sortedDuties.map((duty) => (
                                            <TableRow key={duty.id} className="hover:bg-muted/10">
                                                <TableCell className="font-bold text-primary">
                                                    {duty.vehicle.name}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {duty.user.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={duty.is_primary ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold tracking-wider">
                                                        {duty.is_primary ? 'Primario' : 'Secundario'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm whitespace-nowrap font-mono">
                                                    {duty.start_time ? format(new Date(duty.start_time), 'dd/MM/yyyy HH:mm') : '---'}
                                                </TableCell>
                                                {canEdit('central') && (
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="h-8 px-3"
                                                            onClick={() => handleEndDutyClick(duty)}
                                                            disabled={processingEnd}
                                                        >
                                                            Finalizar
                                                        </Button>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Finalizar Puesta en Servicio */}
            <Dialog open={!!endingDuty} onOpenChange={(open) => !open && setEndingDuty(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Finalizar Puesta en Servicio</DialogTitle>
                        <DialogDescription>
                            Confirmar la salida de {endingDuty?.user.name} para la unidad {endingDuty?.vehicle.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEndDuty}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="end_time" className="font-semibold">Fecha y Hora de Salida</Label>
                                <Input
                                    id="end_time"
                                    type="datetime-local"
                                    value={endData.end_time}
                                    onChange={(e) => setEndData('end_time', e.target.value)}
                                    required
                                />
                                {endErrors.end_time && <p className="text-sm text-destructive">{endErrors.end_time}</p>}
                                <p className="text-xs text-muted-foreground italic">
                                    Por defecto se muestra la hora actual.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setEndingDuty(null)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" type="submit" disabled={processingEnd}>
                                Confirmar Salida
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
