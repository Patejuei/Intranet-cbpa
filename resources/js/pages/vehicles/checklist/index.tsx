import { SortableTableHead } from '@/components/SortableTableHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import Pagination from '@/components/Pagination';
import { useTableFilters } from '@/hooks/use-table-filters';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { BreadcrumbItem, Pagination as PaginationType } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, FileSpreadsheet, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { ReportModal } from '@/components/report-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehículos',
        href: '/vehicles/status',
    },
    {
        title: 'Checklists',
        href: '/vehicles/checklists',
    },
];

interface Checklist {
    id: number;
    status: string;
    created_at: string;
    vehicle: { name: string; plate: string; company: string };
    user: { name: string };
}

interface ChecklistFilters {
    [key: string]: string | undefined;
    vehicle_id?: string;
    vehicle_ids?: string;
    id?: string;
    created_at?: string;
    vehicle_name?: string;
    user_name?: string;
    status?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

interface Props {
    checklists: PaginationType<Checklist>;
    vehicles: { id: number; name: string }[];
    filters?: ChecklistFilters;
}

const emptyChecklistFilters: ChecklistFilters = {
    vehicle_id: 'all',
    vehicle_ids: '',
    id: '',
    created_at: '',
    vehicle_name: '',
    user_name: '',
    status: 'all',
    sort: undefined,
    direction: undefined,
};

import { usePermissions } from '@/hooks/use-permissions';

export default function IndexChecklist({
    checklists,
    vehicles,
    filters: initialFilters = {},
}: Props) {
    const { auth } = usePage<any>().props;
    const { canCreate } = usePermissions();
    const [reportModalOpen, setReportModalOpen] = useState(false);

    const { filters, setFilter, setSort, clearFilters, hasActiveFilters } =
        useTableFilters<ChecklistFilters>('/vehicles/checklists', {
            vehicle_id: initialFilters.vehicle_id || 'all',
            vehicle_ids: initialFilters.vehicle_ids || '',
            id: initialFilters.id || '',
            created_at: initialFilters.created_at || '',
            vehicle_name: initialFilters.vehicle_name || '',
            user_name: initialFilters.user_name || '',
            status: initialFilters.status || 'all',
            sort: initialFilters.sort,
            direction: initialFilters.direction,
        });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historial Checklists" />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 max-w-7xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Historial de Checklists
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Registro de revisiones preventivas de material mayor.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="w-full sm:w-[220px]">
                            <Select
                                value={filters.vehicle_id || 'all'}
                                onValueChange={(val) =>
                                    setFilter('vehicle_id', val)
                                }
                            >
                                <SelectTrigger className="h-9">
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
                                            {v.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    clearFilters(emptyChecklistFilters)
                                }
                                className="gap-1.5 shrink-0"
                            >
                                <RotateCcw className="size-3.5" />
                                <span>Limpiar filtros</span>
                            </Button>
                        )}

                        {/* @ts-ignore */}
                        {canCreate('vehicles.checklist') && (
                            <Button asChild>
                                <Link href="/vehicles/checklists/create">
                                    <Plus className="mr-2 size-4" />
                                    Nuevo Checklist
                                </Link>
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => setReportModalOpen(true)}>
                            <FileSpreadsheet className="mr-2 size-4" />
                            Reporte Excel
                        </Button>
                    </div>
                </div>

                <Card className="rounded-2xl border border-border/70 bg-card shadow-xs overflow-hidden">
                    <CardHeader className="px-5 sm:px-6 py-4 border-b border-border/50 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold text-foreground">Registros de Inspección</CardTitle>
                        <Badge variant="outline" className="border-border/60 text-xs font-normal">
                            {checklists.total ?? checklists.data.length} registros
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-border/60 bg-muted/20">
                                        <SortableTableHead
                                            column="id"
                                            label="ID"
                                            sortKey={filters.sort}
                                            sortDirection={filters.direction}
                                            onSort={setSort}
                                            filterType="text"
                                            filterValue={filters.id}
                                            filterPlaceholder="Filtrar ID..."
                                            onFilterChange={(val) =>
                                                setFilter('id', val)
                                            }
                                            className="w-24"
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
                                            onFilterChange={(val) =>
                                                setFilter('created_at', val)
                                            }
                                        />
                                        <SortableTableHead
                                            column="vehicle"
                                            label="Vehículo"
                                            sortKey={filters.sort}
                                            sortDirection={filters.direction}
                                            onSort={setSort}
                                            filterType="multi-select"
                                            filterValue={filters.vehicle_ids}
                                            filterOptions={vehicles.map((v) => ({
                                                value: v.id.toString(),
                                                label: v.name,
                                            }))}
                                            onFilterChange={(val) =>
                                                setFilter('vehicle_ids', val)
                                            }
                                        />
                                        <SortableTableHead
                                            column="user"
                                            label="Realizado Por"
                                            sortKey={filters.sort}
                                            sortDirection={filters.direction}
                                            onSort={setSort}
                                            filterType="text"
                                            filterValue={filters.user_name}
                                            filterPlaceholder="Filtrar usuario..."
                                            onFilterChange={(val) =>
                                                setFilter('user_name', val)
                                            }
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
                                                    value: 'Pending',
                                                    label: 'Pendiente',
                                                },
                                                {
                                                    value: 'Partially Reviewed',
                                                    label: 'Parcialmente Revisado',
                                                },
                                                {
                                                    value: 'Completed',
                                                    label: 'Completado',
                                                },
                                            ]}
                                            onFilterChange={(val) =>
                                                setFilter('status', val)
                                            }
                                        />
                                        <TableHead className="text-right">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {checklists.data.map((checklist) => (
                                        <TableRow key={checklist.id} className="transition-colors hover:bg-muted/30">
                                            <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                                                #{checklist.id}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatDate(checklist.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-semibold text-sm text-foreground">
                                                    {checklist.vehicle.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {checklist.vehicle.company}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-foreground">
                                                {checklist.user.name}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                                                        checklist.status === 'Completed'
                                                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                                                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                                                    }`}
                                                >
                                                    {checklist.status === 'Completed' ? (
                                                        <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                                                    ) : (
                                                        <Clock className="size-3 text-amber-600 dark:text-amber-400" />
                                                    )}
                                                    {checklist.status === 'Completed' ? 'Completado' : checklist.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {/* @ts-ignore */}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="text-xs hover:text-primary transition-colors"
                                                >
                                                    <Link href={`/vehicles/checklists/${checklist.id}`}>
                                                        Ver Detalles
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {checklists.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-28 text-center text-sm text-muted-foreground"
                                            >
                                                No hay registros encontrados.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {checklists.links && (
                    <div className="flex justify-center pt-2">
                        <Pagination links={checklists.links} />
                    </div>
                )}
                <ReportModal
                    isOpen={reportModalOpen}
                    onClose={() => setReportModalOpen(false)}
                    title="Reporte de Checklists"
                    route="/vehicles/reports/checklists"
                    type="excel"
                />
            </div>
        </AppLayout>
    );
}
