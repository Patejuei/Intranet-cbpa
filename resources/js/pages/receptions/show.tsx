import { SortableTableHead } from '@/components/SortableTableHead';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useClientTableFilter } from '@/hooks/use-client-table-filter';
import AppLayout from '@/layouts/app-layout';
import { ReceptionCertificate } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer, RotateCcw } from 'lucide-react';

export default function ReceptionShow({
    certificate,
}: {
    certificate: ReceptionCertificate;
}) {
    const {
        filteredItems,
        filters,
        setFilter,
        setSort,
        clearFilters,
        hasActiveFilters,
    } = useClientTableFilter<any>(certificate.items || [], {
        accessors: {
            product_name: (item) => item.material?.product_name || '',
            brand_model: (item) =>
                `${item.material?.brand || ''} ${item.material?.model || ''}`.trim(),
            code: (item) => item.material?.code || '',
            quantity: (item) => item.quantity,
        },
    });
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Actas de Recepción', href: '/receptions' },
                {
                    title: `Acta #${certificate.id}`,
                    href: `/receptions/${certificate.id}`,
                },
            ]}
        >
            <Head title={`Acta de Recepción #${certificate.id}`} />

            <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/receptions">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                Acta de Recepción #{certificate.id}
                            </h2>
                            <p className="text-muted-foreground">
                                Detalles del documento.
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => window.print()}
                    >
                        <Printer className="size-4" /> Imprimir
                    </Button>
                </div>

                <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm print:border-none print:shadow-none">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Fecha de Recepción
                            </p>
                            <p className="text-lg">
                                {new Date(
                                    certificate.date,
                                ).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Compañía
                            </p>
                            <p className="text-lg">{certificate.company}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Recepcionado Por (Oficial)
                            </p>
                            <p className="text-lg">{certificate.user?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Entregado Por (Bombero)
                            </p>
                            <p className="text-lg font-bold">
                                {certificate.firefighter?.full_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                RUT: {certificate.firefighter?.rut}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="mb-3 flex items-center justify-between border-b pb-2">
                            <h3 className="text-lg font-semibold">
                                Materiales Recibidos
                            </h3>
                            {hasActiveFilters && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="gap-1.5 text-muted-foreground hover:text-foreground print:hidden"
                                >
                                    <RotateCcw className="size-4" />
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <SortableTableHead
                                        column="product_name"
                                        label="Item"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.product_name}
                                        filterPlaceholder="Filtrar item..."
                                        onFilterChange={(value) =>
                                            setFilter('product_name', value)
                                        }
                                    />
                                    <SortableTableHead
                                        column="brand_model"
                                        label="Marca/Modelo"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.brand_model}
                                        filterPlaceholder="Filtrar marca/modelo..."
                                        onFilterChange={(value) =>
                                            setFilter('brand_model', value)
                                        }
                                    />
                                    <SortableTableHead
                                        column="code"
                                        label="Código"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                        filterType="text"
                                        filterValue={filters.code}
                                        filterPlaceholder="Filtrar código..."
                                        onFilterChange={(value) =>
                                            setFilter('code', value)
                                        }
                                    />
                                    <SortableTableHead
                                        column="quantity"
                                        label="Cantidad"
                                        sortKey={filters.sort}
                                        sortDirection={filters.direction}
                                        onSort={setSort}
                                    />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item, index) => (
                                        <TableRow key={item.id ?? index}>
                                            <TableCell className="font-medium">
                                                {item.material?.product_name}
                                            </TableCell>
                                            <TableCell>
                                                {item.material?.brand}{' '}
                                                {item.material?.model}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {item.material?.code || '-'}
                                            </TableCell>
                                            <TableCell className="font-bold">
                                                {item.quantity}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="py-6 text-center text-muted-foreground"
                                        >
                                            No se encontraron materiales.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {certificate.observations && (
                        <div>
                            <h3 className="mb-2 text-lg font-semibold">
                                Observaciones
                            </h3>
                            <div className="rounded-md bg-muted/30 p-4 text-sm">
                                {certificate.observations}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
