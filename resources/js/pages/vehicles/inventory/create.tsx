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
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

declare var route: any;

export default function InventoryCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sku: '',
        category: 'repuesto',
        stock: 0,
        min_stock: 0,
        unit_cost: 0,
        location: '',
        compatibility: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/vehicles/inventory');
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { title: 'Bodega', href: '/vehicles/inventory' },
                { title: 'Nuevo Ítem', href: '#' },
            ]}
        >
            <Head title="Nuevo Ítem | Bodega Material Mayor" />

            <div className="flex flex-1 flex-col gap-8 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/vehicles/inventory">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Nuevo Ítem de Bodega</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Detalles del Ítem</CardTitle>
                        <CardDescription>
                            Ingrese la información del nuevo repuesto o insumo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label>Nombre del Ítem</Label>
                                    <Input
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Ej: Aceite Motor 15W40"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* SKU */}
                                <div className="space-y-2">
                                    <Label>SKU / Código (Opcional)</Label>
                                    <Input
                                        value={data.sku}
                                        onChange={(e) =>
                                            setData('sku', e.target.value)
                                        }
                                        placeholder="Ej: ACC-123456"
                                    />
                                    {errors.sku && (
                                        <p className="text-sm text-red-500">
                                            {errors.sku}
                                        </p>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label>Categoría</Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(val) =>
                                            setData('category', val)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="insumo">
                                                Insumo (Consumible)
                                            </SelectItem>
                                            <SelectItem value="repuesto">
                                                Repuesto (Parte)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="text-sm text-red-500">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <Label>Ubicación en Bodega</Label>
                                    <Input
                                        value={data.location}
                                        onChange={(e) =>
                                            setData('location', e.target.value)
                                        }
                                        placeholder="Ej: Estante A, Nivel 2"
                                    />
                                    {errors.location && (
                                        <p className="text-sm text-red-500">
                                            {errors.location}
                                        </p>
                                    )}
                                </div>

                                {/* Stock */}
                                <div className="space-y-2">
                                    <Label>Stock Inicial</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={data.stock}
                                        onChange={(e) =>
                                            setData(
                                                'stock',
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        required
                                    />
                                    {errors.stock && (
                                        <p className="text-sm text-red-500">
                                            {errors.stock}
                                        </p>
                                    )}
                                </div>

                                {/* Min Stock */}
                                <div className="space-y-2">
                                    <Label>Stock Mínimo (Alerta)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={data.min_stock}
                                        onChange={(e) =>
                                            setData(
                                                'min_stock',
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        required
                                    />
                                    {errors.min_stock && (
                                        <p className="text-sm text-red-500">
                                            {errors.min_stock}
                                        </p>
                                    )}
                                </div>

                                {/* Unit Cost */}
                                <div className="space-y-2">
                                    <Label>Costo Unitario (CLP)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={data.unit_cost}
                                        onChange={(e) =>
                                            setData(
                                                'unit_cost',
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Valor neto o promedio de compra.
                                    </p>
                                    {errors.unit_cost && (
                                        <p className="text-sm text-red-500">
                                            {errors.unit_cost}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Compatibility */}
                            <div className="space-y-2">
                                <Label>Compatibilidad (Vehículos)</Label>
                                <Textarea
                                    value={data.compatibility}
                                    onChange={(e) =>
                                        setData('compatibility', e.target.value)
                                    }
                                    placeholder="Ej: B-1, B-2, Q-2 (Motor Cummins ISB)"
                                    className="resize-none"
                                />
                                {errors.compatibility && (
                                    <p className="text-sm text-red-500">
                                        {errors.compatibility}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label>Descripción Adicional</Label>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Detalles técnicos, proveedor habitual, etc."
                                    className="resize-none"
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Guardar Ítem
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
