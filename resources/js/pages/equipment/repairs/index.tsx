import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
// import { route } from 'ziggy-js';

export default function RepairRequestsIndex({ requests }: { requests: any[] }) {
    const { canCreate } = usePermissions();
    const { auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Reparaciones',
            href: '/repairs',
        },
    ];

    const filteredRequests = requests.filter((request) =>
        request.material?.product_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            case 'RECEIVED_BY_INSPECTOR':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            case 'APPROVED':
                return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'REJECTED':
                return 'bg-red-100 text-red-800 hover:bg-red-100';
            case 'SENT_TO_PROVIDER':
                return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
            case 'FINISHED':
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'Solicitado';
            case 'RECEIVED_BY_INSPECTOR':
                return 'Recepcionado';
            case 'APPROVED':
                return 'Aprobado';
            case 'REJECTED':
                return 'Rechazado';
            case 'SENT_TO_PROVIDER':
                return 'En Taller';
            case 'FINISHED':
                return 'Finalizado';
            default:
                return status;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reparaciones" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Historial de Solicitudes</CardTitle>
                            {canCreate('equipment') && (
                                <Button asChild>
                                    <Link href="/repairs/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Nueva Solicitud
                                    </Link>
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex items-center gap-2">
                                <Search className="h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Buscar por material..."
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Material</TableHead>
                                            <TableHead>Solicitante</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Inspector</TableHead>
                                            <TableHead className="text-right">
                                                Acciones
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRequests.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={6}
                                                    className="h-24 text-center"
                                                >
                                                    No hay solicitudes
                                                    registradas.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredRequests.map((request) => (
                                                <TableRow key={request.id}>
                                                    <TableCell>
                                                        {formatDate(
                                                            request.created_at,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {request.material
                                                            ?.product_name ||
                                                            'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {request.requester
                                                            ?.name || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="secondary"
                                                            className={getStatusColor(
                                                                request.status,
                                                            )}
                                                        >
                                                            {getStatusLabel(
                                                                request.status,
                                                            )}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {request.inspector
                                                            ?.name || '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/repairs/${request.id}`}
                                                            >
                                                                Ver Detalles
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
