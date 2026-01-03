import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Material } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Box, Download, FileText, History } from 'lucide-react';

interface Log {
    id: number;
    item_name: string;
    serial_number: string;
    inventory_number: string;
    category: string;
    type: string;
    reason: string;
    created_at: string;
    user: { name: string };
    document_path?: string;
}

interface PageProps {
    material: Material;
    logs: Log[];
}

export default function InventoryShow({ material, logs }: PageProps) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Inventario', href: '/inventory' },
                {
                    title: material.product_name,
                    href: `/inventory/${material.id}`,
                },
            ]}
        >
            <Head title={`Detalle: ${material.product_name}`} />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/inventory">
                            <ArrowLeft className="size-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {material.product_name}
                        </h1>
                        <p className="text-muted-foreground">
                            Detalles e Historial de Movimientos
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Material Details Card */}
                    <Card className="h-fit md:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Box className="size-5 text-primary" />
                                Información del Material
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Categoría
                                </h3>
                                <p className="text-sm font-semibold">
                                    {material.category || 'Sin Categoría'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Marca
                                    </h3>
                                    <p className="text-sm">
                                        {material.brand || '-'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Modelo
                                    </h3>
                                    <p className="text-sm">
                                        {material.model || '-'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Código Interno
                                </h3>
                                <div className="mt-1">
                                    {material.code ? (
                                        <Badge
                                            variant="outline"
                                            className="font-mono"
                                        >
                                            {material.code}
                                        </Badge>
                                    ) : (
                                        '-'
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Stock Actual
                                </h3>
                                <div className="mt-1">
                                    <Badge
                                        className={
                                            material.stock_quantity > 0
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
                                        }
                                    >
                                        {material.stock_quantity} unidades
                                    </Badge>
                                </div>
                            </div>
                            {material.document_path && (
                                <div className="border-t pt-4">
                                    <Button
                                        variant="outline"
                                        className="w-full gap-2"
                                        asChild
                                    >
                                        <a
                                            href={`/storage/${material.document_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FileText className="size-4" />
                                            Ver Documento General
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* History Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="size-5 text-primary" />
                                Historial Específico
                            </CardTitle>
                            <CardDescription>
                                Movimientos registrados para este item
                                (Altas/Bajas)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-muted text-muted-foreground">
                                            <tr>
                                                <th className="p-3 font-medium">
                                                    Fecha
                                                </th>
                                                <th className="p-3 font-medium">
                                                    Tipo
                                                </th>
                                                <th className="p-3 font-medium">
                                                    N° Inventario
                                                </th>
                                                <th className="p-3 font-medium">
                                                    S/N Fabricante
                                                </th>
                                                <th className="p-3 font-medium">
                                                    Detalle / Razón
                                                </th>
                                                <th className="p-3 font-medium">
                                                    Usuario
                                                </th>
                                                <th className="p-3 font-medium">
                                                    Doc
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {logs.length > 0 ? (
                                                logs.map((log) => (
                                                    <tr
                                                        key={log.id}
                                                        className="hover:bg-muted/50"
                                                    >
                                                        <td className="p-3">
                                                            {new Date(
                                                                log.created_at,
                                                            ).toLocaleDateString()}
                                                        </td>
                                                        <td className="p-3">
                                                            <Badge
                                                                variant="secondary"
                                                                className={
                                                                    log.type ===
                                                                    'ALTA'
                                                                        ? 'bg-green-100 text-green-600'
                                                                        : 'bg-red-100 text-red-600'
                                                                }
                                                            >
                                                                {log.type}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-3 font-mono text-xs">
                                                            {log.inventory_number ||
                                                                '-'}
                                                        </td>
                                                        <td className="p-3 font-mono text-xs">
                                                            {log.serial_number ||
                                                                '-'}
                                                        </td>
                                                        <td
                                                            className="max-w-[200px] truncate p-3"
                                                            title={log.reason}
                                                        >
                                                            {log.reason || '-'}
                                                        </td>
                                                        <td className="p-3 text-muted-foreground">
                                                            {log.user.name}
                                                        </td>
                                                        <td className="p-3">
                                                            {log.document_path && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6"
                                                                    asChild
                                                                >
                                                                    <a
                                                                        href={`/storage/${log.document_path}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        title="Ver Documento"
                                                                    >
                                                                        <Download className="size-3" />
                                                                    </a>
                                                                </Button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="p-8 text-center text-muted-foreground"
                                                    >
                                                        No hay movimientos
                                                        registrados vinculados a
                                                        este material.
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
        </AppLayout>
    );
}
