import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Download, Edit, Plus, Search, Trash2, Clock, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePermissions } from '@/hooks/use-permissions';

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

interface Props {
    items: {
        data: InventoryItem[];
        links: any[]; // Pagination links
    };
    filters: {
        search?: string;
        category?: string;
    };
    defaultHourRate: number;
}

export default function InventoryIndex({ items, filters, defaultHourRate }: Props) {
    const { canCreate, canEdit, hasPermission } = usePermissions();
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [hourRate, setHourRate] = useState(defaultHourRate);
    const [isSavingRate, setIsSavingRate] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const currentSearch = filters.search || '';
            const currentCategory = filters.category || 'all';

            if (search !== currentSearch || category !== currentCategory) {
                router.get(
                    '/vehicles/inventory',
                    {
                        search: search,
                        category: category !== 'all' ? category : undefined,
                    },
                    { preserveState: true, replace: true },
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, category, filters.search, filters.category]);

    const handleCategoryChange = (val: string) => {
        setCategory(val);
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Está seguro de eliminar este ítem?')) {
            router.delete(`/vehicles/inventory/${id}`);
        }
    };

    const handleSaveRate = () => {
        setIsSavingRate(true);
        router.post('/vehicles/inventory/settings', {
            default_hour_rate: hourRate
        }, {
            onSuccess: () => setIsSavingRate(false),
            onError: () => setIsSavingRate(false),
            preserveScroll: true
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { title: 'Material Mayor', href: '/vehicles/status' },
                {
                    title: 'Bodega',
                    href: '/vehicles/inventory',
                },
            ]}
        >
            <Head title="Bodega Material Mayor" />

            <div className="flex flex-1 flex-col gap-8 p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Bodega Material Mayor
                        </h1>
                        <p className="text-muted-foreground">
                            Gestión de repuestos, insumos y control de stock.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <a href="/vehicles/inventory/export">
                                <Download className="mr-2 h-4 w-4" />
                                Descargar Excel
                            </a>
                        </Button>
                        {canCreate('vehicles.inventory') && (
                            <Button asChild>
                                <Link href="/vehicles/inventory/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuevo Ítem
                                </Link>
                            </Button>
                        )}
                        {hasPermission('vehicles.inventory.edit') && (
                            <Button variant="outline" onClick={() => setIsSettingsModalOpen(true)}>
                                <Clock className="mr-2 h-4 w-4" />
                                Ajustes Taller
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, SKU o ubicación..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select
                        value={category}
                        onValueChange={handleCategoryChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="insumo">Insumos</SelectItem>
                            <SelectItem value="repuesto">Repuestos</SelectItem>
                            <SelectItem value="herramienta">Herramientas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[100px]">SKU</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Unidad</TableHead>
                                <TableHead className="text-right">
                                    Stock
                                </TableHead>
                                <TableHead className="text-right">
                                    Costo Unit.
                                </TableHead>
                                <TableHead>Ubicación</TableHead>
                                <TableHead className="text-right">
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No se encontraron ítems en la bodega.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.data.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="transition-colors hover:bg-muted/50"
                                    >
                                        <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                                            {item.sku || 'N/A'}
                                        </TableCell>
                                        <TableCell className="font-medium hover:text-primary transition-colors cursor-pointer">
                                            <Link href={`/vehicles/inventory/${item.id}`}>
                                                {item.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    item.category === 'insumo'
                                                        ? 'secondary'
                                                        : item.category === 'herramienta'
                                                          ? 'default'
                                                          : 'outline'
                                                }
                                                className={
                                                    item.category === 'insumo'
                                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                                        : item.category === 'herramienta'
                                                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200'
                                                          : 'border-orange-200 text-orange-700'
                                                }
                                            >
                                                {item.category === 'insumo'
                                                    ? 'Insumo'
                                                    : item.category === 'herramienta'
                                                      ? 'Herramienta'
                                                      : 'Repuesto'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {item.unit_of_measure || 'Unidades'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-col items-end">
                                                <span
                                                    className={
                                                        item.stock <=
                                                        item.min_stock
                                                            ? 'font-bold text-red-600'
                                                            : 'font-medium'
                                                    }
                                                >
                                                    {item.stock}
                                                </span>
                                                {item.stock <=
                                                    item.min_stock && (
                                                    <span className="text-[10px] font-medium text-red-500">
                                                        Bajo Stock
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground tabular-nums">
                                            {formatCurrency(item.unit_cost)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {item.location || '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {canEdit('vehicles.inventory') && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <Link
                                                            href={`/vehicles/inventory/${item.id}/edit`}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                )}
                                                {hasPermission('vehicles.inventory.edit') && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                                                        onClick={() =>
                                                            handleDelete(item.id)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Ajustes del Taller
                        </DialogTitle>
                        <DialogDescription>
                            Configure los parámetros globales para el módulo de taller mecánico.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="hour-rate">Precio Valor Hora Hombre (HH)</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                <Input
                                    id="hour-rate"
                                    type="number"
                                    value={hourRate}
                                    onChange={(e) => setHourRate(Number(e.target.value))}
                                    className="pl-7"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Este valor se aplicará a todas las órdenes de trabajo activas y será el valor inicial para órdenes nuevas.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSettingsModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button 
                            onClick={() => {
                                handleSaveRate();
                                setIsSettingsModalOpen(false);
                            }}
                            disabled={isSavingRate}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Configuración
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
