import MaterialForm from '@/components/inventory/MaterialForm';
import { SortableTableHead } from '@/components/SortableTableHead';
import { Button } from '@/components/ui/button';
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
import AppLayout from '@/layouts/app-layout';
import { Material, User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Download,
    Eye,
    FileText,
    Pencil,
    PlusCircle,
    RotateCcw,
    Search,
    Upload,
} from 'lucide-react';
import { useState } from 'react';
import * as XLSX from 'xlsx';

import Pagination from '@/components/Pagination';
import { usePermissions } from '@/hooks/use-permissions';
import { useTableFilters } from '@/hooks/use-table-filters';

interface InventoryFilters {
    [key: string]: string | undefined;
    search?: string;
    company?: string;
    code?: string;
    product_name?: string;
    brand?: string;
    stock_status?: string;
    category?: string;
    dependency?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

interface PageProps {
    materials: {
        data: Material[];
        links: any[];
    };
    filters?: InventoryFilters;
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

const emptyInventoryFilters: InventoryFilters = {
    search: '',
    company: 'all',
    code: '',
    product_name: '',
    brand: '',
    stock_status: 'all',
    category: '',
    dependency: '',
    sort: undefined,
    direction: undefined,
};

export default function InventoryIndex({
    materials,
    filters: initialFilters = {},
}: PageProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const canFilterCompany =
        auth.user.company === 'Comandancia' || auth.user.role === 'admin';
    const { canCreate, canEdit } = usePermissions();
    const { filters, setFilter, setSort, clearFilters, hasActiveFilters } =
        useTableFilters<InventoryFilters>('/inventory', {
            search: initialFilters.search || '',
            company: initialFilters.company || 'all',
            code: initialFilters.code || '',
            product_name: initialFilters.product_name || '',
            brand: initialFilters.brand || '',
            stock_status: initialFilters.stock_status || 'all',
            category: initialFilters.category || '',
            dependency: initialFilters.dependency || '',
            sort: initialFilters.sort,
            direction: initialFilters.direction,
        });
    const [isOpen, setIsOpen] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState<Material | null>(
        null,
    );

    // Import State
    const [importOpen, setImportOpen] = useState(false);
    const [viperImportOpen, setViperImportOpen] = useState(false);
    const [importing, setImporting] = useState(false);

    const openCreate = () => {
        setCurrentMaterial(null);
        setIsOpen(true);
    };

    const openEdit = (material: Material) => {
        setCurrentMaterial(material);
        setIsOpen(true);
    };

    const downloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet([
            {
                'Nombre del producto': 'Casco F1',
                Cantidad: 5,
                Compañía: 'Segunda Compañía',
                Marca: 'MSA',
                Modelo: 'Gallet',
                'Serie de Fabricante': '123456',
            },
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
        const excelBuffer = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array',
        });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plantilla_inventario.xlsx';
        a.click();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Map Spanish headers to English keys
            const mappedData = jsonData.map((row: any) => ({
                product_name:
                    row['Nombre del producto'] || row['product_name'] || '',
                brand: row['Marca'] || row['brand'] || '',
                model: row['Modelo'] || row['model'] || '',
                stock_quantity: row['Cantidad'] || row['stock_quantity'] || 0,
                company: row['Compañía'] || row['company'] || '',
                serial_number:
                    row['Serie de Fabricante'] || row['serial_number'] || '',
                category: 'Sin Categoría',
                code: null,
            }));

            // Send to backend
            router.post(
                '/inventory/import',
                {
                    materials: mappedData,
                },
                {
                    onSuccess: () => {
                        setImportOpen(false);
                        setImporting(false);
                    },
                    onError: () => {
                        setImporting(false);
                    },
                },
            );
        } catch (error) {
            console.error(error);
            setImporting(false);
        }
    };

    const handleViperFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        const formData = new FormData();
        formData.append('file', file);

        router.post('/inventory/import-viper', formData, {
            forceFormData: true,
            onSuccess: () => {
                setViperImportOpen(false);
                setImporting(false);
            },
            onError: () => {
                setImporting(false);
            },
        });
    };

    // Use materials directly as they are now filtered on the server
    const displayMaterials = materials.data;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Inventario', href: '/inventory' },
            ]}
        >
            <Head title="Inventario de Material Menor" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Inventario de Material Menor
                        </h2>
                        <p className="text-muted-foreground">
                            Control de stock de materiales y equipos.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {canCreate('equipment') && (
                            <>
                                <Button
                                    variant="secondary"
                                    onClick={() => setViperImportOpen(true)}
                                    className="gap-2"
                                >
                                    <Upload className="size-4" />
                                    Importar VIPER
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setImportOpen(true)}
                                    className="gap-2"
                                >
                                    <Upload className="size-4" />
                                    Importar
                                </Button>
                                <Button onClick={openCreate} className="gap-2">
                                    <PlusCircle className="size-4" />
                                    Nuevo Material
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-2">
                        <div className="flex max-w-sm flex-1 items-center gap-2">
                            <Search className="size-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar en inventario..."
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
                                    clearFilters(emptyInventoryFilters)
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
                                    column="code"
                                    label="Cód / N° Inv"
                                    sortKey={filters.sort}
                                    sortDirection={filters.direction}
                                    onSort={setSort}
                                    filterType="text"
                                    filterValue={filters.code}
                                    filterPlaceholder="Filtrar código..."
                                    onFilterChange={(value) =>
                                        setFilter('code', value)
                                    }
                                />
                                <SortableTableHead
                                    column="product_name"
                                    label="Producto"
                                    sortKey={filters.sort}
                                    sortDirection={filters.direction}
                                    onSort={setSort}
                                    filterType="text"
                                    filterValue={filters.product_name}
                                    filterPlaceholder="Filtrar producto..."
                                    onFilterChange={(value) =>
                                        setFilter('product_name', value)
                                    }
                                />
                                <SortableTableHead
                                    column="brand"
                                    label="Marca / Modelo"
                                    sortKey={filters.sort}
                                    sortDirection={filters.direction}
                                    onSort={setSort}
                                    filterType="text"
                                    filterValue={filters.brand}
                                    filterPlaceholder="Filtrar marca/modelo..."
                                    onFilterChange={(value) =>
                                        setFilter('brand', value)
                                    }
                                />
                                <SortableTableHead
                                    column="stock_quantity"
                                    label="Stock"
                                    sortKey={filters.sort}
                                    sortDirection={filters.direction}
                                    onSort={setSort}
                                    filterType="select"
                                    filterValue={filters.stock_status}
                                    filterOptions={[
                                        {
                                            value: 'in_stock',
                                            label: 'Con stock (> 0)',
                                        },
                                        {
                                            value: 'out_of_stock',
                                            label: 'Sin stock (0)',
                                        },
                                    ]}
                                    onFilterChange={(value) =>
                                        setFilter('stock_status', value)
                                    }
                                />
                                <SortableTableHead
                                    column="category"
                                    label="Categoría"
                                    sortKey={filters.sort}
                                    sortDirection={filters.direction}
                                    onSort={setSort}
                                    filterType="text"
                                    filterValue={filters.category}
                                    filterPlaceholder="Filtrar categoría..."
                                    onFilterChange={(value) =>
                                        setFilter('category', value)
                                    }
                                />
                                <SortableTableHead
                                    column="dependency"
                                    label="Dependencia"
                                    sortKey={filters.sort}
                                    sortDirection={filters.direction}
                                    onSort={setSort}
                                    filterType="text"
                                    filterValue={filters.dependency}
                                    filterPlaceholder="Filtrar dependencia..."
                                    onFilterChange={(value) =>
                                        setFilter('dependency', value)
                                    }
                                />
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayMaterials.length > 0 ? (
                                displayMaterials.map((material) => (
                                    <TableRow
                                        key={material.id}
                                        className="hover:bg-muted/30"
                                    >
                                        <TableCell className="font-mono text-muted-foreground">
                                            {material.code || '-'}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {material.product_name}
                                        </TableCell>
                                        <TableCell>
                                            {material.brand} {material.model}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    material.stock_quantity > 0
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {material.stock_quantity} un.
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {material.category || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {material.dependency || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    title="Ver Detalle"
                                                >
                                                    <Link
                                                        href={`/inventory/${material.id}`}
                                                    >
                                                        <Eye className="size-4" />
                                                    </Link>
                                                </Button>
                                                {material.document_path && (
                                                    <a
                                                        href={`/storage/${material.document_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                                                        title="Ver Documento"
                                                    >
                                                        <FileText className="size-4" />
                                                    </a>
                                                )}
                                                {canEdit('equipment') && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            openEdit(material)
                                                        }
                                                    >
                                                        <Pencil className="size-4" />
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
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No se encontraron materiales en esta
                                        página.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <Pagination links={materials.links} />
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {currentMaterial
                                ? 'Editar Material'
                                : 'Agregar Nuevo Material'}
                        </DialogTitle>
                        <DialogDescription>
                            {currentMaterial
                                ? 'Modifique los detalles del material.'
                                : 'Ingrese los detalles del nuevo material para inventario.'}
                        </DialogDescription>
                    </DialogHeader>
                    <MaterialForm
                        key={currentMaterial ? currentMaterial.id : 'create'}
                        material={currentMaterial}
                        onSuccess={() => setIsOpen(false)}
                        onCancel={() => setIsOpen(false)}
                    />
                </DialogContent>
            </Dialog>
            <Dialog open={importOpen} onOpenChange={setImportOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Importar Inventario Masivo</DialogTitle>
                        <DialogDescription>
                            Descargue la plantilla, llénela con los datos y
                            súbala para importar materiales.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                onClick={downloadTemplate}
                                className="w-full gap-2"
                            >
                                <Download className="size-4" />
                                Descargar Plantilla Excel
                            </Button>
                        </div>
                        <div className="grid gap-2">
                            <Label>Subir Archivo (.xlsx, .csv)</Label>
                            <Input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileUpload}
                                disabled={importing}
                            />
                            {importing && (
                                <p className="text-sm text-muted-foreground">
                                    Procesando...
                                </p>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            {/* VIPER IMPORT DIALOG */}
            <Dialog open={viperImportOpen} onOpenChange={setViperImportOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Importar Formato VIPER</DialogTitle>
                        <DialogDescription>
                            Suba el archivo exportado de VIPER (.xlsx).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Subir Archivo (.xlsx)</Label>
                            <Input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleViperFileUpload}
                                disabled={importing}
                            />
                            {importing && (
                                <p className="text-sm text-muted-foreground">
                                    Procesando VIPER...
                                </p>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
