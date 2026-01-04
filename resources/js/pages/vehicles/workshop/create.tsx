import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
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
import { format } from 'date-fns';
import { ClipboardCheck } from 'lucide-react';
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
        workshop_name: 'Nemesio Vicuña 275, Puente Alto',
        description: '',
        tasks: [] as string[],
        issue_ids: [] as number[],
        // New Fields
        responsible_person: '',
        mileage_in: '',
        traction: '4x2',
        fuel_type: 'Diesel',
        transmission: 'Manual',
        entry_checklist: {} as Record<string, string>, // item -> status (functional, faulty, na)
    });

    const checklistItems = [
        'Sistema de frenos (Incluye ABS)',
        'Sistema Eléctrico y luces de emergencia',
        'Motor y sistema de refrigeración',
        'Suspensión y dirección',
        'Cabina de Mando (Tableros, mando, radiocomunicación)',
        'Equipamiento Hidraulico / Bombas de Agua',
        'Escala / Sistema Extensible (si aplica)',
        'Compartimientos de Herramientas',
        'Sistema de carga de agua / estanque',
        'Neumáticos y repuestos',
        'Alarma sonora y luces baliza',
        'Fugas de líquidos',
    ];

    const handleChecklistChange = (item: string, status: string) => {
        const taskName = `Revisar: ${item}`;
        let newTasks = [...data.tasks];

        if (status === 'Fallas') {
            // Add task if not present
            if (!newTasks.includes(taskName)) {
                newTasks.push(taskName);
            }
        } else {
            // Remove task if present
            newTasks = newTasks.filter((t) => t !== taskName);
        }

        setData((prevData) => ({
            ...prevData,
            entry_checklist: {
                ...prevData.entry_checklist,
                [item]: status,
            },
            tasks: newTasks,
        }));
    };

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
                                            readOnly
                                            className="bg-muted text-muted-foreground"
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
                                        <DatePicker
                                            date={data.entry_date}
                                            setDate={(d) =>
                                                setData(
                                                    'entry_date',
                                                    d
                                                        ? format(
                                                              d,
                                                              'yyyy-MM-dd',
                                                          )
                                                        : '',
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
                                        <DatePicker
                                            date={data.tentative_exit_date}
                                            setDate={(d) =>
                                                setData(
                                                    'tentative_exit_date',
                                                    d
                                                        ? format(
                                                              d,
                                                              'yyyy-MM-dd',
                                                          )
                                                        : '',
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label className="mb-1 block text-sm font-medium">
                                            Bombero Responsable
                                        </Label>
                                        <Input
                                            type="text"
                                            value={data.responsible_person}
                                            onChange={(e) =>
                                                setData(
                                                    'responsible_person',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nombre del responsable"
                                        />
                                        {errors.responsible_person && (
                                            <p className="mt-1 text-xs text-destructive">
                                                {errors.responsible_person}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="mb-1 block text-sm font-medium">
                                            Kilometraje de Ingreso
                                        </Label>
                                        <Input
                                            type="number"
                                            value={data.mileage_in}
                                            onChange={(e) =>
                                                setData(
                                                    'mileage_in',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="0"
                                        />
                                        {errors.mileage_in && (
                                            <p className="mt-1 text-xs text-destructive">
                                                {errors.mileage_in}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Technical Specs */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <div>
                                        <Label className="mb-2 block text-sm font-medium">
                                            Tracción
                                        </Label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="traction"
                                                    value="4x2"
                                                    checked={
                                                        data.traction === '4x2'
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'traction',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <span className="text-sm">
                                                    4x2
                                                </span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="traction"
                                                    value="4x4"
                                                    checked={
                                                        data.traction === '4x4'
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'traction',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <span className="text-sm">
                                                    4x4
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="mb-2 block text-sm font-medium">
                                            Transmisión
                                        </Label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="transmission"
                                                    value="Manual"
                                                    checked={
                                                        data.transmission ===
                                                        'Manual'
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'transmission',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <span className="text-sm">
                                                    Manual
                                                </span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="transmission"
                                                    value="Automática"
                                                    checked={
                                                        data.transmission ===
                                                        'Automática'
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'transmission',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <span className="text-sm">
                                                    Automática
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="mb-2 block text-sm font-medium">
                                            Combustible
                                        </Label>
                                        <div className="flex flex-wrap gap-4">
                                            {[
                                                'Diesel',
                                                'Gasolina',
                                                'Eléctrico',
                                                'Otro',
                                            ].map((fuel) => (
                                                <label
                                                    key={fuel}
                                                    className="flex items-center gap-2"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="fuel_type"
                                                        value={fuel}
                                                        checked={
                                                            data.fuel_type ===
                                                            fuel
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'fuel_type',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <span className="text-sm">
                                                        {fuel}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Entry Checklist */}
                                <div className="rounded-lg border p-4">
                                    <h3 className="mb-4 flex items-center gap-2 font-medium">
                                        <ClipboardCheck className="size-4" />{' '}
                                        Checklist de Ingreso
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="px-2 py-2 text-left font-medium">
                                                        Elemento
                                                    </th>
                                                    <th className="px-2 py-2 text-center font-medium">
                                                        Funcional
                                                    </th>
                                                    <th className="px-2 py-2 text-center font-medium">
                                                        Fallas
                                                    </th>
                                                    <th className="px-2 py-2 text-center font-medium">
                                                        N/A
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {checklistItems.map((item) => (
                                                    <tr key={item}>
                                                        <td className="px-2 py-2">
                                                            {item}
                                                        </td>
                                                        <td className="px-2 py-2 text-center">
                                                            <input
                                                                type="radio"
                                                                name={`chk_${item}`}
                                                                value="Funcional"
                                                                checked={
                                                                    data
                                                                        .entry_checklist[
                                                                        item
                                                                    ] ===
                                                                    'Funcional'
                                                                }
                                                                onChange={() =>
                                                                    handleChecklistChange(
                                                                        item,
                                                                        'Funcional',
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 text-center">
                                                            <input
                                                                type="radio"
                                                                name={`chk_${item}`}
                                                                value="Fallas"
                                                                checked={
                                                                    data
                                                                        .entry_checklist[
                                                                        item
                                                                    ] ===
                                                                    'Fallas'
                                                                }
                                                                onChange={() =>
                                                                    handleChecklistChange(
                                                                        item,
                                                                        'Fallas',
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 text-center">
                                                            <input
                                                                type="radio"
                                                                name={`chk_${item}`}
                                                                value="N/A"
                                                                checked={
                                                                    data
                                                                        .entry_checklist[
                                                                        item
                                                                    ] === 'N/A'
                                                                }
                                                                onChange={() =>
                                                                    handleChecklistChange(
                                                                        item,
                                                                        'N/A',
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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
