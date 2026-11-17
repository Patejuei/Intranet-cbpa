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
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, ClipboardCheck, Clock, Send, ShieldAlert, Truck } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehículos',
        href: '/vehicles/status',
    },
    {
        title: 'Checklists',
        href: '/vehicles/checklists',
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
    const allItems = Object.values(items).flat();

    const { data, setData, post, processing, errors } =
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

            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
                {/* Back Link */}
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-foreground"
                        asChild
                    >
                        <Link href="/vehicles/checklists">
                            <ArrowLeft className="size-4" />
                            <span>Volver a la lista de checklists</span>
                        </Link>
                    </Button>
                </div>

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ClipboardCheck className="size-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Nuevo Checklist Preventivo
                            </h1>
                            <p className="text-xs text-muted-foreground sm:text-sm">
                                Registro de inspección y estado operativo del material mayor institucional.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Vehicle Selection Card */}
                    <Card className="rounded-2xl border border-border/70 shadow-xs">
                        <CardHeader className="pb-3 pt-5 px-5 sm:px-6">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                                <Truck className="size-4 text-primary" />
                                <span>Unidad a Inspeccionar</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-5 pb-5 sm:px-6">
                            <div className="grid gap-2 max-w-md">
                                <Label htmlFor="vehicle_id" className="text-sm font-medium text-foreground">
                                    Vehículo <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    onValueChange={(value) =>
                                        setData('vehicle_id', value)
                                    }
                                    value={data.vehicle_id}
                                >
                                    <SelectTrigger id="vehicle_id" className="h-10 text-sm">
                                        <SelectValue placeholder="Seleccione un vehículo..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vehicles.map((vehicle) => (
                                            <SelectItem
                                                key={vehicle.id}
                                                value={vehicle.id.toString()}
                                            >
                                                {vehicle.name} ({vehicle.plate}) — {vehicle.company}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.vehicle_id && (
                                    <p className="text-xs text-destructive">
                                        {errors.vehicle_id}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Inspection Categories */}
                    {Object.entries(items).map(([category, categoryItems]) => (
                        <Card key={category} className="rounded-2xl border border-border/70 shadow-xs overflow-hidden">
                            <div className="border-b border-border/60 bg-muted/25 px-5 py-3.5 sm:px-6">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                                    {category}
                                </h2>
                            </div>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/60">
                                    {categoryItems.map((item) => {
                                        const index = data.details.findIndex(
                                            (d) => d.item_id === item.id,
                                        );
                                        const detail = data.details[index];

                                        if (!detail) return null;

                                        return (
                                            <div
                                                key={item.id}
                                                className="flex flex-col gap-3.5 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between"
                                            >
                                                <div className="min-w-[200px] flex-1 font-medium text-foreground text-sm">
                                                    {item.name}
                                                </div>

                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
                                                    {/* Radio options with accessible high contrast */}
                                                    <RadioGroup
                                                        value={detail.status}
                                                        onValueChange={(val: string) =>
                                                            updateDetail(
                                                                index,
                                                                'status',
                                                                val,
                                                            )
                                                        }
                                                        className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-1.5"
                                                    >
                                                        <Label
                                                            htmlFor={`ok-${item.id}`}
                                                            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                                                                detail.status === 'ok'
                                                                    ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300 shadow-xs'
                                                                    : 'text-muted-foreground hover:text-foreground'
                                                            }`}
                                                        >
                                                            <RadioGroupItem
                                                                value="ok"
                                                                id={`ok-${item.id}`}
                                                                className="sr-only"
                                                            />
                                                            <CheckCircle2 className="size-3.5" />
                                                            <span>OK</span>
                                                        </Label>

                                                        <Label
                                                            htmlFor={`nm-${item.id}`}
                                                            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                                                                detail.status === 'next_maint'
                                                                    ? 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300 shadow-xs'
                                                                    : 'text-muted-foreground hover:text-foreground'
                                                            }`}
                                                        >
                                                            <RadioGroupItem
                                                                value="next_maint"
                                                                id={`nm-${item.id}`}
                                                                className="sr-only"
                                                            />
                                                            <Clock className="size-3.5" />
                                                            <span>Próx. Mant.</span>
                                                        </Label>

                                                        <Label
                                                            htmlFor={`urg-${item.id}`}
                                                            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                                                                detail.status === 'urgent'
                                                                    ? 'bg-red-500/15 text-red-700 dark:border-red-500/35 dark:bg-red-500/25 dark:text-red-300 shadow-xs'
                                                                    : 'text-muted-foreground hover:text-foreground'
                                                            }`}
                                                        >
                                                            <RadioGroupItem
                                                                value="urgent"
                                                                id={`urg-${item.id}`}
                                                                className="sr-only"
                                                            />
                                                            <ShieldAlert className="size-3.5" />
                                                            <span>Urgente</span>
                                                        </Label>
                                                    </RadioGroup>

                                                    <div className="w-full sm:w-[260px]">
                                                        <Input
                                                            placeholder="Observaciones del ítem..."
                                                            value={detail.notes}
                                                            onChange={(e) =>
                                                                updateDetail(
                                                                    index,
                                                                    'notes',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="h-9 text-xs"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* General Observations */}
                    <Card className="rounded-2xl border border-border/70 shadow-xs">
                        <CardContent className="p-5 sm:p-6 space-y-2.5">
                            <Label htmlFor="general_observations" className="text-sm font-semibold text-foreground">
                                Observaciones Generales
                            </Label>
                            <Textarea
                                id="general_observations"
                                value={data.general_observations}
                                onChange={(e) =>
                                    setData('general_observations', e.target.value)
                                }
                                placeholder="Comentarios o antecedentes adicionales sobre el estado general del vehículo..."
                                className="min-h-[110px] text-sm leading-relaxed"
                            />
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex flex-col-reverse justify-end gap-3 pt-2 sm:flex-row sm:items-center">
                        <Button
                            variant="outline"
                            type="button"
                            asChild
                            className="w-full sm:w-auto"
                        >
                            <Link href="/vehicles/checklists">
                                Cancelar
                            </Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full gap-2 shadow-xs sm:w-auto"
                        >
                            <Send className="size-4" />
                            <span>Registrar Checklist</span>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}