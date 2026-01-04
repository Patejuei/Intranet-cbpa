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
import { BreadcrumbItem, Pagination as PaginationType } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehículos',
        href: '/vehicles/status',
    },
    {
        title: 'Checklists',
        href: '/vehicles/checklists',
    },
];

interface Checklist {
    id: number;
    status: string;
    created_at: string;
    vehicle: { name: string; plate: string; company: string };
    user: { name: string };
}

interface Props {
    checklists: PaginationType<Checklist>;
}

export default function IndexChecklist({ checklists }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historial Checklists" />
            <div className="flex flex-1 flex-col gap-8 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Historial de Checklists
                        </h1>
                        <p className="text-muted-foreground">
                            Registro de revisiones preventivas.
                        </p>
                    </div>
                    {/* @ts-ignore */}
                    <Link href="/vehicles/checklists/create">
                        <Button>
                            <Plus className="mr-2 size-4" />
                            Nuevo Checklist
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Registros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Vehículo</TableHead>
                                    <TableHead>Realizado Por</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {checklists.data.map((checklist) => (
                                    <TableRow key={checklist.id}>
                                        <TableCell className="font-medium">
                                            #{checklist.id}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(checklist.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {checklist.vehicle.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {checklist.vehicle.company}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {checklist.user.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    checklist.status ===
                                                    'Completed'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {checklist.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {/* @ts-ignore */}
                                            <Link
                                                href={`/vehicles/checklists/${checklist.id}`}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    Ver Detalles
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {checklists.data.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No hay registros encontrados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
