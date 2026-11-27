import ActionOtpVerificationModal from '@/components/action-otp-verification-modal';
import Pagination from '@/components/Pagination';
import { SortableTableHead } from '@/components/SortableTableHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useOtpAction } from '@/hooks/use-otp-action';
import { useTableFilters } from '@/hooks/use-table-filters';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, Download, Eye, Plus, Receipt, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface Rendition {
    id: number;
    amount: number;
    description: string;
    invoice_number: string;
    supplier_rut: string;
    expense_type: string;
    status: 'pending_inspector' | 'pending_secretary' | 'approved' | 'rejected';
    created_at: string;
    invoice_date: string;
    user: { name: string };
    vehicle?: { name: string; company: string };
}

interface RenditionFilters {
    [key: string]: string | undefined;
    status?: string;
    expense_type?: string;
    description?: string;
    invoice_number?: string;
    supplier_rut?: string;
    vehicle?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

interface Props {
    renditions: {
        data: Rendition[];
        links: any[];
        total?: number;
    };
    userRole: string;
    userDepartment: string;
    filters?: RenditionFilters;
}

const emptyRenditionFilters: RenditionFilters = {
    status: 'all',
    expense_type: 'all',
    description: '',
    invoice_number: '',
    supplier_rut: '',
    vehicle: '',
    sort: undefined,
    direction: undefined,
};

export default function RenditionIndex({
    renditions,
    userRole,
    userDepartment,
    filters: initialFilters = {},
}: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const { isOtpModalOpen, performWithOtp, handleVerified, closeOtpModal } = useOtpAction();

    const { filters, setFilter, setSort, clearFilters, hasActiveFilters } =
        useTableFilters<RenditionFilters>('/vehicles/renditions', {
            status: initialFilters.status || 'all',
            expense_type: initialFilters.expense_type || 'all',
            description: initialFilters.description || '',
            invoice_number: initialFilters.invoice_number || '',
            supplier_rut: initialFilters.supplier_rut || '',
            vehicle: initialFilters.vehicle || '',
            sort: initialFilters.sort,
            direction: initialFilters.direction,
        });

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(renditions.data.map((r) => r.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter((sid) => sid !== id));
        }
    };

    const handleExport = () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/vehicles/renditions/export';

        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');
        if (token) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = '_token';
            input.value = token;
            form.appendChild(input);
        }

        if (filters.expense_type && filters.expense_type !== 'all') {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'expense_type';
            input.value = filters.expense_type;
            form.appendChild(input);
        }

        if (selectedIds.length > 0) {
            selectedIds.forEach((id) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'ids[]';
                input.value = id.toString();
                form.appendChild(input);
            });
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    const handleBatchValidate = () => {
        if (selectedIds.length === 0) return;
        if (
            !confirm(
                `¿Está seguro de aprobar ${selectedIds.length} rendiciones seleccionadas?`,
            )
        )
            return;

        performWithOtp(() => {
            router.post(
                '/vehicles/renditions/review-batch',
                {
                    ids: selectedIds,
                    action: 'approve',
                },
                {
                    onSuccess: () => {
                        setSelectedIds([]);
                    },
                },
            );
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending_inspector':
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 font-medium text-[11px]"
                    >
                        Pendiente Inspector
                    </Badge>
                );
            case 'pending_secretary':
                return (
                    <Badge
                        variant="outline"
                        className="border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300 font-medium text-[11px]"
                    >
                        Pendiente Secretaria
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 font-semibold text-[11px]"
                    >
                        Aprobado
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge
                        variant="outline"
                        className="border-red-500/30 bg-red-500/10 text-red-700 dark:border-red-500/35 dark:bg-red-500/20 dark:text-red-300 font-semibold text-[11px]"
                    >
                        Rechazado
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary" className="text-[11px]">
                        {status}
                    </Badge>
                );
        }
    };

    const getExpenseLabel = (type: string) => {
        const map: Record<string, string> = {
            repair_supplies: 'Insumos Reparación',
            spare_parts: 'Repuestos',
            tools: 'Herramientas',
            other_tools: 'Otras Herramientas',
        };
        return map[type] || type;
    };

    const canBatchApprove =
        userRole === 'admin' ||
        (userRole === 'inspector' && (userDepartment || '').trim() === 'Material Mayor') ||
        userRole === 'secretaria_adquisiciones';

    const getBatchButtonLabel = () => {
        if (userRole === 'secretaria_adquisiciones') {
            return 'Validar Seleccionados';
        }
        return 'Aprobar Seleccionados';
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                {
                    title: 'Rendiciones',
                    href: '/vehicles/renditions',
                },
            ]}
        >
            <Head title="Rendiciones y Gastos" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Rendiciones y Gastos
                            </h1>
                            <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                {renditions.total ?? renditions.data.length} registros
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Gestión, validación y trazabilidad de facturas, boletas y rendiciones del taller institucional.
                        </p>
                    </div>

                    {(userRole === 'mechanic' || userRole === 'admin') && (
                        <Button asChild className="gap-2 shadow-xs shrink-0">
                            <Link href="/vehicles/renditions/create">
                                <Plus className="size-4" />
                                <span>Nueva Rendición</span>
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Filter and Actions Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="w-full sm:w-[240px]">
                            <Select
                                value={filters.expense_type || 'all'}
                                onValueChange={(value) =>
                                    setFilter('expense_type', value)
                                }
                            >
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="Tipo de Gasto" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los gastos</SelectItem>
                                    <SelectItem value="repair_supplies">Insumos Reparación</SelectItem>
                                    <SelectItem value="spare_parts">Repuestos</SelectItem>
                                    <SelectItem value="tools">Herramientas</SelectItem>
                                    <SelectItem value="other_tools">Otras Herramientas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => clearFilters(emptyRenditionFilters)}
                                className="gap-1.5 shrink-0"
                            >
                                <RotateCcw className="size-3.5" />
                                <span>Limpiar filtros</span>
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {canBatchApprove && (
                            <Button
                                size="sm"
                                className="gap-2 shadow-xs"
                                onClick={handleBatchValidate}
                                disabled={selectedIds.length === 0}
                            >
                                <CheckCircle2 className="size-4" />
                                <span>{getBatchButtonLabel()} ({selectedIds.length})</span>
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 shadow-xs"
                            onClick={handleExport}
                        >
                            <Download className="size-4" />
                            <span>Exportar Excel {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <Card className="rounded-2xl border border-border/70 shadow-xs overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[45px]">
                                        <Checkbox
                                            checked={
                                                renditions.data.length > 0 &&
                                                selectedIds.length === renditions.data.length
                                            }
                                            onCheckedChange={(val) =>
                                                handleSelectAll(!!val)
                                            }
                                            aria-label="Seleccionar todo"
                                        />
                                    </TableHead>
                                    <SortableTableHead
                                        column="invoice_date"
                                        label="Fecha Doc."
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        className="w-[110px]"
                                    />
                                    <SortableTableHead
                                        column="description"
                                        label="Concepto"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.description}
                                        filterPlaceholder="Filtrar por concepto..."
                                        onFilterChange={(value) =>
                                            setFilter('description', value)
                                        }
                                        className="min-w-[180px]"
                                    />
                                    <SortableTableHead
                                        column="invoice_number"
                                        label="Nº Factura"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.invoice_number}
                                        filterPlaceholder="Filtrar por factura..."
                                        onFilterChange={(value) =>
                                            setFilter('invoice_number', value)
                                        }
                                    />
                                    <SortableTableHead
                                        column="supplier_rut"
                                        label="Proveedor (RUT)"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.supplier_rut}
                                        filterPlaceholder="Filtrar por RUT..."
                                        onFilterChange={(value) =>
                                            setFilter('supplier_rut', value)
                                        }
                                    />
                                    <SortableTableHead
                                        column="vehicle"
                                        label="Destino / Carro"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.vehicle}
                                        filterPlaceholder="Filtrar por carro..."
                                        onFilterChange={(value) =>
                                            setFilter('vehicle', value)
                                        }
                                    />
                                    <SortableTableHead
                                        column="expense_type"
                                        label="Tipo"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="select"
                                        filterValue={filters.expense_type}
                                        filterOptions={[
                                            {
                                                value: 'repair_supplies',
                                                label: 'Insumos Reparación',
                                            },
                                            {
                                                value: 'spare_parts',
                                                label: 'Repuestos',
                                            },
                                            {
                                                value: 'tools',
                                                label: 'Herramientas',
                                            },
                                            {
                                                value: 'other_tools',
                                                label: 'Otras Herramientas',
                                            },
                                        ]}
                                        onFilterChange={(value) =>
                                            setFilter('expense_type', value)
                                        }
                                    />
                                    <SortableTableHead
                                        column="amount"
                                        label="Monto"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        align="right"
                                    />
                                    <SortableTableHead
                                        column="status"
                                        label="Estado"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="select"
                                        filterValue={filters.status}
                                        filterOptions={[
                                            {
                                                value: 'pending_inspector',
                                                label: 'Pendiente Inspector',
                                            },
                                            {
                                                value: 'pending_secretary',
                                                label: 'Pendiente Secretaria',
                                            },
                                            {
                                                value: 'approved',
                                                label: 'Aprobado',
                                            },
                                            {
                                                value: 'rejected',
                                                label: 'Rechazado',
                                            },
                                        ]}
                                        onFilterChange={(value) =>
                                            setFilter('status', value)
                                        }
                                    />
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renditions.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={10}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Receipt className="size-8 text-muted-foreground/40" />
                                                <p className="text-sm font-medium">No hay rendiciones registradas.</p>
                                                <p className="text-xs text-muted-foreground/70">
                                                    Las compras y rendiciones ingresadas por taller aparecerán aquí.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    renditions.data.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="transition-colors hover:bg-muted/40"
                                        >
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.includes(item.id)}
                                                    onCheckedChange={(val) =>
                                                        handleSelect(item.id, !!val)
                                                    }
                                                    aria-label={`Seleccionar rendición #${item.id}`}
                                                />
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                {new Date(item.invoice_date).toLocaleDateString('es-CL', {
                                                    timeZone: 'UTC',
                                                    dateStyle: 'short',
                                                })}
                                            </TableCell>
                                            <TableCell className="font-medium text-foreground">
                                                <Link
                                                    href={`/vehicles/renditions/${item.id}`}
                                                    className="hover:text-primary transition-colors line-clamp-1"
                                                    title={item.description}
                                                >
                                                    {item.description}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                                                #{item.invoice_number}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {item.supplier_rut}
                                            </TableCell>
                                            <TableCell className="text-xs font-medium text-foreground">
                                                {item.vehicle
                                                    ? `${item.vehicle.name} (${item.vehicle.company})`
                                                    : 'Taller / General'}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {getExpenseLabel(item.expense_type)}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-xs font-bold text-foreground">
                                                {formatCurrency(item.amount)}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(item.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 gap-1.5 hover:text-primary"
                                                    asChild
                                                >
                                                    <Link href={`/vehicles/renditions/${item.id}`}>
                                                        <Eye className="size-3.5" />
                                                        <span>Ver</span>
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Pagination links={renditions.links} />

                <ActionOtpVerificationModal
                    isOpen={isOtpModalOpen}
                    onClose={closeOtpModal}
                    onVerified={handleVerified}
                />
            </div>
        </AuthenticatedLayout>
    );
}