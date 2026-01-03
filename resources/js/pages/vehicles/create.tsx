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

export default function VehicleCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        plate: '',
        make: '',
        model: '',
        year: '',
        company: 'Comandancia',
        status: 'Operative',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/vehicles');
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
                { title: 'Nuevo Vehículo', href: '/vehicles/create' },
            ]}
        >
            <Head title="Nuevo Vehículo" />
            <div className="flex h-full flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/vehicles/status">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Nuevo Vehículo</h1>
                        <p className="text-muted-foreground">
                            Registrar una nueva unidad en el sistema.
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
                                        placeholder="ej. B-1"
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
                                        placeholder="AA-BB-12"
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
                                        placeholder="ej. Renault"
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
                                        placeholder="ej. Midlum 220"
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
                                        placeholder="2023"
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

                            <Button type="submit" disabled={processing}>
                                Registrar Unidad
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
