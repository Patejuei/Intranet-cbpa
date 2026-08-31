import { Button } from '@/components/ui/button';
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
import { Head, useForm, usePage } from '@inertiajs/react';
import { LifeBuoy, Send } from 'lucide-react';
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

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2 text-primary">
                        <LifeBuoy className="size-5" />
                        <h2 className="text-lg font-semibold text-foreground">
                            Crear Ticket de Soporte
                        </h2>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {isAdmin && (
                            <div className="grid gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
                                <Label htmlFor="requester_email">
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
                                />
                                <p className="text-xs text-muted-foreground">
                                    Ingrese el correo del usuario registrado en la plataforma que solicitó el soporte (vía llamada o correo).
                                </p>
                                {errors.requester_email && (
                                    <p className="text-xs text-destructive">
                                        {errors.requester_email}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="subject">Asunto</Label>
                            <Input
                                id="subject"
                                value={data.subject}
                                onChange={(e) =>
                                    setData('subject', e.target.value)
                                }
                                placeholder="Ej: No puedo acceder al módulo de vehículos..."
                                required
                            />
                            {errors.subject && (
                                <p className="text-xs text-destructive">
                                    {errors.subject}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Select
                                    value={data.category}
                                    onValueChange={(val) =>
                                        setData('category', val)
                                    }
                                >
                                    <SelectTrigger>
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
                                <Label htmlFor="priority">Prioridad</Label>
                                <Select
                                    value={data.priority}
                                    onValueChange={(val) =>
                                        setData('priority', val)
                                    }
                                >
                                    <SelectTrigger>
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
                            <Label htmlFor="message">Descripción del Problema</Label>
                            <Textarea
                                id="message"
                                value={data.message}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>,
                                ) => setData('message', e.target.value)}
                                placeholder="Describa el problema o solicitud con el mayor detalle posible..."
                                className="min-h-[150px]"
                                required
                            />
                            {errors.message && (
                                <p className="text-xs text-destructive">
                                    {errors.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="image">
                                Archivo Adjunto (Opcional)
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
                                className="cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG o PDF hasta 10MB.
                            </p>
                            {errors.image && (
                                <p className="text-xs text-destructive">
                                    {errors.image}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full gap-2 sm:w-auto"
                            >
                                <Send className="size-4" />
                                Enviar Ticket
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
