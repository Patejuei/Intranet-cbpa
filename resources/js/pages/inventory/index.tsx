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
import AppLayout from '@/layouts/app-layout';
import { Material } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Download, Eye, FileText, Pencil, Search, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { read, utils } from 'xlsx';

import CompanyFilter from '@/components/app/CompanyFilter';
import Pagination from '@/components/Pagination';

interface PageProps {
    materials: {
        data: Material[];
        links: any[];
    };
    filters?: {
        search?: string;
    };
}

export default function InventoryIndex({ materials, filters }: PageProps) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    // Import State
    const [importOpen, setImportOpen] = useState(false);
    const [importing, setImporting] = useState(false);

    // Form handling
    const { data, setData, post, put, processing, errors, reset } = useForm({
        product_name: '',
        brand: '',
        model: '',
        code: '',
        stock_quantity: 0,
        company: 'Segunda Compañía',
        category: '',
        serial_number: '',
        document_path: null as File | null,
    });

    const openCreate = () => {
        reset();
        setIsEditing(false);
        setCurrentId(null);
        setIsOpen(true);
    };

    const openEdit = (material: Material) => {
        setData({
            product_name: material.product_name,
            brand: material.brand || '',
            model: material.model || '',
            code: material.code || '',
            stock_quantity: material.stock_quantity,
            company: material.company,
            category: material.category || 'Sin Categoría',
            serial_number: material.serial_number || '',
            document_path: null, // Don't prepopulate file input
        });
        setIsEditing(true);
        setCurrentId(material.id);
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && currentId) {
            put(`/inventory/${currentId}`, {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            post('/inventory', {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    const downloadTemplate = () => {
        const ws = utils.json_to_sheet([
            {
                'Nombre del producto': 'Ej: Guantes de trabajo',
                Marca: 'Ej: Steelpro',
                Modelo: 'Ej: Multiflex',
                Cantidad: 10,
                Compañía: 'Segunda Compañía',
                'Serie de Fabricante': 'Ej: SN-998877',
            },
        ]);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Plantilla');
        // Trigger download
        // Using writeFile from xlsx
        import('xlsx').then((xlsx) => {
            xlsx.writeFile(wb, 'plantilla_inventario.xlsx');
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        try {
            const data = await file.arrayBuffer();
            const workbook = read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = utils.sheet_to_json(worksheet);

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

    const isFirstRun = useRef(true);

    // Server-side search implementation with debounce
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            router.get(
                '/inventory',
                { search: searchTerm },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

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
                        <Button
                            variant="outline"
                            onClick={() => setImportOpen(true)}
                            className="gap-2"
                        >
                            <Upload className="size-4" />
                            Importar
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex max-w-sm items-center gap-2">
                        <Search className="size-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar en esta página..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <CompanyFilter />
                </div>

                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Cód / N° Inv
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Producto
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Marca / Modelo
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Stock
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Categoría
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Compañía
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {displayMaterials.length > 0 ? (
                                    displayMaterials.map((material) => (
                                        <tr
                                            key={material.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-mono text-muted-foreground">
                                                {material.code || '-'}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {material.product_name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {material.brand}{' '}
                                                {material.model}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        material.stock_quantity >
                                                        0
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {material.stock_quantity}{' '}
                                                    un.
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {material.category || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {material.company}
                                            </td>
                                            <td className="px-4 py-3">
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
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            openEdit(material)
                                                        }
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No se encontraron materiales en esta
                                            página.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination links={materials.links} />
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing
                                ? 'Editar Material'
                                : 'Agregar Nuevo Material'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? 'Modifique los detalles del material.'
                                : 'Ingrese los detalles del nuevo material para inventario.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="company">Compañía</Label>
                            <Select
                                value={data.company}
                                onValueChange={(value) =>
                                    setData('company', value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione Compañía" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Primera Compañía">
                                        Primera Compañía
                                    </SelectItem>
                                    <SelectItem value="Segunda Compañía">
                                        Segunda Compañía
                                    </SelectItem>
                                    <SelectItem value="Tercera Compañía">
                                        Tercera Compañía
                                    </SelectItem>
                                    <SelectItem value="Cuarta Compañía">
                                        Cuarta Compañía
                                    </SelectItem>
                                    <SelectItem value="Quinta Compañía">
                                        Quinta Compañía
                                    </SelectItem>
                                    <SelectItem value="Sexta Compañía">
                                        Sexta Compañía
                                    </SelectItem>
                                    <SelectItem value="Séptima Compañía">
                                        Séptima Compañía
                                    </SelectItem>
                                    <SelectItem value="Octava Compañía">
                                        Octava Compañía
                                    </SelectItem>
                                    <SelectItem value="Novena Compañía">
                                        Novena Compañía
                                    </SelectItem>
                                    <SelectItem value="Brigada Juvenil">
                                        Brigada Juvenil
                                    </SelectItem>
                                    <SelectItem value="Comandancia">
                                        Comandancia
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="product_name">
                                Nombre del Producto
                            </Label>
                            <Input
                                id="product_name"
                                value={data.product_name}
                                onChange={(e) =>
                                    setData('product_name', e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="brand">Marca</Label>
                                <Input
                                    id="brand"
                                    value={data.brand}
                                    onChange={(e) =>
                                        setData('brand', e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="model">Modelo</Label>
                                <Input
                                    id="model"
                                    value={data.model}
                                    onChange={(e) =>
                                        setData('model', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="serial_number">
                                    N° de Serie de Fabricante
                                </Label>
                                <Input
                                    id="serial_number"
                                    value={data.serial_number || ''}
                                    onChange={(e) =>
                                        setData('serial_number', e.target.value)
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="stock_quantity">
                                    Cantidad Inicial
                                </Label>
                                <Input
                                    id="stock_quantity"
                                    type="number"
                                    min="0"
                                    value={data.stock_quantity}
                                    onChange={(e) =>
                                        setData(
                                            'stock_quantity',
                                            parseInt(e.target.value),
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Select
                                value={data.category}
                                onValueChange={(value) =>
                                    setData('category', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sin Categoría">
                                        Sin Categoría
                                    </SelectItem>
                                    <SelectItem value="Equipos de Protección Personal">
                                        Equipos de Protección Personal
                                    </SelectItem>
                                    <SelectItem value="Material de Extinción">
                                        Material de Extinción
                                    </SelectItem>
                                    <SelectItem value="Herramientas de Rescate">
                                        Herramientas de Rescate
                                    </SelectItem>
                                    <SelectItem value="Material Médico">
                                        Material Médico
                                    </SelectItem>
                                    <SelectItem value="Telecomunicaciones">
                                        Telecomunicaciones
                                    </SelectItem>
                                    <SelectItem value="Entrada Forzada">
                                        Entrada Forzada
                                    </SelectItem>
                                    <SelectItem value="Escalas">
                                        Escalas
                                    </SelectItem>
                                    <SelectItem value="Ventilación">
                                        Ventilación
                                    </SelectItem>
                                    <SelectItem value="Riesgos Eléctricos">
                                        Riesgos Eléctricos
                                    </SelectItem>
                                    <SelectItem value="Materiales Peligrosos">
                                        Materiales Peligrosos
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="document_path">
                                Documento de Alta (Opcional)
                            </Label>
                            <Input
                                id="document_path"
                                type="file"
                                onChange={(e) =>
                                    setData(
                                        'document_path',
                                        e.target.files
                                            ? e.target.files[0]
                                            : null,
                                    )
                                }
                                className="cursor-pointer"
                            />
                            <p className="text-[0.8rem] text-muted-foreground">
                                Adjuntar factura, guía de despacho o acta de
                                alta.
                            </p>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {isEditing ? 'Actualizar' : 'Guardar'}
                            </Button>
                        </div>
                    </form>
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
        </AppLayout>
    );
}
