import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, Download, Eye, Plus } from 'lucide-react';
import { useState } from 'react';

interface Rendition {
    id: number;
    amount: number;
    description: string;
    invoice_number: string;
    supplier_rut: string;
    expense_type: string;
    status: 'pending_validation' | 'rendido' | 'rejected';
    created_at: string;
    invoice_date: string;
    user: { name: string };
    vehicle?: { name: string; company: string };
}

interface Props {
    renditions: {
        data: Rendition[];
        links: any[];
    };
    userRole: string;
}

export default function RenditionIndex({ renditions, userRole }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

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
        if (selectedIds.length === 0) return;
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/vehicles/renditions/export';
        // Add CSRF token
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

        selectedIds.forEach((id) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'ids[]';
            input.value = id.toString();
            form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    const handleBatchValidate = () => {
        if (selectedIds.length === 0) return;
        if (
            !confirm(
                `¿Está seguro de validar ${selectedIds.length} rendiciones seleccionadas? Esto las marcará como Rendidas.`,
            )
        )
            return;

        router.post(
            '/vehicles/renditions/validate-batch',
            {
                ids: selectedIds,
                action: 'validate',
            },
            {
                onSuccess: () => {
                    setSelectedIds([]);
                },
            },
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'rendido':
                return (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Rendido
                    </Badge>
                );
            case 'pending_validation':
                return (
                    <Badge
                        variant="outline"
                        className="border-orange-200 text-orange-600"
                    >
                        Pendiente Validación
                    </Badge>
                );
            case 'rejected':
                return <Badge variant="destructive">Rechazado</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
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

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { title: 'Material Mayor', href: '/vehicles/status' },
                {
                    title: 'Rendiciones',
                    href: '/vehicles/renditions',
                },
            ]}
        >
            <Head title="Rendiciones" />

            <div className="flex flex-1 flex-col gap-8 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Rendiciones y Gastos
                        </h1>
                        <p className="text-muted-foreground">
                            Gestión de facturas, boletas y rendiciones de
                            taller.
                        </p>
                    </div>
                    {(userRole === 'secretaria_adquisiciones' ||
                        userRole === 'admin') && (
                        <Button asChild>
                            <Link href="/vehicles/renditions/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Nueva Rendición
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    {(userRole === 'secretaria_compras' ||
                        userRole === 'admin') && (
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleBatchValidate}
                            disabled={selectedIds.length === 0}
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Validar ({selectedIds.length})
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        disabled={selectedIds.length === 0}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Exportar Excel ({selectedIds.length})
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Historial de Rendiciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={
                                                renditions.data.length > 0 &&
                                                selectedIds.length ===
                                                    renditions.data.length
                                            }
                                            onCheckedChange={(val) =>
                                                handleSelectAll(!!val)
                                            }
                                        />
                                    </TableHead>
                                    <TableHead>Fecha Factura</TableHead>
                                    <TableHead>Concepto</TableHead>
                                    <TableHead>Nº Doc</TableHead>
                                    <TableHead>Proveedor</TableHead>
                                    <TableHead>Dependencia</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renditions.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={10}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No hay rendiciones registradas.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    renditions.data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.includes(
                                                        item.id,
                                                    )}
                                                    onCheckedChange={(val) =>
                                                        handleSelect(
                                                            item.id,
                                                            !!val,
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    item.invoice_date,
                                                ).toLocaleDateString('es-CL', {
                                                    timeZone: 'UTC',
                                                })}
                                            </TableCell>
                                            <TableCell
                                                className="max-w-[200px] truncate"
                                                title={item.description}
                                            >
                                                {item.description}
                                            </TableCell>
                                            <TableCell>
                                                {item.invoice_number}
                                            </TableCell>
                                            <TableCell>
                                                {item.supplier_rut}
                                            </TableCell>
                                            <TableCell>
                                                {item.vehicle
                                                    ? `${item.vehicle.name} (${item.vehicle.company})`
                                                    : 'Taller / General'}
                                            </TableCell>
                                            <TableCell>
                                                {getExpenseLabel(
                                                    item.expense_type,
                                                )}
                                            </TableCell>
                                            <TableCell className="font-mono">
                                                {formatCurrency(item.amount)}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(item.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/vehicles/renditions/${item.id}`}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Ver
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
            </div>
        </AuthenticatedLayout>
    );
}
