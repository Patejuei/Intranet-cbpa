import * as React from 'react';
import { useState } from 'react';
import Pagination from '@/components/Pagination';
import { SortableTableHead } from '@/components/SortableTableHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ExportLogsDialog } from '@/components/vehicles/export-logs-dialog';
import { usePermissions } from '@/hooks/use-permissions';
import { useTableFilters } from '@/hooks/use-table-filters';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import {
    Check,
    FileSpreadsheet,
    Plus,
    RotateCcw,
    X,
} from 'lucide-react';

interface Vehicle {
    id: number;
    name: string;
    company?: string | null;
}

interface Log {
    id: number;
    vehicle: Vehicle;
    driver: { name: string };
    obac?: {
        id?: number;
        first_name?: string | null;
        paternal_last_name?: string | null;
        maternal_last_name?: string | null;
        full_name?: string | null;
        general_registry_number?: string | null;
    } | null;
    obac_name?: string | null;
    start_km: number;
    end_km: number;
    activity_type: string;
    destination: string;
    movement_key?: string;
    date: string;
    departure_time?: string;
    arrival_time?: string;
    fuel_liters?: number | null;
    fuel_coupon?: string | null;
}

interface LogFilters {
    [key: string]: string | undefined;
    vehicle_id?: string;
    vehicle_ids?: string;
    driver_ids?: string;
    movement_key?: string;
    date?: string;
    vehicle_name?: string;
    activity_type?: string;
    activity_types?: string;
    destination?: string;
    fuel?: string;
    driver_name?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

const ACTIVITY_TYPE_OPTIONS = [
    { value: 'Emergencia', label: 'Emergencia' },
    { value: 'Academia', label: 'Academia / Ejercicio' },
    { value: 'Tramite', label: 'Trámite Administrativo' },
    { value: 'Taller', label: 'Traslado a Taller' },
    { value: 'CargaCombustible', label: 'Carga de Combustible' },
    {
        value: 'RecuperacionMaterial',
        label: 'Recuperación de Material (6-15)',
    },
];

const emptyLogFilters: LogFilters = {
    vehicle_id: 'all',
    vehicle_ids: '',
    driver_ids: '',
    movement_key: '',
    date: '',
    vehicle_name: '',
    activity_type: 'all',
    activity_types: '',
    destination: '',
    fuel: 'all',
    driver_name: '',
    sort: undefined,
    direction: undefined,
};

export default function VehicleLogs({
    logs,
    vehicles,
    drivers = [],
    filters: initialFilters = {},
}: {
    logs: any;
    vehicles: Vehicle[];
    drivers?: { id: number; name: string }[];
    filters?: LogFilters;
}) {
    const { canCreate } = usePermissions();
    const { filters, setFilter, setSort, clearFilters, hasActiveFilters } =
        useTableFilters<LogFilters>('/vehicles/logs', {
            vehicle_id: initialFilters.vehicle_id || 'all',
            vehicle_ids: initialFilters.vehicle_ids || '',
            driver_ids: initialFilters.driver_ids || '',
            movement_key: initialFilters.movement_key || '',
            date: initialFilters.date || '',
            vehicle_name: initialFilters.vehicle_name || '',
            activity_type: initialFilters.activity_type || 'all',
            activity_types: initialFilters.activity_types || '',
            destination: initialFilters.destination || '',
            fuel: initialFilters.fuel || 'all',
            driver_name: initialFilters.driver_name || '',
            sort: initialFilters.sort,
            direction: initialFilters.direction,
        });
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Bitácora', href: '/vehicles/logs' },
            ]}
        >
            <Head title="Bitácora de Máquinas" />

            <div className="flex h-full flex-col gap-6 p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Bitácora del Material Mayor
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Control de kilometraje y movimientos de las unidades.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsExportDialogOpen(true)}
                        >
                            <FileSpreadsheet className="mr-2 size-4 text-emerald-600" />
                            Exportar Excel
                        </Button>
                        {canCreate('vehicles.logs') && (
                            <Button size="sm" asChild>
                                <Link href="/vehicles/logs/create">
                                    <Plus className="mr-2 size-4" />
                                    Registrar Movimiento
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <Card className="rounded-2xl border border-border/70 bg-card shadow-xs">
                    <CardHeader className="flex flex-col gap-4 border-b border-border/60 pb-5 md:flex-row md:items-center md:justify-between">
                        <CardTitle className="text-lg">Historial de Bitácoras</CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                value={filters.vehicle_id || 'all'}
                                onValueChange={(val) =>
                                    setFilter('vehicle_id', val)
                                }
                            >
                                <SelectTrigger className="h-9 w-[190px]">
                                    <SelectValue placeholder="Filtrar por Vehículo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Todos los Vehículos
                                    </SelectItem>
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
                            <Input
                                className="h-9 w-[160px]"
                                placeholder="Buscar Clave..."
                                value={filters.movement_key || ''}
                                onChange={(e) =>
                                    setFilter('movement_key', e.target.value, {
                                        debounce: true,
                                    })
                                }
                            />
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => clearFilters(emptyLogFilters)}
                                    className="gap-1.5 shrink-0 h-9"
                                >
                                    <RotateCcw className="size-3.5" />
                                    <span>Limpiar filtros</span>
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="overflow-x-auto rounded-xl border border-border/70">
                            <table className="w-full min-w-[800px] text-sm md:min-w-full">
                                <thead className="bg-muted/50">
                                    <tr className="border-b border-border/60">
                                        <SortableTableHead
                                            column="date"
                                            label="Fecha"
                                            sortKey={filters.sort}
                                            sortDirection={filters.direction}
                                            onSort={setSort}
                                            filterType="text"
                                            filterValue={filters.date}
                                            filterPlaceholder="YYYY-MM-DD..."
                                            onFilterChange={(val) =>
                                                setFilter('date', val)
                                            }
                                            className="px-4"
                                        />
                                        <SortableTableHead
                                            column="departure_time"
                                            label="Horas"
                                            sortKey={filters.sort}
                                            sortDirection={filters.direction}
                                            onSort={setSort}
                                            className="px-4"
                                        />
                                        <SortableTableHead
                                            column="vehicle"
                                            label="Unidad"
                                            sortKey={filters.sort}
                                            sortDirection={filters.direction}
                                            onSort={setSort}
                                            filterType="multi-select"
                                            filterValue={filters.vehicle_ids}
                                            filterOptions={vehicles.map((v) => ({
                                                value: v.id.toString(),
                                                label: v.company
                                                    ? `${v.name} (${v.company})`
                                                    : v.name,
                                            }))}
                                            onFilterChange={(val) =>
                                                setFilter('vehicle_ids', val)
                                            }
                                            className="px-4"
                                        />
                                        <SortableTableHead
                                            column="activity_type"
                                            label="Actividad"
                                            sortKey={filters.sort}
                                            sortDirection={filters.direction}
                                            onSort={setSort}
                                            filterType="select"
                                            filterValue={filters.activity_type}
                                            filterOptions={ACTIVITY_TYPE_OPTIONS}
                                            onFilterChange={(val) =>
                                                setFilter('activity_type', val)
                                            }
                                            className="px-4"
                                        />
                                        <SortableTableHead
                                            column="destination"
                                            label="Destino"
                                            sortKey={filters.sort}
                                            sortDirection={filters.direction}
                                            onSort={setSort}
                                            filterType="text"
                                            filterValue={filters.destination}
                                            filterPlaceholder="Filtrar destino..."
                                            onFilterChange={(val) =>
                                                setFilter('destination', val)
                                            }
                                            className="px-4"
                                        />
                                        <SortableTableHead
                                            column="movement_key"
                                            label="Clave"
                                            sortKey={filters.sort}
                                            sortDirection={filters.direction}
                                            onSort={setSort}
                                            filterType="text"
                                            filterValue={filters.movement_key}
                                            filterPlaceholder="Filtrar clave..."
                                            onFilterChange={(val) =>
                                                setFilter('movement_key', val)
                                            }
                                            className="px-4"
                                        />
                                        <SortableTableHead
                                            column="fuel"
                                            label="Combustible"
                                            sortable={false}
                                            filterType="select"
                                            filterValue={filters.fuel}
                                            filterOptions={[
                                                {
                                                    value: 'yes',
                                                    label: 'Con combustible',
                                                },
                                                {
                                                    value: 'no',
                                                    label: 'Sin combustible',
                                                },
                                            ]}
                                            onFilterChange={(val) =>
                                                setFilter('fuel', val)
                                            }
                                            align="center"
                                            className="px-4"
                                        />
                                        <SortableTableHead
                                            column="start_km"
                                            label="Km Salida"
                                            sortKey={filters.sort}
                                            sortDirection={filters.direction}
                                            onSort={setSort}
                                            className="px-4"
                                        />
                                        <SortableTableHead
                                            column="end_km"
                                            label="Km Llegada"
                                            sortKey={filters.sort}
                                            sortDirection={filters.direction}
                                            onSort={setSort}
                                            className="px-4"
                                        />
                                        <SortableTableHead
                                            column="driver"
                                            label="Conductor"
                                            sortKey={filters.sort}
                                            sortDirection={filters.direction}
                                            onSort={setSort}
                                            filterType="multi-select"
                                            filterValue={filters.driver_ids}
                                            filterOptions={drivers.map((d) => ({
                                                value: d.id.toString(),
                                                label: d.name,
                                            }))}
                                            onFilterChange={(val) =>
                                                setFilter('driver_ids', val)
                                            }
                                            className="px-4"
                                        />
                                        <th className="h-10 px-4 text-right font-medium">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.data.map((log: Log) => (
                                        <tr
                                            key={log.id}
                                            className="border-b border-border/40 transition-colors hover:bg-muted/40"
                                        >
                                            <td className="p-4">
                                                {formatDate(log.date)}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col text-xs font-mono">
                                                    <span>
                                                        S:{' '}
                                                        {log.departure_time ||
                                                            '-'}
                                                    </span>
                                                    <span>
                                                        L:{' '}
                                                        {log.arrival_time ||
                                                            '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-semibold">
                                                {log.vehicle.name}
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="outline" className="font-normal">
                                                    {log.activity_type}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {log.destination}
                                            </td>
                                            <td className="p-4 font-mono text-xs">
                                                {log.movement_key || '-'}
                                            </td>
                                            <td className="p-4 text-center">
                                                {log.fuel_liters || log.fuel_coupon ? (
                                                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                        <Check className="size-3.5" />
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                                        <X className="size-3.5" />
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 font-mono">
                                                {log.start_km}
                                            </td>
                                            <td className="p-4 font-mono">
                                                {log.end_km || '-'}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col text-xs">
                                                    <span className="font-medium text-foreground">{log.driver?.name || '-'}</span>
                                                    {(() => {
                                                        const obacName = log.obac
                                                            ? [log.obac.first_name, log.obac.paternal_last_name, log.obac.maternal_last_name].filter(Boolean).join(' ') || log.obac.full_name
                                                            : log.obac_name;

                                                        return obacName ? (
                                                            <span
                                                                className="text-muted-foreground text-[11px] truncate max-w-[160px]"
                                                                title={`OBAC: ${obacName}`}
                                                            >
                                                                OBAC: {obacName}
                                                            </span>
                                                        ) : null;
                                                    })()}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/vehicles/logs/${log.id}`}
                                                    >
                                                        Ver
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {logs.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={11}
                                                className="p-8 text-center text-muted-foreground"
                                            >
                                                No hay registros de bitácora encontrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={logs.links} />
                    </CardContent>
                </Card>
            </div>

            <ExportLogsDialog
                open={isExportDialogOpen}
                onOpenChange={setIsExportDialogOpen}
                vehicles={vehicles}
                currentMovementKey={filters.movement_key}
            />
        </AppLayout>
    );
}
