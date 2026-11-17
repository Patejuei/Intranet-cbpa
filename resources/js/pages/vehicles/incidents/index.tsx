
import { ExportIncidentsDialog } from '@/components/vehicles/export-incidents-dialog';
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
import Pagination from '@/components/Pagination';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Eye, FileSpreadsheet, Image as ImageIcon, Plus } from 'lucide-react';
import { useState } from 'react';

interface Vehicle {
    id: number;
    name: string;
    company?: string | null;
}

interface Issue {
    id: number;
    vehicle: Vehicle;
    reporter: { name: string };
    description: string;
    severity: string;
    is_stopped: boolean;
    status: string;
    date: string;
    created_at: string;
    reviewed_at?: string;
    reviewed_by?: number;
    sent_to_hq: boolean;
    sent_to_workshop: boolean;
    workshop_read_at?: string;
    hq_read_at?: string;
    reported_to_commander: boolean;
    commander_seen: boolean;
    images_count?: number;
}

export default function VehicleIncidents({
    issues,
    vehicles,
}: {
    issues: any;
    vehicles: Vehicle[];
}) {
    const { canCreate } = usePermissions();
    const [reportModalOpen, setReportModalOpen] = useState(false);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical':
                return 'destructive';
            case 'High':
                return 'destructive';
            case 'Medium':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Incidencias', href: '/vehicles/incidents' },
            ]}
        >
            <Head title="Registro de Incidencias" />
            <div className="mx-auto flex h-full w-full flex-1 flex-col gap-6 p-4 sm:p-6 max-w-7xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Registro de Incidencias
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Reporte y seguimiento de novedades mecánicas de la flota.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Button
                            variant="outline"
                            onClick={() => setReportModalOpen(true)}
                        >
                            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
                            Reporte Excel
                        </Button>
                        {canCreate('vehicles.incidents') && (
                            <Button asChild>
                                <Link href="/vehicles/incidents/create">
                                    <Plus className="mr-2 size-4" />
                                    Nueva Incidencia
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <Card className="rounded-2xl border border-border/70 bg-card shadow-xs overflow-hidden">
                    <CardHeader className="px-5 sm:px-6 py-4 border-b border-border/50 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold text-foreground">Listado de Novedades</CardTitle>
                        <Badge variant="outline" className="border-border/60 text-xs font-normal">
                            {issues.total ?? issues.data.length} registros
                        </Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-border/60 bg-muted/20">
                                        <TableHead className="w-28">Fecha</TableHead>
                                        <TableHead>Unidad</TableHead>
                                        <TableHead>Gravedad</TableHead>
                                        <TableHead className="min-w-[280px]">Descripción</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Reportado Por</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {issues.data.map((issue: Issue) => (
                                        <TableRow
                                            key={issue.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <TableCell className="font-mono text-xs">
                                                {issue.date}
                                            </TableCell>
                                            <TableCell className="font-bold text-sm text-foreground">
                                                {issue.vehicle.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        getSeverityColor(
                                                            issue.severity,
                                                        ) as any
                                                    }
                                                    className="font-semibold text-xs"
                                                >
                                                    {issue.severity}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 whitespace-pre-line text-sm text-foreground">
                                                    <span>{issue.description}</span>
                                                    {issue.images_count ? issue.images_count > 0 ? (
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                                                            <ImageIcon className="size-3.5 text-primary" />
                                                            <span>{issue.images_count} {issue.images_count === 1 ? 'imagen' : 'imágenes'}</span>
                                                        </div>
                                                    ) : null : null}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1.5">
                                                    {issue.status === 'Resolved' ? (
                                                        <span className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                                                            Resuelto
                                                        </span>
                                                    ) : issue.status === 'En Taller' ? (
                                                        <span className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                                                            En Taller
                                                        </span>
                                                    ) : !issue.reviewed_at ? (
                                                        <span className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                                                            Pendiente Revisión
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
                                                            Revisado
                                                        </span>
                                                    )}
                                                    {issue.is_stopped && (
                                                        <span className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
                                                            Detenido
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {issue.reporter?.name ||
                                                    'Desconocido'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    asChild
                                                    className="text-xs hover:text-primary transition-colors"
                                                >
                                                    <Link href={`/vehicles/incidents/${issue.id}`}>
                                                        <Eye className="mr-1.5 size-3.5" /> Ver
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {issues.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="h-28 text-center text-sm text-muted-foreground"
                                            >
                                                No hay incidencias registradas.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
                <Pagination links={issues.links} />

                <ExportIncidentsDialog
                    open={reportModalOpen}
                    onOpenChange={setReportModalOpen}
                    vehicles={vehicles}
                />
            </div>
        </AppLayout>
    );
}
