import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, FileText, LifeBuoy, Paperclip, Send, User, UserCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

interface UserModel {
    id: number;
    name: string;
    company: string;
    role?: string;
}

interface TicketMessageModel {
    id: number;
    message: string;
    image_path: string | null;
    created_at: string;
    user: UserModel;
}

interface TicketModel {
    id: number;
    subject: string;
    category: string | null;
    priority: string;
    status: string;
    company: string;
    created_at: string;
    user: UserModel;
    assigned_to: UserModel | null;
    messages: TicketMessageModel[];
}

interface PageProps {
    ticket: TicketModel;
    categories: Record<string, string>;
}

export default function TicketShow({ ticket, categories }: PageProps) {
    const { auth } = usePage().props as any;
    const currentUser = auth.user;
    const isAdmin = currentUser.role === 'admin';

    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
        image: null as File | null,
    });

    const submitReply: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/tickets/${ticket.id}/reply`, {
            onSuccess: () => reset(),
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ABIERTO':
                return <Badge className="bg-yellow-500">Abierto</Badge>;
            case 'EN_PROCESO':
                return <Badge className="bg-blue-500">En Proceso</Badge>;
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

    const isImage = (path: string) => {
        const ext = path.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Soporte', href: '/tickets' },
                {
                    title: `Ticket #${ticket.id}`,
                    href: `/tickets/${ticket.id}`,
                },
            ]}
        >
            <Head title={`Ticket #${ticket.id}`} />

            <div className="mx-auto flex h-[calc(100vh-120px)] w-full max-w-5xl flex-col gap-6 p-4">
                <Button
                    variant="ghost"
                    className="w-fit gap-2 pl-0 hover:bg-transparent hover:text-primary"
                    asChild
                >
                    <Link href="/tickets">
                        <ArrowLeft className="h-4 w-4" />
                        Volver a Soporte
                    </Link>
                </Button>

                {/* Header Ticket Info */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:p-6">
                    <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-bold">
                                #{ticket.id} - {ticket.subject}
                            </h2>
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span>
                                Categoría:{' '}
                                <span className="font-medium text-foreground">
                                    {ticket.category
                                        ? categories[ticket.category] ?? ticket.category
                                        : 'Sin categoría'}
                                </span>
                            </span>
                            <span>
                                Solicitante:{' '}
                                <span className="font-medium text-foreground">
                                    {ticket.user.name}
                                </span>{' '}
                                ({ticket.company})
                            </span>
                            <span>Creado el {formatDate(ticket.created_at)}</span>
                        </div>
                        {ticket.assigned_to && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <UserCheck className="size-3.5" />
                                Asignado a:{' '}
                                <span className="font-medium text-foreground">
                                    {ticket.assigned_to.name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && (
                        <div className="flex flex-wrap items-start gap-2">
                            {/* Assign to me */}
                            {!ticket.assigned_to && (
                                <Link
                                    href={`/tickets/${ticket.id}/assign`}
                                    method="post"
                                    as="button"
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5"
                                    >
                                        <UserCheck className="size-3.5" />
                                        Tomar Ticket
                                    </Button>
                                </Link>
                            )}

                            {/* Status buttons */}
                            {ticket.status !== 'EN_PROCESO' &&
                                ticket.status !== 'CERRADO' && (
                                    <Link
                                        href={`/tickets/${ticket.id}/status`}
                                        method="patch"
                                        data={{ status: 'EN_PROCESO' }}
                                        as="button"
                                    >
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            Marcar En Proceso
                                        </Button>
                                    </Link>
                                )}
                            {ticket.status !== 'ABIERTO' &&
                                ticket.status !== 'CERRADO' && (
                                    <Link
                                        href={`/tickets/${ticket.id}/status`}
                                        method="patch"
                                        data={{ status: 'ABIERTO' }}
                                        as="button"
                                    >
                                        <Button variant="outline" size="sm">
                                            Reabrir
                                        </Button>
                                    </Link>
                                )}
                            {ticket.status !== 'CERRADO' && (
                                <Link
                                    href={`/tickets/${ticket.id}/status`}
                                    method="patch"
                                    data={{ status: 'CERRADO' }}
                                    as="button"
                                >
                                    <Button variant="secondary" size="sm">
                                        Cerrar Ticket
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Conversation Area */}
                <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border bg-muted/20 p-4">
                    {ticket.messages.length === 0 ? (
                        <div className="py-10 text-center text-muted-foreground">
                            No hay mensajes.
                        </div>
                    ) : (
                        ticket.messages.map((msg) => {
                            const isOwnMessage = msg.user.id === currentUser.id;
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                                        <User className="size-4 text-primary" />
                                    </div>
                                    <div
                                        className={`flex max-w-[80%] flex-col ${isOwnMessage ? 'items-end' : ''}`}
                                    >
                                        <div className="mb-1 flex items-center gap-2">
                                            <span className="text-xs font-medium text-muted-foreground">
                                                {msg.user.name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground/70">
                                                {new Date(
                                                    msg.created_at,
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div
                                            className={`rounded-lg p-3 text-sm ${
                                                isOwnMessage
                                                    ? 'rounded-tr-none bg-primary text-primary-foreground'
                                                    : 'rounded-tl-none border bg-card shadow-sm'
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap">
                                                {msg.message}
                                            </p>
                                        </div>
                                        {msg.image_path && (
                                            <div className="mt-2 text-sm">
                                                {isImage(msg.image_path) ? (
                                                    <div className="max-w-[200px] overflow-hidden rounded-md border">
                                                        <a
                                                            href={`/storage/${msg.image_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img
                                                                src={`/storage/${msg.image_path}`}
                                                                alt="Adjunto"
                                                                className="h-auto w-full"
                                                            />
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <a
                                                        href={`/storage/${msg.image_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
                                                    >
                                                        <FileText className="size-3.5" />
                                                        Ver archivo adjunto
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Reply Form */}
                {ticket.status !== 'CERRADO' && (
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <form onSubmit={submitReply} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="reply-message">
                                    Responder
                                </Label>
                                <Textarea
                                    id="reply-message"
                                    value={data.message}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLTextAreaElement>,
                                    ) => setData('message', e.target.value)}
                                    placeholder="Escriba su respuesta..."
                                    className="min-h-[100px]"
                                    required
                                />
                                {errors.message && (
                                    <p className="text-xs text-destructive">
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Label
                                        htmlFor="reply-image"
                                        className="cursor-pointer"
                                    >
                                        <div className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs hover:bg-muted">
                                            <Paperclip className="size-3.5" />
                                            Adjuntar archivo
                                        </div>
                                    </Label>
                                    <Input
                                        id="reply-image"
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) =>
                                            setData(
                                                'image',
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null,
                                            )
                                        }
                                        className="hidden"
                                    />
                                    {data.image && (
                                        <span className="text-xs text-muted-foreground">
                                            {data.image.name}
                                        </span>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="gap-2"
                                >
                                    <Send className="size-4" />
                                    Enviar
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {ticket.status === 'CERRADO' && (
                    <div className="rounded-xl border border-muted bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                        Este ticket ha sido cerrado. No se pueden enviar más
                        respuestas.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
