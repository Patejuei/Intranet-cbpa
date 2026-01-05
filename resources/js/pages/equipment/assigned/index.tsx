import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Pagination as PaginationType } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Eye, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Material Menor',
        href: '/inventory',
    },
    {
        title: 'Prendas a Cargo',
        href: '/assigned-materials',
    },
];

interface Firefighter {
    id: number;
    full_name: string;
    rut: string;
    company: string;
    assigned_materials?: any[]; // We only need count really, but relationship was loaded
}

interface Props {
    firefighters: PaginationType<Firefighter>;
    filters: {
        search?: string;
        company?: string;
    };
    can_filter_company: boolean;
}

export default function AssignedMaterialsIndex({
    firefighters,
    filters,
    can_filter_company,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [company, setCompany] = useState(filters.company || 'all');

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get(
            '/assigned-materials',
            {
                search,
                company: company === 'all' ? undefined : company,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleCompanyChange = (val: string) => {
        setCompany(val);
        // Trigger search immediately on filter change
        router.get(
            '/assigned-materials',
            {
                search,
                company: val === 'all' ? undefined : val,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Prendas a Cargo" />

            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Bomberos - Prendas a Cargo
                        </h1>
                        <p className="text-muted-foreground">
                            Seleccione un bombero para ver sus prendas
                            asignadas.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4 md:flex-row">
                    <form
                        onSubmit={handleSearch}
                        className="flex w-full flex-1 gap-2"
                    >
                        <div className="relative flex-1 md:max-w-sm">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar bombero (Nombre o RUT)..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Buscar
                        </Button>
                    </form>

                    {can_filter_company && (
                        <div className="w-full md:w-[200px]">
                            <Select
                                value={company}
                                onValueChange={handleCompanyChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrar por Compañía" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Todas las Compañías
                                    </SelectItem>
                                    <SelectItem value="Primera Compañía">
                                        Primera Compañía
                                    </SelectItem>
                                    <SelectItem value="Segunda Compañía">
                                        Segunda Compañía
                                    </SelectItem>
                                    <SelectItem value="Tercera Compañía">
                                        Tercera Compañía
                                    </SelectItem>
                                    <SelectItem value="Cuarta Compañía">
                                        Cuarta Compañía
                                    </SelectItem>
                                    <SelectItem value="Quinta Compañía">
                                        Quinta Compañía
                                    </SelectItem>
                                    <SelectItem value="Séptima Compañía">
                                        Séptima Compañía
                                    </SelectItem>
                                    <SelectItem value="Octava Compañía">
                                        Octava Compañía
                                    </SelectItem>
                                    <SelectItem value="Novena Compañía">
                                        Novena Compañía
                                    </SelectItem>
                                    <SelectItem value="Décima Compañía">
                                        Décima Compañía
                                    </SelectItem>
                                    <SelectItem value="Comandancia">
                                        Comandancia
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <Card>
                    <CardHeader className="bg-muted/50 pb-4">
                        <CardTitle className="text-lg">
                            Listado de Bomberos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>RUT</TableHead>
                                    <TableHead>Compañía</TableHead>
                                    <TableHead className="text-right">
                                        Acción
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {firefighters.data.length > 0 ? (
                                    firefighters.data.map((firefighter) => (
                                        <TableRow
                                            key={firefighter.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() =>
                                                router.visit(
                                                    `/assigned-materials/${firefighter.id}`,
                                                )
                                            }
                                        >
                                            <TableCell className="font-medium">
                                                {firefighter.full_name}
                                            </TableCell>
                                            <TableCell>
                                                {firefighter.rut}
                                            </TableCell>
                                            <TableCell>
                                                {firefighter.company}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                >
                                                    <Eye className="mr-2 size-4" />
                                                    Ver Detalles
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No se encontraron bomberos.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {firefighters.links && (
                    <div className="mt-4 flex justify-center gap-2">
                        {firefighters.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                disabled={!link.url}
                                onClick={() =>
                                    link.url && router.visit(link.url)
                                }
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
