import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, LifeBuoy, Paperclip, Send, X } from 'lucide-react';
import { FormEventHandler } from 'react';

interface PageProps {
    categories: Record<string, string>;
}

export default function TicketCreate({ categories }: PageProps) {
    const { auth } = usePage().props as any;
    const currentUser = auth.user;
    const isAdmin = currentUser?.role === 'admin';

    const searchParams = new URLSearchParams(window.location.search);

    const { data, setData, post, processing, errors } = useForm({
        requester_email: '',
        subject: searchParams.get('subject') || '',
        category: '',
        priority: 'MEDIA',
        message: searchParams.get('message') || '',
        image: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/tickets');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Soporte', href: '/tickets' },
                { title: 'Nuevo Ticket', href: '/tickets/create' },
            ]}
        >
            <Head title="Nuevo Ticket de Soporte" />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 sm:p-6">
                {/* Back button */}
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

                <Card className="rounded-2xl border border-border/70 shadow-xs">
                    <CardContent className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <LifeBuoy className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                    Crear Ticket de Soporte
                                </h1>
                                <p className="text-xs text-muted-foreground sm:text-sm">
                                    Detalla tu requerimiento o incidencia técnica para ser atendido a la brevedad.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {isAdmin && (
                                <div className="grid gap-2.5 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:p-5">
                                    <Label htmlFor="requester_email" className="text-sm font-semibold text-foreground">
                                        Correo Electrónico del Solicitante <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="requester_email"
                                        type="email"
                                        value={data.requester_email}
                                        onChange={(e) =>
                                            setData('requester_email', e.target.value)
                                        }
                                        placeholder="ej: usuario@cbpa.cl"
                                        required
                                        className="h-10 text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Ingresa el correo del voluntario o funcionario registrado que solicitó la asistencia (vía llamada, radio o correo).
                                    </p>
                                    {errors.requester_email && (
                                        <p className="text-xs text-destructive">
                                            {errors.requester_email}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                                    Asunto <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="subject"
                                    value={data.subject}
                                    onChange={(e) =>
                                        setData('subject', e.target.value)
                                    }
                                    placeholder="Ej: Problemas de acceso al módulo de vehículos o reporte de falla..."
                                    required
                                    className="h-10 text-sm"
                                />
                                {errors.subject && (
                                    <p className="text-xs text-destructive">
                                        {errors.subject}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="category" className="text-sm font-medium text-foreground">
                                        Categoría
                                    </Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(val) =>
                                            setData('category', val)
                                        }
                                    >
                                        <SelectTrigger id="category" className="h-10 text-sm">
                                            <SelectValue placeholder="Seleccione categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(categories).map(
                                                ([key, label]) => (
                                                    <SelectItem
                                                        key={key}
                                                        value={key}
                                                    >
                                                        {label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="text-xs text-destructive">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="priority" className="text-sm font-medium text-foreground">
                                        Prioridad
                                    </Label>
                                    <Select
                                        value={data.priority}
                                        onValueChange={(val) =>
                                            setData('priority', val)
                                        }
                                    >
                                        <SelectTrigger id="priority" className="h-10 text-sm">
                                            <SelectValue placeholder="Seleccione prioridad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BAJA">
                                                Baja
                                            </SelectItem>
                                            <SelectItem value="MEDIA">
                                                Media
                                            </SelectItem>
                                            <SelectItem value="ALTA">
                                                Alta
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.priority && (
                                        <p className="text-xs text-destructive">
                                            {errors.priority}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="message" className="text-sm font-medium text-foreground">
                                    Descripción del Problema <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="message"
                                    value={data.message}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLTextAreaElement>,
                                    ) => setData('message', e.target.value)}
                                    placeholder="Describe el inconveniente o solicitud con el mayor detalle posible (pasos para reproducir, mensajes de error, etc.)..."
                                    className="min-h-[140px] text-sm leading-relaxed"
                                    required
                                />
                                {errors.message && (
                                    <p className="text-xs text-destructive">
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-sm font-medium text-foreground">
                                    Archivo Adjunto (Opcional)
                                </Label>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Label
                                        htmlFor="image"
                                        className="cursor-pointer"
                                    >
                                        <div className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-muted/40 px-3.5 py-2 text-xs font-medium text-foreground transition hover:bg-muted">
                                            <Paperclip className="size-3.5 text-muted-foreground" />
                                            <span>Seleccionar archivo</span>
                                        </div>
                                    </Label>
                                    <Input
                                        id="image"
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
                                    {data.image ? (
                                        <div className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                            <span className="max-w-[220px] truncate">
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
                                    ) : (
                                        <span className="text-xs text-muted-foreground">
                                            JPG, PNG o PDF (máx. 10MB)
                                        </span>
                                    )}
                                </div>
                                {errors.image && (
                                    <p className="text-xs text-destructive">
                                        {errors.image}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col-reverse justify-end gap-3 pt-3 sm:flex-row sm:items-center">
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="w-full sm:w-auto"
                                    asChild
                                >
                                    <Link href="/tickets">
                                        Cancelar
                                    </Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full gap-2 shadow-xs sm:w-auto"
                                >
                                    <Send className="size-4" />
                                    <span>Enviar Ticket</span>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
