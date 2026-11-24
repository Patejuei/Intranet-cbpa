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
import { Firefighter } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Calendar,
    FileText,
    Flame,
    Hash,
    IdCard,
    Mail,
    Package,
    Pencil,
    Shield,
    User,
} from 'lucide-react';
import React from 'react';

interface AssignedMaterialItem {
    id: number;
    firefighter_id: number;
    material_id: number;
    created_at: string;
    material?: {
        id: number;
        product_name: string;
        code?: string | null;
        brand?: string | null;
        model?: string | null;
        dependency?: string | null;
    };
}

interface DeliveryCertificateItem {
    id: number;
    correlative?: number | null;
    date: string;
    company: string;
    observations?: string | null;
    created_at: string;
}

interface Props {
    firefighter: Firefighter & {
        assigned_materials?: AssignedMaterialItem[];
        delivery_certificates?: DeliveryCertificateItem[];
    };
}

export default function FirefighterShow({ firefighter }: Props) {
    const displayName =
        [firefighter.first_name, firefighter.paternal_last_name, firefighter.maternal_last_name]
            .filter(Boolean)
            .join(' ') || firefighter.full_name;

    const assignedMaterials = firefighter.assigned_materials || [];
    const deliveryCertificates = firefighter.delivery_certificates || [];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Administración', href: '/admin/firefighters' },
                { title: 'Bomberos', href: '/admin/firefighters' },
                { title: displayName, href: `/admin/firefighters/${firefighter.id}` },
            ]}
        >
            <Head title={`Ficha de Bombero - ${displayName}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Header Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="ghost" size="sm" asChild className="gap-2 w-fit">
                        <Link href="/admin/firefighters">
                            <ArrowLeft className="size-4" />
                            <span>Volver a Bomberos</span>
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button size="sm" asChild className="gap-2">
                            <Link href={`/admin/firefighters/${firefighter.id}/edit`}>
                                <Pencil className="size-4" />
                                <span>Editar Ficha</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Firefighter Profile Banner */}
                <Card className="rounded-2xl border border-border/70 shadow-xs">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Flame className="size-7" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                            {displayName}
                                        </h1>
                                        {firefighter.general_registry_number && (
                                            <Badge variant="secondary" className="font-mono text-xs">
                                                Reg. {firefighter.general_registry_number}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Building2 className="size-4 text-primary" />
                                        <span>{firefighter.company}</span>
                                        <span>•</span>
                                        <span className="font-mono">{firefighter.rut}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-xs">
                                    ID #{firefighter.id}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
                                    {assignedMaterials.length} {assignedMaterials.length === 1 ? 'prenda activa' : 'prendas activas'}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Información Personal */}
                    <Card className="rounded-2xl border border-border/70 shadow-xs">
                        <CardHeader className="border-b border-border/60 pb-4">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <User className="size-4 text-primary" />
                                <span>Identificación Personal</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">Primer Nombre</span>
                                    <p className="text-sm font-medium mt-0.5">{firefighter.first_name || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">Segundo Nombre</span>
                                    <p className="text-sm font-medium mt-0.5">{firefighter.middle_name || '-'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">Apellido Paterno</span>
                                    <p className="text-sm font-medium mt-0.5">{firefighter.paternal_last_name || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">Apellido Materno</span>
                                    <p className="text-sm font-medium mt-0.5">{firefighter.maternal_last_name || '-'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1">
                                        <IdCard className="size-3" /> RUT
                                    </span>
                                    <p className="text-sm font-mono font-medium mt-0.5">{firefighter.rut}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1">
                                        <Mail className="size-3" /> Correo Electrónico
                                    </span>
                                    <p className="text-sm font-medium mt-0.5 truncate">{firefighter.email || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información Institucional */}
                    <Card className="rounded-2xl border border-border/70 shadow-xs">
                        <CardHeader className="border-b border-border/60 pb-4">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Shield className="size-4 text-primary" />
                                <span>Datos Institucionales</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <span className="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1">
                                    <Building2 className="size-3" /> Compañía
                                </span>
                                <p className="text-base font-semibold text-foreground mt-0.5">{firefighter.company}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1">
                                        <Hash className="size-3" /> Registro General
                                    </span>
                                    <p className="text-sm font-mono font-semibold mt-0.5">
                                        {firefighter.general_registry_number ? `N° ${firefighter.general_registry_number}` : 'Sin N° registrado'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1">
                                        <Calendar className="size-3" /> Fecha de Registro
                                    </span>
                                    <p className="text-sm font-medium mt-0.5">
                                        {firefighter.created_at ? formatDate(firefighter.created_at) : '-'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Prendas Asignadas */}
                <Card className="rounded-2xl border border-border/70 shadow-xs">
                    <CardHeader className="border-b border-border/60 pb-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Package className="size-4 text-primary" />
                            <span>Material Menor Asignado ({assignedMaterials.length})</span>
                        </CardTitle>
                        {assignedMaterials.length > 0 && (
                            <Button variant="outline" size="sm" asChild>
                                <a
                                    href={`/assigned-materials/${firefighter.id}/pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="gap-2"
                                >
                                    <FileText className="size-3.5" />
                                    <span>Certificado de Asignación</span>
                                </a>
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        {assignedMaterials.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Prenda / Equipo</TableHead>
                                        <TableHead>Código</TableHead>
                                        <TableHead>Marca / Modelo</TableHead>
                                        <TableHead className="text-right">Fecha Asignación</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assignedMaterials.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {item.material?.product_name || `Material #${item.material_id}`}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {item.material?.code || '-'}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {[item.material?.brand, item.material?.model].filter(Boolean).join(' ') || '-'}
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground">
                                                {item.created_at ? formatDate(item.created_at) : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                Este bombero no tiene prendas o material menor asignado a su cargo personal actualmente.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Últimas Actas de Entrega */}
                {deliveryCertificates.length > 0 && (
                    <Card className="rounded-2xl border border-border/70 shadow-xs">
                        <CardHeader className="border-b border-border/60 pb-4">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <FileText className="size-4 text-primary" />
                                <span>Historial de Actas de Entrega Recientes</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>N° Acta</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Compañía</TableHead>
                                        <TableHead className="text-right">Documento</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {deliveryCertificates.map((cert) => (
                                        <TableRow key={cert.id}>
                                            <TableCell className="font-mono font-medium">
                                                Acta #{cert.correlative || cert.id}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {formatDate(cert.date)}
                                            </TableCell>
                                            <TableCell className="text-xs font-medium">
                                                {cert.company}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a
                                                        href={`/deliveries/${cert.id}/pdf`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="gap-1.5 text-xs text-primary hover:underline"
                                                    >
                                                        <FileText className="size-3.5" />
                                                        <span>Ver PDF</span>
                                                    </a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
