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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Eye, Plus } from 'lucide-react';

interface Rendition {
    id: number;
    amount: number;
    description: string;
    status:
        | 'draft'
        | 'pending_inspector'
        | 'pending_comandante'
        | 'approved'
        | 'rejected';
    created_at: string;
    user: { name: string };
    inspector?: { name: string };
    comandante?: { name: string };
}

interface Props {
    renditions: {
        data: Rendition[];
        links: any[];
    };
    userRole: string;
    canVisaInspector: boolean;
    canVisaComandante: boolean;
}

export default function PettyCashIndex({
    renditions,
    userRole,
    canVisaInspector,
    canVisaComandante,
}: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Liberado a Pago
                    </Badge>
                );
            case 'pending_inspector':
                return (
                    <Badge
                        variant="outline"
                        className="border-orange-200 text-orange-600"
                    >
                        Pendiente Inspector
                    </Badge>
                );
            case 'pending_comandante':
                return (
                    <Badge
                        variant="outline"
                        className="border-blue-200 text-blue-600"
                    >
                        Pendiente Comandante
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-700 hover:bg-red-100"
                    >
                        Rechazado
                    </Badge>
                );
            default:
                return <Badge variant="secondary">Borrador</Badge>;
        }
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { title: 'Material Mayor', href: '/vehicles/status' },
                { title: 'Caja Chica', href: '/vehicles/petty-cash' },
            ]}
        >
            <Head title="Rendición Caja Chica" />

            <div className="flex flex-1 flex-col gap-8 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Rendición de Caja Chica
                        </h1>
                        <p className="text-muted-foreground">
                            Gestión de gastos menores y aprobaciones.
                        </p>
                    </div>
                    {userRole === 'mechanic' && (
                        <Button asChild>
                            <Link href="/vehicles/petty-cash/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Nueva Rendición
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Historial de Rendiciones</CardTitle>
                        <CardDescription>
                            Revise el estado de sus rendiciones y solicitudes
                            pendientes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Solicitante</TableHead>
                                    <TableHead>Descripción</TableHead>
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
                                            colSpan={6}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No hay rendiciones registradas.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    renditions.data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                {new Date(
                                                    item.created_at,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {item.user.name}
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">
                                                {item.description}
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
                                                        href={`/vehicles/petty-cash/${item.id}`}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Ver Detalles
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
