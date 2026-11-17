import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Clock,
    DollarSign,
    History,
    MapPin,
    Package,
    Tag,
    User,
} from 'lucide-react';

interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    category: 'insumo' | 'repuesto' | 'herramienta';
    stock: number;
    min_stock: number;
    unit_cost: number;
    location: string;
    unit_of_measure: string;
    description: string;
}

interface WorkshopHistory {
    id: number;
    type: string;
    quantity_change: number;
    current_balance: number;
    description: string;
    created_at: string;
    user: { name: string };
}

interface Props {
    item: InventoryItem;
    history: WorkshopHistory[];
}

export default function WorkshopInventoryShow({ item, history }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
        }).format(amount);
    };

    const getMovementBadge = (type: string) => {
        switch (type) {
            case 'ALTA':
            case 'ADD':
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 font-semibold text-[11px]"
                    >
                        {type}
                    </Badge>
                );
            case 'REMOVE':
                return (
                    <Badge
                        variant="outline"
                        className="border-red-500/30 bg-red-500/10 text-red-700 dark:border-red-500/35 dark:bg-red-500/20 dark:text-red-300 font-semibold text-[11px]"
                    >
                        {type}
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="secondary"
                        className="border-border/60 text-muted-foreground font-medium text-[11px]"
                    >
                        {type}
                    </Badge>
                );
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Bodega', href: '/vehicles/inventory' },
                {
                    title: item.name,
                    href: `/vehicles/inventory/${item.id}`,
                },
            ]}
        >
            <Head title={`Detalle: ${item.name}`} />

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
                {/* Back button */}
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-foreground"
                        asChild
                    >
                        <Link href="/vehicles/inventory">
                            <ArrowLeft className="size-4" />
                            <span>Volver a la bodega de repuestos</span>
                        </Link>
                    </Button>
                </div>

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {item.name}
                            </h1>
                            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                SKU: {item.sku || 'S/N'}
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ficha técnica del material, disponibilidad en pañol y trazabilidad histórica.
                        </p>
                    </div>

                    <Button size="sm" asChild className="gap-2 shadow-xs shrink-0">
                        <Link href={`/vehicles/inventory/${item.id}/edit`}>
                            <span>Editar Ítem</span>
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Item Details Card */}
                    <Card className="h-fit rounded-2xl border border-border/70 shadow-xs lg:col-span-1">
                        <CardHeader className="pb-3 pt-5 px-5 sm:px-6">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                                <Package className="size-4 text-primary" />
                                <span>Información General</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 px-5 pb-5 sm:px-6">
                            <div className="flex flex-wrap gap-2">
                                <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1 text-xs">
                                    <Tag className="size-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Categoría:</span>
                                    <span className="font-semibold text-foreground capitalize">{item.category}</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1 text-xs">
                                    <MapPin className="size-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Ubicación:</span>
                                    <span className="font-semibold text-foreground">{item.location || 'Sin asignar'}</span>
                                </div>
                            </div>

                            <div className="rounded-xl border border-border/60 bg-muted/15 p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Stock en Bodega
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Mínimo: {item.min_stock}
                                    </span>
                                </div>
                                <div className="flex items-baseline justify-between">
                                    <span
                                        className={`text-2xl font-bold ${
                                            item.stock <= item.min_stock
                                                ? 'text-destructive dark:text-red-400'
                                                : 'text-foreground'
                                        }`}
                                    >
                                        {item.stock}{' '}
                                        <span className="text-sm font-normal text-muted-foreground">
                                            {item.unit_of_measure || 'unidades'}
                                        </span>
                                    </span>
                                    {item.stock <= item.min_stock ? (
                                        <span className="inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs font-bold text-red-700 dark:text-red-300">
                                            <AlertTriangle className="size-3" />
                                            Bajo Stock
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                            <CheckCircle2 className="size-3" />
                                            Normal
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Costo Unitario
                                </span>
                                <p className="text-lg font-bold text-foreground">
                                    {formatCurrency(item.unit_cost)}
                                </p>
                            </div>

                            {item.description && (
                                <div className="space-y-1 pt-1 border-t border-border/50">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Descripción
                                    </span>
                                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {item.description}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* History Card */}
                    <Card className="rounded-2xl border border-border/70 shadow-xs overflow-hidden lg:col-span-2">
                        <CardHeader className="border-b border-border/60 bg-muted/20 px-5 py-4 sm:px-6">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                                <History className="size-4 text-primary" />
                                <span>Historial de Movimientos y Entregas</span>
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                                Registro cronológico de ingresos, egresos y consumos en taller.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[140px]">Fecha</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead className="text-right">Variación</TableHead>
                                        <TableHead className="text-right">Saldo</TableHead>
                                        <TableHead className="min-w-[180px]">Descripción</TableHead>
                                        <TableHead className="text-right">Usuario</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.length > 0 ? (
                                        history.map((record) => (
                                            <TableRow
                                                key={record.id}
                                                className="transition-colors hover:bg-muted/40"
                                            >
                                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {new Date(record.created_at).toLocaleString('es-CL', {
                                                        dateStyle: 'short',
                                                        timeStyle: 'short',
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    {getMovementBadge(record.type)}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-xs">
                                                    <span
                                                        className={
                                                            record.quantity_change > 0
                                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                                : record.quantity_change < 0
                                                                  ? 'text-red-600 dark:text-red-400'
                                                                  : 'text-muted-foreground'
                                                        }
                                                    >
                                                        {record.quantity_change > 0 ? '+' : ''}
                                                        {record.quantity_change}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-xs font-semibold text-foreground">
                                                    {record.current_balance}
                                                </TableCell>
                                                <TableCell className="text-xs text-foreground" title={record.description}>
                                                    {record.description}
                                                </TableCell>
                                                <TableCell className="text-right text-xs text-muted-foreground">
                                                    {record.user?.name || 'Sistema'}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-28 text-center text-muted-foreground text-xs italic"
                                            >
                                                No se registran movimientos para este ítem en la bitácora de bodega.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}