import { SortableTableHead } from '@/components/SortableTableHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Clock,
    Download,
    Edit,
    Package,
    Plus,
    RotateCcw,
    Save,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

declare let route: any;

interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    category: 'insumo' | 'repuesto' | 'herramienta';
    stock: number;
    min_stock: number;
    unit_cost: number;
    location: string;
    unit_of_measure: string;
}

interface InventoryFilters {
    [key: string]: string | undefined;
    search?: string;
    sku?: string;
    name?: string;
    category?: string;
    unit_of_measure?: string;
    location?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

interface Props {
    items: {
        data: InventoryItem[];
        links: any[];
    };
    filters?: InventoryFilters;
    defaultHourRate: number;
}

const emptyInventoryFilters: InventoryFilters = {
    search: '',
    sku: '',
    name: '',
    category: 'all',
    unit_of_measure: '',
    location: '',
    sort: undefined,
    direction: undefined,
};

export default function InventoryIndex({
    items,
    filters: initialFilters = {},
    defaultHourRate,
}: Props) {
    const { canCreate, canEdit, hasPermission, canConfigureHH } = usePermissions();
    const { filters, setFilter, setSort, clearFilters, hasActiveFilters } =
        useTableFilters<InventoryFilters>('/vehicles/inventory', {
            search: initialFilters.search || '',
            sku: initialFilters.sku || '',
            name: initialFilters.name || '',
            category: initialFilters.category || 'all',
            unit_of_measure: initialFilters.unit_of_measure || '',
            location: initialFilters.location || '',
            sort: initialFilters.sort,
            direction: initialFilters.direction,
        });
    const [hourRate, setHourRate] = useState(defaultHourRate);
    const [isSavingRate, setIsSavingRate] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const handleDelete = (id: number) => {
        if (confirm('¿Está seguro de eliminar este ítem?')) {
            router.delete(`/vehicles/inventory/${id}`);
        }
    };

    const handleSaveRate = () => {
        setIsSavingRate(true);
        router.post(
            '/vehicles/inventory/settings',
            { default_hour_rate: hourRate },
            {
                onSuccess: () => setIsSavingRate(false),
                onError: () => setIsSavingRate(false),
                preserveScroll: true,
            },
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
        }).format(amount);
    };

    const getCategoryBadge = (cat: string) => {
        switch (cat) {
            case 'insumo':
                return (
                    <Badge
                        variant="outline"
                        className="border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300 font-medium text-[11px]"
                    >
                        Insumo
                    </Badge>
                );
            case 'herramienta':
                return (
                    <Badge
                        variant="outline"
                        className="border-purple-500/30 bg-purple-500/10 text-purple-700 dark:border-purple-500/35 dark:bg-purple-500/20 dark:text-purple-300 font-medium text-[11px]"
                    >
                        Herramienta
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 font-medium text-[11px]"
                    >
                        Repuesto
                    </Badge>
                );
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                {
                    title: 'Bodega Material Mayor',
                    href: '/vehicles/inventory',
                },
            ]}
        >
            <Head title="Bodega Material Mayor" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Bodega Material Mayor
                            </h1>
                            <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                {items.data.length} ítems
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Control de repuestos, insumos, inventario y stock crítico para mantenimiento.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <Button variant="outline" size="sm" asChild className="gap-2 shadow-xs">
                            <a href="/vehicles/inventory/export">
                                <Download className="size-4" />
                                <span>Exportar Excel</span>
                            </a>
                        </Button>

                        {canConfigureHH() && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsSettingsModalOpen(true)}
                                className="gap-2 shadow-xs"
                            >
                                <Clock className="size-4" />
                                <span>Ajustes Taller</span>
                            </Button>
                        )}

                        {canCreate('vehicles.inventory') && (
                            <Button size="sm" asChild className="gap-2 shadow-xs">
                                <Link href="/vehicles/inventory/create">
                                    <Plus className="size-4" />
                                    <span>Nuevo Ítem</span>
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
                            placeholder="Buscar por nombre, SKU o ubicación..."
                            className="h-9 pl-9 pr-4 text-sm"
                            value={filters.search || ''}
                            onChange={(e) =>
                                setFilter('search', e.target.value, {
                                    debounce: true,
                                })
                            }
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <div className="w-full sm:w-[200px]">
                            <Select
                                value={filters.category || 'all'}
                                onValueChange={(val) =>
                                    setFilter('category', val)
                                }
                            >
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="Filtrar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las categorías</SelectItem>
                                    <SelectItem value="insumo">Insumos</SelectItem>
                                    <SelectItem value="repuesto">Repuestos</SelectItem>
                                    <SelectItem value="herramienta">Herramientas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    clearFilters(emptyInventoryFilters)
                                }
                                className="gap-1.5 shrink-0"
                            >
                                <RotateCcw className="size-3.5" />
                                <span>Limpiar filtros</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <Card className="rounded-2xl border border-border/70 shadow-xs overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <SortableTableHead
                                        column="sku"
                                        label="SKU"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.sku}
                                        filterPlaceholder="Filtrar SKU..."
                                        onFilterChange={(val) =>
                                            setFilter('sku', val)
                                        }
                                        className="w-[120px]"
                                    />
                                    <SortableTableHead
                                        column="name"
                                        label="Nombre"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.name}
                                        filterPlaceholder="Filtrar nombre..."
                                        onFilterChange={(val) =>
                                            setFilter('name', val)
                                        }
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
                                        filterOptions={[
                                            { value: 'insumo', label: 'Insumos' },
                                            {
                                                value: 'repuesto',
                                                label: 'Repuestos',
                                            },
                                            {
                                                value: 'herramienta',
                                                label: 'Herramientas',
                                            },
                                        ]}
                                        onFilterChange={(val) =>
                                            setFilter('category', val)
                                        }
                                    />
                                    <SortableTableHead
                                        column="unit_of_measure"
                                        label="Unidad"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.unit_of_measure}
                                        filterPlaceholder="Filtrar unidad..."
                                        onFilterChange={(val) =>
                                            setFilter('unit_of_measure', val)
                                        }
                                    />
                                    <SortableTableHead
                                        column="stock"
                                        label="Stock"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        align="right"
                                    />
                                    <SortableTableHead
                                        column="unit_cost"
                                        label="Costo Unit."
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        align="right"
                                    />
                                    <SortableTableHead
                                        column="location"
                                        label="Ubicación"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.location}
                                        filterPlaceholder="Filtrar ubicación..."
                                        onFilterChange={(val) =>
                                            setFilter('location', val)
                                        }
                                    />
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Package className="size-8 text-muted-foreground/40" />
                                                <p className="text-sm font-medium">No se encontraron ítems en la bodega.</p>
                                                <p className="text-xs text-muted-foreground/70">
                                                    {filters.search
                                                        ? 'Pruebe modificando los términos de búsqueda.'
                                                        : 'No hay elementos registrados en esta categoría.'}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    items.data.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="transition-colors hover:bg-muted/40"
                                        >
                                            <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                                                {item.sku || 'S/N'}
                                            </TableCell>
                                            <TableCell className="font-medium text-foreground">
                                                <Link
                                                    href={`/vehicles/inventory/${item.id}`}
                                                    className="hover:text-primary transition-colors font-semibold"
                                                >
                                                    {item.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {getCategoryBadge(item.category)}
                                            </TableCell>
                                            <TableCell className="capitalize text-xs text-muted-foreground">
                                                {item.unit_of_measure || 'Unidades'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-col items-end">
                                                    <span
                                                        className={`text-sm font-bold ${
                                                            item.stock <= item.min_stock
                                                                ? 'text-destructive dark:text-red-400'
                                                                : 'text-foreground'
                                                        }`}
                                                    >
                                                        {item.stock}
                                                    </span>
                                                    {item.stock <= item.min_stock && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-destructive dark:text-red-400">
                                                            <AlertTriangle className="size-2.5" />
                                                            Crítico
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-xs font-medium text-foreground tabular-nums">
                                                {formatCurrency(item.unit_cost)}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {item.location || '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {canEdit('vehicles.inventory') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                            className="size-8 text-muted-foreground hover:text-foreground"
                                                        >
                                                            <Link
                                                                href={`/vehicles/inventory/${item.id}/edit`}
                                                            >
                                                                <Edit className="size-3.5" />
                                                                <span className="sr-only">Editar</span>
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {hasPermission('vehicles.inventory.edit') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8 text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                            <span className="sr-only">Eliminar</span>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Settings Modal */}
            <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                            <Clock className="size-5 text-primary" />
                            <span>Ajustes del Taller Mecánico</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Configure los parámetros globales de tarificación para órdenes de trabajo.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-3">
                        <div className="space-y-2">
                            <Label htmlFor="hour-rate" className="text-sm font-semibold text-foreground">
                                Valor Hora Hombre (HH)
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
                                    $
                                </span>
                                <Input
                                    id="hour-rate"
                                    type="number"
                                    value={hourRate}
                                    onChange={(e) => setHourRate(Number(e.target.value))}
                                    className="h-10 pl-7 text-sm font-medium"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Este monto base se utilizará en las liquidaciones horarias de las órdenes del taller.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsSettingsModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                handleSaveRate();
                                setIsSettingsModalOpen(false);
                            }}
                            disabled={isSavingRate}
                            className="gap-2 shadow-xs"
                        >
                            <Save className="size-4" />
                            <span>Guardar Configuración</span>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}