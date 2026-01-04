import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePermissions } from '@/hooks/use-permissions'; // Added hook
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, FileText, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Maintenance {
    id: number;
    vehicle_id: number;
    entry_date: string;
    tentative_exit_date?: string;
    workshop_name: string;
    description: string;
    status: string;
    vehicle: {
        name: string;
        company: string;
        plate: string;
    };
    issues: any[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    maintenances: {
        data: Maintenance[];
        links: PaginationLink[];
    };
    filters: {
        status?: string;
        search?: string;
    };
}

export default function VehicleWorkshop() {
    const { maintenances, filters } = usePage<PageProps>().props;
    const { canCreate } = usePermissions(); // Use hook
    const [search, setSearch] = useState(filters.search || '');
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // Manual debounce implementation
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleSearch = (val: string) => {
        setSearch(val);
    };

    const handleStatusChange = (val: string) => {
        router.get(
            '/vehicles/workshop',
            { status: val, search },
            { preserveState: true, replace: true },
        );
    };

    // Effect for debounced search
    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            router.get(
                '/vehicles/workshop',
                { status: filters.status, search: debouncedSearch },
                { preserveState: true, replace: true },
            );
        }
    }, [debouncedSearch]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'En Taller':
                return 'bg-blue-500';
            case 'Esperando Repuestos':
                return 'bg-yellow-500';
            case 'Listo para Retiro':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Material Mayor', href: '/vehicles/dashboard' },
                { title: 'Taller Mecánico', href: '/vehicles/workshop' },
            ]}
        >
            <Head title="Taller Mecánico" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Taller Mecánico</h1>
                        <p className="text-muted-foreground">
                            Gestión de ingresos y reparaciones de vehículos.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {canCreate('vehicles.workshop') && (
                            <Button asChild>
                                <Link href="/vehicles/workshop/create">
                                    <Plus className="mr-2 size-4" /> Nuevo
                                    Ingreso
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar vehículo..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Select
                        defaultValue={filters.status || 'active'}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">
                                Activos (En Taller)
                            </SelectItem>
                            <SelectItem value="history">
                                Historial (Finalizados)
                            </SelectItem>
                            <SelectItem value="all">Todos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vehículo</TableHead>
                                    <TableHead>Compañía</TableHead>
                                    <TableHead>Taller</TableHead>
                                    <TableHead>Fecha Ingreso</TableHead>
                                    <TableHead>Salida Est.</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {maintenances.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-24 text-center"
                                        >
                                            No hay registros encontrados.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    maintenances.data.map((m) => (
                                        <TableRow key={m.id}>
                                            <TableCell className="font-medium">
                                                {m.vehicle.name}
                                                <div className="text-xs text-muted-foreground">
                                                    {m.vehicle.plate}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {m.vehicle.company}
                                            </TableCell>
                                            <TableCell>
                                                {m.workshop_name}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(m.entry_date)}
                                            </TableCell>
                                            <TableCell>
                                                {m.tentative_exit_date
                                                    ? formatDate(
                                                          m.tentative_exit_date,
                                                      )
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={`${getStatusColor(
                                                        m.status,
                                                    )} hover:${getStatusColor(
                                                        m.status,
                                                    )}`}
                                                >
                                                    {m.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        title="Ver Detalle"
                                                    >
                                                        <Link
                                                            href={`/vehicles/workshop/${m.id}`}
                                                        >
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        title="Imprimir Orden"
                                                    >
                                                        <a
                                                            href={`/vehicles/workshop/${m.id}/print`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <FileText className="size-4" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {maintenances.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {maintenances.links.map((link, i) =>
                            link.url ? (
                                <Button
                                    key={i}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    asChild
                                >
                                    <Link
                                        href={link.url}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </Button>
                            ) : (
                                <span
                                    key={i}
                                    className="px-2 text-sm text-muted-foreground"
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ),
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
