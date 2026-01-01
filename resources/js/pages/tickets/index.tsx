import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, Send, Ticket } from 'lucide-react';
import { FormEventHandler } from 'react';

interface TicketModel {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    created_at: string;
    user: { name: string };
}

export default function TicketIndex({ tickets }: { tickets: TicketModel[] }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        priority: 'MEDIA',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/tickets', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Ticketera', href: '/tickets' },
            ]}
        >
            <Head title="Ticketera / Solicitudes" />

            <div className="flex flex-col gap-6 p-4">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Formulario */}
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-2 text-primary">
                            <Ticket className="size-5" />
                            <h2 className="text-lg font-semibold text-foreground">
                                Crear Solicitud / Reporte
                            </h2>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Asunto
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    placeholder="Ej: Falla en equipo X, Solicitud de insumos..."
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Prioridad
                                </label>
                                <select
                                    value={data.priority}
                                    onChange={(e) =>
                                        setData('priority', e.target.value)
                                    }
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                >
                                    <option value="BAJA">Baja</option>
                                    <option value="MEDIA">Media</option>
                                    <option value="ALTA">Alta</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Descripción Detallada
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    placeholder="Describa el problema o solicitud con detalle..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                <Send className="size-4" />
                                Enviar Ticket
                            </button>
                        </form>
                    </div>

                    {/* Lista Tickets */}
                    <div className="flex max-h-[600px] flex-col overflow-hidden rounded-xl border bg-card p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-2 text-primary">
                            <AlertCircle className="size-5" />
                            <h2 className="text-lg font-semibold text-foreground">
                                Mis Tickets Recientes
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2">
                            {tickets.length === 0 ? (
                                <p className="py-8 text-center text-muted-foreground">
                                    No hay tickets registrados.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {tickets.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className="rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="mb-2 flex items-start justify-between">
                                                <span className="block truncate pr-2 font-semibold">
                                                    {ticket.title}
                                                </span>
                                                <div className="flex shrink-0 gap-2">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                            ticket.priority ===
                                                            'ALTA'
                                                                ? 'bg-red-100 text-red-700'
                                                                : ticket.priority ===
                                                                    'MEDIA'
                                                                  ? 'bg-yellow-100 text-yellow-700'
                                                                  : 'bg-blue-100 text-blue-700'
                                                        }`}
                                                    >
                                                        {ticket.priority}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                                {ticket.description}
                                            </p>
                                            <div className="flex items-center justify-between border-t border-border/50 pt-2 text-xs text-muted-foreground">
                                                <span>
                                                    {ticket.user.name} -{' '}
                                                    {new Date(
                                                        ticket.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                                <span
                                                    className={`font-bold uppercase ${
                                                        ticket.status ===
                                                        'ABIERTO'
                                                            ? 'text-green-600'
                                                            : 'text-neutral-500'
                                                    }`}
                                                >
                                                    {ticket.status.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
