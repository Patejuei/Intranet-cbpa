import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Head, Link, router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface Vehicle {
    id: number;
    name: string;
    plate: string;
    make: string;
    model: string;
    year: number;
    company: string;
    status: string;
    type?: string;
    technical_review_expires_at?: string;
    circulation_permit_expires_at?: string;
    insurance_expires_at?: string;
}

export default function VehicleEdit({ vehicle }: { vehicle: Vehicle }) {
    const { data, setData, put, processing, errors } = useForm({
        name: vehicle.name,
        plate: vehicle.plate,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year.toString(),
        company: vehicle.company,
        type: vehicle.type || '',
        technical_review_expires_at: vehicle.technical_review_expires_at
            ? vehicle.technical_review_expires_at.split('T')[0]
            : '',
        circulation_permit_expires_at: vehicle.circulation_permit_expires_at
            ? vehicle.circulation_permit_expires_at.split('T')[0]
            : '',
        insurance_expires_at: vehicle.insurance_expires_at
            ? vehicle.insurance_expires_at.split('T')[0]
            : '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/vehicles/${vehicle.id}`);
    };

    const confirmDecommission = () => {
        router.delete(`/vehicles/${vehicle.id}`);
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
                                        disabled
                                        className="bg-muted"
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
                                        disabled
                                        className="bg-muted"
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
                                        disabled
                                        className="bg-muted"
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
                                        disabled
                                        className="bg-muted"
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
                                        disabled
                                    >
                                        <SelectTrigger className="bg-muted">
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

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="type">
                                        Tipo de Vehículo
                                    </Label>
                                    <Input
                                        id="type"
                                        value={data.type}
                                        onChange={(e) =>
                                            setData('type', e.target.value)
                                        }
                                        placeholder="ej. Bomba, Rescate, Aljibe"
                                    />
                                    {errors.type && (
                                        <p className="text-sm text-destructive">
                                            {errors.type}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="mb-4 text-lg font-semibold">
                                    Documentación
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="technical_review">
                                            Revisión Técnica
                                        </Label>
                                        <DatePicker
                                            date={
                                                data.technical_review_expires_at
                                            }
                                            setDate={(d) =>
                                                setData(
                                                    'technical_review_expires_at',
                                                    d
                                                        ? format(
                                                              d,
                                                              'yyyy-MM-dd',
                                                          )
                                                        : '',
                                                )
                                            }
                                        />
                                        {errors.technical_review_expires_at && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    errors.technical_review_expires_at
                                                }
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="circulation_permit">
                                            Permiso de Circulación
                                        </Label>
                                        <DatePicker
                                            date={
                                                data.circulation_permit_expires_at
                                            }
                                            setDate={(d) =>
                                                setData(
                                                    'circulation_permit_expires_at',
                                                    d
                                                        ? format(
                                                              d,
                                                              'yyyy-MM-dd',
                                                          )
                                                        : '',
                                                )
                                            }
                                        />
                                        {errors.circulation_permit_expires_at && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    errors.circulation_permit_expires_at
                                                }
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="insurance">
                                            Seguro Obligatorio
                                        </Label>
                                        <DatePicker
                                            date={data.insurance_expires_at}
                                            setDate={(d) =>
                                                setData(
                                                    'insurance_expires_at',
                                                    d
                                                        ? format(
                                                              d,
                                                              'yyyy-MM-dd',
                                                          )
                                                        : '',
                                                )
                                            }
                                        />
                                        {errors.insurance_expires_at && (
                                            <p className="text-sm text-destructive">
                                                {errors.insurance_expires_at}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Dar de Baja
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                ¿Dar de baja este vehículo?
                                            </DialogTitle>
                                            <DialogDescription>
                                                Esta acción ocultará el vehículo
                                                de las listas activas y lo
                                                moverá a la lista de "Dados de
                                                Baja". El historial se
                                                mantendrá.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">
                                                    Cancelar
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                variant="destructive"
                                                onClick={confirmDecommission}
                                            >
                                                Dar de Baja
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
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
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
