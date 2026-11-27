import CompanyFilter from '@/components/app/CompanyFilter';
import Pagination from '@/components/Pagination';
import { SortableTableHead } from '@/components/SortableTableHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePermissions } from '@/hooks/use-permissions';
import { useTableFilters } from '@/hooks/use-table-filters';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import { Eye, LifeBuoy, Plus, RotateCcw, Search, Tag } from 'lucide-react';

interface UserModel {
    id: number;
    name: string;
    company: string;
}

interface TicketModel {
    id: number;
    subject: string;
    company: string;
    category: string | null;
    priority: string;
    status: string;
    created_at: string;
    user: UserModel;
    assigned_to: UserModel | null;
}

interface TicketFilters {
    [key: string]: string | undefined;
    search?: string;
    id?: string;
    subject?: string;
    category?: string;
    priority?: string;
    status?: string;
    company?: string;
    requester?: string;
    assigned_to?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

interface PageProps {
    tickets: {
        data: TicketModel[];
        links: any[];
        total?: number;
    };
    categories: Record<string, string>;
    can_create?: boolean;
    filters?: TicketFilters;
}

const emptyTicketFilters: TicketFilters = {
    search: '',
    id: '',
    subject: '',
    category: 'all',
    priority: 'all',
    status: 'all',
    company: '',
    requester: '',
    assigned_to: '',
    sort: undefined,
    direction: undefined,
};

export default function TicketIndex({
    tickets,
    categories,
    can_create,
    filters: initialFilters = {},
}: PageProps) {
    const { canCreate, user } = usePermissions();

    const { filters, setFilter, setSort, clearFilters, hasActiveFilters } =
        useTableFilters<TicketFilters>('/tickets', {
            search: initialFilters.search || '',
            id: initialFilters.id || '',
            subject: initialFilters.subject || '',
            category: initialFilters.category || 'all',
            priority: initialFilters.priority || 'all',
            status: initialFilters.status || 'all',
            company: initialFilters.company || '',
            requester: initialFilters.requester || '',
            assigned_to: initialFilters.assigned_to || '',
            sort: initialFilters.sort,
            direction: initialFilters.direction,
        });

    // Si viene can_create del backend lo usamos directamente, sino usamos canCreate hook
    const showCreateButton = can_create !== undefined ? can_create : canCreate('tickets');

    const totalTickets = tickets.total ?? tickets.data.length;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ABIERTO':
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 font-medium"
                    >
                        Abierto
                    </Badge>
                );
            case 'EN_PROCESO':
                return (
                    <Badge
                        variant="outline"
                        className="border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300 font-medium"
                    >
                        En Proceso
                    </Badge>
                );
            case 'CERRADO':
                return (
                    <Badge
                        variant="secondary"
                        className="border-border/60 text-muted-foreground font-medium"
                    >
                        Cerrado
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'ALTA':
                return (
                    <Badge
                        variant="outline"
                        className="border-red-500/30 bg-red-500/10 text-red-700 dark:border-red-500/35 dark:bg-red-500/20 dark:text-red-300 font-semibold"
                    >
                        Alta
                    </Badge>
                );
            case 'MEDIA':
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 font-medium"
                    >
                        Media
                    </Badge>
                );
            case 'BAJA':
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 font-medium"
                    >
                        Baja
                    </Badge>
                );
            default:
                return <Badge variant="outline">{priority}</Badge>;
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Soporte', href: '/tickets' },
            ]}
        >
            <Head title="Soporte / Ticketera" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Soporte de Plataforma
                            </h1>
                            <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                {totalTickets}{' '}
                                {totalTickets === 1 ? 'ticket' : 'tickets'}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Sistema de tickets para asistencia técnica e incidencias de la intranet institucional.
                        </p>
                    </div>
                    {showCreateButton && (
                        <Button asChild className="gap-2 shadow-xs shrink-0">
                            <Link href="/tickets/create">
                                <Plus className="size-4" />
                                Nuevo Ticket
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                        <Input
                            placeholder="Buscar por asunto, categoría, compañía, solicitante o ID..."
                            value={filters.search || ''}
                            onChange={(e) =>
                                setFilter('search', e.target.value, {
                                    debounce: true,
                                })
                            }
                            className="h-9 pl-9 pr-4 text-sm"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => clearFilters(emptyTicketFilters)}
                                className="gap-1.5 shrink-0"
                            >
                                <RotateCcw className="size-3.5" />
                                <span>Limpiar filtros</span>
                            </Button>
                        )}
                        {user?.role === 'admin' && <CompanyFilter />}
                    </div>
                </div>

                {/* Tickets Table Card */}
                <Card className="rounded-2xl border border-border/70 shadow-xs overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <SortableTableHead
                                        column="id"
                                        label="ID"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.id}
                                        filterPlaceholder="Filtrar por ID..."
                                        onFilterChange={(value) => setFilter('id', value)}
                                        className="w-[80px]"
                                    />
                                    <SortableTableHead
                                        column="subject"
                                        label="Asunto"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.subject}
                                        filterPlaceholder="Filtrar por asunto..."
                                        onFilterChange={(value) => setFilter('subject', value)}
                                        className="min-w-[200px]"
                                    />
                                    <SortableTableHead
                                        column="category"
                                        label="Categoría"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="select"
                                        filterValue={filters.category}
                                        filterOptions={Object.entries(categories).map(
                                            ([value, label]) => ({
                                                value,
                                                label,
                                            }),
                                        )}
                                        onFilterChange={(value) => setFilter('category', value)}
                                    />
                                    <SortableTableHead
                                        column="priority"
                                        label="Prioridad"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="select"
                                        filterValue={filters.priority}
                                        filterOptions={[
                                            { value: 'ALTA', label: 'Alta' },
                                            { value: 'MEDIA', label: 'Media' },
                                            { value: 'BAJA', label: 'Baja' },
                                        ]}
                                        onFilterChange={(value) => setFilter('priority', value)}
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
                                            { value: 'ABIERTO', label: 'Abierto' },
                                            { value: 'EN_PROCESO', label: 'En Proceso' },
                                            { value: 'CERRADO', label: 'Cerrado' },
                                        ]}
                                        onFilterChange={(value) => setFilter('status', value)}
                                    />
                                    <SortableTableHead
                                        column="company"
                                        label="Compañía"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.company}
                                        filterPlaceholder="Filtrar por compañía..."
                                        onFilterChange={(value) => setFilter('company', value)}
                                    />
                                    <SortableTableHead
                                        column="requester"
                                        label="Solicitante"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.requester}
                                        filterPlaceholder="Filtrar por solicitante..."
                                        onFilterChange={(value) => setFilter('requester', value)}
                                    />
                                    <SortableTableHead
                                        column="assigned_to"
                                        label="Asignado a"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.assigned_to}
                                        filterPlaceholder="Filtrar por asignado..."
                                        onFilterChange={(value) => setFilter('assigned_to', value)}
                                    />
                                    <SortableTableHead
                                        column="created_at"
                                        label="Fecha"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                    />
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.data.length > 0 ? (
                                    tickets.data.map((ticket) => (
                                        <TableRow
                                            key={ticket.id}
                                            className="transition-colors hover:bg-muted/40"
                                        >
                                            <TableCell className="font-semibold text-muted-foreground">
                                                #{ticket.id}
                                            </TableCell>
                                            <TableCell className="font-medium text-foreground">
                                                <Link
                                                    href={`/tickets/${ticket.id}`}
                                                    className="hover:text-primary transition-colors line-clamp-1"
                                                >
                                                    {ticket.subject}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs">
                                                {ticket.category ? (
                                                    <span className="inline-flex items-center gap-1">
                                                        <Tag className="size-3 opacity-60" />
                                                        {categories[ticket.category] ?? ticket.category}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground/60">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getPriorityBadge(ticket.priority)}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(ticket.status)}
                                            </TableCell>
                                            <TableCell className="text-xs font-medium">
                                                {ticket.company}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs">
                                                {ticket.user.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs">
                                                {ticket.assigned_to ? (
                                                    ticket.assigned_to.name
                                                ) : (
                                                    <span className="text-xs italic text-muted-foreground/60">
                                                        Sin asignar
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                                                {formatDate(ticket.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 gap-1.5 hover:text-primary"
                                                    asChild
                                                >
                                                    <Link href={`/tickets/${ticket.id}`}>
                                                        <Eye className="size-3.5" />
                                                        <span>Ver</span>
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={10}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <LifeBuoy className="size-8 text-muted-foreground/40" />
                                                <p className="text-sm font-medium">
                                                    No se encontraron tickets.
                                                </p>
                                                <p className="text-xs text-muted-foreground/70">
                                                    {hasActiveFilters
                                                        ? 'Pruebe modificando los filtros o términos de búsqueda.'
                                                        : 'No hay tickets registrados en esta sección.'}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Pagination links={tickets.links} />
            </div>
        </AppLayout>
    );
}
