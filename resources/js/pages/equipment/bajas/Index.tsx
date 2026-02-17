import Pagination from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { SharedData, User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Eye, PlusCircle } from 'lucide-react';

interface MaterialBajaRequest {
    id: number;
    user: User;
    material: {
        product_name: string;
        code: string;
    };
    quantity: number;
    reason: string;
    status:
        | 'PENDIENTE'
        | 'VALIDADO'
        | 'APROBADO'
        | 'RECHAZADO'
        | 'EN_REPARACION';
    created_at: string;
}

interface Props extends SharedData {
    requests: {
        data: MaterialBajaRequest[];
        links: any[];
    };
}

export default function IndexBajas({ auth, requests }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDIENTE':
                return (
                    <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    >
                        Pendiente
                    </Badge>
                );
            case 'VALIDADO':
                return (
                    <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                    >
                        Validado
                    </Badge>
                );
            case 'APROBADO':
                return (
                    <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 hover:bg-green-100"
                    >
                        Aprobado
                    </Badge>
                );
            case 'RECHAZADO':
                return (
                    <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800 hover:bg-red-100"
                    >
                        Rechazado
                    </Badge>
                );
            case 'EN_REPARACION':
                return (
                    <Badge
                        variant="outline"
                        className="bg-orange-100 text-orange-800 hover:bg-orange-100"
                    >
                        En Reparación
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Equipamiento', href: '/equipment' },
                { title: 'Solicitudes de Baja', href: '/equipment/bajas' },
            ]}
        >
            <Head title="Solicitudes de Baja" />

            <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Solicitudes de Baja
                        </h2>
                        <p className="text-muted-foreground">
                            Gestión y seguimiento de bajas de material menor.
                        </p>
                    </div>
                    {(auth.user.role === 'capitan' ||
                        auth.user.role === 'admin') && (
                        <Button asChild>
                            <Link href="/equipment/bajas/create">
                                <PlusCircle className="mr-2 size-4" />
                                Nueva Solicitud
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Historial de Solicitudes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            ID
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Fecha
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Solicitante
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Material
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Cant.
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Estado
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {requests.data.length > 0 ? (
                                        requests.data.map((req) => (
                                            <tr
                                                key={req.id}
                                                className="hover:bg-muted/30"
                                            >
                                                <td className="px-4 py-3 font-mono">
                                                    #{req.id}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {new Date(
                                                        req.created_at,
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span>
                                                            {req.user.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {req.user.company ||
                                                                'Sin Compañía'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {
                                                                req.material
                                                                    .product_name
                                                            }
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {req.material.code}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {req.quantity}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {getStatusBadge(req.status)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/equipment/bajas/${req.id}`}
                                                        >
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="px-4 py-8 text-center text-muted-foreground"
                                            >
                                                No hay solicitudes registradas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4">
                            <Pagination links={requests.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
