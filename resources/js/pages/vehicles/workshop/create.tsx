import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

interface Issue {
    id: number;
    description: string;
    date: string;
    severity: string;
}

interface Vehicle {
    id: number;
    name: string;
    company: string;
    plate: string;
    make: string;
    model: string;
    issues: Issue[];
    active_maintenance_id?: number;
}

export default function WorkshopCreate({ vehicles }: { vehicles: Vehicle[] }) {
    const { data, setData, post, processing, errors } = useForm({
        vehicle_id: '',
        entry_date: new Date().toISOString().split('T')[0],
        tentative_exit_date: '',
        workshop_name: '',
        description: '',
        tasks: [] as string[],
        issue_ids: [] as number[],
    });

    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
        null,
    );

    useEffect(() => {
        if (data.vehicle_id) {
            const v = vehicles.find((v) => v.id.toString() === data.vehicle_id);
            setSelectedVehicle(v || null);
            // Reset issues when vehicle changes?
            setData('issue_ids', []);
        } else {
            setSelectedVehicle(null);
        }
    }, [data.vehicle_id]);

    const handleIssueToggle = (id: number) => {
        const current = data.issue_ids;
        if (current.includes(id)) {
            setData(
                'issue_ids',
                current.filter((i) => i !== id),
            );
        } else {
            setData('issue_ids', [...current, id]);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/vehicles/workshop');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Taller Mecánico', href: '/vehicles/workshop' },
                { title: 'Nuevo Ingreso', href: '/vehicles/workshop/create' },
            ]}
        >
            <Head title="Ingresar Vehículo a Taller" />

            <div className="flex flex-col gap-6 p-4">
                <div className="mx-auto w-full max-w-3xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ingresar Vehículo a Taller</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Vehículo</Label>
                                        <Select
                                            onValueChange={(val) =>
                                                setData('vehicle_id', val)
                                            }
                                            value={data.vehicle_id}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un vehículo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {vehicles.map((v) => (
                                                    <SelectItem
                                                        key={v.id}
                                                        value={v.id.toString()}
                                                    >
                                                        {v.name} ({v.company})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.vehicle_id && (
                                            <p className="text-sm text-destructive">
                                                {errors.vehicle_id}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Taller / Lugar</Label>
                                        <Input
                                            value={data.workshop_name}
                                            onChange={(e) =>
                                                setData(
                                                    'workshop_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ej: Taller Central, Mecánico JS"
                                        />
                                        {errors.workshop_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.workshop_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {selectedVehicle && (
                                    <div className="rounded-md border bg-muted/50 p-4">
                                        <h3 className="mb-2 font-semibold">
                                            Detalles del Vehículo
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-muted-foreground">
                                                    Patente:
                                                </span>{' '}
                                                {selectedVehicle.plate || 'N/A'}
                                            </div>
                                            <div>
                                                <span className="font-medium text-muted-foreground">
                                                    Marca/Modelo:
                                                </span>{' '}
                                                {selectedVehicle.make}{' '}
                                                {selectedVehicle.model}
                                            </div>
                                            <div>
                                                <span className="font-medium text-muted-foreground">
                                                    Compañía:
                                                </span>{' '}
                                                {selectedVehicle.company}
                                            </div>
                                        </div>

                                        {/* Duplicate Warning */}
                                        {selectedVehicle.active_maintenance_id && (
                                            <div className="mt-4 rounded-md border border-yellow-500/20 bg-yellow-500/10 p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="font-bold text-yellow-500">
                                                        ⚠️ Este vehículo ya se
                                                        encuentra en taller.
                                                    </div>
                                                    <Button
                                                        asChild
                                                        variant="secondary"
                                                        size="sm"
                                                    >
                                                        <a
                                                            href={`/vehicles/workshop/${selectedVehicle.active_maintenance_id}`}
                                                        >
                                                            Ver Orden Activa
                                                        </a>
                                                    </Button>
                                                </div>
                                                <p className="mt-2 text-xs text-muted-foreground">
                                                    Si desea ingresar un nuevo
                                                    registro, por favor finalice
                                                    la orden anterior primero.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Fecha de Ingreso</Label>
                                        <Input
                                            type="date"
                                            value={data.entry_date}
                                            onChange={(e) =>
                                                setData(
                                                    'entry_date',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.entry_date && (
                                            <p className="text-sm text-destructive">
                                                {errors.entry_date}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>
                                            Fecha Tentativa Salida (Opcional)
                                        </Label>
                                        <Input
                                            type="date"
                                            value={data.tentative_exit_date}
                                            onChange={(e) =>
                                                setData(
                                                    'tentative_exit_date',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                {selectedVehicle &&
                                    selectedVehicle.issues.length > 0 && (
                                        <div className="space-y-2 rounded-md border p-4">
                                            <Label className="text-base font-semibold">
                                                Reportar Incidencias Existentes
                                            </Label>
                                            <div className="space-y-2">
                                                {selectedVehicle.issues.map(
                                                    (issue) => (
                                                        <div
                                                            key={issue.id}
                                                            className="flex items-start space-x-2"
                                                        >
                                                            <Checkbox
                                                                id={`issue-${issue.id}`}
                                                                checked={data.issue_ids.includes(
                                                                    issue.id,
                                                                )}
                                                                onCheckedChange={() =>
                                                                    handleIssueToggle(
                                                                        issue.id,
                                                                    )
                                                                }
                                                            />
                                                            <Label
                                                                htmlFor={`issue-${issue.id}`}
                                                                className="font-normal"
                                                            >
                                                                <span className="font-semibold">
                                                                    {issue.date}
                                                                    :
                                                                </span>{' '}
                                                                {
                                                                    issue.description
                                                                }{' '}
                                                                <span className="text-xs text-muted-foreground">
                                                                    (
                                                                    {
                                                                        issue.severity
                                                                    }
                                                                    )
                                                                </span>
                                                            </Label>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                <div className="space-y-2">
                                    <Label>Trabajos a Realizar (Lista)</Label>
                                    <div className="space-y-2">
                                        {data.tasks.map((task, index) => (
                                            <div
                                                key={index}
                                                className="flex gap-2"
                                            >
                                                <Input
                                                    value={task}
                                                    onChange={(e) => {
                                                        const newTasks = [
                                                            ...data.tasks,
                                                        ];
                                                        newTasks[index] =
                                                            e.target.value;
                                                        setData(
                                                            'tasks',
                                                            newTasks,
                                                        );
                                                    }}
                                                    placeholder={`Trabajo #${index + 1}`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => {
                                                        const newTasks =
                                                            data.tasks.filter(
                                                                (_, i) =>
                                                                    i !== index,
                                                            );
                                                        setData(
                                                            'tasks',
                                                            newTasks,
                                                        );
                                                    }}
                                                >
                                                    <span className="sr-only">
                                                        Eliminar
                                                    </span>
                                                    &times;
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setData('tasks', [
                                                    ...data.tasks,
                                                    '',
                                                ])
                                            }
                                        >
                                            + Agregar Trabajo
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Observaciones Generales</Label>
                                    <Textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Detalles adicionales..."
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="submit" disabled={processing}>
                                        Registrar Ingreso
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
