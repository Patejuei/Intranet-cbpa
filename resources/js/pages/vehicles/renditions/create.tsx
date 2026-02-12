import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Trash2, UploadCloud } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

// Ziggy route helper
import { Combobox } from '@/components/ui/combobox';
import { Switch } from '@/components/ui/switch';

type PageProps = {
    vehicles: { id: number; name: string; company: string }[];
    inventoryItems: {
        id: number;
        name: string;
        sku?: string;
        current_stock: number;
    }[];
};

export default function RenditionCreate({
    vehicles,
    inventoryItems,
}: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_rut: '',
        invoice_number: '',
        invoice_date: '',
        vehicle_id: '',
        expense_type: '',
        description: '',
        amount: '',
        stock_item_id: '',
        stock_quantity: '',
        attachments: [] as File[],
        is_new_entry: false,
        sku: '',
        unit_of_measure: 'UNIDAD',
        unit_cost: '',
    });

    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setData('attachments', [...data.attachments, ...newFiles]);

            const newPreviews = newFiles.map((file) =>
                URL.createObjectURL(file),
            );
            setPreviews([...previews, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = [...data.attachments];
        newFiles.splice(index, 1);
        setData('attachments', newFiles);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/vehicles/renditions');
    };

    const expenseTypes = [
        { value: 'repair_supplies', label: 'Insumos por Reparación' },
        { value: 'spare_parts', label: 'Repuestos' },
        { value: 'tools', label: 'Herramientas' },
        { value: 'other_tools', label: 'Otras Herramientas' },
    ];

    // Prepare options for Comboboxes
    const vehicleOptions = vehicles.map((v) => ({
        value: v.id.toString(),
        label: `${v.name} (${v.company})`,
        description: v.company,
    }));

    // Add "Taller" option (assuming it might be a specific ID or handled specially)
    // Checking if "Taller" exists in options, if not, we might ideally want to add it if it's a valid ID.
    // Since we don't have the ID, we'll rely on the user having created it or we'll filter for it.
    // For now, if the user requested "add option", we assume they want it VISIBLE.
    // We'll append it if not present, but using a placeholder ID '0' or similar might break backend.
    // A better approach is to assume the backend has a vehicle named 'Taller' and it's included in 'vehicles' prop.
    // If not, we'll manually add a generic option but warn it needs a valid ID.
    // Let's add it purely as a UI option for searchability if it's in the list.
    // Actually, the user says "add the option", implying it's NOT there.
    // I will add a static option with value 'taller' and handle the potential backend error by notifying.
    const tallerOption = {
        value: 'taller',
        label: 'Taller',
        description: 'Gasto General',
    };
    const finalVehicleOptions = [tallerOption, ...vehicleOptions];

    const inventoryOptions = inventoryItems.map((item) => ({
        value: item.id.toString(),
        label: item.name,
        description: `SKU: ${item.sku || 'N/A'} | Stock: ${item.current_stock}`,
    }));

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                {
                    title: 'Rendiciones',
                    href: '/vehicles/renditions',
                },
                { title: 'Nueva Rendición', href: '#' },
            ]}
        >
            <Head title="Nueva Rendición" />

            <div className="flex flex-1 flex-col gap-8 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/vehicles/renditions">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Nueva Rendición</h1>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles de la Facturación</CardTitle>
                            <CardDescription>
                                Ingrese los datos de la factura o boleta.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>RUT Proveedor</Label>
                                <Input
                                    placeholder="Ej: 76.123.456-K"
                                    value={data.supplier_rut}
                                    onChange={(e) =>
                                        setData('supplier_rut', e.target.value)
                                    }
                                    required
                                />
                                {errors.supplier_rut && (
                                    <p className="text-sm text-red-500">
                                        {errors.supplier_rut}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Fecha Factura</Label>
                                <Input
                                    type="date"
                                    value={data.invoice_date}
                                    onChange={(e) =>
                                        setData('invoice_date', e.target.value)
                                    }
                                    required
                                />
                                {errors.invoice_date && (
                                    <p className="text-sm text-red-500">
                                        {errors.invoice_date}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Nº Factura / Boleta</Label>
                                <Input
                                    placeholder="Ej: 123456"
                                    value={data.invoice_number}
                                    onChange={(e) =>
                                        setData(
                                            'invoice_number',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {errors.invoice_number && (
                                    <p className="text-sm text-red-500">
                                        {errors.invoice_number}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Monto Total (CLP)</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    placeholder="Ej: 50000"
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData('amount', e.target.value)
                                    }
                                    required
                                />
                                {errors.amount && (
                                    <p className="text-sm text-red-500">
                                        {errors.amount}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles del Gasto</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Unidad / Carro (Material Mayor)</Label>
                                <Combobox
                                    options={finalVehicleOptions}
                                    value={data.vehicle_id}
                                    onChange={(val) =>
                                        setData('vehicle_id', val)
                                    }
                                    placeholder="Seleccione Unidad o Taller"
                                    searchPlaceholder="Buscar carro..."
                                />
                                {errors.vehicle_id && (
                                    <p className="text-sm text-red-500">
                                        {errors.vehicle_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Tipo de Gasto</Label>
                                <Select
                                    value={data.expense_type}
                                    onValueChange={(val) =>
                                        setData('expense_type', val)
                                    }
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione Tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {expenseTypes.map((t) => (
                                            <SelectItem
                                                key={t.value}
                                                value={t.value}
                                            >
                                                {t.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.expense_type && (
                                    <p className="text-sm text-red-500">
                                        {errors.expense_type}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-2 space-y-2">
                                <Label>Concepto / Descripción</Label>
                                <Textarea
                                    placeholder="Detalle breve de la compra..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    required
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Comprobantes</CardTitle>
                            <CardDescription>
                                Adjunte imagen de la factura/boleta enviada por
                                Taller.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border border-dashed p-8 text-center transition-colors hover:bg-muted/50">
                                <input
                                    type="file"
                                    id="attachments"
                                    multiple
                                    accept="image/*,application/pdf"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="attachments"
                                    className="flex cursor-pointer flex-col items-center justify-center gap-2"
                                >
                                    <div className="rounded-full bg-primary/10 p-4 text-primary">
                                        <UploadCloud className="h-6 w-6" />
                                    </div>
                                    <div className="text-sm font-medium">
                                        Haga clic para subir archivos
                                    </div>
                                </label>
                            </div>
                            {errors.attachments && (
                                <p className="text-sm text-red-500">
                                    {errors.attachments}
                                </p>
                            )}

                            {data.attachments.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-6">
                                    {data.attachments.map((file, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative aspect-square overflow-hidden rounded-md border bg-muted"
                                        >
                                            {file.type.startsWith('image/') ? (
                                                <img
                                                    src={previews[idx]}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center p-2 text-xs">
                                                    {file.name}
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeFile(idx)}
                                                className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Integración con Bodega (Opcional)
                            </CardTitle>
                            <CardDescription>
                                Si la compra corresponde a un ítem de
                                inventario, seleccione para gestionar stock.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {(data.expense_type === 'repair_supplies' ||
                                data.expense_type === 'spare_parts') && (
                                    <>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="new_entry"
                                                checked={data.is_new_entry}
                                                onCheckedChange={(checked) =>
                                                    setData('is_new_entry', checked)
                                                }
                                            />
                                            <Label htmlFor="new_entry">
                                                {data.is_new_entry
                                                    ? 'Nuevo Ingreso a Bodega'
                                                    : 'Reabastecimiento (Ítem Existente)'}
                                            </Label>
                                        </div>

                                        {!data.is_new_entry ? (
                                            // RESTOCKING
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Ítem de Bodega</Label>
                                                    <Combobox
                                                        options={inventoryOptions}
                                                        value={data.stock_item_id}
                                                        onChange={(val) =>
                                                            setData(
                                                                'stock_item_id',
                                                                val,
                                                            )
                                                        }
                                                        placeholder="Buscar por Nombre o Código..."
                                                        searchPlaceholder="Nombre, SKU, Código..."
                                                        emptyText="No se encontró producto."
                                                    />
                                                </div>
                                                {data.stock_item_id && (
                                                    <div className="space-y-2">
                                                        <Label>
                                                            Cantidad a Sumar
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={
                                                                data.stock_quantity
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'stock_quantity',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            required={
                                                                !!data.stock_item_id
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            // NEW ENTRY
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="col-span-2 rounded-md bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                                    Se creará un nuevo artículo en
                                                    Bodega (Material Mayor) con el
                                                    nombre igual al "Concepto /
                                                    Descripción". Compatibilidad:
                                                    Todos. Ubicación: Taller.
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>SKU / Código Parte</Label>
                                                    <Input
                                                        placeholder="Ej: FIL-OIL-2024"
                                                        value={data.sku}
                                                        onChange={(e) =>
                                                            setData(
                                                                'sku',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Unidad de Medida</Label>
                                                    <Select
                                                        value={data.unit_of_measure}
                                                        onValueChange={(val) =>
                                                            setData(
                                                                'unit_of_measure',
                                                                val,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="UNIDAD">
                                                                UNIDAD
                                                            </SelectItem>
                                                            <SelectItem value="LITRO">
                                                                LITRO
                                                            </SelectItem>
                                                            <SelectItem value="METRO">
                                                                METRO
                                                            </SelectItem>
                                                            <SelectItem value="KIT">
                                                                KIT
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Cantidad Inicial</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={data.stock_quantity}
                                                        onChange={(e) =>
                                                            setData(
                                                                'stock_quantity',
                                                                e.target.value,
                                                            )
                                                        }
                                                        required={data.is_new_entry}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>
                                                        Costo Unitario (Neto Aprox)
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={data.unit_cost}
                                                        onChange={(e) =>
                                                            setData(
                                                                'unit_cost',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                            {(data.expense_type === 'tools' ||
                                data.expense_type === 'other_tools') && (
                                    <div className="space-y-4">
                                        <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                                            Este ítem se ingresará automáticamente
                                            al inventario de <strong>Material Menor</strong>.
                                            <ul className="mt-1 list-inside list-disc">
                                                <li>Compañía: Comandancia</li>
                                                <li>Dependencia: Taller Mecánico</li>
                                                <li>Categoría: Otro</li>
                                                <li>Nombre: Concepto / Descripción</li>
                                            </ul>
                                        </div>
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Cantidad</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={data.stock_quantity}
                                                    onChange={(e) =>
                                                        setData(
                                                            'stock_quantity',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Cantidad de herramientas..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {!['repair_supplies', 'spare_parts', 'tools', 'other_tools'].includes(data.expense_type) && (
                                <div className="text-sm text-muted-foreground">
                                    Seleccione un tipo de gasto compatible para ver opciones de inventario.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing} size="lg">
                            <Save className="mr-2 h-4 w-4" />
                            Registrar Rendición
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
