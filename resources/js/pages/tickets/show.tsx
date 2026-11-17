import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Clock,
    FileText,
    Paperclip,
    RotateCcw,
    Send,
    Tag,
    User,
    UserCheck,
    X,
} from 'lucide-react';
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
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 font-medium"
                    >
                        Abierto
                    </Badge>
                );
            case 'EN_PROCESO':
                return (
                    <Badge
                        variant="outline"
                        className="border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300 font-medium"
                    >
                        En Proceso
                    </Badge>
                );
            case 'CERRADO':
                return (
                    <Badge
                        variant="secondary"
                        className="border-border/60 text-muted-foreground font-medium"
                    >
                        Cerrado
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'ALTA':
                return (
                    <Badge
                        variant="outline"
                        className="border-red-500/30 bg-red-500/10 text-red-700 dark:border-red-500/35 dark:bg-red-500/20 dark:text-red-300 font-semibold"
                    >
                        Alta
                    </Badge>
                );
            case 'MEDIA':
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 font-medium"
                    >
                        Media
                    </Badge>
                );
            case 'BAJA':
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 font-medium"
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
            <Head title={`Ticket #${ticket.id} - ${ticket.subject}`} />

            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
                {/* Back navigation */}
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-foreground"
                        asChild
                    >
                        <Link href="/tickets">
                            <ArrowLeft className="size-4" />
                            <span>Volver a la lista de tickets</span>
                        </Link>
                    </Button>
                </div>

                {/* Header Ticket Info Card */}
                <Card className="rounded-2xl border border-border/70 shadow-xs">
                    <CardContent className="p-5 sm:p-6">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                            <div className="flex-1 space-y-3">
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <span className="text-sm font-bold text-primary">
                                        #{ticket.id}
                                    </span>
                                    <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                        {ticket.subject}
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(ticket.status)}
                                        {getPriorityBadge(ticket.priority)}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 pt-1.5 text-xs">
                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1 text-muted-foreground">
                                        <Tag className="size-3.5 text-muted-foreground/70" />
                                        <span>Categoría:</span>
                                        <span className="font-semibold text-foreground">
                                            {ticket.category
                                                ? categories[ticket.category] ?? ticket.category
                                                : 'General'}
                                        </span>
                                    </div>

                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1 text-muted-foreground">
                                        <User className="size-3.5 text-muted-foreground/70" />
                                        <span>Solicitante:</span>
                                        <span className="font-semibold text-foreground">
                                            {ticket.user.name} ({ticket.company})
                                        </span>
                                    </div>

                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1 text-muted-foreground">
                                        <Clock className="size-3.5 text-muted-foreground/70" />
                                        <span>Creado:</span>
                                        <span className="font-medium text-foreground">
                                            {formatDate(ticket.created_at)}
                                        </span>
                                    </div>

                                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1 text-muted-foreground">
                                        <UserCheck className="size-3.5 text-muted-foreground/70" />
                                        <span>Asignado:</span>
                                        {ticket.assigned_to ? (
                                            <span className="font-semibold text-foreground">
                                                {ticket.assigned_to.name}
                                            </span>
                                        ) : (
                                            <span className="italic text-muted-foreground/70">
                                                Sin asignar
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Admin Actions */}
                            {isAdmin && (
                                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 shrink-0">
                                    {/* Assign to me */}
                                    {!ticket.assigned_to && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-1.5 shadow-xs"
                                            asChild
                                        >
                                            <Link
                                                href={`/tickets/${ticket.id}/assign`}
                                                method="post"
                                                as="button"
                                            >
                                                <UserCheck className="size-3.5" />
                                                Tomar Ticket
                                            </Link>
                                        </Button>
                                    )}

                                    {/* Status buttons */}
                                    {ticket.status !== 'EN_PROCESO' &&
                                        ticket.status !== 'CERRADO' && (
                                            <Button
                                                size="sm"
                                                className="gap-1.5 shadow-xs"
                                                asChild
                                            >
                                                <Link
                                                    href={`/tickets/${ticket.id}/status`}
                                                    method="patch"
                                                    data={{ status: 'EN_PROCESO' }}
                                                    as="button"
                                                >
                                                    <Clock className="size-3.5" />
                                                    Marcar En Proceso
                                                </Link>
                                            </Button>
                                        )}
                                    {ticket.status !== 'ABIERTO' &&
                                        ticket.status !== 'CERRADO' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1.5"
                                                asChild
                                            >
                                                <Link
                                                    href={`/tickets/${ticket.id}/status`}
                                                    method="patch"
                                                    data={{ status: 'ABIERTO' }}
                                                    as="button"
                                                >
                                                    <RotateCcw className="size-3.5" />
                                                    Reabrir
                                                </Link>
                                            </Button>
                                        )}
                                    {ticket.status !== 'CERRADO' && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="gap-1.5"
                                            asChild
                                        >
                                            <Link
                                                href={`/tickets/${ticket.id}/status`}
                                                method="patch"
                                                data={{ status: 'CERRADO' }}
                                                as="button"
                                            >
                                                <CheckCircle2 className="size-3.5 text-emerald-500" />
                                                Cerrar Ticket
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Conversation Area */}
                <div className="space-y-4 rounded-2xl border border-border/70 bg-muted/10 p-4 sm:p-6 shadow-xs min-h-[300px]">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                        <span>Historial de Conversación</span>
                        <span>{ticket.messages.length} {ticket.messages.length === 1 ? 'mensaje' : 'mensajes'}</span>
                    </div>

                    {ticket.messages.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <AlertCircle className="mx-auto size-8 text-muted-foreground/40 mb-2" />
                            <p className="text-sm font-medium">No hay mensajes registrados aún.</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {ticket.messages.map((msg) => {
                                const isOwnMessage = msg.user.id === currentUser.id;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3.5 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                                    >
                                        <div
                                            className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                                isOwnMessage
                                                    ? 'bg-primary text-primary-foreground shadow-xs'
                                                    : 'bg-muted border border-border/70 text-foreground'
                                            }`}
                                        >
                                            {msg.user.name.charAt(0).toUpperCase()}
                                        </div>

                                        <div
                                            className={`flex max-w-[85%] sm:max-w-[75%] flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
                                        >
                                            <div className="mb-1.5 flex items-center gap-2 px-1">
                                                <span className="text-xs font-semibold text-foreground">
                                                    {msg.user.name}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground">
                                                    {new Date(msg.created_at).toLocaleString([], {
                                                        dateStyle: 'short',
                                                        timeStyle: 'short',
                                                    })}
                                                </span>
                                            </div>

                                            <div
                                                className={`rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                                                    isOwnMessage
                                                        ? 'rounded-tr-xs bg-primary text-primary-foreground'
                                                        : 'rounded-tl-xs border border-border/70 bg-card text-foreground'
                                                }`}
                                            >
                                                <p className="whitespace-pre-wrap">{msg.message}</p>
                                            </div>

                                            {msg.image_path && (
                                                <div className="mt-2.5">
                                                    {isImage(msg.image_path) ? (
                                                        <div className="max-w-[280px] overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs transition hover:opacity-95">
                                                            <a
                                                                href={`/storage/${msg.image_path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <img
                                                                    src={`/storage/${msg.image_path}`}
                                                                    alt="Adjunto"
                                                                    className="h-auto w-full object-cover"
                                                                />
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <a
                                                            href={`/storage/${msg.image_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3.5 py-2 text-xs font-medium text-foreground shadow-xs transition hover:bg-muted/50"
                                                        >
                                                            <FileText className="size-4 text-primary" />
                                                            Ver archivo adjunto
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Reply Form */}
                {ticket.status !== 'CERRADO' ? (
                    <Card className="rounded-2xl border border-border/70 shadow-xs">
                        <CardContent className="p-4 sm:p-5">
                            <form onSubmit={submitReply} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="reply-message" className="text-sm font-semibold text-foreground">
                                        Enviar Respuesta
                                    </Label>
                                    <Textarea
                                        id="reply-message"
                                        value={data.message}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                            setData('message', e.target.value)
                                        }
                                        placeholder="Escriba su respuesta o actualización sobre este ticket..."
                                        className="min-h-[110px] rounded-xl text-sm"
                                        required
                                    />
                                    {errors.message && (
                                        <p className="text-xs text-destructive">{errors.message}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
                                    <div className="flex items-center gap-2">
                                        <Label
                                            htmlFor="reply-image"
                                            className="cursor-pointer"
                                        >
                                            <div className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted">
                                                <Paperclip className="size-3.5 text-muted-foreground" />
                                                <span>Adjuntar imagen o PDF</span>
                                            </div>
                                        </Label>
                                        <Input
                                            id="reply-image"
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) =>
                                                setData(
                                                    'image',
                                                    e.target.files ? e.target.files[0] : null,
                                                )
                                            }
                                            className="hidden"
                                        />
                                        {data.image && (
                                            <div className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                                <span className="max-w-[200px] truncate">
                                                    {data.image.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('image', null)}
                                                    className="hover:opacity-75"
                                                >
                                                    <X className="size-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="gap-2 shadow-xs shrink-0"
                                    >
                                        <Send className="size-4" />
                                        <span>Enviar Respuesta</span>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-muted/30 p-5 text-center text-sm font-medium text-muted-foreground shadow-xs">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                        <span>Este ticket ha sido cerrado. No se admiten nuevas respuestas en este hilo.</span>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
