import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { ReceptionCertificate } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';

export default function ReceptionShow({
    certificate,
}: {
    certificate: ReceptionCertificate;
}) {
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
                        <h3 className="mb-3 border-b pb-2 text-lg font-semibold">
                            Materiales Recibidos
                        </h3>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-2">Item</th>
                                    <th className="px-4 py-2">Marca/Modelo</th>
                                    <th className="px-4 py-2">Código</th>
                                    <th className="px-4 py-2">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {certificate.items?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 font-medium">
                                            {item.material?.product_name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {item.material?.brand}{' '}
                                            {item.material?.model}
                                        </td>
                                        <td className="px-4 py-2 text-muted-foreground">
                                            {item.material?.code || '-'}
                                        </td>
                                        <td className="px-4 py-2 font-bold">
                                            {item.quantity}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
