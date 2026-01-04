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
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

declare var route: any;

interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    category: 'insumo' | 'repuesto';
    stock: number;
    min_stock: number;
    unit_cost: number;
    location: string;
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
}

export default function InventoryIndex({ items, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Only trigger router.get if search or category has actually changed from initial filters
            // or if they have changed from the last state that triggered a router.get
            const currentSearch = filters.search || '';
            const currentCategory = filters.category || 'all';

            if (search !== currentSearch || category !== currentCategory) {
                router.get(
                    route('vehicles.inventory.index'),
                    {
                        search: search,
                        category: category !== 'all' ? category : undefined,
                    },
                    { preserveState: true, replace: true },
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, category, filters.search, filters.category]); // Trigger on search or category change

    const handleCategoryChange = (val: string) => {
        setCategory(val);
        // The useEffect hook will handle the router.get call after debounce
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Está seguro de eliminar este ítem?')) {
            router.delete(route('vehicles.inventory.destroy', id));
        }
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
                    title: 'Bodega Central',
                    href: route('vehicles.inventory.index'),
                },
            ]}
        >
            <Head title="Bodega Material Mayor" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl leading-tight font-semibold text-gray-800">
                                Bodega Material Mayor
                            </h2>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-1 items-center gap-4">
                                <div className="relative w-72">
                                    <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por nombre o SKU..."
                                        className="pl-8"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
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
                                        <SelectItem value="all">
                                            Todas
                                        </SelectItem>
                                        <SelectItem value="insumo">
                                            Insumos
                                        </SelectItem>
                                        <SelectItem value="repuesto">
                                            Repuestos
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button asChild>
                                <Link href={route('vehicles.inventory.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuevo Ítem
                                </Link>
                            </Button>
                        </div>

                        <div className="rounded-md border bg-white shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Categoría</TableHead>
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
                                                colSpan={7}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                No se encontraron ítems.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        items.data.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-mono text-xs">
                                                    {item.sku || '-'}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {item.name}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                                            item.category ===
                                                            'insumo'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-orange-100 text-orange-800'
                                                        }`}
                                                    >
                                                        {item.category ===
                                                        'insumo'
                                                            ? 'Insumo'
                                                            : 'Repuesto'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span
                                                        className={
                                                            item.stock <=
                                                            item.min_stock
                                                                ? 'font-bold text-red-600'
                                                                : 'text-green-600'
                                                        }
                                                    >
                                                        {item.stock}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(
                                                        item.unit_cost,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {item.location || '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    'vehicles.inventory.edit',
                                                                    item.id,
                                                                )}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
