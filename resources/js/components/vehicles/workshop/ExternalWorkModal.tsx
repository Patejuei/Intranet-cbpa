import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, FileText, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface ExternalWork {
    id?: number;
    description: string;
    provider: string;
    cost: number | string;
    supplier_rut?: string | null;
    invoice_number?: string | null;
    invoice_image?: File | null;
    entry_image?: File | null;
    exit_image?: File | null;
    invoice_image_path?: string | null;
    entry_image_path?: string | null;
    exit_image_path?: string | null;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (work: ExternalWork) => void;
    initialData?: ExternalWork | null;
    isReadOnly?: boolean;
}

export default function ExternalWorkModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    isReadOnly,
}: Props) {
    const [data, setData] = useState<ExternalWork>({
        description: '',
        provider: '',
        cost: '',
        supplier_rut: '',
        invoice_number: '',
    });

    useEffect(() => {
        if (initialData) {
            setData({
                ...initialData,
                supplier_rut: initialData.supplier_rut || '',
                invoice_number: initialData.invoice_number || '',
            });
        } else {
            setData({
                description: '',
                provider: '',
                cost: '',
                supplier_rut: '',
                invoice_number: '',
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (files && files.length > 0) {
            setData((prev) => ({ ...prev, [name]: files[0] }));
        } else if (!files) {
            setData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        if (!data.description || !data.provider || !data.cost) {
            alert('Descripción, Proveedor y Costo son campos obligatorios.');
            return;
        }
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>
                        {isReadOnly
                            ? 'Detalles de Trabajo Externo'
                            : initialData
                              ? 'Editar Trabajo Externo'
                              : 'Añadir Trabajo Externo'}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Descripción *</Label>
                        <Input
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            disabled={isReadOnly}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Proveedor / Taller *</Label>
                            <Input
                                name="provider"
                                value={data.provider}
                                onChange={handleChange}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>RUT Proveedor</Label>
                            <Input
                                name="supplier_rut"
                                value={data.supplier_rut || ''}
                                onChange={handleChange}
                                disabled={isReadOnly}
                                placeholder="Ej: 76.123.456-7"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nº de Factura</Label>
                            <Input
                                name="invoice_number"
                                value={data.invoice_number || ''}
                                onChange={handleChange}
                                disabled={isReadOnly}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Costo *</Label>
                            <Input
                                name="cost"
                                type="number"
                                value={data.cost}
                                onChange={handleChange}
                                disabled={isReadOnly}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* ----- Adjuntos ----- */}
                    {isReadOnly ? (
                        /* Vista de solo lectura: mostrar previews reales */
                        <div className="space-y-4">
                            <Label className="text-sm font-semibold">Documentos e Imágenes Adjuntas</Label>

                            {/* Factura */}
                            {data.invoice_image_path ? (
                                <div className="rounded-md border bg-muted/20 p-3 space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        Factura
                                    </div>
                                    {data.invoice_image_path.match(/\.(jpe?g|png|webp)$/i) ? (
                                        <a
                                            href={`/storage/${data.invoice_image_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                src={`/storage/${data.invoice_image_path}`}
                                                alt="Factura"
                                                className="mt-1 max-h-40 rounded border object-contain cursor-pointer hover:opacity-80 transition-opacity"
                                            />
                                        </a>
                                    ) : (
                                        <a
                                            href={`/storage/${data.invoice_image_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            Ver documento
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Sin factura adjunta
                                </p>
                            )}

                            {/* Imágenes Ingreso / Salida */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Imagen de Ingreso */}
                                <div className="rounded-md border bg-muted/20 p-3 space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <ImageIcon className="h-4 w-4 text-green-500" />
                                        Imagen de Ingreso
                                    </div>
                                    {data.entry_image_path ? (
                                        <a
                                            href={`/storage/${data.entry_image_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                src={`/storage/${data.entry_image_path}`}
                                                alt="Ingreso"
                                                className="max-h-32 w-full rounded border object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                            />
                                        </a>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">Sin imagen</p>
                                    )}
                                </div>

                                {/* Imagen de Salida */}
                                <div className="rounded-md border bg-muted/20 p-3 space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <ImageIcon className="h-4 w-4 text-orange-500" />
                                        Imagen de Salida
                                    </div>
                                    {data.exit_image_path ? (
                                        <a
                                            href={`/storage/${data.exit_image_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <img
                                                src={`/storage/${data.exit_image_path}`}
                                                alt="Salida"
                                                className="max-h-32 w-full rounded border object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                            />
                                        </a>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">Sin imagen</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Vista de edición: inputs de carga de archivos */
                        <>
                            <div className="space-y-2 bg-muted/30 p-3 rounded-md border">
                                <Label className="text-sm font-semibold">
                                    Adjuntar Factura (PDF o Imagen)
                                </Label>
                                <Input
                                    name="invoice_image"
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleChange}
                                    className="text-xs"
                                />
                                {data.invoice_image_path && (
                                    <a
                                        href={`/storage/${data.invoice_image_path}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-1 block text-sm text-blue-600 hover:underline"
                                    >
                                        Ver Archivo Actual
                                    </a>
                                )}
                                {data.invoice_image && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Nuevo archivo seleccionado:{' '}
                                        {data.invoice_image.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 bg-muted/30 p-3 rounded-md border">
                                    <Label className="text-sm font-semibold">
                                        Imagen de Ingreso
                                    </Label>
                                    <Input
                                        name="entry_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="text-xs"
                                    />
                                    {data.entry_image_path && (
                                        <a
                                            href={`/storage/${data.entry_image_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-1 block text-sm text-blue-600 hover:underline"
                                        >
                                            Ver Imagen Actual
                                        </a>
                                    )}
                                    {data.entry_image && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Nuevo archivo seleccionado:{' '}
                                            {data.entry_image.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2 bg-muted/30 p-3 rounded-md border">
                                    <Label className="text-sm font-semibold">
                                        Imagen de Salida
                                    </Label>
                                    <Input
                                        name="exit_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="text-xs"
                                    />
                                    {data.exit_image_path && (
                                        <a
                                            href={`/storage/${data.exit_image_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-1 block text-sm text-blue-600 hover:underline"
                                        >
                                            Ver Imagen Actual
                                        </a>
                                    )}
                                    {data.exit_image && (
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Nuevo archivo seleccionado:{' '}
                                            {data.exit_image.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {!isReadOnly ? (
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave}>Guardar Trabajo</Button>
                    </DialogFooter>
                ) : (
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>
                            Cerrar
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
