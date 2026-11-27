import { SortableTableHead } from '@/components/SortableTableHead';
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
import { useClientTableFilter } from '@/hooks/use-client-table-filter';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, RefreshCw, RotateCcw } from 'lucide-react';

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
    const {
        filteredItems: filteredVehicles,
        filters,
        setFilter,
        setSort,
        clearFilters,
        hasActiveFilters,
        getUniqueOptions,
    } = useClientTableFilter(vehicles, {
        accessors: {
            name: (v) => v.name,
            plate: (v) => v.plate,
            model: (v) => `${v.make} ${v.model}`,
            company: (v) => v.company,
            deleted_at: (v) => v.deleted_at,
        },
        exactMatchColumns: ['company'],
    });

    const restoreVehicle = (id: number) => {
        if (confirm('¿Está seguro de restaurar este vehículo?')) {
            router.patch(`/vehicles/${id}/restore`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
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
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div>
                            <CardTitle>Listado de Unidades</CardTitle>
                            <CardDescription>
                                Estos vehículos no aparecen en los listados activos.
                            </CardDescription>
                        </div>
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                className="gap-1.5 shrink-0"
                            >
                                <RotateCcw className="size-3.5" />
                                <span>Limpiar filtros</span>
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <SortableTableHead
                                        column="name"
                                        label="Unidad"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.name}
                                        filterPlaceholder="Filtrar unidad..."
                                        onFilterChange={(val) =>
                                            setFilter('name', val)
                                        }
                                    />
                                    <SortableTableHead
                                        column="plate"
                                        label="Patente"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.plate}
                                        filterPlaceholder="Filtrar patente..."
                                        onFilterChange={(val) =>
                                            setFilter('plate', val)
                                        }
                                    />
                                    <SortableTableHead
                                        column="model"
                                        label="Marca/Modelo"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.model}
                                        filterPlaceholder="Filtrar marca/modelo..."
                                        onFilterChange={(val) =>
                                            setFilter('model', val)
                                        }
                                    />
                                    <SortableTableHead
                                        column="company"
                                        label="Compañía"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="select"
                                        filterValue={filters.company}
                                        filterOptions={getUniqueOptions(
                                            'company',
                                        )}
                                        onFilterChange={(val) =>
                                            setFilter('company', val)
                                        }
                                    />
                                    <SortableTableHead
                                        column="deleted_at"
                                        label="Fecha Baja"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.deleted_at}
                                        filterPlaceholder="YYYY-MM-DD..."
                                        onFilterChange={(val) =>
                                            setFilter('deleted_at', val)
                                        }
                                    />
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVehicles.map((vehicle) => (
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
                                {filteredVehicles.length === 0 && (
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
