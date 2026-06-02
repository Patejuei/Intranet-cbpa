import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Eye,
    FileText,
    Pencil,
    Plus,
    Printer,
    Save,
    Trash2,
    Wrench,
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

import ExternalWorkModal, {
    ExternalWork,
} from '@/components/vehicles/workshop/ExternalWorkModal';

interface Task {
    id?: number;
    description: string;
    is_completed: boolean;
    cost: number | null;
}

interface Issue {
    id: number;
    description: string;
    status: string;
    date: string;
}

interface Vehicle {
    id: number;
    name: string;
    plate: string;
    model: string;
    make: string;
    company: string;
}

interface Maintenance {
    id: number;
    vehicle_id: number;
    vehicle: Vehicle;
    workshop_name: string;
    description: string;
    entry_date: string;
    tentative_exit_date: string | null;
    status: string;
    responsible_person?: string;
    mileage_in?: number;
    traction?: string;
    fuel_type?: string;
    transmission?: string;
    entry_checklist?: Record<string, string>;
    withdrawal_responsible_name?: string;
    withdrawal_responsible_rut?: string;
    issues: Issue[];
    tasks: Task[];
    items: {
        id: number;
        pivot: {
            quantity: number;
            unit_cost: number;
            total_cost: number;
        };
        name: string;
        sku: string;
    }[];
    external_works?: ExternalWork[];
    working_hours?: number;
    hour_rate?: number;
}

interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    stock: number;
    unit_cost: number;
    category: string;
}

export default function WorkshopShow({
    maintenance,
    inventoryItems,
}: {
    maintenance: Maintenance;
    inventoryItems: InventoryItem[];
}) {
    const { data, setData, put, processing } = useForm({
        status: maintenance.status,
        tentative_exit_date: maintenance.tentative_exit_date
            ? maintenance.tentative_exit_date.split('T')[0]
            : '',
        description: maintenance.description || '',
        tasks: maintenance.tasks.map((t) => ({
            ...t,
            cost: t.cost ? Number(t.cost) : null,
        })) as Task[],
        resolved_issue_ids: [] as number[],
        withdrawal_responsible_name:
            maintenance.withdrawal_responsible_name || '',
        withdrawal_responsible_rut:
            maintenance.withdrawal_responsible_rut || '',
        external_works: (maintenance.external_works || []).map((w) => ({
            ...w,
            cost: w.cost ? Number(w.cost) : '',
        })) as ExternalWork[],
        working_hours: maintenance.working_hours || 0,
        hour_rate: maintenance.hour_rate || 0,
    });

    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
    const [isExternalModalOpen, setIsExternalModalOpen] = useState(false);
    const [editingWorkIndex, setEditingWorkIndex] = useState<number | null>(
        null,
    );
    const [viewingWorkIndex, setViewingWorkIndex] = useState<number | null>(
        null,
    );

    const [inventoryForm, setInventoryForm] = useState({
        inventory_item_id: '',
        quantity: 1,
    });

    const [isAddingItem, setIsAddingItem] = useState(false);

    const statusOptions = [
        'En Taller',
        'Trabajando',
        'En Espera de Repuestos',
        'Pruebas Finales',
        'Finalizado',
        'Entregado',
    ];

    const handleSaveWorks = () => {
        router.post(
            `/vehicles/workshop/${maintenance.id}`,
            {
                _method: 'put',
                ...data,
            } as any,
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    const props = page.props as any;
                    if (props.maintenance) {
                        const updated = props.maintenance;
                        setData((prev) => ({
                            ...prev,
                            tasks: updated.tasks.map((t: any) => ({
                                ...t,
                                cost: t.cost ? Number(t.cost) : null,
                            })),
                            external_works: (updated.external_works || []).map((w: any) => ({
                                ...w,
                                cost: w.cost ? Number(w.cost) : '',
                            })),
                        }));
                        toast.success('Cambios guardados exitosamente');
                    }
                }
            },
        );
    };

    const handleFinalize = () => {
        if (
            confirm(
                '¿Está seguro de finalizar el trabajo? Esto resolverá las incidencias marcadas y generará el documento de salida.',
            )
        ) {
            router.post(
                `/vehicles/workshop/${maintenance.id}`,
                {
                    _method: 'put',
                    ...data,
                    status: 'Finalizado',
                } as any,
                {
                    forceFormData: true,
                    preserveScroll: true,
                    onSuccess: (page) => {
                        const props = page.props as any;
                        if (props.maintenance) {
                            const updated = props.maintenance;
                            setData((prev) => ({
                                ...prev,
                                status: updated.status,
                                tasks: updated.tasks.map((t: any) => ({
                                    ...t,
                                    cost: t.cost ? Number(t.cost) : null,
                                })),
                                external_works: (updated.external_works || []).map((w: any) => ({
                                    ...w,
                                    cost: w.cost ? Number(w.cost) : '',
                                })),
                            }));
                            toast.success('Orden finalizada correctamente');
                        }
                    }
                },
            );
        }
    };

    const toggleTaskCompletion = (index: number) => {
        const newTasks = [...data.tasks];
        newTasks[index].is_completed = !newTasks[index].is_completed;
        setData('tasks', newTasks);
    };

    const updateTaskDescription = (index: number, val: string) => {
        const newTasks = [...data.tasks];
        newTasks[index].description = val;
        setData('tasks', newTasks);
    };

    const addTask = () => {
        setData('tasks', [
            ...data.tasks,
            { description: '', is_completed: false, cost: null },
        ]);
    };

    const removeTask = (index: number) => {
        const newTasks = data.tasks.filter((_, i) => i !== index);
        setData('tasks', newTasks);
    };

    const toggleIssueResolution = (id: number) => {
        const current = data.resolved_issue_ids;
        if (current.includes(id)) {
            setData(
                'resolved_issue_ids',
                current.filter((i) => i !== id),
            );
            const issue = maintenance.issues.find((i) => i.id === id);
            if (issue) {
                issue.status = 'Pending';
            }
        } else {
            setData('resolved_issue_ids', [...current, id]);
            const issue = maintenance.issues.find((i) => i.id === id);
            if (issue) {
                issue.status = 'Resolved';
            }
        }
    };

    const handleAddInventoryItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inventoryForm.inventory_item_id || inventoryForm.quantity < 1)
            return;

        setIsAddingItem(true);
        router.post(
            `/vehicles/workshop/${maintenance.id}/items`,
            inventoryForm as any,
            {
                onSuccess: () => {
                    setInventoryForm({ inventory_item_id: '', quantity: 1 });
                    setIsAddingItem(false);
                },
                onError: () => setIsAddingItem(false),
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const handleRemoveInventoryItem = (itemId: number) => {
        if (confirm('¿Eliminar este ítem de la orden?')) {
            router.delete(
                `/vehicles/workshop/${maintenance.id}/items/${itemId}`,
                { preserveScroll: true, preserveState: true },
            );
        }
    };

    // Calculate totals
    const totalPartsCost =
        maintenance.items?.reduce(
            (sum, item) => sum + (item.pivot.total_cost || 0),
            0,
        ) || 0;

    const laborCost = Number(data.working_hours) * Number(data.hour_rate);
    const externalWorksCost = data.external_works.reduce(
        (sum, w) => sum + (Number(w.cost) || 0),
        0,
    );

    const totalOrderCost = totalPartsCost + laborCost + externalWorksCost;

    const completedTasks = data.tasks.filter((t) => t.is_completed).length;

    const { canEdit: canEditPermission, canConfigureHH, canEditWorkingHours } = usePermissions();
    const canEdit = canEditPermission('vehicles.workshop');
    const isLocked =
        maintenance.status === 'Finalizado' ||
        maintenance.status === 'Entregado';

    const isReadOnly = !canEdit;
    const isContentLocked = !canEdit || isLocked;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Taller Mecánico', href: '/vehicles/workshop' },
                {
                    title: `Orden #${maintenance.id}`,
                    href: `/vehicles/workshop/${maintenance.id}`,
                },
            ]}
        >
            <Head title={`Orden de Trabajo #${maintenance.id}`} />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4">
                <Button
                    variant="ghost"
                    className="w-fit gap-2 pl-0 hover:bg-transparent hover:text-primary"
                    asChild
                >
                    <Link href="/vehicles/workshop">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Taller
                    </Link>
                </Button>

                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold">
                            <Wrench className="h-6 w-6" />
                            Orden de Trabajo #{maintenance.id}
                        </h1>
                        <p className="text-muted-foreground">
                            {maintenance.vehicle.name} -{' '}
                            {maintenance.vehicle.plate} (
                            {maintenance.vehicle.company})
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {(maintenance.status === 'Finalizado' ||
                            maintenance.status === 'Entregado') && (
                            <Button
                                variant="outline"
                                asChild
                                className="border-green-600 text-green-600 hover:bg-green-50"
                            >
                                <a
                                    href={`/vehicles/workshop/${maintenance.id}/print-exit`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Imprimir Salida
                                </a>
                            </Button>
                        )}

                        <Button variant="outline" asChild>
                            <a
                                href={`/vehicles/workshop/${maintenance.id}/print`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Printer className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Imprimir Orden
                                </span>
                                <span className="sm:hidden">Imprimir</span>
                            </a>
                        </Button>

                        {!isReadOnly && (
                            <Button
                                onClick={handleSaveWorks}
                                disabled={processing}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Guardar Cambios
                                </span>
                            </Button>
                        )}

                        {!isReadOnly &&
                            maintenance.status !== 'Finalizado' &&
                            maintenance.status !== 'Entregado' && (
                                <Button
                                    variant="destructive"
                                    onClick={handleFinalize}
                                    disabled={processing || isContentLocked}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">
                                        Finalizar
                                    </span>
                                </Button>
                            )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Estado y Fechas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Estado Actual</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(val) => {
                                            if (val === 'Entregado') {
                                                setIsWithdrawalModalOpen(true);
                                                setData('status', val);
                                            } else {
                                                setData('status', val);
                                            }
                                        }}
                                        disabled={isReadOnly}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((opt) => (
                                                <SelectItem
                                                    key={opt}
                                                    value={opt}
                                                >
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Fecha de Ingreso</Label>
                                    <div className="flex items-center gap-2 rounded border bg-muted/50 p-2 text-sm">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(maintenance.entry_date)}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Fecha Tentativa Salida</Label>
                                    <Input
                                        type="date"
                                        value={data.tentative_exit_date}
                                        onChange={(e) =>
                                            setData(
                                                'tentative_exit_date',
                                                e.target.value,
                                            )
                                        }
                                        onClick={(e) =>
                                            e.currentTarget.showPicker()
                                        }
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Label>Taller / Proveedor</Label>
                                    <p className="font-medium">
                                        {maintenance.workshop_name}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Detalles del Ingreso
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Responsable
                                        </Label>
                                        <p className="font-medium">
                                            {maintenance.responsible_person ||
                                                '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Kilometraje
                                        </Label>
                                        <p className="font-medium">
                                            {maintenance.mileage_in
                                                ? `${maintenance.mileage_in} km`
                                                : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Tracción
                                        </Label>
                                        <p className="font-medium">
                                            {maintenance.traction || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Transmisión
                                        </Label>
                                        <p className="font-medium">
                                            {maintenance.transmission || '-'}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-xs text-muted-foreground">
                                            Combustible
                                        </Label>
                                        <p className="font-medium">
                                            {maintenance.fuel_type || '-'}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Mano de Obra (HH)
                                    </Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs">
                                                Horas (HH)
                                            </Label>
                                            <Input
                                                type="number"
                                                step="0.5"
                                                value={data.working_hours}
                                                onChange={(e) =>
                                                    setData(
                                                        'working_hours',
                                                        Number(e.target.value),
                                                    )
                                                }
                                                disabled={
                                                    !canEditWorkingHours() ||
                                                    data.status ===
                                                        'Entregado' ||
                                                    data.status === 'Finalizado'
                                                }
                                                className={`h-8 text-sm ${!canEditWorkingHours() ? 'bg-muted' : ''}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">
                                                Precio/Hora
                                            </Label>
                                            <Input
                                                type="number"
                                                value={data.hour_rate}
                                                onChange={(e) =>
                                                    setData(
                                                        'hour_rate',
                                                        Number(e.target.value),
                                                    )
                                                }
                                                disabled={
                                                    !canConfigureHH() ||
                                                    data.status ===
                                                        'Entregado' ||
                                                    data.status === 'Finalizado'
                                                }
                                                className={`h-8 text-sm ${!canConfigureHH() ? 'bg-muted' : ''}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between border-t border-dashed pt-2 text-sm">
                                        <span className="text-muted-foreground">
                                            Subtotal Labor:
                                        </span>
                                        <span className="font-bold">
                                            $
                                            {(
                                                Number(data.working_hours) *
                                                Number(data.hour_rate)
                                            ).toLocaleString('es-CL')}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Incidencias Vinculadas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {maintenance.issues.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No hay incidencias vinculadas.
                                    </p>
                                ) : (
                                    maintenance.issues.map((issue) => (
                                        <div
                                            key={issue.id}
                                            className="flex items-start gap-2 rounded border p-2"
                                        >
                                            <Checkbox
                                                checked={
                                                    issue.status ===
                                                        'Resolved' ||
                                                    data.resolved_issue_ids.includes(
                                                        issue.id,
                                                    )
                                                }
                                                disabled={
                                                    isContentLocked
                                                }
                                                onCheckedChange={() =>
                                                    toggleIssueResolution(
                                                        issue.id,
                                                    )
                                                }
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {issue.description}
                                                </p>
                                                <div className="mt-1 flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDate(issue.date)}
                                                    </span>
                                                    <Badge
                                                        variant={
                                                            issue.status ===
                                                                'Resolved' ||
                                                            data.resolved_issue_ids.includes(
                                                                issue.id,
                                                            )
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {issue.status ===
                                                        'Resolved'
                                                            ? 'Resuelto'
                                                            : data.resolved_issue_ids.includes(
                                                                    issue.id,
                                                                )
                                                              ? 'Marcado para Resolver'
                                                              : 'Pendiente'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>
                                    Repuestos e Insumos Utilizados
                                </CardTitle>
                                <Badge
                                    variant="secondary"
                                    className="text-base"
                                >
                                    {maintenance.items?.length || 0} Ítems
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {!isContentLocked && (
                                    <div className="flex items-end gap-2 rounded bg-muted/30 p-4">
                                        <div className="flex-1 space-y-2">
                                            <Label>Item de Bodega</Label>
                                            <Select
                                                value={inventoryForm.inventory_item_id.toString()}
                                                onValueChange={(val) =>
                                                    setInventoryForm({
                                                        ...inventoryForm,
                                                        inventory_item_id: val,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar ítem..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {inventoryItems.map(
                                                        (item) => (
                                                            <SelectItem
                                                                key={item.id}
                                                                value={item.id.toString()}
                                                            >
                                                                {item.name} (
                                                                {item.sku}) -
                                                                Stock:{' '}
                                                                {item.stock}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-24 space-y-2">
                                            <Label>Cantidad</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={inventoryForm.quantity}
                                                onChange={(e) =>
                                                    setInventoryForm({
                                                        ...inventoryForm,
                                                        quantity:
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 1,
                                                    })
                                                }
                                            />
                                        </div>
                                        <Button
                                            onClick={handleAddInventoryItem}
                                            disabled={
                                                isAddingItem ||
                                                !inventoryForm.inventory_item_id
                                            }
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Agregar
                                        </Button>
                                    </div>
                                )}

                                <div className="rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/50 text-left">
                                                <th className="p-3 font-medium">
                                                    Ítem
                                                </th>
                                                <th className="p-3 text-right font-medium">
                                                    Cant.
                                                </th>
                                                <th className="p-3 text-right font-medium">
                                                    Costo Unit.
                                                </th>
                                                <th className="p-3 text-right font-medium">
                                                    Total
                                                </th>
                                                {!isContentLocked && (
                                                    <th className="w-[50px] p-3 text-right font-medium text-muted-foreground"></th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {!maintenance.items ||
                                            maintenance.items.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="p-4 text-center text-muted-foreground"
                                                    >
                                                        No se han utilizado
                                                        repuestos.
                                                    </td>
                                                </tr>
                                            ) : (
                                                maintenance.items.map(
                                                    (item) => (
                                                        <tr
                                                            key={item.id}
                                                            className="border-b last:border-0"
                                                        >
                                                            <td className="p-3">
                                                                <div className="font-medium">
                                                                    {item.name}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {item.sku}
                                                                </div>
                                                            </td>
                                                            <td className="p-3 text-right">
                                                                {
                                                                    item.pivot
                                                                        .quantity
                                                                }
                                                            </td>
                                                            <td className="p-3 text-right">
                                                                $
                                                                {item.pivot.unit_cost.toLocaleString(
                                                                    'es-CL',
                                                                )}
                                                            </td>
                                                            <td className="p-3 text-right font-medium">
                                                                $
                                                                {item.pivot.total_cost.toLocaleString(
                                                                    'es-CL',
                                                                )}
                                                            </td>
                                                            {!isContentLocked && (
                                                                <td className="p-3 text-right">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                                        onClick={() =>
                                                                            handleRemoveInventoryItem(
                                                                                item.id,
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            isContentLocked
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                        <tfoot className="bg-muted/20">
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="p-3 text-right font-semibold"
                                                >
                                                    Total Repuestos:
                                                </td>
                                                <td className="p-3 text-right font-bold">
                                                    $
                                                    {totalPartsCost.toLocaleString(
                                                        'es-CL',
                                                    )}
                                                </td>
                                                {!isContentLocked && <td></td>}
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <CardTitle className="text-lg">
                                    Listado de Trabajos
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">
                                        {completedTasks}/{data.tasks.length}{' '}
                                        Completados
                                    </Badge>
                                    {!isContentLocked && (
                                        <Button
                                            onClick={addTask}
                                            size="sm"
                                            className="h-8 gap-1"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">
                                                Agregar
                                            </span>
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {data.tasks.map((task, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/20"
                                        >
                                            {!isReadOnly && (
                                                <Checkbox
                                                    checked={task.is_completed}
                                                    onCheckedChange={() =>
                                                        toggleTaskCompletion(
                                                            index,
                                                        )
                                                    }
                                                    className="mt-1"
                                                    disabled={
                                                        isReadOnly ||
                                                        data.status ===
                                                            'Finalizado' ||
                                                        data.status ===
                                                            'Entregado'
                                                    }
                                                />
                                            )}
                                            <div className="flex-1 space-y-2">
                                                <Input
                                                    value={task.description}
                                                    onChange={(e) =>
                                                        updateTaskDescription(
                                                            index,
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Descripción del trabajo..."
                                                    className={`border-none bg-transparent p-0 text-sm font-medium focus-visible:ring-0 ${
                                                        task.is_completed
                                                            ? 'text-muted-foreground line-through'
                                                            : ''
                                                    }`}
                                                    readOnly={
                                                        isContentLocked ||
                                                        data.status ===
                                                            'Finalizado' ||
                                                        data.status ===
                                                            'Entregado'
                                                    }
                                                />
                                            </div>
                                            {!isContentLocked && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        removeTask(index)
                                                    }
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    {data.tasks.length === 0 && (
                                        <p className="py-4 text-center text-sm text-muted-foreground">
                                            No hay trabajos registrados.
                                        </p>
                                    )}
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-semibold">
                                            Trabajos Externos
                                        </Label>
                                        {!isContentLocked && (
                                            <Button
                                                onClick={() => {
                                                    setEditingWorkIndex(null);
                                                    setIsExternalModalOpen(
                                                        true,
                                                    );
                                                }}
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-1"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                                Agregar Externo
                                            </Button>
                                        )}
                                    </div>
                                    <div className="rounded-md border">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b bg-muted/50 text-left">
                                                    <th className="p-3 font-medium">
                                                        Descripción
                                                    </th>
                                                    <th className="p-3 font-medium">
                                                        Proveedor
                                                    </th>
                                                    <th className="p-3 text-right font-medium">
                                                        Costo
                                                    </th>
                                                    <th className="w-[120px] p-3"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.external_works.length ===
                                                0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan={4}
                                                            className="p-4 text-center text-muted-foreground"
                                                        >
                                                            No hay trabajos
                                                            externos
                                                            registrados.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    data.external_works.map(
                                                        (work, index) => (
                                                            <tr
                                                                key={index}
                                                                className="border-b last:border-0 hover:bg-muted/10"
                                                            >
                                                                <td className="p-3">
                                                                    {
                                                                        work.description
                                                                    }
                                                                </td>
                                                                <td className="p-3">
                                                                    {
                                                                        work.provider
                                                                    }
                                                                </td>
                                                                <td className="p-3 text-right font-medium">
                                                                    $
                                                                    {Number(
                                                                        work.cost,
                                                                    ).toLocaleString(
                                                                        'es-CL',
                                                                    )}
                                                                </td>
                                                                <td className="p-3 text-right">
                                                                    <div className="flex justify-end gap-1">
                                                                        {/* Ver detalles – siempre visible */}
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                                            title="Ver detalles"
                                                                            onClick={() => {
                                                                                setViewingWorkIndex(
                                                                                    index,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                        {/* Editar y Eliminar – solo cuando no está bloqueado */}
                                                                        {!isContentLocked && (
                                                                            <>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8 text-blue-600 hover:bg-blue-100 hover:text-blue-800"
                                                                                    title="Editar"
                                                                                    onClick={() => {
                                                                                        setEditingWorkIndex(
                                                                                            index,
                                                                                        );
                                                                                        setIsExternalModalOpen(
                                                                                            true,
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <Pencil className="h-4 w-4" />
                                                                                </Button>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                                                    title="Eliminar"
                                                                                    onClick={() => {
                                                                                        if (
                                                                                            confirm(
                                                                                                '¿Eliminar trabajo externo?',
                                                                                            )
                                                                                        ) {
                                                                                            const newWorks =
                                                                                                data.external_works.filter(
                                                                                                    (
                                                                                                        _,
                                                                                                        i,
                                                                                                    ) =>
                                                                                                        i !==
                                                                                                        index,
                                                                                                );
                                                                                            setData(
                                                                                                'external_works',
                                                                                                newWorks,
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <Separator />

                                <div className="rounded-lg bg-primary/5 p-4">
                                    <table className="w-full">
                                        <tfoot>
                                            <tr className="bg-primary/5 text-primary">
                                                <td
                                                    colSpan={3}
                                                    className="p-4 text-right text-lg font-bold"
                                                >
                                                    Total Inversión de Orden:
                                                </td>
                                                <td className="p-4 text-right text-lg font-bold">
                                                    $
                                                    {totalOrderCost.toLocaleString(
                                                        'es-CL',
                                                    )}
                                                </td>
                                                {!isContentLocked && <td></td>}
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                        {/* ── Descripción / Detalle General ── */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Detalle General
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">
                                        Descripción de la orden (se puede
                                        actualizar a medida que avanza el
                                        trabajo)
                                    </Label>
                                    <Textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Descripción general del trabajo a realizar..."
                                        rows={5}
                                        readOnly={
                                            isReadOnly ||
                                            data.status === 'Entregado'
                                        }
                                        className={
                                            isReadOnly ||
                                            data.status === 'Entregado'
                                                ? 'resize-none bg-muted/50'
                                                : 'resize-none'
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modal para editar / agregar trabajo externo */}
            <ExternalWorkModal
                isOpen={isExternalModalOpen}
                onClose={() => {
                    setIsExternalModalOpen(false);
                    setEditingWorkIndex(null);
                }}
                initialData={
                    editingWorkIndex !== null
                        ? data.external_works[editingWorkIndex]
                        : null
                }
                onSave={(work) => {
                    const newWorks = [...data.external_works];
                    if (editingWorkIndex !== null) {
                        newWorks[editingWorkIndex] = work;
                    } else {
                        newWorks.push(work);
                    }
                    setData('external_works', newWorks);
                }}
            />

            {/* Modal de solo lectura para visualizar trabajo externo */}
            <ExternalWorkModal
                isOpen={viewingWorkIndex !== null}
                onClose={() => setViewingWorkIndex(null)}
                initialData={
                    viewingWorkIndex !== null
                        ? data.external_works[viewingWorkIndex]
                        : null
                }
                onSave={() => {}}
                isReadOnly={true}
            />

            <Dialog
                open={isWithdrawalModalOpen}
                onOpenChange={setIsWithdrawalModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Información de Retiro</DialogTitle>
                        <DialogDescription>
                            Por favor, complete los datos de la persona que
                            retira el vehículo.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Nombre Completo</Label>
                            <Input
                                value={data.withdrawal_responsible_name}
                                onChange={(e) =>
                                    setData(
                                        'withdrawal_responsible_name',
                                        e.target.value,
                                    )
                                }
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>RUT</Label>
                            <Input
                                value={data.withdrawal_responsible_rut}
                                onChange={(e) =>
                                    setData(
                                        'withdrawal_responsible_rut',
                                        e.target.value,
                                    )
                                }
                                placeholder="12.345.678-9"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsWithdrawalModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                if (
                                    data.withdrawal_responsible_name &&
                                    data.withdrawal_responsible_rut
                                ) {
                                    setIsWithdrawalModalOpen(false);
                                } else {
                                    alert(
                                        'Por favor complete todos los campos',
                                    );
                                }
                            }}
                        >
                            Confirmar Datos
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
