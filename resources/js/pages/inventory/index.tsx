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
import { Head, useForm } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

import CompanyFilter from '@/components/app/CompanyFilter';

export default function InventoryIndex({
    materials,
}: {
    materials: Material[];
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Form handling
    const { data, setData, post, processing, errors, reset } = useForm({
        product_name: '',
        brand: '',
        model: '',
        code: '',
        stock_quantity: 0,
        company: 'Segunda Compañía', // Default fallback, should be handled by logic or dropdown
        category: '',
        document_path: null as File | null,
    });

    // Note: Assuming company comes from user context in backend, but form needs it if Admin implies mult-tenant add?
    // The MaterialController logic requires company. If regular user, backend forces company.

    const openCreate = () => {
        reset();
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/inventory', {
            onSuccess: () => setIsOpen(false),
        });
    };

    const filteredMaterials = materials.filter(
        (m) =>
            m.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (m.code &&
                m.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (m.brand &&
                m.brand.toLowerCase().includes(searchTerm.toLowerCase())),
    );

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
                    <Button onClick={openCreate} className="gap-2">
                        <Plus className="size-4" />
                        Agregar Material
                    </Button>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex max-w-sm items-center gap-2">
                        <Search className="size-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar material..."
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
                                        Código
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
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredMaterials.length > 0 ? (
                                    filteredMaterials.map((material) => (
                                        <tr
                                            key={material.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 text-muted-foreground">
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
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No se encontraron materiales.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Agregar Nuevo Material</DialogTitle>
                        <DialogDescription>
                            Ingrese los detalles del nuevo material para
                            inventario.
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
                                <Label htmlFor="code">Código Interno</Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData('code', e.target.value)
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
                            <Input
                                id="category"
                                value={data.category}
                                onChange={(e) =>
                                    setData('category', e.target.value)
                                }
                                placeholder="Ej: EPP, Uniforme, Radio..."
                            />
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
                                Guardar
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
