import Pagination from '@/components/Pagination';
import { SortableTableHead } from '@/components/SortableTableHead';
import { Button } from '@/components/ui/button';
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
import { useTableFilters } from '@/hooks/use-table-filters';
import AppLayout from '@/layouts/app-layout';
import { ReceptionCertificate, User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Eye, FileText, Plus, RotateCcw, Search } from 'lucide-react';

interface ReceptionFilters {
    [key: string]: string | undefined;
    search?: string;
    company?: string;
    date?: string;
    firefighter_name?: string;
    user_name?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

interface PageProps {
    certificates: {
        data: ReceptionCertificate[];
        links: any[];
    };
    filters?: ReceptionFilters;
}

const companiesList = [
    'Primera Compañía',
    'Segunda Compañía',
    'Tercera Compañía',
    'Cuarta Compañía',
    'Quinta Compañía',
    'Séptima Compañía',
    'Octava Compañía',
    'Novena Compañía',
    'Décima Compañía',
    'Comandancia',
];

const emptyReceptionFilters: ReceptionFilters = {
    search: '',
    company: 'all',
    date: '',
    firefighter_name: '',
    user_name: '',
    sort: undefined,
    direction: undefined,
};

export default function ReceptionIndex({
    certificates,
    filters: initialFilters = {},
}: PageProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const canFilterCompany =
        auth.user.company === 'Comandancia' || auth.user.role === 'admin';
    const { canCreate } = usePermissions();
    const { filters, setFilter, setSort, clearFilters, hasActiveFilters } =
        useTableFilters<ReceptionFilters>('/receptions', {
            search: initialFilters.search || '',
            company: initialFilters.company || 'all',
            date: initialFilters.date || '',
            firefighter_name: initialFilters.firefighter_name || '',
            user_name: initialFilters.user_name || '',
            sort: initialFilters.sort,
            direction: initialFilters.direction,
        });

    const filteredCertificates = certificates.data;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Actas de Recepción', href: '/receptions' },
            ]}
        >
            <Head title="Actas de Recepción" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Actas de Recepción
                        </h2>
                        <p className="text-muted-foreground">
                            Historial de recepción de materiales devueltos por
                            bomberos.
                        </p>
                    </div>
                    {canCreate('reception') && (
                        <Link href="/receptions/create">
                            <Button className="gap-2">
                                <Plus className="size-4" />
                                Nueva Acta
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-2">
                        <div className="flex max-w-sm flex-1 items-center gap-2">
                            <Search className="size-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por bombero u oficial..."
                                value={filters.search || ''}
                                onChange={(e) =>
                                    setFilter('search', e.target.value, {
                                        debounce: true,
                                    })
                                }
                                className="h-9"
                            />
                        </div>
                        {hasActiveFilters && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    clearFilters(emptyReceptionFilters)
                                }
                                className="gap-1.5 text-muted-foreground hover:text-foreground"
                            >
                                <RotateCcw className="size-4" />
                                Limpiar filtros
                            </Button>
                        )}
                    </div>
                    {canFilterCompany && (
                        <Select
                            value={filters.company || 'all'}
                            onValueChange={(val) => setFilter('company', val)}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filtrar por Compañía" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Todas las Compañías
                                </SelectItem>
                                {companiesList.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                <div className="rounded-xl border bg-card shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <SortableTableHead
                                    column="date"
                                    label="Fecha"
                                    sortKey={filters.sort}
                                    sortDirection={filters.direction}
                                    onSort={setSort}
                                    filterType="text"
                                    filterValue={filters.date}
                                    filterPlaceholder="YYYY-MM-DD..."
                                    onFilterChange={(value) =>
                                        setFilter('date', value)
                                    }
                                />
                                <SortableTableHead
                                    column="firefighter_name"
                                    label="Bombero (Entrega)"
                                    sortKey={filters.sort}
                                    sortDirection={filters.direction}
                                    onSort={setSort}
                                    filterType="text"
                                    filterValue={filters.firefighter_name}
                                    filterPlaceholder="Filtrar bombero..."
                                    onFilterChange={(value) =>
                                        setFilter('firefighter_name', value)
                                    }
                                />
                                <SortableTableHead
                                    column="user_name"
                                    label="Oficial (Recibe)"
                                    sortKey={filters.sort}
                                    sortDirection={filters.direction}
                                    onSort={setSort}
                                    filterType="text"
                                    filterValue={filters.user_name}
                                    filterPlaceholder="Filtrar oficial..."
                                    onFilterChange={(value) =>
                                        setFilter('user_name', value)
                                    }
                                />
                                <SortableTableHead
                                    column="items_count"
                                    label="Items"
                                    sortKey={filters.sort}
                                    sortDirection={filters.direction}
                                    onSort={setSort}
                                />
                                <SortableTableHead
                                    column="company"
                                    label="Compañía"
                                    sortKey={filters.sort}
                                    sortDirection={filters.direction}
                                    onSort={setSort}
                                    filterType={
                                        canFilterCompany ? 'select' : undefined
                                    }
                                    filterValue={filters.company}
                                    filterOptions={companiesList.map((c) => ({
                                        value: c,
                                        label: c,
                                    }))}
                                    onFilterChange={(value) =>
                                        setFilter('company', value)
                                    }
                                />
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCertificates.length > 0 ? (
                                filteredCertificates.map((cert) => (
                                    <TableRow
                                        key={cert.id}
                                        className="hover:bg-muted/30"
                                    >
                                        <TableCell>
                                            {new Date(
                                                cert.date,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {cert.firefighter?.full_name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {cert.user?.name}
                                        </TableCell>
                                        <TableCell>
                                            {cert.items?.length || 0} items
                                        </TableCell>
                                        <TableCell>{cert.company}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/receptions/${cert.id}`}
                                                    className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
                                                >
                                                    <Eye className="size-3" />{' '}
                                                    Ver
                                                </Link>
                                                <a
                                                    href={`/receptions/${cert.id}/pdf`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                                                >
                                                    <FileText className="size-3" />{' '}
                                                    PDF
                                                </a>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No se encontraron actas en esta página.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination links={certificates.links} />
            </div>
        </AppLayout>
    );
}
