import { MaterialSelector } from '@/components/MaterialSelector'; // Assuming this path or move it?
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Material } from '@/types';
import { Head, useForm } from '@inertiajs/react'; // Correct import
import { useState } from 'react';
// Actually Component is in @/components/MaterialSelector (based on previous view_file)
// No, previous view_file said resources/js/Components/MaterialSelector.tsx so it is @/Components/MaterialSelector ?
// File path was resources/js/Components/MaterialSelector.tsx.
// Standard alias usually maps @/Components to resources/js/Components.
// But some projects use @/components/ui...
// Let's check imports in InventoryIndex: import MaterialForm from '@/components/inventory/MaterialForm';
// import { Button } from '@/components/ui/button';
// So likely '@/Components/MaterialSelector' or '@/components/MaterialSelector'?
// InventoryIndex says: import CompanyFilter from '@/components/app/CompanyFilter';
// Pagination from '@/components/Pagination';
// So it seems lowercase 'components' is the alias for resources/js/Components?
// Let's try '@/components/MaterialSelector'

// Wait, I need to check where MaterialSelector is exactly.
// Step 106: resources/js/Components/MaterialSelector.tsx
// Step 107: InventoryIndex uses '@/components/Pagination'.
// So alias is likely '@/components'.

import { Loader2, Upload, X } from 'lucide-react';

interface Props {
    materials: Material[];
}

export default function CreateBaja({ materials }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        material_id: 0,
        quantity: 1,
        reason: '',
        images: [] as string[],
    });

    const [selectedMaterial, setSelectedMaterial] = useState<
        Material | undefined
    >(undefined);

    const handleMaterialChange = (id: number) => {
        setData('material_id', id);
        const mat = materials.find((m) => m.id === id);
        setSelectedMaterial(mat);
        if (mat) {
            // Default quantity to 1, max is stock
            if (data.quantity > mat.stock_quantity) {
                setData('quantity', mat.stock_quantity);
            }
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setData('images', [...data.images, base64String]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        const newImages = [...data.images];
        newImages.splice(index, 1);
        setData('images', newImages);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/equipment/bajas', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Equipamiento', href: '/equipment' },
                { title: 'Solicitudes de Baja', href: '/equipment/bajas' },
                { title: 'Nueva Solicitud', href: '/equipment/bajas/create' },
            ]}
        >
            <Head title="Registrar Baja de Material" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="mx-auto w-full max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Registrar Solicitud de Baja</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Seleccionar Material</Label>
                                    <MaterialSelector
                                        materials={materials}
                                        value={data.material_id}
                                        onChange={handleMaterialChange}
                                        placeholder="Buscar material..."
                                    />
                                    {errors.material_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.material_id}
                                        </p>
                                    )}
                                </div>

                                {selectedMaterial && (
                                    <div className="rounded-md bg-muted p-3 text-sm">
                                        <p>
                                            <span className="font-semibold">
                                                Stock Actual:
                                            </span>{' '}
                                            {selectedMaterial.stock_quantity}
                                        </p>
                                        <p>
                                            <span className="font-semibold">
                                                Código:
                                            </span>{' '}
                                            {selectedMaterial.code || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="font-semibold">
                                                Serie:
                                            </span>{' '}
                                            {selectedMaterial.serial_number ||
                                                'N/A'}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="quantity">
                                        Cantidad a dar de baja
                                    </Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min={1}
                                        max={
                                            selectedMaterial?.stock_quantity ||
                                            1
                                        }
                                        value={data.quantity}
                                        onChange={(e) =>
                                            setData(
                                                'quantity',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        disabled={!selectedMaterial}
                                    />
                                    {errors.quantity && (
                                        <p className="text-sm text-destructive">
                                            {errors.quantity}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reason">
                                        Motivo de la baja
                                    </Label>
                                    <Textarea
                                        id="reason"
                                        placeholder="Describa el motivo (daño, pérdida, obsolescencia...)"
                                        value={data.reason}
                                        onChange={(e) =>
                                            setData('reason', e.target.value)
                                        }
                                        rows={4}
                                    />
                                    {errors.reason && (
                                        <p className="text-sm text-destructive">
                                            {errors.reason}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        Evidencia Fotográfica (Opcional)
                                    </Label>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        'image-upload',
                                                    )
                                                    ?.click()
                                            }
                                        >
                                            <Upload className="mr-2 size-4" />
                                            Subir Imágenes
                                        </Button>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </div>

                                    {data.images.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                                            {data.images.map((img, index) => (
                                                <div
                                                    key={index}
                                                    className="group relative"
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Evidence ${index}`}
                                                        className="h-24 w-full rounded-md border object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeImage(index)
                                                        }
                                                        className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                                    >
                                                        <X className="size-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.images && (
                                        <p className="text-sm text-destructive">
                                            {errors.images}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={
                                            processing || !selectedMaterial
                                        }
                                    >
                                        {processing && (
                                            <Loader2 className="mr-2 size-4 animate-spin" />
                                        )}
                                        Registrar Solicitud
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
