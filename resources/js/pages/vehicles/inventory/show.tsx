import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, History, Package } from 'lucide-react';

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

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { title: 'Material Mayor', href: '/vehicles/status' },
                { title: 'Bodega', href: '/vehicles/inventory' },
                {
                    title: item.name,
                    href: `/vehicles/inventory/${item.id}`,
                },
            ]}
        >
            <Head title={`Detalle: ${item.name}`} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/vehicles/inventory">
                                <ArrowLeft className="size-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {item.name}
                            </h1>
                            <p className="text-muted-foreground">
                                Trazabilidad e historial de cambios
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Item Details Card */}
                    <Card className="h-fit md:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Package className="size-5 text-primary" />
                                Información del Ítem
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    Categoría
                                </h3>
                                <Badge
                                    variant="outline"
                                    className="mt-1 capitalize"
                                >
                                    {item.category}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        SKU
                                    </h3>
                                    <p className="mt-0.5 font-mono text-sm">
                                        {item.sku || '-'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        Ubicación
                                    </h3>
                                    <p className="mt-0.5 text-sm">
                                        {item.location || '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        Stock Actual
                                    </h3>
                                    <div className="mt-0.5 flex flex-col">
                                        <span
                                            className={`text-sm font-bold ${item.stock <= item.min_stock ? 'text-red-500' : 'text-green-600'}`}
                                        >
                                            {item.stock}{' '}
                                            {item.unit_of_measure || 'Unidades'}
                                        </span>
                                        {item.stock <= item.min_stock && (
                                            <span className="text-[10px] font-medium text-red-400">
                                                Bajo Stock Crítico
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        Stock Mínimo
                                    </h3>
                                    <p className="mt-0.5 text-sm">
                                        {item.min_stock}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    Costo Unitario
                                </h3>
                                <p className="mt-0.5 text-sm font-medium">
                                    {formatCurrency(item.unit_cost)}
                                </p>
                            </div>
                            {item.description && (
                                <div>
                                    <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        Descripción
                                    </h3>
                                    <p className="mt-0.5 text-sm whitespace-pre-line text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* History Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <History className="size-5 text-primary" />
                                Historial de Cambios
                            </CardTitle>
                            <CardDescription>
                                Registro cronológico de movimientos y
                                modificaciones
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-md border">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b bg-muted/50 text-muted-foreground">
                                            <tr>
                                                <th className="p-3 font-medium">
                                                    Fecha
                                                </th>
                                                <th className="p-3 font-medium">
                                                    Tipo
                                                </th>
                                                <th className="p-3 text-right font-medium">
                                                    Variación
                                                </th>
                                                <th className="p-3 text-right font-medium">
                                                    Saldo
                                                </th>
                                                <th className="p-3 font-medium">
                                                    Descripción
                                                </th>
                                                <th className="p-3 text-right font-medium">
                                                    Usuario
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {history.length > 0 ? (
                                                history.map((record) => (
                                                    <tr
                                                        key={record.id}
                                                        className="transition-colors hover:bg-muted/30"
                                                    >
                                                        <td className="p-3 whitespace-nowrap text-muted-foreground">
                                                            {new Date(
                                                                record.created_at,
                                                            ).toLocaleString(
                                                                'es-CL',
                                                                {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="p-3">
                                                            <Badge
                                                                variant="outline"
                                                                className={
                                                                    record.type ===
                                                                    'ALTA'
                                                                        ? 'border-blue-200 bg-blue-50 text-blue-700'
                                                                        : record.type ===
                                                                            'ADD'
                                                                          ? 'border-green-200 bg-green-50 text-green-700'
                                                                          : record.type ===
                                                                              'REMOVE'
                                                                            ? 'border-red-200 bg-red-50 text-red-700'
                                                                            : 'border-slate-200 bg-slate-50 text-slate-700'
                                                                }
                                                            >
                                                                {record.type}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-3 text-right font-medium">
                                                            <span
                                                                className={
                                                                    record.quantity_change >
                                                                    0
                                                                        ? 'text-green-600'
                                                                        : record.quantity_change <
                                                                            0
                                                                          ? 'text-red-600'
                                                                          : 'text-muted-foreground'
                                                                }
                                                            >
                                                                {record.quantity_change >
                                                                0
                                                                    ? '+'
                                                                    : ''}
                                                                {
                                                                    record.quantity_change
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="p-3 text-right font-mono text-xs">
                                                            {
                                                                record.current_balance
                                                            }
                                                        </td>
                                                        <td
                                                            className="max-w-[250px] p-3"
                                                            title={
                                                                record.description
                                                            }
                                                        >
                                                            {record.description}
                                                        </td>
                                                        <td className="p-3 text-right text-xs text-muted-foreground">
                                                            {record.user
                                                                ?.name ||
                                                                'Sistema'}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="p-8 text-center text-muted-foreground italic"
                                                    >
                                                        No se registra historial
                                                        para este ítem.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
