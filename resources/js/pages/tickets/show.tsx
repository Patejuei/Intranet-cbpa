import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, FileText, Paperclip, Send, User } from 'lucide-react';
import { FormEventHandler } from 'react';

interface User {
    id: number;
    name: string;
    company: string;
}

interface TicketMessage {
    id: number;
    message: string;
    image_path: string | null;
    created_at: string;
    user: User;
}

interface Ticket {
    id: number;
    subject: string;
    priority: string;
    status: string;
    company: string;
    created_at: string;
    user: User;
    messages: TicketMessage[];
}

export default function TicketShow({ ticket }: { ticket: Ticket }) {
    const { auth } = usePage().props as any;
    const currentUser = auth.user;

    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
        image: null as File | null,
    });

    const {
        data: statusData,
        put, // Using PUT/PATCH via Inertia helper? Actually controller uses patch.
        processing: statusProcessing,
    } = useForm({
        status: ticket.status,
    });

    const submitReply: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/tickets/${ticket.id}/reply`, {
            onSuccess: () => reset(),
        });
    };

    const handleStatusChange = (newStatus: string) => {
        // We use a custom request here or updating the form data then submitting?
        // Easiest is to manually call router.patch or use the form.
        // Let's use router.visit logic or just a separate form/function.
        // Actually, we can just use the statusData form.
        // But we need to set data first then submit.
        // Better:
        // router.patch(route('tickets.updateStatus', ticket.id), { status: newStatus });
        // But we need to use 'method: patch'.
        // Since I initialized useForm with statusData, I can't easily change and submit in one go without useEffect or similar.
        // I will use a direct inertia post/patch call from import { router }.
        // Actually, let's keep it simple: separate function using the router provided by inertia.
    };

    // Workaround for status change:
    const changeStatus = (newStatus: string) => {
        // using the @inertiajs/react router directly
        // import { router } from '@inertiajs/react'
        // But I didn't import it.
        // I'll create a mini-form logic or just add a simple button group that submits a form.
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ABIERTO':
                return <Badge className="bg-yellow-500">Pendiente</Badge>;
            case 'EN_PROCESO':
                return <Badge className="bg-blue-500">En Proceso</Badge>;
            case 'CERRADO':
                return <Badge variant="secondary">Cerrado</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const isImage = (path: string) => {
        const ext = path.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
    };

    const getFileName = (path: string) => {
        return path.split('/').pop();
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Ticketera', href: '/tickets' },
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
                        Volver a Ticketera
                    </Link>
                </Button>

                {/* Header Ticket Info */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:p-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold">
                                #{ticket.id} - {ticket.subject}
                            </h2>
                            {getStatusBadge(ticket.status)}

                            {/* Priority Badge / Dropdown */}
                            {currentUser.company === 'Comandancia' ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-6 gap-1 text-xs"
                                        >
                                            {ticket.priority}
                                            <span className="sr-only">
                                                Cambiar Prioridad
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                router.patch(
                                                    `/tickets/${ticket.id}/priority`,
                                                    { priority: 'BAJA' },
                                                )
                                            }
                                        >
                                            BAJA
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                router.patch(
                                                    `/tickets/${ticket.id}/priority`,
                                                    { priority: 'MEDIA' },
                                                )
                                            }
                                        >
                                            MEDIA
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                router.patch(
                                                    `/tickets/${ticket.id}/priority`,
                                                    { priority: 'ALTA' },
                                                )
                                            }
                                        >
                                            ALTA
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Badge variant="outline">
                                    {ticket.priority}
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Iniciado por{' '}
                            <span className="font-medium text-foreground">
                                {ticket.user.name}
                            </span>{' '}
                            ({ticket.company}) el{' '}
                            {formatDate(ticket.created_at)}
                        </p>
                    </div>

                    {/* Status Actions (Comandancia Only) */}
                    {currentUser.company === 'Comandancia' && (
                        <div className="flex items-center gap-2">
                            {ticket.status !== 'ABIERTO' && (
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
                        ticket.messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.user.id === currentUser.id ? 'flex-row-reverse' : ''}`}
                            >
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                                    <User className="size-4 text-primary" />
                                </div>
                                <div
                                    className={`flex max-w-[80%] flex-col ${msg.user.id === currentUser.id ? 'items-end' : ''}`}
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
                                            msg.user.id === currentUser.id
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
                                                    className="flex items-center gap-2 rounded border bg-background p-2 text-primary hover:bg-accent"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    <span className="truncate underline">
                                                        {getFileName(
                                                            msg.image_path,
                                                        )}
                                                    </span>
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Reply Box */}
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    {ticket.status === 'CERRADO' ? (
                        <div className="text-center text-sm text-muted-foreground">
                            Este ticket está cerrado. Reabra el ticket para
                            responder.
                        </div>
                    ) : (
                        <form
                            onSubmit={submitReply}
                            className="flex flex-col gap-4"
                        >
                            <div className="relative">
                                <Textarea
                                    placeholder="Escriba su respuesta..."
                                    value={data.message}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLTextAreaElement>,
                                    ) => setData('message', e.target.value)}
                                    className="min-h-[80px] resize-none pr-12"
                                    required
                                />
                                <div className="absolute right-2 bottom-2">
                                    <Label
                                        htmlFor="msg-image"
                                        className="block cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    >
                                        <Paperclip className="size-4" />
                                    </Label>
                                    <Input
                                        id="msg-image"
                                        type="file"
                                        className="hidden"
                                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                        onChange={(e) =>
                                            setData(
                                                'image',
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {data.image && (
                                <div className="flex w-fit items-center gap-1 rounded bg-blue-50 px-2 py-1 text-xs text-blue-600">
                                    <Paperclip className="size-3" />
                                    Imagen adjunta: {data.image.name}
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    Comandancia vs Compañía
                                </p>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="gap-2"
                                >
                                    <Send className="size-4" />
                                    Responder
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
