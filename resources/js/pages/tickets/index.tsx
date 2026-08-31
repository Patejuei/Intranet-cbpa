import CompanyFilter from '@/components/app/CompanyFilter';
import Pagination from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import { Eye, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { usePermissions } from '@/hooks/use-permissions';

interface UserModel {
    id: number;
    name: string;
    company: string;
}

interface TicketModel {
    id: number;
    subject: string;
    company: string;
    category: string | null;
    priority: string;
    status: string;
    created_at: string;
    user: UserModel;
    assigned_to: UserModel | null;
}

interface PageProps {
    tickets: {
        data: TicketModel[];
        links: any[];
    };
    categories: Record<string, string>;
    can_create?: boolean;
}

export default function TicketIndex({ tickets, categories, can_create }: PageProps) {
    const { canCreate, user } = usePermissions();
    const [searchTerm, setSearchTerm] = useState('');

    // Si viene can_create del backend lo usamos directamente, sino usamos canCreate hook
    const showCreateButton = can_create !== undefined ? can_create : canCreate('tickets');

    const filteredTickets = tickets.data.filter(
        (t) =>
            t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.category && categories[t.category]?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            t.id.toString().includes(searchTerm),
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ABIERTO':
                return (
                    <Badge
                        variant="default"
                        className="bg-yellow-500 hover:bg-yellow-600"
                    >
                        Abierto
                    </Badge>
                );
            case 'EN_PROCESO':
                return (
                    <Badge
                        variant="default"
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        En Proceso
                    </Badge>
                );
            case 'CERRADO':
                return <Badge variant="secondary">Cerrado</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'ALTA':
                return <Badge variant="destructive">Alta</Badge>;
            case 'MEDIA':
                return (
                    <Badge
                        variant="outline"
                        className="border-yellow-600 text-yellow-600"
                    >
                        Media
                    </Badge>
                );
            case 'BAJA':
                return (
                    <Badge
                        variant="outline"
                        className="border-green-600 text-green-600"
                    >
                        Baja
                    </Badge>
                );
            default:
                return <Badge variant="outline">{priority}</Badge>;
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Soporte', href: '/tickets' },
            ]}
        >
            <Head title="Soporte / Ticketera" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Soporte de Plataforma
                        </h2>
                        <p className="text-muted-foreground">
                            Sistema de tickets para soporte técnico de la
                            intranet.
                        </p>
                    </div>
                    {showCreateButton && (
                        <Link href="/tickets/create">
                            <Button className="gap-2">
                                <Plus className="size-4" />
                                Nuevo Ticket
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex max-w-sm items-center gap-2">
                        <Search className="size-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por asunto, categoría o compañía..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    {user?.role === 'admin' && <CompanyFilter />}
                </div>

                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        ID
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Asunto
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Categoría
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Prioridad
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Estado
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Compañía
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Solicitante
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Asignado a
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Fecha
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredTickets.length > 0 ? (
                                    filteredTickets.map((ticket) => (
                                        <tr
                                            key={ticket.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                #{ticket.id}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {ticket.subject}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {ticket.category
                                                    ? categories[ticket.category] ?? ticket.category
                                                    : '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getPriorityBadge(
                                                    ticket.priority,
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(ticket.status)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {ticket.company}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {ticket.user.name}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {ticket.assigned_to
                                                    ? ticket.assigned_to.name
                                                    : (
                                                        <span className="text-xs italic">
                                                            Sin asignar
                                                        </span>
                                                    )}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {formatDate(ticket.created_at)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link
                                                    href={`/tickets/${ticket.id}`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 gap-2"
                                                    >
                                                        <Eye className="size-4" />
                                                        Ver
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={10}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No se encontraron tickets.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination links={tickets.links} />
            </div>
        </AppLayout>
    );
}
