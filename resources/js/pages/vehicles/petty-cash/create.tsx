import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthenticatedLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Trash2, UploadCloud } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function PettyCashCreate() {
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        description: '',
        attachments: [] as File[],
    });

    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setData('attachments', [...data.attachments, ...newFiles]);

            // Generate previews
            const newPreviews = newFiles.map((file) =>
                URL.createObjectURL(file),
            );
            setPreviews([...previews, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = [...data.attachments];
        newFiles.splice(index, 1);
        setData('attachments', newFiles);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]); // Cleanup
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/vehicles/petty-cash');
    };

    return (
        <AuthenticatedLayout
            breadcrumbs={[
                { title: 'Caja Chica', href: '/vehicles/petty-cash' },
                { title: 'Nueva Rendición', href: '#' },
            ]}
        >
            <Head title="Nueva Rendición | Caja Chica" />

            <div className="flex flex-1 flex-col gap-8 p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/vehicles/petty-cash">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Nueva Rendición</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Detalles de la Boleta / Recibo</CardTitle>
                        <CardDescription>
                            Adjunte las imágenes de los recibos y especifique el
                            monto total.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Monto Total (CLP)</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        placeholder="Ej: 15000"
                                        value={data.amount}
                                        onChange={(e) =>
                                            setData('amount', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.amount && (
                                        <p className="text-sm text-red-500">
                                            {errors.amount}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Descripción / Motivo</Label>
                                    <Input
                                        placeholder="Ej: Compra de ampolletas para B-2"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Attachments */}
                            <div className="space-y-4">
                                <Label>Comprobantes (Boletas/Facturas)</Label>
                                <div className="rounded-lg border border-dashed p-8 text-center transition-colors hover:bg-muted/50">
                                    <input
                                        type="file"
                                        id="attachments"
                                        multiple
                                        accept="image/*,application/pdf"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="attachments"
                                        className="flex cursor-pointer flex-col items-center justify-center gap-2"
                                    >
                                        <div className="rounded-full bg-primary/10 p-4 text-primary">
                                            <UploadCloud className="h-6 w-6" />
                                        </div>
                                        <div className="text-sm font-medium">
                                            Haga clic para subir archivos
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Se permiten múltiples imágenes o
                                            PDF.
                                        </div>
                                    </label>
                                </div>
                                {errors.attachments && (
                                    <p className="text-sm text-red-500">
                                        {errors.attachments}
                                    </p>
                                )}

                                {/* Preview Grid */}
                                {data.attachments.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                                        {data.attachments.map((file, idx) => (
                                            <div
                                                key={idx}
                                                className="group relative aspect-square overflow-hidden rounded-md border bg-muted"
                                            >
                                                {file.type.startsWith(
                                                    'image/',
                                                ) ? (
                                                    <img
                                                        src={previews[idx]}
                                                        alt="Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center p-2 text-center text-xs">
                                                        {file.name}
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFile(idx)
                                                    }
                                                    className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Enviar Rendición
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
