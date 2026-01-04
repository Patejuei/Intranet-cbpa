import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehículos',
        href: '/vehicles/status',
    },
    {
        title: 'Nuevo Checklist',
        href: '/vehicles/checklists/create',
    },
];

interface Vehicle {
    id: number;
    name: string;
    company: string;
    plate: string;
}

interface ChecklistItem {
    id: number;
    category: string;
    name: string;
}

interface Props {
    vehicles: Vehicle[];
    items: Record<string, ChecklistItem[]>;
}

interface ChecklistForm {
    vehicle_id: string;
    details: {
        item_id: number;
        status: 'ok' | 'urgent' | 'next_maint';
        notes: string;
    }[];
    general_observations: string;
}

export default function CreateChecklist({ vehicles, items }: Props) {
    // Flatten items to get IDs for initial state
    const allItems = Object.values(items).flat();

    const { data, setData, post, processing, errors, reset } =
        useForm<ChecklistForm>({
            vehicle_id: '',
            details: allItems.map((item) => ({
                item_id: item.id,
                status: 'ok',
                notes: '',
            })),
            general_observations: '',
        });

    const updateDetail = (
        index: number,
        field: 'status' | 'notes',
        value: any,
    ) => {
        const newDetails = [...data.details];
        newDetails[index] = { ...newDetails[index], [field]: value };
        setData('details', newDetails);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // @ts-ignore
        post('/vehicles/checklists');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Checklist Preventivo" />
            <div className="flex flex-1 flex-col gap-8 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Checklist Preventivo
                        </h1>
                        <p className="text-muted-foreground">
                            Complete el formulario para registrar el estado del
                            vehículo.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Selección de Vehículo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="vehicle_id">Vehículo</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setData('vehicle_id', value)
                                        }
                                        value={data.vehicle_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un vehículo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vehicles.map((vehicle) => (
                                                <SelectItem
                                                    key={vehicle.id}
                                                    value={vehicle.id.toString()}
                                                >
                                                    {vehicle.name} (
                                                    {vehicle.plate}) -{' '}
                                                    {vehicle.company}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.vehicle_id && (
                                        <p className="text-sm font-medium text-destructive">
                                            {errors.vehicle_id}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {Object.entries(items).map(([category, categoryItems]) => (
                        <Card key={category} className="overflow-hidden">
                            <div className="border-b bg-muted/50 px-6 py-4">
                                <h3 className="text-lg font-bold">
                                    {category}
                                </h3>
                            </div>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {categoryItems.map((item) => {
                                        const index = data.details.findIndex(
                                            (d) => d.item_id === item.id,
                                        );
                                        const detail = data.details[index];

                                        if (!detail) return null;

                                        return (
                                            <div
                                                key={item.id}
                                                className="grid gap-4 p-4 md:grid-cols-[1fr_auto_1fr] md:p-6"
                                            >
                                                <div className="flex items-center font-medium">
                                                    {item.name}
                                                </div>

                                                <div className="flex items-start justify-center">
                                                    <RadioGroup
                                                        value={detail.status}
                                                        onValueChange={(
                                                            val: string,
                                                        ) =>
                                                            updateDetail(
                                                                index,
                                                                'status',
                                                                val,
                                                            )
                                                        }
                                                        className="flex gap-4"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value="ok"
                                                                id={`ok-${item.id}`}
                                                                className="border-green-600 text-green-600"
                                                            />
                                                            <Label
                                                                htmlFor={`ok-${item.id}`}
                                                                className="cursor-pointer font-bold text-green-700"
                                                            >
                                                                OK
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value="next_maint"
                                                                id={`nm-${item.id}`}
                                                                className="border-yellow-600 text-yellow-600"
                                                            />
                                                            <Label
                                                                htmlFor={`nm-${item.id}`}
                                                                className="cursor-pointer font-bold text-yellow-700"
                                                            >
                                                                Próx. Mant.
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem
                                                                value="urgent"
                                                                id={`urg-${item.id}`}
                                                                className="border-red-600 text-red-600"
                                                            />
                                                            <Label
                                                                htmlFor={`urg-${item.id}`}
                                                                className="cursor-pointer font-bold text-red-700"
                                                            >
                                                                Urgente
                                                            </Label>
                                                        </div>
                                                    </RadioGroup>
                                                </div>

                                                <div className="flex items-center">
                                                    <Input
                                                        placeholder="Observaciones (opcional)"
                                                        value={detail.notes}
                                                        onChange={(e) =>
                                                            updateDetail(
                                                                index,
                                                                'notes',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-9"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="space-y-4 rounded-lg border p-4">
                        <Label htmlFor="general_observations">
                            Observaciones Generales
                        </Label>
                        <Textarea
                            id="general_observations"
                            value={data.general_observations}
                            onChange={(e) =>
                                setData('general_observations', e.target.value)
                            }
                            placeholder="Comentarios generales sobre el estado del vehículo..."
                        />
                    </div>

                    <div className="flex justify-end gap-4 pb-8">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => window.history.back()}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            size="lg"
                            className="w-full md:w-auto"
                        >
                            Registrar Checklist
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
