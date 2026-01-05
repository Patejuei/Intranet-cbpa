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
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';

interface AssignedMaterial {
    id: number;
    material: {
        id: number;
        product_name: string;
        brand?: string;
        model?: string;
        code?: string;
    };
    quantity: number;
}

interface Firefighter {
    id: number;
    full_name: string;
    rut: string;
    company: string;
    assigned_materials: AssignedMaterial[];
}

interface Props {
    firefighter: Firefighter;
}

export default function AssignedMaterialsShow({ firefighter }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Material Menor',
            href: '/inventory',
        },
        {
            title: 'Prendas a Cargo',
            href: '/assigned-materials',
        },
        {
            title: firefighter.full_name,
            href: `/assigned-materials/${firefighter.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Prendas - ${firefighter.full_name}`} />

            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/assigned-materials">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Detalle de Prendas a Cargo
                            </h1>
                            <p className="text-muted-foreground">
                                {firefighter.full_name} - {firefighter.company}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" disabled>
                        <Printer className="mr-2 size-4" /> Imprimir
                        (Próximamente)
                    </Button>
                </div>

                <Card>
                    <CardHeader className="bg-muted/50 pb-4">
                        <CardTitle className="text-lg">
                            Materiales Asignados
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Material</TableHead>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Marca / Modelo</TableHead>
                                    <TableHead className="text-right">
                                        Cantidad
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {firefighter.assigned_materials &&
                                firefighter.assigned_materials.length > 0 ? (
                                    firefighter.assigned_materials.map(
                                        (assigned) => (
                                            <TableRow key={assigned.id}>
                                                <TableCell className="font-medium">
                                                    {
                                                        assigned.material
                                                            .product_name
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {assigned.material.code ||
                                                        '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {assigned.material.brand}{' '}
                                                    {assigned.material.model}
                                                </TableCell>
                                                <TableCell className="text-right text-lg font-bold">
                                                    {assigned.quantity}
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="py-12 text-center text-muted-foreground"
                                        >
                                            Este bombero no tiene prendas
                                            asignadas actualmente.
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
