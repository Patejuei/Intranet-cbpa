import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/select'; // Added Select components
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react'; // Added router
import { Plus, Trash2 } from 'lucide-react';

export default function ConfigureChecklist({
    items,
    canConfigureAll,
    currentCompany,
    companies, // Received from controller
}: {
    items: Record<string, any[]>;
    canConfigureAll: boolean;
    currentCompany: string;
    companies: string[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        short_name: '',
        full_name: '',
        category: '',
        company: currentCompany, // Default to current view context
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vehicles/checklist-items', {
            onSuccess: () => {
                reset();
                setData('company', currentCompany); // Keep company context
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Está seguro de eliminar este ítem?')) {
            router.delete(`/vehicles/checklist-items/${id}`);
        }
    };

    const handleCompanyChange = (val: string) => {
        router.get(
            '/vehicles/checklist-items',
            { company: val },
            { preserveState: true },
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Material Mayor', href: '/vehicles/dashboard' },
                {
                    title: 'Configurar Checklist',
                    href: '/vehicles/checklist-items',
                },
            ]}
        >
            <Head title="Configurar Checklist" />
            <div className="flex h-full flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Configuración de Checklist
                        </h1>
                        <p className="text-muted-foreground">
                            Administre los ítems que aparecen en los checklists.
                        </p>
                    </div>
                </div>

                {canConfigureAll && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Seleccionar Compañía</CardTitle>
                            <CardDescription>
                                Está configurando los ítems para:{' '}
                                <span className="font-bold">
                                    {currentCompany}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Select
                                value={currentCompany}
                                onValueChange={handleCompanyChange}
                            >
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Seleccione una compañía" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Comandancia">
                                        Comandancia
                                    </SelectItem>
                                    {companies && companies.length > 0 ? (
                                        companies.map((c) => (
                                            <SelectItem key={c} value={c}>
                                                {c}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <>
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
                                            <SelectItem value="Septima Compañía">
                                                Septima Compañía
                                            </SelectItem>
                                            <SelectItem value="Octava Compañía">
                                                Octava Compañía
                                            </SelectItem>
                                            <SelectItem value="Novena Compañía">
                                                Novena Compañía
                                            </SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Nuevo Ítem para {currentCompany}
                            </CardTitle>
                            <CardDescription>
                                Agregue un nuevo punto de revisión.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <input type="hidden" value={currentCompany} />

                                <div className="space-y-2">
                                    <Label htmlFor="category">Categoría</Label>
                                    <Input
                                        id="category"
                                        placeholder="Ej: Motor, Cabina, Luces..."
                                        value={data.category}
                                        onChange={(e) =>
                                            setData('category', e.target.value)
                                        }
                                    />
                                    {errors.category && (
                                        <p className="text-sm text-destructive">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="short_name">
                                        Nombre Corto
                                    </Label>
                                    <Input
                                        id="short_name"
                                        placeholder="Ej: Nivel de Aceite"
                                        value={data.short_name}
                                        onChange={(e) =>
                                            setData(
                                                'short_name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.short_name && (
                                        <p className="text-sm text-destructive">
                                            {errors.short_name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">
                                        Descripción Completa
                                    </Label>
                                    <Input
                                        id="full_name"
                                        placeholder="Ej: Verificar nivel de aceite de motor y estado..."
                                        value={data.full_name}
                                        onChange={(e) =>
                                            setData('full_name', e.target.value)
                                        }
                                    />
                                    {errors.full_name && (
                                        <p className="text-sm text-destructive">
                                            {errors.full_name}
                                        </p>
                                    )}
                                </div>
                                <Button type="submit" disabled={processing}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Agregar Ítem
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Ítems Existentes ({currentCompany})
                            </CardTitle>
                            <CardDescription>
                                Listado de puntos de control actuales.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="max-h-[600px] overflow-y-auto">
                            {Object.entries(items).map(([category, list]) => (
                                <div key={category} className="mb-6">
                                    <h3 className="mb-2 text-lg font-semibold">
                                        {category}
                                    </h3>
                                    <div className="space-y-2">
                                        {list.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50"
                                            >
                                                <div>
                                                    <p className="font-medium">
                                                        {item.short_name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.full_name}
                                                    </p>
                                                    {item.company === null && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="mt-1"
                                                        >
                                                            Global
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Separator className="my-4" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
