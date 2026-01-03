import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { DeliveryCertificate } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Eye, FileText, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import CompanyFilter from '@/components/app/CompanyFilter';

interface PageProps {
    certificates: {
        data: DeliveryCertificate[];
        links: any[];
    };
}

export default function DeliveryIndex({ certificates }: PageProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCertificates = certificates.data.filter(
        (c) =>
            c.firefighter?.full_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            c.user?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Actas de Entrega', href: '/deliveries' },
            ]}
        >
            <Head title="Actas de Entrega" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Actas de Entrega
                        </h2>
                        <p className="text-muted-foreground">
                            Historial de entrega de materiales a bomberos.
                        </p>
                    </div>
                    <Link href="/deliveries/create">
                        <Button className="gap-2">
                            <Plus className="size-4" />
                            Nueva Acta
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex max-w-sm items-center gap-2">
                        <Search className="size-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por bombero u oficial..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <CompanyFilter />
                </div>

                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Fecha
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Bombero Receptor
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Oficial Entrega
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Items
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Compañía
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredCertificates.length > 0 ? (
                                    filteredCertificates.map((cert) => (
                                        <tr
                                            key={cert.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3">
                                                {new Date(
                                                    cert.date,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {cert.firefighter?.full_name}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {cert.user?.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {cert.items?.length || 0} items
                                            </td>
                                            <td className="px-4 py-3">
                                                {cert.company}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/deliveries/${cert.id}`}
                                                        className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
                                                    >
                                                        <Eye className="size-3" />{' '}
                                                        Ver
                                                    </Link>
                                                    <a
                                                        href={`/deliveries/${cert.id}/pdf`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                                                    >
                                                        <FileText className="size-3" />{' '}
                                                        PDF
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No se encontraron actas en esta
                                            página.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination links={certificates.links} />
            </div>
        </AppLayout>
    );
}
