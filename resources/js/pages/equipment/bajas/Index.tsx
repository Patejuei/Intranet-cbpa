import Pagination from '@/components/Pagination';
import { SortableTableHead } from '@/components/SortableTableHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { SharedData, User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Eye, PlusCircle, RotateCcw } from 'lucide-react';

interface MaterialBajaRequest {
    id: number;
    user: User;
    material: {
        product_name: string;
        code: string;
    };
    quantity: number;
    reason: string;
    status:
        | 'PENDIENTE'
        | 'VALIDADO'
        | 'APROBADO'
        | 'RECHAZADO'
        | 'EN_REPARACION';
    created_at: string;
}

interface Props extends SharedData {
    requests: {
        data: MaterialBajaRequest[];
        links: any[];
    };
}

export default function IndexBajas({ auth, requests }: Props) {
    const {
        filteredItems,
        filters,
        setFilter,
        setSort,
        clearFilters,
        hasActiveFilters,
    } = useClientTableFilter<MaterialBajaRequest>(requests.data, {
        accessors: {
            id: (req) => req.id,
            created_at: (req) => req.created_at,
            requester: (req) =>
                `${req.user.name} ${req.user.company || ''}`.trim(),
            material: (req) =>
                `${req.material.product_name} ${req.material.code}`.trim(),
            quantity: (req) => req.quantity,
            status: (req) => req.status,
        },
        exactMatchColumns: ['status'],
    });
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDIENTE':
                return (
                    <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    >
                        Pendiente
                    </Badge>
                );
            case 'VALIDADO':
                return (
                    <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                    >
                        Validado
                    </Badge>
                );
            case 'APROBADO':
                return (
                    <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 hover:bg-green-100"
                    >
                        Aprobado
                    </Badge>
                );
            case 'RECHAZADO':
                return (
                    <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800 hover:bg-red-100"
                    >
                        Rechazado
                    </Badge>
                );
            case 'EN_REPARACION':
                return (
                    <Badge
                        variant="outline"
                        className="bg-orange-100 text-orange-800 hover:bg-orange-100"
                    >
                        En Reparación
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Equipamiento', href: '/equipment' },
                { title: 'Solicitudes de Baja', href: '/equipment/bajas' },
            ]}
        >
            <Head title="Solicitudes de Baja" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Solicitudes de Baja
                        </h2>
                        <p className="text-muted-foreground">
                            Gestión y seguimiento de bajas de material menor.
                        </p>
                    </div>
                    {(auth.user.role === 'capitan' ||
                        auth.user.role === 'admin') && (
                        <Button asChild>
                            <Link href="/equipment/bajas/create">
                                <PlusCircle className="mr-2 size-4" />
                                Nueva Solicitud
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Historial de Solicitudes</CardTitle>
                        {hasActiveFilters && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="gap-1.5 text-muted-foreground hover:text-foreground"
                            >
                                <RotateCcw className="size-4" />
                                Limpiar filtros
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <SortableTableHead
                                        column="id"
                                        label="ID"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.id}
                                        filterPlaceholder="ID..."
                                        onFilterChange={(value) =>
                                            setFilter('id', value)
                                        }
                                    />
                                    <SortableTableHead
                                        column="created_at"
                                        label="Fecha"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.created_at}
                                        filterPlaceholder="YYYY-MM-DD..."
                                        onFilterChange={(value) =>
                                            setFilter('created_at', value)
                                        }
                                    />
                                    <SortableTableHead
                                        column="requester"
                                        label="Solicitante"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.requester}
                                        filterPlaceholder="Filtrar solicitante..."
                                        onFilterChange={(value) =>
                                            setFilter('requester', value)
                                        }
                                    />
                                    <SortableTableHead
                                        column="material"
                                        label="Material"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.material}
                                        filterPlaceholder="Filtrar material..."
                                        onFilterChange={(value) =>
                                            setFilter('material', value)
                                        }
                                    />
                                    <SortableTableHead
                                        column="quantity"
                                        label="Cant."
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                    />
                                    <SortableTableHead
                                        column="status"
                                        label="Estado"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="select"
                                        filterValue={filters.status}
                                        filterOptions={[
                                            {
                                                value: 'PENDIENTE',
                                                label: 'Pendiente',
                                            },
                                            {
                                                value: 'VALIDADO',
                                                label: 'Validado',
                                            },
                                            {
                                                value: 'APROBADO',
                                                label: 'Aprobado',
                                            },
                                            {
                                                value: 'RECHAZADO',
                                                label: 'Rechazado',
                                            },
                                            {
                                                value: 'EN_REPARACION',
                                                label: 'En Reparación',
                                            },
                                        ]}
                                        onFilterChange={(value) =>
                                            setFilter('status', value)
                                        }
                                    />
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((req) => (
                                        <TableRow
                                            key={req.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <TableCell className="font-mono">
                                                #{req.id}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    req.created_at,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{req.user.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {req.user.company ||
                                                            'Sin Compañía'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {
                                                            req.material
                                                                .product_name
                                                        }
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {req.material.code}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{req.quantity}</TableCell>
                                            <TableCell>
                                                {getStatusBadge(req.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/equipment/bajas/${req.id}`}
                                                    >
                                                        <Eye className="size-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No hay solicitudes registradas.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <div className="mt-4">
                            <Pagination links={requests.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
