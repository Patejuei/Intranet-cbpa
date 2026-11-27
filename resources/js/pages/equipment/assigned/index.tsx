import { SortableTableHead } from '@/components/SortableTableHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useTableFilters } from '@/hooks/use-table-filters';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Pagination as PaginationType } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Eye, RotateCcw, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Material Menor',
        href: '/inventory',
    },
    {
        title: 'Prendas a Cargo',
        href: '/assigned-materials',
    },
];

interface Firefighter {
    id: number;
    full_name: string;
    rut: string;
    company: string;
    assigned_materials?: any[]; // We only need count really, but relationship was loaded
}

interface AssignedFilters {
    [key: string]: string | undefined;
    search?: string;
    full_name?: string;
    rut?: string;
    company?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

interface Props {
    firefighters: PaginationType<Firefighter>;
    filters: AssignedFilters;
    can_filter_company: boolean;
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

const emptyAssignedFilters: AssignedFilters = {
    search: '',
    full_name: '',
    rut: '',
    company: 'all',
    sort: undefined,
    direction: undefined,
};

export default function AssignedMaterialsIndex({
    firefighters,
    filters: initialFilters = {},
    can_filter_company,
}: Props) {
    const { filters, setFilter, setSort, clearFilters, hasActiveFilters } =
        useTableFilters<AssignedFilters>('/assigned-materials', {
            search: initialFilters.search || '',
            full_name: initialFilters.full_name || '',
            rut: initialFilters.rut || '',
            company: initialFilters.company || 'all',
            sort: initialFilters.sort,
            direction: initialFilters.direction,
        });

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setFilter('search', filters.search || '');
    };

    const handleCompanyChange = (val: string) => {
        setFilter('company', val);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Prendas a Cargo" />

            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Bomberos - Prendas a Cargo
                        </h1>
                        <p className="text-muted-foreground">
                            Seleccione un bombero para ver sus prendas
                            asignadas.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 md:flex-row">
                    <form
                        onSubmit={handleSearch}
                        className="flex w-full flex-1 gap-2"
                    >
                        <div className="relative flex-1 md:max-w-sm">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar bombero (Nombre o RUT)..."
                                className="pl-8"
                                value={filters.search || ''}
                                onChange={(e) =>
                                    setFilter('search', e.target.value, {
                                        debounce: true,
                                    })
                                }
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Buscar
                        </Button>
                    </form>

                    {hasActiveFilters && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => clearFilters(emptyAssignedFilters)}
                            className="gap-1.5 text-muted-foreground hover:text-foreground"
                        >
                            <RotateCcw className="size-4" />
                            Limpiar filtros
                        </Button>
                    )}

                    {can_filter_company && (
                        <div className="w-full md:w-[200px]">
                            <Select
                                value={filters.company || 'all'}
                                onValueChange={handleCompanyChange}
                            >
                                <SelectTrigger>
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
                        </div>
                    )}
                </div>

                <Card>
                    <CardHeader className="bg-muted/50 pb-4">
                        <CardTitle className="text-lg">
                            Listado de Bomberos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <SortableTableHead
                                        column="full_name"
                                        label="Nombre"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.full_name}
                                        filterPlaceholder="Filtrar por nombre..."
                                        onFilterChange={(value) =>
                                            setFilter('full_name', value)
                                        }
                                    />
                                    <SortableTableHead
                                        column="rut"
                                        label="RUT"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.rut}
                                        filterPlaceholder="Filtrar por RUT..."
                                        onFilterChange={(value) =>
                                            setFilter('rut', value)
                                        }
                                    />
                                    <SortableTableHead
                                        column="company"
                                        label="Compañía"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType={
                                            can_filter_company
                                                ? 'select'
                                                : undefined
                                        }
                                        filterValue={filters.company}
                                        filterOptions={companiesList.map(
                                            (c) => ({
                                                value: c,
                                                label: c,
                                            }),
                                        )}
                                        onFilterChange={(value) =>
                                            setFilter('company', value)
                                        }
                                    />
                                    <TableHead className="text-right">
                                        Acción
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {firefighters.data.length > 0 ? (
                                    firefighters.data.map((firefighter) => (
                                        <TableRow
                                            key={firefighter.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() =>
                                                router.visit(
                                                    `/assigned-materials/${firefighter.id}`,
                                                )
                                            }
                                        >
                                            <TableCell className="font-medium">
                                                {firefighter.full_name}
                                            </TableCell>
                                            <TableCell>
                                                {firefighter.rut}
                                            </TableCell>
                                            <TableCell>
                                                {firefighter.company}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                >
                                                    <Eye className="mr-2 size-4" />
                                                    Ver Detalles
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No se encontraron bomberos.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {firefighters.links && (
                    <div className="mt-4 flex justify-center gap-2">
                        {firefighters.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                disabled={!link.url}
                                onClick={() =>
                                    link.url && router.visit(link.url)
                                }
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
