import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, CheckCircle, Clock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehículos',
        href: '/vehicles/status',
    },
    {
        title: 'Historial Checklists',
        href: '/vehicles/checklists',
    },
];

interface ChecklistDetail {
    id: number;
    status: 'ok' | 'urgent' | 'next_maint';
    notes: string | null;
    item: {
        id: number;
        category: string;
        name: string;
    };
}

interface Checklist {
    id: number;
    status: string;
    created_at: string;
    vehicle: { name: string; plate: string; company: string };
    user: { name: string };
    captain?: { name: string };
    captain_reviewed_at?: string;
    machinist?: { name: string };
    machinist_reviewed_at?: string;
    details: ChecklistDetail[];
    general_observations: string | null;
}

interface Props {
    checklist: Checklist;
    canReview: boolean;
}

export default function ShowChecklist({ checklist, canReview }: Props) {
    const { auth } = usePage().props;

    const groupedDetails = checklist.details.reduce(
        (acc, detail) => {
            const category = detail.item.category;
            if (!acc[category]) acc[category] = [];
            acc[category].push(detail);
            return acc;
        },
        {} as Record<string, ChecklistDetail[]>,
    );

    const handleReview = () => {
        if (confirm('¿Está seguro de visar este checklist?')) {
            // @ts-ignore
            router.post(`/vehicles/checklists/${checklist.id}/review`);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ok':
                return <Badge className="bg-green-500">OK</Badge>;
            case 'next_maint':
                return <Badge className="bg-yellow-500">Próx. Mant.</Badge>;
            case 'urgent':
                return <Badge className="bg-red-500">Urgente</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ok':
                return <CheckCircle className="size-5 text-green-500" />;
            case 'next_maint':
                return <Clock className="size-5 text-yellow-500" />;
            case 'urgent':
                return <AlertCircle className="size-5 text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Checklist #${checklist.id}`} />
            <div className="flex flex-1 flex-col gap-8 p-4">
                <Link
                    href="/vehicles/checklists"
                    className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Volver a la lista
                </Link>

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold">
                            Checklist #{checklist.id}
                            <Badge
                                variant={
                                    checklist.status === 'Completed'
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {checklist.status}
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground">
                            {formatDate(checklist.created_at)} - Realizado por{' '}
                            {checklist.user.name}
                        </p>
                    </div>
                    {canReview && (
                        <Button
                            onClick={handleReview}
                            size="lg"
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="mr-2 size-4" />
                            Visar Checklist
                        </Button>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos del Vehículo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">
                                    Nombre:
                                </span>
                                <span>{checklist.vehicle.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">
                                    Patente:
                                </span>
                                <span>{checklist.vehicle.plate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-muted-foreground">
                                    Compañía:
                                </span>
                                <span>{checklist.vehicle.company}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Estado de Revisión</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded border p-2">
                                <div>
                                    <p className="font-bold">Capitán</p>
                                    <p className="text-xs text-muted-foreground">
                                        {checklist.captain
                                            ? checklist.captain.name
                                            : 'Pendiente'}
                                    </p>
                                </div>
                                {checklist.captain_reviewed_at ? (
                                    <div className="flex items-center gap-1 text-sm text-green-600">
                                        <CheckCircle className="size-4" />
                                        {formatDate(
                                            checklist.captain_reviewed_at,
                                        )}
                                    </div>
                                ) : (
                                    <Badge variant="outline">Pendiente</Badge>
                                )}
                            </div>
                            <div className="flex items-center justify-between rounded border p-2">
                                <div>
                                    <p className="font-bold">Maquinista</p>
                                    <p className="text-xs text-muted-foreground">
                                        {checklist.machinist
                                            ? checklist.machinist.name
                                            : 'Pendiente'}
                                    </p>
                                </div>
                                {checklist.machinist_reviewed_at ? (
                                    <div className="flex items-center gap-1 text-sm text-green-600">
                                        <CheckCircle className="size-4" />
                                        {formatDate(
                                            checklist.machinist_reviewed_at,
                                        )}
                                    </div>
                                ) : (
                                    <Badge variant="outline">Pendiente</Badge>
                                )}
                            </div>

                            {checklist.general_observations && (
                                <div className="rounded-lg border bg-muted/50 p-4">
                                    <h3 className="mb-2 font-medium">
                                        Observaciones Generales
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {checklist.general_observations}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {Object.entries(groupedDetails).map(
                        ([category, details]) => (
                            <Card key={category}>
                                <div className="border-b bg-muted/50 px-6 py-4">
                                    <h3 className="text-lg font-bold">
                                        {category}
                                    </h3>
                                </div>
                                <CardContent className="p-0">
                                    <div className="divide-y">
                                        {details.map((detail) => (
                                            <div
                                                key={detail.id}
                                                className="flex flex-col justify-between gap-4 p-4 md:flex-row md:items-center"
                                            >
                                                <div className="flex-1 font-medium">
                                                    {detail.item.name}
                                                </div>
                                                <div className="flex min-w-[150px] items-center gap-3">
                                                    {getStatusIcon(
                                                        detail.status,
                                                    )}
                                                    {getStatusBadge(
                                                        detail.status,
                                                    )}
                                                </div>
                                                <div className="flex-1 text-sm text-muted-foreground italic">
                                                    {detail.notes ||
                                                        'Sin observaciones'}
                                                </div>
                                                {/* Action Button for creating incident if not OK */}
                                                {detail.status !== 'ok' && (
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={() =>
                                                            alert(
                                                                'Próximamente: Crear Incidencia automática',
                                                            )
                                                        }
                                                    >
                                                        Crear Incidencia
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ),
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
