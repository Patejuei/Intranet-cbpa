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
import { usePermissions } from '@/hooks/use-permissions'; // Added hook
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    FileText,
    Plus,
    Printer,
    Save,
    Trash2,
    Wrench,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

declare var route: any;

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
    const { data, setData, put, processing, errors } = useForm({
        status: maintenance.status,
        tentative_exit_date: maintenance.tentative_exit_date || '',
        tasks: maintenance.tasks.map((t) => ({
            ...t,
            cost: t.cost ? Number(t.cost) : null,
        })) as Task[],
        resolved_issue_ids: [] as number[],
        withdrawal_responsible_name:
            maintenance.withdrawal_responsible_name || '',
        withdrawal_responsible_rut:
            maintenance.withdrawal_responsible_rut || '',
    });

    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

    const [inventoryForm, setInventoryForm] = useState({
        inventory_item_id: '',
        quantity: 1,
    });

    const [isAddingItem, setIsAddingItem] = useState(false);

    const statusOptions = [
        'En Taller',
        'Ingresado',
        'Trabajando',
        'En Espera de Repuestos',
        'Pruebas Finales',
        'Finalizado',
        'Entregado',
    ];

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/vehicles/workshop/${maintenance.id}`);
    };

    const toggleTaskCompletion = (index: number) => {
        const newTasks = [...data.tasks];
        newTasks[index].is_completed = !newTasks[index].is_completed;
        setData('tasks', newTasks);
    };

    const updateTaskCost = (index: number, val: string) => {
        const newTasks = [...data.tasks];
        newTasks[index].cost = val ? parseFloat(val) : null;
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
        } else {
            setData('resolved_issue_ids', [...current, id]);
        }
    };

    const handleAddInventoryItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inventoryForm.inventory_item_id || inventoryForm.quantity < 1)
            return;

        setIsAddingItem(true);
        router.post(
            `/vehicles/maintenance/${maintenance.id}/items`,
            inventoryForm as any,
            {
                onSuccess: () => {
                    setInventoryForm({ inventory_item_id: '', quantity: 1 });
                    setIsAddingItem(false);
                },
                onError: () => setIsAddingItem(false),
                preserveScroll: true,
            },
        );
    };

    const handleRemoveInventoryItem = (itemId: number) => {
        if (confirm('¿Eliminar este ítem de la orden?')) {
            router.delete(
                `/vehicles/maintenance/${maintenance.id}/items/${itemId}`,
                { preserveScroll: true },
            );
        }
    };

    // Calculate totals
    const totalTasksCost = data.tasks.reduce(
        (sum, task) => sum + (task.cost || 0),
        0,
    );
    const totalPartsCost =
        maintenance.items?.reduce(
            (sum, item) => sum + (item.pivot.total_cost || 0),
            0,
        ) || 0;

    const grandTotal = totalTasksCost + totalPartsCost;

    const completedTasks = data.tasks.filter((t) => t.is_completed).length;

    const { auth } = usePage<any>().props;
    const { canEdit: canEditPermission } = usePermissions();
    const canEdit = canEditPermission('vehicles.workshop');
    const isReadOnly = !canEdit;

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
                {/* Header Actions */}
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
                                onClick={handleSubmit}
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
                                    onClick={() => {
                                        if (
                                            confirm(
                                                '¿Está seguro de finalizar el trabajo? Esto resolverá las incidencias marcadas y generará el documento de salida.',
                                            )
                                        ) {
                                            router.put(
                                                `/vehicles/workshop/${maintenance.id}`,
                                                {
                                                    ...data,
                                                    status: 'Finalizado',
                                                } as any,
                                            );
                                        }
                                    }}
                                    disabled={processing}
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
                    {/* Left Column: Details & Status */}
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
                                                // We don't set status yet, or we set it but don't save.
                                                // Let's set it to trigger the UI, but the modal blocks the final save?
                                                // Actually, "Guardar Cambios" is separate.
                                                // If I set it here, the dropdown changes.
                                                // Then the modal appears.
                                                // If they cancel modal, I should revert status?
                                                // For simplicity: Set it. If they cancel, they can change it back.
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
                                        disabled={isReadOnly}
                                    />
                                </div>
                                {/* ... (Separator and Workshop Name remain same) ... */}
                                <Separator />
                                <div className="space-y-2">
                                    <Label>Taller / Proveedor</Label>
                                    <p className="font-medium">
                                        {maintenance.workshop_name}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Detalles del Ingreso Card (Assuming previously here, keeping previous content if existed) */}
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

                                {maintenance.entry_checklist && (
                                    <div className="mt-4">
                                        <Label className="mb-2 block text-xs text-muted-foreground">
                                            Checklist de Recepción (Fallas)
                                        </Label>
                                        <div className="space-y-1 rounded border p-2">
                                            {(() => {
                                                const issues = Object.entries(
                                                    maintenance.entry_checklist,
                                                ).filter(
                                                    ([_, v]) => v === 'Fallas',
                                                );
                                                if (issues.length === 0)
                                                    return (
                                                        <p className="text-xs text-muted-foreground">
                                                            No se reportaron
                                                            fallas en el
                                                            ingreso.
                                                        </p>
                                                    );
                                                return issues.map(([k]) => (
                                                    <div
                                                        key={k}
                                                        className="flex items-center gap-2 text-xs text-red-600"
                                                    >
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        <span>{k}</span>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Linked Incidents */}
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
                                                    isReadOnly ||
                                                    issue.status === 'Resolved'
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

                    {/* Right Column: Tasks Checklist & Inventory */}
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
                                {/* Add Item Form */}
                                {!isReadOnly &&
                                    maintenance.status !== 'Finalizado' && (
                                        <div className="flex items-end gap-2 rounded bg-muted/30 p-4">
                                            <div className="flex-1 space-y-2">
                                                <Label>Item de Bodega</Label>
                                                <Select
                                                    value={inventoryForm.inventory_item_id.toString()}
                                                    onValueChange={(val) =>
                                                        setInventoryForm({
                                                            ...inventoryForm,
                                                            inventory_item_id:
                                                                val,
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
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    value={item.id.toString()}
                                                                >
                                                                    {item.name}{' '}
                                                                    ({item.sku})
                                                                    - Stock:{' '}
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
                                                    value={
                                                        inventoryForm.quantity
                                                    }
                                                    onChange={(e) =>
                                                        setInventoryForm({
                                                            ...inventoryForm,
                                                            quantity:
                                                                parseInt(
                                                                    e.target
                                                                        .value,
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

                                {/* Items List */}
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
                                                {!isReadOnly && (
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
                                                            {!isReadOnly && (
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
                                                {!isReadOnly && <td></td>}
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>
                                    Lista de Trabajos (Mano de Obra)
                                </CardTitle>
                                <Badge variant="outline" className="text-base">
                                    Progreso: {completedTasks} /{' '}
                                    {data.tasks.length}
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>
                                        Descripción General / Observaciones
                                    </Label>
                                    <p className="min-h-[60px] rounded border bg-muted p-3 text-sm text-muted-foreground">
                                        {maintenance.description ||
                                            'Sin observaciones generales.'}
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-semibold">
                                            Tareas Específicas
                                        </Label>
                                        {!isReadOnly && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={addTask}
                                                type="button"
                                            >
                                                + Agregar Tarea
                                            </Button>
                                        )}
                                    </div>

                                    {data.tasks.length === 0 && (
                                        <p className="rounded border-2 border-dashed py-8 text-center text-muted-foreground">
                                            No hay tareas registradas. Agrega
                                            una para comenzar el seguimiento.
                                        </p>
                                    )}

                                    {data.tasks.map((task, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col items-start gap-3 rounded border bg-card p-3 transition-colors hover:bg-accent/5 md:flex-row md:items-center"
                                        >
                                            <Checkbox
                                                checked={task.is_completed}
                                                onCheckedChange={() =>
                                                    toggleTaskCompletion(index)
                                                }
                                                disabled={isReadOnly}
                                                className="mt-1 md:mt-0"
                                            />
                                            <div className="w-full flex-1 space-y-2 md:flex md:gap-4 md:space-y-0">
                                                <Input
                                                    value={task.description}
                                                    onChange={(e) =>
                                                        updateTaskDescription(
                                                            index,
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Descripción de la tarea"
                                                    disabled={isReadOnly}
                                                    className={
                                                        task.is_completed
                                                            ? 'text-muted-foreground line-through'
                                                            : ''
                                                    }
                                                />
                                                <div className="flex w-full items-center gap-2 md:w-32">
                                                    <span className="text-sm font-semibold text-muted-foreground">
                                                        $
                                                    </span>
                                                    <Input
                                                        type="number"
                                                        value={task.cost ?? ''}
                                                        onChange={(e) =>
                                                            updateTaskCost(
                                                                index,
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Costo"
                                                        disabled={isReadOnly}
                                                    />
                                                </div>
                                            </div>
                                            {!isReadOnly && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:bg-destructive/10"
                                                    onClick={() =>
                                                        removeTask(index)
                                                    }
                                                    type="button"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex items-center justify-end gap-4 text-muted-foreground">
                                        <span className="text-sm">
                                            Total Mano de Obra:
                                        </span>
                                        <span className="font-semibold">
                                            $
                                            {totalTasksCost.toLocaleString(
                                                'es-CL',
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-end gap-4 text-muted-foreground">
                                        <span className="text-sm">
                                            Total Repuestos:
                                        </span>
                                        <span className="font-semibold">
                                            $
                                            {totalPartsCost.toLocaleString(
                                                'es-CL',
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-end gap-4 border-t pt-2">
                                        <span className="text-lg font-bold">
                                            Costo Total Estimado:
                                        </span>
                                        <span className="text-2xl font-bold text-primary">
                                            $
                                            {grandTotal.toLocaleString('es-CL')}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Dialog
                    open={isWithdrawalModalOpen}
                    onOpenChange={setIsWithdrawalModalOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Confirmar Entrega de Unidad
                            </DialogTitle>
                            <DialogDescription>
                                Para registrar la salida, por favor ingrese los
                                datos de quien retira el vehículo.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nombre Responsable Retiro</Label>
                                <Input
                                    value={data.withdrawal_responsible_name}
                                    onChange={(e) =>
                                        setData(
                                            'withdrawal_responsible_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ej: Tte. Juan Perez"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>RUT Responsable</Label>
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
                                    setIsWithdrawalModalOpen(false);
                                }}
                            >
                                Confirmar Datos
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
