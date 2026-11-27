import * as React from 'react';
import { Combobox } from '@/components/ui/combobox';
import InputError from '@/components/input-error';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Firefighter } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Fuel,
    Gauge,
    KeyRound,
    MapPin,
    Plus,
    Truck,
    Upload,
    UserCheck,
} from 'lucide-react';

interface Vehicle {
    id: number;
    name: string;
    company?: string | null;
    last_mileage?: number;
    coupon_number?: string | null;
}

export default function VehicleLogCreate({
    vehicles,
    firefighters = [],
}: {
    vehicles: Vehicle[];
    firefighters?: Firefighter[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        vehicle_id: '',
        obac_id: '',
        start_km: '',
        end_km: '',
        departure_time: '',
        arrival_time: '',
        activity_type: '',
        destination: '',
        movement_key: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        fuel_liters: '',
        fuel_coupon: '',
        has_fuel: false,
        receipt: null as File | null,
        observations: '',
    });

    const obacOptions = React.useMemo(() => {
        return (firefighters || []).map((f) => {
            const displayName =
                [f.first_name, f.paternal_last_name, f.maternal_last_name]
                    .filter(Boolean)
                    .join(' ') || f.full_name;

            return {
                value: f.id.toString(),
                label: displayName,
                description: [
                    f.general_registry_number
                        ? `Reg. ${f.general_registry_number}`
                        : null,
                    f.company || null,
                ]
                    .filter(Boolean)
                    .join(' • '),
                searchValue: `${displayName} ${f.full_name || ''} ${f.general_registry_number || ''} ${f.company || ''}`,
            };
        });
    }, [firefighters]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vehicles/logs');
    };

    const handleVehicleChange = (val: string) => {
        const selectedVehicle = vehicles.find((v) => v.id.toString() === val);
        if (selectedVehicle) {
            setData((prev) => ({
                ...prev,
                vehicle_id: val,
                start_km:
                    selectedVehicle.last_mileage !== undefined &&
                    selectedVehicle.last_mileage !== null
                        ? String(selectedVehicle.last_mileage)
                        : '',
                fuel_coupon:
                    prev.has_fuel && selectedVehicle.coupon_number
                        ? selectedVehicle.coupon_number
                        : prev.has_fuel
                          ? ''
                          : prev.fuel_coupon,
            }));
        } else {
            setData('vehicle_id', val);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Bitácora', href: '/vehicles/logs' },
                { title: 'Registrar Movimiento', href: '/vehicles/logs/create' },
            ]}
        >
            <Head title="Registrar Entrada de Bitácora" />

            <div className="flex h-full flex-col gap-6 p-4 sm:p-6">
                <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Registrar Movimiento
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Control y registro de salida del Material Mayor.
                        </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/vehicles/logs">
                            <ArrowLeft className="mr-2 size-4" />
                            Volver a Bitácoras
                        </Link>
                    </Button>
                </div>

                <div className="mx-auto w-full max-w-3xl">
                    <Card className="rounded-2xl border border-border/70 bg-card shadow-xs">
                        <CardHeader className="border-b border-border/60 pb-5">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Truck className="size-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">
                                        Nueva Entrada de Bitácora
                                    </CardTitle>
                                    <CardDescription>
                                        Registre la salida, kilometraje y movimiento de una unidad institucional.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {!vehicles || vehicles.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                    <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4">
                                        <Truck className="size-7" />
                                    </div>
                                    <h3 className="text-base font-semibold text-foreground">
                                        Sin unidades asignadas como conductor
                                    </h3>
                                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                        Usted no cuenta con carros asignados para conducir. En la institución, los movimientos de bitácora solo pueden ser registrados por los conductores autorizados para cada unidad.
                                    </p>
                                    <Button variant="outline" className="mt-6 gap-2" asChild>
                                        <Link href="/vehicles/logs">
                                            <ArrowLeft className="size-4" />
                                            Volver a Bitácoras
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Unidad y Fecha */}
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="vehicle" className="flex items-center gap-1.5 text-sm font-medium">
                                                <Truck className="size-3.5 text-muted-foreground" />
                                                Vehículo <span className="text-destructive">*</span>
                                            </Label>
                                            <Select
                                                onValueChange={handleVehicleChange}
                                                value={data.vehicle_id}
                                            >
                                                <SelectTrigger id="vehicle" className="h-10" aria-invalid={!!errors.vehicle_id}>
                                                    <SelectValue placeholder="Seleccione unidad" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {vehicles.map((v) => (
                                                        <SelectItem
                                                            key={v.id}
                                                            value={v.id.toString()}
                                                        >
                                                            {v.name} {v.company ? `(${v.company})` : ''}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.vehicle_id} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="date" className="flex items-center gap-1.5 text-sm font-medium">
                                                <Calendar className="size-3.5 text-muted-foreground" />
                                                Fecha del Movimiento <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="date"
                                                type="date"
                                                className="h-10"
                                                value={data.date}
                                                aria-invalid={!!errors.date}
                                                onChange={(e) =>
                                                    setData('date', e.target.value)
                                                }
                                                onClick={(e) =>
                                                    e.currentTarget.showPicker?.()
                                                }
                                            />
                                            <InputError message={errors.date} />
                                        </div>
                                    </div>

                                    {/* OBAC y Clave */}
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="obac" className="flex items-center gap-1.5 text-sm font-medium">
                                                <UserCheck className="size-3.5 text-muted-foreground" />
                                                OBAC <span className="text-xs font-normal text-muted-foreground">(Oficial o Bombero a Cargo)</span>
                                            </Label>
                                            <Combobox
                                                options={obacOptions}
                                                value={data.obac_id}
                                                onChange={(val) => setData('obac_id', val)}
                                                placeholder="Buscar por nombre o N° de registro general..."
                                                searchPlaceholder="Escriba nombre o N° de registro..."
                                                emptyText="No se encontró ningún bombero con ese criterio."
                                                clearable
                                                className="h-10"
                                            />
                                            <InputError message={errors.obac_id} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="movement_key" className="flex items-center gap-1.5 text-sm font-medium">
                                                <KeyRound className="size-3.5 text-muted-foreground" />
                                                Clave
                                            </Label>
                                            <Input
                                                id="movement_key"
                                                className="h-10 font-mono uppercase"
                                                value={data.movement_key}
                                                aria-invalid={!!errors.movement_key}
                                                onChange={(e) =>
                                                    setData('movement_key', e.target.value)
                                                }
                                                placeholder="Ej: 10-0-5"
                                            />
                                            <InputError message={errors.movement_key} />
                                        </div>
                                    </div>

                                    {/* Dirección / Destino */}
                                    <div className="space-y-2">
                                        <Label htmlFor="destination" className="flex items-center gap-1.5 text-sm font-medium">
                                            <MapPin className="size-3.5 text-muted-foreground" />
                                            Dirección / Destino <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="destination"
                                            className="h-10"
                                            value={data.destination}
                                            aria-invalid={!!errors.destination}
                                            onChange={(e) =>
                                                setData('destination', e.target.value)
                                            }
                                            placeholder="Dirección o lugar de destino..."
                                        />
                                        <InputError message={errors.destination} />
                                    </div>

                                    {/* Kilometraje */}
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="start_km" className="flex items-center gap-1.5 text-sm font-medium">
                                                    <Gauge className="size-3.5 text-muted-foreground" />
                                                    Kilometraje Inicio
                                                </Label>
                                                {data.vehicle_id && (
                                                    <span className="text-xs text-muted-foreground">
                                                        Último odómetro registrado
                                                    </span>
                                                )}
                                            </div>
                                            <Input
                                                id="start_km"
                                                type="number"
                                                className="h-10 font-mono"
                                                value={data.start_km}
                                                aria-invalid={!!errors.start_km}
                                                onChange={(e) =>
                                                    setData('start_km', e.target.value)
                                                }
                                                placeholder="0"
                                            />
                                            <InputError message={errors.start_km} />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="end_km" className="flex items-center gap-1.5 text-sm font-medium">
                                                    <Gauge className="size-3.5 text-muted-foreground" />
                                                    Kilometraje Fin <span className="text-destructive">*</span>
                                                </Label>
                                                {Number(data.end_km) > Number(data.start_km) && Number(data.start_km) > 0 && (
                                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                                        +{Number(data.end_km) - Number(data.start_km)} km
                                                    </span>
                                                )}
                                            </div>
                                            <Input
                                                id="end_km"
                                                type="number"
                                                className="h-10 font-mono"
                                                value={data.end_km}
                                                aria-invalid={!!errors.end_km}
                                                onChange={(e) =>
                                                    setData('end_km', e.target.value)
                                                }
                                                placeholder="0"
                                            />
                                            <InputError message={errors.end_km} />
                                        </div>
                                    </div>

                                    {/* Horas */}
                                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="departure_time" className="flex items-center gap-1.5 text-sm font-medium">
                                                <Clock className="size-3.5 text-muted-foreground" />
                                                Hora de Salida <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="departure_time"
                                                type="time"
                                                className="h-10 font-mono"
                                                value={data.departure_time}
                                                aria-invalid={!!errors.departure_time}
                                                onChange={(e) =>
                                                    setData('departure_time', e.target.value)
                                                }
                                                onClick={(e) =>
                                                    e.currentTarget.showPicker?.()
                                                }
                                            />
                                            <InputError message={errors.departure_time} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="arrival_time" className="flex items-center gap-1.5 text-sm font-medium">
                                                <Clock className="size-3.5 text-muted-foreground" />
                                                Hora de Regreso <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="arrival_time"
                                                type="time"
                                                className="h-10 font-mono"
                                                value={data.arrival_time}
                                                aria-invalid={!!errors.arrival_time}
                                                onChange={(e) =>
                                                    setData('arrival_time', e.target.value)
                                                }
                                                onClick={(e) =>
                                                    e.currentTarget.showPicker?.()
                                                }
                                            />
                                            <InputError message={errors.arrival_time} />
                                        </div>
                                    </div>

                                    {/* Tipo de Actividad */}
                                    <div className="space-y-2">
                                        <Label htmlFor="activity" className="text-sm font-medium">
                                            Tipo de Actividad <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            onValueChange={(val) =>
                                                setData('activity_type', val)
                                            }
                                            value={data.activity_type}
                                        >
                                            <SelectTrigger id="activity" className="h-10" aria-invalid={!!errors.activity_type}>
                                                <SelectValue placeholder="Seleccione el tipo de actividad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Emergencia">
                                                    Emergencia
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
                                                <SelectItem value="RecuperacionMaterial">
                                                    Recuperación de Material (6-15)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.activity_type} />
                                    </div>

                                    {/* Combustible */}
                                    <div className="rounded-xl border border-border/70 bg-muted/20 p-4 transition-colors sm:p-5">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Fuel className="size-4 text-primary" />
                                                    <Label htmlFor="fuel-mode" className="cursor-pointer text-sm font-semibold">
                                                        ¿Fue a Cargar Combustible?
                                                    </Label>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Active si la unidad cargó combustible para registrar litros, cupón y voucher.
                                                </p>
                                            </div>
                                            <Switch
                                                id="fuel-mode"
                                                checked={data.has_fuel}
                                                onCheckedChange={(checked) => {
                                                    const selectedVehicle =
                                                        vehicles.find(
                                                            (v) =>
                                                                v.id.toString() ===
                                                                data.vehicle_id,
                                                        );
                                                    setData((prev) => ({
                                                        ...prev,
                                                        has_fuel: checked,
                                                        fuel_coupon: checked
                                                            ? (selectedVehicle?.coupon_number || '')
                                                            : '',
                                                        fuel_liters: checked ? prev.fuel_liters : '',
                                                        receipt: checked ? prev.receipt : null,
                                                    }));
                                                }}
                                            />
                                        </div>
                                        {data.has_fuel && (
                                            <div className="mt-4 space-y-4 rounded-xl border border-border/70 bg-background/60 p-4 backdrop-blur-xs">
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="fuel_liters" className="text-xs font-medium">
                                                            Litros Cargados
                                                        </Label>
                                                        <div className="relative">
                                                            <Input
                                                                id="fuel_liters"
                                                                type="number"
                                                                step="0.01"
                                                                className="h-10 pr-12 font-mono"
                                                                value={data.fuel_liters}
                                                                aria-invalid={!!errors.fuel_liters}
                                                                onChange={(e) =>
                                                                    setData('fuel_liters', e.target.value)
                                                                }
                                                                placeholder="0.00"
                                                            />
                                                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-muted-foreground">
                                                                Lts
                                                            </span>
                                                        </div>
                                                        <InputError message={errors.fuel_liters} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="fuel_coupon" className="text-xs font-medium">
                                                            Nº Cupón / Vale
                                                        </Label>
                                                        <Input
                                                            id="fuel_coupon"
                                                            className="h-10 font-mono"
                                                            value={data.fuel_coupon}
                                                            aria-invalid={!!errors.fuel_coupon}
                                                            onChange={(e) =>
                                                                setData('fuel_coupon', e.target.value)
                                                            }
                                                            placeholder="Nº Documento"
                                                            disabled={
                                                                !!vehicles.find(
                                                                    (v) =>
                                                                        v.id.toString() ===
                                                                        data.vehicle_id,
                                                                )?.coupon_number
                                                            }
                                                        />
                                                        <InputError message={errors.fuel_coupon} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="receipt" className="flex items-center gap-1.5 text-xs font-medium">
                                                        <Upload className="size-3.5 text-muted-foreground" />
                                                        Fotografía Boleta / Vale
                                                    </Label>
                                                    <Input
                                                        id="receipt"
                                                        type="file"
                                                        accept="image/*"
                                                        capture="environment"
                                                        className="h-10 cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted/80"
                                                        aria-invalid={!!errors.receipt}
                                                        onChange={(e) =>
                                                            setData(
                                                                'receipt',
                                                                e.target.files
                                                                    ? e.target.files[0]
                                                                    : null,
                                                            )
                                                        }
                                                    />
                                                    <InputError message={errors.receipt} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Observaciones */}
                                    <div className="space-y-2">
                                        <Label htmlFor="observations" className="text-sm font-medium">
                                            Observaciones <span className="text-xs font-normal text-muted-foreground">(Opcional)</span>
                                        </Label>
                                        <Textarea
                                            id="observations"
                                            value={data.observations}
                                            aria-invalid={!!errors.observations}
                                            onChange={(e) =>
                                                setData('observations', e.target.value)
                                            }
                                            placeholder="Detalle cualquier novedad o incidencia observada durante el movimiento..."
                                            className="min-h-[100px] resize-y rounded-xl"
                                        />
                                        <InputError message={errors.observations} />
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => reset()}
                                            disabled={processing}
                                            className="h-10"
                                        >
                                            Limpiar Formulario
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-10 gap-2 px-6 shadow-xs"
                                        >
                                            <Plus className="size-4" />
                                            Registrar Movimiento
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
