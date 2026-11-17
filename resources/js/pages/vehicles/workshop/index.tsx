import Pagination from '@/components/Pagination';
import { ReportModal } from '@/components/report-modal';
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
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, FileSpreadsheet, FileText, Plus, Search, Wrench } from 'lucide-react';
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

export default function VehicleWorkshop() {
    const { maintenances, filters } = usePage<{
        maintenances: {
            data: Maintenance[];
            links: PaginationLink[];
        };
        filters: {
            status?: string;
            search?: string;
            page?: number;
        };
    }>().props;

    const { canCreate } = usePermissions();
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [debouncedSearch, setDebouncedSearch] = useState(search);

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

    useEffect(() => {
        if (debouncedSearch !== (filters.search || '')) {
            router.get(
                '/vehicles/workshop',
                {
                    status: filters.status,
                    search: debouncedSearch,
                },
                { preserveState: true, replace: true },
            );
        }
    }, [debouncedSearch]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'En Taller':
                return (
                    <Badge
                        variant="outline"
                        className="border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300 font-semibold text-[11px]"
                    >
                        En Taller
                    </Badge>
                );
            case 'En Espera de Repuestos':
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 font-medium text-[11px]"
                    >
                        En Espera de Repuestos
                    </Badge>
                );
            case 'Finalizado':
            case 'Entregado':
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 font-semibold text-[11px]"
                    >
                        {status}
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary" className="text-[11px]">
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Taller Mecánico', href: '/vehicles/workshop' },
            ]}
        >
            <Head title="Taller Mecánico" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Taller Mecánico
                            </h1>
                            <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                {maintenances.data.length} órdenes
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Gestión de órdenes de trabajo, reparaciones activas, horas hombre y entregas de carros.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReportModalOpen(true)}
                            className="gap-2 shadow-xs"
                        >
                            <FileSpreadsheet className="size-4" />
                            <span>Reporte Excel</span>
                        </Button>

                        {canCreate('vehicles.workshop') && (
                            <Button size="sm" asChild className="gap-2 shadow-xs">
                                <Link href="/vehicles/workshop/create">
                                    <Plus className="size-4" />
                                    <span>Nuevo Ingreso</span>
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                        <Input
                            placeholder="Buscar por código de vehículo, patente o taller..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="h-9 pl-9 pr-4 text-sm"
                        />
                    </div>

                    <div className="w-full sm:w-[220px] shrink-0">
                        <Select
                            defaultValue={filters.status || 'all'}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las órdenes</SelectItem>
                                <SelectItem value="active">Activas (En Taller)</SelectItem>
                                <SelectItem value="history">Historial (Finalizadas / Entregadas)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Table */}
                <Card className="rounded-2xl border border-border/70 shadow-xs overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[160px]">Vehículo</TableHead>
                                    <TableHead>Compañía</TableHead>
                                    <TableHead>Taller / Proveedor</TableHead>
                                    <TableHead>Fecha Ingreso</TableHead>
                                    <TableHead>Salida Estimada</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {maintenances.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Wrench className="size-8 text-muted-foreground/40" />
                                                <p className="text-sm font-medium">No se encontraron órdenes de trabajo.</p>
                                                <p className="text-xs text-muted-foreground/70">
                                                    {search
                                                        ? 'Pruebe con otros términos de búsqueda.'
                                                        : 'No hay vehículos ingresados en este filtro.'}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    maintenances.data.map((m) => (
                                        <TableRow
                                            key={m.id}
                                            className="transition-colors hover:bg-muted/40"
                                        >
                                            <TableCell className="font-semibold text-foreground">
                                                <Link
                                                    href={`/vehicles/workshop/${m.id}`}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    {m.vehicle.name}
                                                </Link>
                                                <span className="block text-xs font-mono font-normal text-muted-foreground">
                                                    {m.vehicle.plate}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-xs font-medium text-foreground">
                                                {m.vehicle.company}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {m.workshop_name}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                {formatDate(m.entry_date)}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                {m.tentative_exit_date
                                                    ? formatDate(m.tentative_exit_date)
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(m.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="size-8 text-muted-foreground hover:text-foreground"
                                                        title="Ver Orden de Trabajo"
                                                    >
                                                        <Link href={`/vehicles/workshop/${m.id}`}>
                                                            <Eye className="size-3.5" />
                                                            <span className="sr-only">Ver</span>
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="size-8 text-muted-foreground hover:text-foreground"
                                                        title="Imprimir Orden"
                                                    >
                                                        <a
                                                            href={`/vehicles/workshop/${m.id}/print`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            <FileText className="size-3.5" />
                                                            <span className="sr-only">Imprimir</span>
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
                <Pagination links={maintenances.links} />
            </div>

            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                title="Reporte del Taller Mecánico"
                route="/vehicles/reports/workshop"
                type="excel"
            />
        </AppLayout>
    );
}