import { Button } from '@/components/ui/button';
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

interface Props {
    item: {
        id: number;
        name: string;
        sku: string;
        category: string;
        stock: number;
        min_stock: number;
        unit_cost: number;
        location: string;
        compatibility: string;
        description: string;
    };
}

export default function InventoryEdit({ item }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: item.name,
        sku: item.sku || '',
        category: item.category,
        stock: item.stock,
        min_stock: item.min_stock,
        unit_cost: item.unit_cost,
        location: item.location || '',
        compatibility: item.compatibility || '',
        description: item.description || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('vehicles.inventory.update', item.id));
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { title: 'Bodega', href: route('vehicles.inventory.index') },
                { title: `Editar: ${item.name}`, href: '#' },
            ]}
        >
            <Head title={`Editar ${item.name} | Bodega`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('vehicles.inventory.index')}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <h2 className="text-xl leading-tight font-semibold text-gray-800">
                            Editar Ítem: {item.name}
                        </h2>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
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
                                    />
                                    {errors.location && (
                                        <p className="text-sm text-red-500">
                                            {errors.location}
                                        </p>
                                    )}
                                </div>

                                {/* Stock */}
                                <div className="space-y-2">
                                    <Label>Stock Actual</Label>
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
                                    <Label>Stock Mínimo</Label>
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
                                    {errors.unit_cost && (
                                        <p className="text-sm text-red-500">
                                            {errors.unit_cost}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Compatibility */}
                            <div className="space-y-2">
                                <Label>Compatibilidad</Label>
                                <Textarea
                                    value={data.compatibility}
                                    onChange={(e) =>
                                        setData('compatibility', e.target.value)
                                    }
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
                                    Guardar Cambios
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
