import MaterialForm from '@/components/inventory/MaterialForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { Material } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Box, Edit, FileText, History } from 'lucide-react';
import { useState } from 'react';

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

interface MaterialHistory {
    id: number;
    type: string; // 'INITIAL', 'ADD', 'REMOVE', 'DELIVERY', 'RECEPTION', 'MAINTENANCE', 'EDIT'
    quantity_change: number;
    current_balance: number;
    description: string;
    reference_type: string;
    reference_id: number;
    created_at: string;
    user: { name: string };
}

interface PageProps {
    material: Material;
    logs: Log[];
    history: MaterialHistory[];
}

export default function InventoryShow({ material, logs, history }: PageProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);

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
                <div className="flex items-center justify-between">
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
                    {/* Botón Editar */}
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Edit className="size-4" /> Editar
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Editar Material</DialogTitle>
                                <DialogDescription>
                                    Modificar detalles del material o ajustar
                                    stock manualmente.
                                </DialogDescription>
                            </DialogHeader>
                            <MaterialForm
                                material={material}
                                onSuccess={() => setIsEditOpen(false)}
                                onCancel={() => setIsEditOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
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
                            <div className="grid grid-cols-2 gap-4">
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
                                        Número de Serie
                                    </h3>
                                    <div className="mt-1">
                                        {material.serial_number ? (
                                            <Badge
                                                variant="outline"
                                                className="font-mono"
                                            >
                                                {material.serial_number}
                                            </Badge>
                                        ) : (
                                            '-'
                                        )}
                                    </div>
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

                    {/* Unified History Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="size-5 text-primary" />
                                Historial de Movimientos Unificado
                            </CardTitle>
                            <CardDescription>
                                Registro completo de Entregas, Recepciones y
                                Ajustes
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
                                                    Cambio
                                                </th>
                                                <th className="p-3 font-medium">
                                                    Descripción
                                                </th>
                                                <th className="p-3 font-medium">
                                                    Usuario
                                                </th>
                                                <th className="p-3 font-medium">
                                                    Ref
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {history.length > 0 ? (
                                                history.map((record) => (
                                                    <tr
                                                        key={record.id}
                                                        className="hover:bg-muted/50"
                                                    >
                                                        <td className="p-3">
                                                            {new Date(
                                                                record.created_at,
                                                            ).toLocaleString()}
                                                        </td>
                                                        <td className="p-3">
                                                            <Badge
                                                                variant={
                                                                    record.type ===
                                                                    'DELIVERY'
                                                                        ? 'outline'
                                                                        : record.type ===
                                                                            'RECEPTION'
                                                                          ? 'outline'
                                                                          : record.type ===
                                                                              'ADD'
                                                                            ? 'secondary'
                                                                            : record.type ===
                                                                                'REMOVE'
                                                                              ? 'destructive'
                                                                              : 'default'
                                                                }
                                                                className={
                                                                    record.type ===
                                                                    'DELIVERY'
                                                                        ? 'bg-blue-50 text-blue-700'
                                                                        : record.type ===
                                                                            'RECEPTION'
                                                                          ? 'bg-green-50 text-green-700'
                                                                          : record.type ===
                                                                              'ADD'
                                                                            ? 'bg-green-100 text-green-700'
                                                                            : record.type ===
                                                                                'REMOVE'
                                                                              ? 'bg-red-100 text-red-700'
                                                                              : ''
                                                                }
                                                            >
                                                                {record.type}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-3 font-medium">
                                                            <span
                                                                className={
                                                                    record.quantity_change >
                                                                    0
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
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
                                                        <td
                                                            className="max-w-[200px] truncate p-3"
                                                            title={
                                                                record.description
                                                            }
                                                        >
                                                            {record.description}
                                                        </td>
                                                        <td className="p-3 text-muted-foreground">
                                                            {record.user
                                                                ?.name || '-'}
                                                        </td>
                                                        <td className="p-3">
                                                            {record.reference_type?.includes(
                                                                'DeliveryCertificate',
                                                            ) && (
                                                                <Link
                                                                    href={`/deliveries/${record.reference_id}`}
                                                                    className="text-blue-500 hover:underline"
                                                                >
                                                                    Acta #
                                                                    {
                                                                        record.reference_id
                                                                    }
                                                                </Link>
                                                            )}
                                                            {record.reference_type?.includes(
                                                                'ReceptionCertificate',
                                                            ) && (
                                                                <Link
                                                                    href={`/receptions/${record.reference_id}`}
                                                                    className="text-blue-500 hover:underline"
                                                                >
                                                                    Acta #
                                                                    {
                                                                        record.reference_id
                                                                    }
                                                                </Link>
                                                            )}
                                                            {record.reference_type?.includes(
                                                                'EquipmentLog',
                                                            ) && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    Manual
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="p-8 text-center text-muted-foreground"
                                                    >
                                                        No hay historial
                                                        unificado disponible.
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
