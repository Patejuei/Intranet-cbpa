import MaterialForm from '@/components/inventory/MaterialForm';
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
import AppLayout from '@/layouts/app-layout';
import { Material } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
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
    const [currentMaterial, setCurrentMaterial] = useState<Material | null>(
        null,
    );

    // Import State
    const [importOpen, setImportOpen] = useState(false);
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
        const ws = utils.json_to_sheet([
            {
                'Nombre del producto': 'Casco F1',
                Cantidad: 5,
                Compañía: 'Segunda Compañía',
                Marca: 'MSA',
                Modelo: 'Gallet',
                'Serie de Fabricante': '123456',
            },
        ]);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Plantilla');
        const excelBuffer = utils.write(wb, {
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
        </AppLayout>
    );
}
