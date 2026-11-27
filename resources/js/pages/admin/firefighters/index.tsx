import Pagination from '@/components/Pagination';
import { SortableTableHead } from '@/components/SortableTableHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Firefighter } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Eye, Flame, Pencil, RotateCcw, Search, Trash, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';

interface FirefighterFilters {
    [key: string]: string | undefined;
    search?: string;
    general_registry_number?: string;
    name?: string;
    rut?: string;
    company?: string;
    email?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

interface PageProps {
    firefighters: {
        data: Firefighter[];
        links: any[];
        total?: number;
    };
    filters?: FirefighterFilters;
    companies?: string[];
}

const defaultCompanies = [
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

const emptyFirefighterFilters: FirefighterFilters = {
    search: '',
    general_registry_number: '',
    name: '',
    rut: '',
    company: 'all',
    email: '',
    sort: undefined,
    direction: undefined,
};

export default function FirefighterIndex({
    firefighters,
    filters: initialFilters = {},
    companies = defaultCompanies,
}: PageProps) {
    const { canCreate, canEdit } = usePermissions();
    const { filters, setFilter, setSort, clearFilters, hasActiveFilters } =
        useTableFilters<FirefighterFilters>('/admin/firefighters', {
            search: initialFilters.search || '',
            general_registry_number:
                initialFilters.general_registry_number || '',
            name: initialFilters.name || '',
            rut: initialFilters.rut || '',
            company: initialFilters.company || 'all',
            email: initialFilters.email || '',
            sort: initialFilters.sort,
            direction: initialFilters.direction,
        });
    const [isEdit, setIsEdit] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Form handling
    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: 0,
        general_registry_number: '',
        first_name: '',
        middle_name: '',
        paternal_last_name: '',
        maternal_last_name: '',
        rut: '',
        company: '',
        email: '',
    });

    const openCreate = () => {
        reset();
        setIsEdit(false);
        setIsOpen(true);
    };

    const openEdit = (firefighter: Firefighter) => {
        setData({
            id: firefighter.id,
            general_registry_number: firefighter.general_registry_number || '',
            first_name: firefighter.first_name || '',
            middle_name: firefighter.middle_name || '',
            paternal_last_name: firefighter.paternal_last_name || '',
            maternal_last_name: firefighter.maternal_last_name || '',
            rut: firefighter.rut,
            company: firefighter.company,
            email: firefighter.email || '',
        });
        setIsEdit(true);
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/firefighters/${data.id}`, {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            post('/admin/firefighters', {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este bombero?')) {
            router.delete(`/admin/firefighters/${id}`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Administración', href: '/admin/firefighters' },
            ]}
        >
            <Head title="Gestión de Bomberos" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Gestión de Bomberos
                            </h1>
                            <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                {firefighters.total ?? firefighters.data.length}{' '}
                                {(firefighters.total ?? firefighters.data.length) === 1
                                    ? 'bombero'
                                    : 'bomberos'}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Registro del personal de voluntarios, números de registro general y compañía de pertenencia.
                        </p>
                    </div>

                    {canCreate('firefighters') && (
                        <Button asChild className="gap-2 shadow-xs shrink-0">
                            <Link href="/admin/firefighters/create">
                                <UserPlus className="size-4" />
                                <span>Nuevo Bombero</span>
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Search Bar & Clear Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                        <Input
                            placeholder="Buscar por nombre, RUT o N° de registro..."
                            value={filters.search || ''}
                            onChange={(e) =>
                                setFilter('search', e.target.value, {
                                    debounce: true,
                                })
                            }
                            className="h-9 pl-9 pr-4 text-sm"
                        />
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => clearFilters(emptyFirefighterFilters)}
                            className="gap-1.5 shrink-0"
                        >
                            <RotateCcw className="size-3.5" />
                            <span>Limpiar filtros</span>
                        </Button>
                    )}
                </div>

                {/* Table */}
                <Card className="rounded-2xl border border-border/70 shadow-xs overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <SortableTableHead
                                        column="general_registry_number"
                                        label="N° Reg. General"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={
                                            filters.general_registry_number
                                        }
                                        filterPlaceholder="Filtrar por N°..."
                                        onFilterChange={(value) =>
                                            setFilter(
                                                'general_registry_number',
                                                value,
                                            )
                                        }
                                        className="w-[155px]"
                                    />
                                    <SortableTableHead
                                        column="full_name"
                                        label="Nombre"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.name}
                                        filterPlaceholder="Filtrar por nombre..."
                                        onFilterChange={(value) =>
                                            setFilter('name', value)
                                        }
                                        className="min-w-[200px]"
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
                                        className="min-w-[130px]"
                                    />
                                    <SortableTableHead
                                        column="company"
                                        label="Compañía"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="select"
                                        filterValue={filters.company}
                                        filterOptions={companies.map((c) => ({
                                            value: c,
                                            label: c,
                                        }))}
                                        onFilterChange={(value) =>
                                            setFilter('company', value)
                                        }
                                        className="min-w-[160px]"
                                    />
                                    <SortableTableHead
                                        column="email"
                                        label="Correo Electrónico"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.email}
                                        filterPlaceholder="Filtrar por correo..."
                                        onFilterChange={(value) =>
                                            setFilter('email', value)
                                        }
                                        className="min-w-[180px]"
                                    />
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {firefighters.data.length > 0 ? (
                                    firefighters.data.map((firefighter) => (
                                        <TableRow
                                            key={firefighter.id}
                                            className="transition-colors hover:bg-muted/40"
                                        >
                                            <TableCell className="font-semibold text-muted-foreground text-xs sm:text-sm">
                                                {firefighter.general_registry_number || '-'}
                                            </TableCell>
                                            <TableCell className="font-medium text-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Flame className="size-3.5 text-primary opacity-70" />
                                                    <span>
                                                        {[
                                                            firefighter.first_name,
                                                            firefighter.paternal_last_name,
                                                            firefighter.maternal_last_name,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(' ') ||
                                                            firefighter.full_name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs sm:text-sm text-muted-foreground">
                                                {firefighter.rut}
                                            </TableCell>
                                            <TableCell className="text-xs font-medium text-foreground">
                                                {firefighter.company}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {firefighter.email || '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-muted-foreground hover:text-foreground"
                                                        asChild
                                                    >
                                                        <Link href={`/admin/firefighters/${firefighter.id}`}>
                                                            <Eye className="size-3.5" />
                                                            <span className="sr-only">Ver ficha</span>
                                                        </Link>
                                                    </Button>
                                                    {canEdit('firefighters') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-muted-foreground hover:text-foreground"
                                                            asChild
                                                        >
                                                            <Link href={`/admin/firefighters/${firefighter.id}/edit`}>
                                                                <Pencil className="size-3.5" />
                                                                <span className="sr-only">Editar bombero</span>
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {canEdit('firefighters') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() => handleDelete(firefighter.id)}
                                                        >
                                                            <Trash className="size-3.5" />
                                                            <span className="sr-only">Eliminar bombero</span>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Users className="size-8 text-muted-foreground/40" />
                                                <p className="text-sm font-medium">No se encontraron bomberos.</p>
                                                <p className="text-xs text-muted-foreground/70">
                                                    {hasActiveFilters
                                                        ? 'Pruebe modificando los términos de búsqueda o filtros.'
                                                        : 'No hay registros cargados en esta vista.'}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Pagination links={firefighters.links} />
            </div>

            {/* Modal Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">
                            {isEdit ? 'Editar Bombero' : 'Nuevo Bombero'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Complete los antecedentes institucionales del voluntario.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="company" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Compañía <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.company}
                                onValueChange={(value) =>
                                    setData('company', value)
                                }
                            >
                                <SelectTrigger id="company" className="h-10 text-sm">
                                    <SelectValue placeholder="Seleccione Compañía" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companies.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.company && (
                                <p className="text-xs text-destructive">
                                    {errors.company}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="first_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Nombre <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="first_name"
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData('first_name', e.target.value)
                                    }
                                    placeholder="Ej: Carlos"
                                    className="h-10 text-sm"
                                    required
                                />
                                {errors.first_name && (
                                    <p className="text-xs text-destructive">
                                        {errors.first_name}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="middle_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Segundo Nombre
                                </Label>
                                <Input
                                    id="middle_name"
                                    value={data.middle_name}
                                    onChange={(e) =>
                                        setData('middle_name', e.target.value)
                                    }
                                    placeholder="Ej: Alberto"
                                    className="h-10 text-sm"
                                />
                                {errors.middle_name && (
                                    <p className="text-xs text-destructive">
                                        {errors.middle_name}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="paternal_last_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Apellido Paterno <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="paternal_last_name"
                                    value={data.paternal_last_name}
                                    onChange={(e) =>
                                        setData('paternal_last_name', e.target.value)
                                    }
                                    placeholder="Ej: Silva"
                                    className="h-10 text-sm"
                                    required
                                />
                                {errors.paternal_last_name && (
                                    <p className="text-xs text-destructive">
                                        {errors.paternal_last_name}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="maternal_last_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Apellido Materno <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="maternal_last_name"
                                    value={data.maternal_last_name}
                                    onChange={(e) =>
                                        setData('maternal_last_name', e.target.value)
                                    }
                                    placeholder="Ej: Gómez"
                                    className="h-10 text-sm"
                                    required
                                />
                                {errors.maternal_last_name && (
                                    <p className="text-xs text-destructive">
                                        {errors.maternal_last_name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="rut" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    RUT <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="rut"
                                    value={data.rut}
                                    onChange={(e) => setData('rut', e.target.value)}
                                    placeholder="12.345.678-9"
                                    className="h-10 text-sm"
                                    required
                                />
                                {errors.rut && (
                                    <p className="text-xs text-destructive">
                                        {errors.rut}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="general_registry_number" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    N° Registro General
                                </Label>
                                <Input
                                    id="general_registry_number"
                                    value={data.general_registry_number}
                                    onChange={(e) =>
                                        setData(
                                            'general_registry_number',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ej: 1420"
                                    className="h-10 text-sm"
                                />
                                {errors.general_registry_number && (
                                    <p className="text-xs text-destructive">
                                        {errors.general_registry_number}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Correo Electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="bombero@cbpa.cl"
                                className="h-10 text-sm"
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing} className="shadow-xs">
                                {isEdit ? 'Guardar Cambios' : 'Crear Bombero'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}