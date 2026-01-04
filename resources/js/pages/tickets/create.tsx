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
import { Head, useForm } from '@inertiajs/react';
import { Send, Ticket } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function TicketCreate() {
    // Helper to get query params
    const searchParams = new URLSearchParams(window.location.search);

    const { data, setData, post, processing, errors } = useForm({
        subject: searchParams.get('subject') || '',
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
                { title: 'Ticketera', href: '/tickets' },
                { title: 'Nuevo Ticket', href: '/tickets/create' },
            ]}
        >
            <Head title="Nuevo Ticket" />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2 text-primary">
                        <Ticket className="size-5" />
                        <h2 className="text-lg font-semibold text-foreground">
                            Crear Nueva Solicitud
                        </h2>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="subject">Asunto</Label>
                            <Input
                                id="subject"
                                value={data.subject}
                                onChange={(e) =>
                                    setData('subject', e.target.value)
                                }
                                placeholder="Ej: Falla en equipo X, Solicitud de insumos..."
                                required
                            />
                            {errors.subject && (
                                <p className="text-xs text-destructive">
                                    {errors.subject}
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
                                    <SelectItem value="BAJA">Baja</SelectItem>
                                    <SelectItem value="MEDIA">Media</SelectItem>
                                    <SelectItem value="ALTA">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.priority && (
                                <p className="text-xs text-destructive">
                                    {errors.priority}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="message">Mensaje Detallado</Label>
                            <Textarea
                                id="message"
                                value={data.message}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>,
                                ) => setData('message', e.target.value)}
                                placeholder="Describa el problema o solicitud con detalle..."
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
                                Imagen Adjunta (Opcional)
                            </Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
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
                                JPG, PNG hasta 10MB.
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
                                Enviar Solicitud
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
