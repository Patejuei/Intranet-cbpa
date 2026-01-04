import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface ChecklistItem {
    id: number;
    category: string;
    name: string;
}

interface Props {
    items: Record<string, ChecklistItem[]>;
}

const categories = [
    'Luces LED y Sonorización',
    'Cabina',
    'Carrocería',
    'Motor',
    'Cuerpo de Bomba / Estanque',
    'Material Menor (Inventario Rápido)',
];

export default function ConfigureChecklist({ items }: Props) {
    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        category: '',
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // @ts-ignore
        post('/vehicles/checklist-items', {
            onSuccess: () => reset('name'),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este ítem?')) {
            // @ts-ignore
            destroy(`/vehicles/checklist-items/${id}`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Vehículos', href: '/vehicles/status' },
                { title: 'Checklists', href: '/vehicles/checklists' },
                {
                    title: 'Configuración',
                    href: '/vehicles/checklist-items',
                },
            ]}
        >
            <Head title="Configurar Checklist" />

            <div className="flex flex-1 flex-col gap-8 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Configuración de Checklist
                        </h1>
                        <p className="text-muted-foreground">
                            Administre las preguntas y categorías del checklist
                            preventivo.
                        </p>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                    <div className="space-y-6">
                        {Object.entries(items).map(
                            ([category, categoryItems]) => (
                                <Card key={category}>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base font-semibold">
                                            {category}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Item</TableHead>
                                                    <TableHead className="w-[100px] text-right">
                                                        Acciones
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {categoryItems.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>
                                                            {item.name}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        item.id,
                                                                    )
                                                                }
                                                                className="text-destructive hover:text-destructive/90"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            ),
                        )}
                    </div>

                    <div>
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Nuevo Ítem</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Categoría</Label>
                                        <Select
                                            value={data.category}
                                            onValueChange={(val) =>
                                                setData('category', val)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem
                                                        key={cat}
                                                        value={cat}
                                                    >
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && (
                                            <p className="text-xs text-destructive">
                                                {errors.category}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nombre del Ítem</Label>
                                        <Input
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="Ej: Nivel de Aceite"
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-destructive">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        <Plus className="mr-2 size-4" />
                                        Agregar
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
