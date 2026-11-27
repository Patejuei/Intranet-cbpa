import Pagination from '@/components/Pagination';
import { SortableTableHead } from '@/components/SortableTableHead';
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
import { useTableFilters } from '@/hooks/use-table-filters';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, RotateCcw, Search, Shield, Trash, UserPlus, Users } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    rut?: string;
    role: string;
    permissions: string[];
    company: string;
    is_enabled?: boolean;
}

interface UserFilters {
    [key: string]: string | undefined;
    search?: string;
    name?: string;
    rut?: string;
    email?: string;
    company?: string;
    role?: string;
    status?: string;
    permission?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

interface PageProps {
    users: {
        data: User[];
        links: any[];
        total?: number;
    };
    filters?: UserFilters;
    companies?: string[];
    roles?: Record<string, string>;
}

const emptyUserFilters: UserFilters = {
    search: '',
    name: '',
    rut: '',
    email: '',
    company: 'all',
    role: 'all',
    status: 'all',
    permission: '',
    sort: undefined,
    direction: undefined,
};

export default function UserIndex({
    users,
    filters: initialFilters = {},
    companies = [],
    roles = {},
}: PageProps) {
    const { props } = usePage<SharedData>();
    const user = props.auth.user;
    const currentUserRole = user?.role || 'user';

    const { filters, setFilter, setSort, clearFilters, hasActiveFilters } =
        useTableFilters<UserFilters>('/admin/users', {
            search: initialFilters.search || '',
            name: initialFilters.name || '',
            rut: initialFilters.rut || '',
            email: initialFilters.email || '',
            company: initialFilters.company || 'all',
            role: initialFilters.role || 'all',
            status: initialFilters.status || 'all',
            permission: initialFilters.permission || '',
            sort: initialFilters.sort,
            direction: initialFilters.direction,
        });

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return (
                    <Badge
                        variant="outline"
                        className="border-purple-500/30 bg-purple-500/10 text-purple-700 dark:border-purple-500/35 dark:bg-purple-500/20 dark:text-purple-300 font-semibold uppercase text-[11px]"
                    >
                        Administrador
                    </Badge>
                );
            case 'comandante':
            case 'inspector':
                return (
                    <Badge
                        variant="outline"
                        className="border-primary/30 bg-primary/10 text-primary dark:border-primary/40 dark:bg-primary/20 font-medium capitalize text-[11px]"
                    >
                        {role}
                    </Badge>
                );
            case 'capitan':
            case 'maquinista':
                return (
                    <Badge
                        variant="outline"
                        className="border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300 font-medium capitalize text-[11px]"
                    >
                        {role}
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="secondary"
                        className="border-border/60 text-muted-foreground capitalize text-[11px]"
                    >
                        {role}
                    </Badge>
                );
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Administración', href: '/admin/users' },
            ]}
        >
            <Head title="Gestión de Usuarios" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Gestión de Usuarios
                            </h1>
                            <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                {users.total ?? users.data.length}{' '}
                                {(users.total ?? users.data.length) === 1
                                    ? 'usuario'
                                    : 'usuarios'}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Administra cuentas de acceso, roles institucionales y permisos modulares.
                        </p>
                    </div>

                    <Button asChild className="gap-2 shadow-xs shrink-0">
                        <Link href="/admin/users/create">
                            <UserPlus className="size-4" />
                            <span>Nuevo Usuario</span>
                        </Link>
                    </Button>
                </div>

                {/* Search & Quick Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative w-full max-w-md">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                            <Input
                                placeholder="Buscar por nombre, RUT o correo..."
                                value={filters.search || ''}
                                onChange={(e) =>
                                    setFilter('search', e.target.value, {
                                        debounce: true,
                                    })
                                }
                                className="h-9 pl-9 pr-4 text-sm"
                            />
                        </div>

                        <Select
                            value={filters.status || 'all'}
                            onValueChange={(value) => setFilter('status', value)}
                        >
                            <SelectTrigger className="h-9 w-full sm:w-[170px] text-sm">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="enabled">Activos</SelectItem>
                                <SelectItem value="disabled">Inactivos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => clearFilters(emptyUserFilters)}
                            className="gap-1.5 shrink-0"
                        >
                            <RotateCcw className="size-3.5" />
                            <span>Limpiar filtros</span>
                        </Button>
                    )}
                </div>

                {/* Users Table */}
                <Card className="rounded-2xl border border-border/70 shadow-xs overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <SortableTableHead
                                        column="name"
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
                                        className="min-w-[180px]"
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
                                        className="min-w-[200px]"
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
                                        column="role"
                                        label="Rol del Sistema"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="select"
                                        filterValue={filters.role}
                                        filterOptions={Object.entries(
                                            roles,
                                        ).map(([value, label]) => ({
                                            value,
                                            label,
                                        }))}
                                        onFilterChange={(value) =>
                                            setFilter('role', value)
                                        }
                                        className="min-w-[160px]"
                                    />
                                    <SortableTableHead
                                        column="permission"
                                        label="Permisos"
                                        sortable={false}
                                        filterType="text"
                                        filterValue={filters.permission}
                                        filterPlaceholder="Filtrar por permiso..."
                                        onFilterChange={(value) =>
                                            setFilter('permission', value)
                                        }
                                        className="min-w-[220px]"
                                    />
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length > 0 ? (
                                    users.data.map((u) => (
                                        <TableRow
                                            key={u.id}
                                            className="transition-colors hover:bg-muted/40"
                                        >
                                            <TableCell className="font-semibold text-foreground">
                                                <div className="flex items-center gap-2">
                                                    <span>{u.name}</span>
                                                    {u.is_enabled === false && (
                                                        <Badge
                                                            variant="outline"
                                                            className="border-destructive/30 bg-destructive/10 text-destructive text-[10px] px-1.5 py-0"
                                                        >
                                                            Inactivo
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">
                                                {u.rut ? (
                                                    <span className="font-medium text-foreground">{u.rut}</span>
                                                ) : (
                                                    <span className="text-muted-foreground/50 italic text-[11px]">
                                                        Sin RUT
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-xs sm:text-sm">
                                                {u.email}
                                            </TableCell>
                                            <TableCell className="text-xs font-medium text-foreground">
                                                {u.company || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {getRoleBadge(u.role)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1 max-w-xs">
                                                    {u.role === 'admin' ? (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                                                            <Shield className="size-3" />
                                                            Acceso Total
                                                        </span>
                                                    ) : (
                                                        (Array.isArray(u.permissions)
                                                            ? u.permissions
                                                            : []
                                                        ).map((perm) => (
                                                            <span
                                                                key={perm}
                                                                className="rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                                                            >
                                                                {perm}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {currentUserRole !== 'ayudante' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-muted-foreground hover:text-foreground"
                                                            asChild
                                                        >
                                                            <Link href={`/admin/users/${u.id}/edit`}>
                                                                <Pencil className="size-3.5" />
                                                                <span className="sr-only">Editar usuario</span>
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {u.id !== 1 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() => handleDelete(u.id)}
                                                        >
                                                            <Trash className="size-3.5" />
                                                            <span className="sr-only">Eliminar usuario</span>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Users className="size-8 text-muted-foreground/40" />
                                                <p className="text-sm font-medium">No se encontraron usuarios.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Pagination links={users.links} />
            </div>
        </AppLayout>
    );
}
