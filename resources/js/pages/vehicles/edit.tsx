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
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Vehicle {
    id: number;
    name: string;
    plate: string;
    make: string;
    model: string;
    year: number;
    company: string;
    status: string;
}

export default function VehicleEdit({ vehicle }: { vehicle: Vehicle }) {
    const { data, setData, put, processing, errors } = useForm({
        name: vehicle.name,
        plate: vehicle.plate,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year.toString(),
        company: vehicle.company,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/vehicles/${vehicle.id}`);
    };

    const companies = [
        'Comandancia',
        'Primera Compañía',
        'Segunda Compañía',
        'Tercera Compañía',
        'Cuarta Compañía',
        'Quinta Compañía',
        'Sexta Compañía',
        'Séptima Compañía',
        'Octava Compañía',
        'Novena Compañía',
        'Décima Compañía',
    ];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Material Mayor', href: '/vehicles/dashboard' },
                { title: 'Estado de Carros', href: '/vehicles/status' },
                {
                    title: `Editar ${vehicle.name}`,
                    href: `/vehicles/${vehicle.id}/edit`,
                },
            ]}
        >
            <Head title={`Editar ${vehicle.name}`} />
            <div className="flex h-full flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/vehicles/status/${vehicle.id}`}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Editar Vehículo</h1>
                        <p className="text-muted-foreground">
                            Modificar datos de la unidad {vehicle.name}.
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Detalles de la Unidad</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre (Sigla)</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="plate">Patente</Label>
                                    <Input
                                        id="plate"
                                        value={data.plate}
                                        onChange={(e) =>
                                            setData('plate', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.plate && (
                                        <p className="text-sm text-destructive">
                                            {errors.plate}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="make">Marca</Label>
                                    <Input
                                        id="make"
                                        value={data.make}
                                        onChange={(e) =>
                                            setData('make', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.make && (
                                        <p className="text-sm text-destructive">
                                            {errors.make}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="model">Modelo</Label>
                                    <Input
                                        id="model"
                                        value={data.model}
                                        onChange={(e) =>
                                            setData('model', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.model && (
                                        <p className="text-sm text-destructive">
                                            {errors.model}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="year">Año</Label>
                                    <Input
                                        id="year"
                                        type="number"
                                        value={data.year}
                                        onChange={(e) =>
                                            setData('year', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.year && (
                                        <p className="text-sm text-destructive">
                                            {errors.year}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">Compañía</Label>
                                    <Select
                                        value={data.company}
                                        onValueChange={(val) =>
                                            setData('company', val)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione compañía" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map((c) => (
                                                <SelectItem key={c} value={c}>
                                                    {c}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.company && (
                                        <p className="text-sm text-destructive">
                                            {errors.company}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link
                                        href={`/vehicles/status/${vehicle.id}`}
                                    >
                                        Cancelar
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Guardar Cambios
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
