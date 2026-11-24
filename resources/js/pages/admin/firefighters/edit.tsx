import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
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
import AppLayout from '@/layouts/app-layout';
import { Firefighter } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Pencil, Save, UserCheck } from 'lucide-react';
import React, { FormEventHandler } from 'react';

interface Props {
    firefighter: Firefighter;
    companies: string[];
}

export default function FirefighterEdit({ firefighter, companies }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        general_registry_number: firefighter.general_registry_number || '',
        first_name: firefighter.first_name || '',
        middle_name: firefighter.middle_name || '',
        paternal_last_name: firefighter.paternal_last_name || '',
        maternal_last_name: firefighter.maternal_last_name || '',
        rut: firefighter.rut || '',
        company: firefighter.company || '',
        email: firefighter.email || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/firefighters/${firefighter.id}`);
    };

    const displayName =
        [firefighter.first_name, firefighter.paternal_last_name, firefighter.maternal_last_name]
            .filter(Boolean)
            .join(' ') || firefighter.full_name;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Administración', href: '/admin/firefighters' },
                { title: 'Bomberos', href: '/admin/firefighters' },
                { title: displayName, href: `/admin/firefighters/${firefighter.id}` },
                { title: 'Editar', href: `/admin/firefighters/${firefighter.id}/edit` },
            ]}
        >
            <Head title={`Editar Bombero - ${displayName}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6">
                {/* Header Actions */}
                <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
                    <Button variant="ghost" size="sm" asChild className="gap-2">
                        <Link href={`/admin/firefighters/${firefighter.id}`}>
                            <ArrowLeft className="size-4" />
                            <span>Volver a la ficha</span>
                        </Link>
                    </Button>
                </div>

                <Card className="mx-auto w-full max-w-4xl rounded-2xl border border-border/70 shadow-xs">
                    <CardContent className="p-6 sm:p-8">
                        {/* Title and Icon */}
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Pencil className="size-5" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                        Editar Ficha de Bombero
                                    </h1>
                                    <p className="text-xs text-muted-foreground sm:text-sm">
                                        Modificando datos de {displayName}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-border/80">
                                    ID #{firefighter.id}
                                </Badge>
                                {firefighter.general_registry_number && (
                                    <Badge variant="secondary" className="font-mono">
                                        Reg. {firefighter.general_registry_number}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Información Personal */}
                            <div className="space-y-4">
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                                    Identificación Personal
                                </h2>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_name" className="text-sm font-medium">
                                            Primer Nombre <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="first_name"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            placeholder="Ej: Carlos"
                                            className="h-10 text-sm"
                                            required
                                            aria-invalid={!!errors.first_name}
                                        />
                                        <InputError message={errors.first_name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="middle_name" className="text-sm font-medium">
                                            Segundo Nombre <span className="text-xs font-normal text-muted-foreground">(Opcional)</span>
                                        </Label>
                                        <Input
                                            id="middle_name"
                                            value={data.middle_name}
                                            onChange={(e) => setData('middle_name', e.target.value)}
                                            placeholder="Ej: Alberto"
                                            className="h-10 text-sm"
                                            aria-invalid={!!errors.middle_name}
                                        />
                                        <InputError message={errors.middle_name} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="paternal_last_name" className="text-sm font-medium">
                                            Apellido Paterno <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="paternal_last_name"
                                            value={data.paternal_last_name}
                                            onChange={(e) => setData('paternal_last_name', e.target.value)}
                                            placeholder="Ej: Pérez"
                                            className="h-10 text-sm"
                                            required
                                            aria-invalid={!!errors.paternal_last_name}
                                        />
                                        <InputError message={errors.paternal_last_name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="maternal_last_name" className="text-sm font-medium">
                                            Apellido Materno <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="maternal_last_name"
                                            value={data.maternal_last_name}
                                            onChange={(e) => setData('maternal_last_name', e.target.value)}
                                            placeholder="Ej: Morales"
                                            className="h-10 text-sm"
                                            required
                                            aria-invalid={!!errors.maternal_last_name}
                                        />
                                        <InputError message={errors.maternal_last_name} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="rut" className="text-sm font-medium">
                                            RUT <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="rut"
                                            value={data.rut}
                                            onChange={(e) => setData('rut', e.target.value)}
                                            placeholder="Ej: 12.345.678-9"
                                            className="h-10 text-sm font-mono"
                                            required
                                            aria-invalid={!!errors.rut}
                                        />
                                        <InputError message={errors.rut} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-sm font-medium">
                                            Correo Electrónico <span className="text-xs font-normal text-muted-foreground">(Opcional)</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="voluntario@cbpa.cl"
                                            className="h-10 text-sm"
                                            aria-invalid={!!errors.email}
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>
                            </div>

                            {/* Información Institucional */}
                            <div className="space-y-4 pt-4 border-t border-border/60">
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                                    Información Institucional
                                </h2>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="company" className="text-sm font-medium">
                                            Compañía <span className="text-destructive">*</span>
                                        </Label>
                                        <Select
                                            value={data.company}
                                            onValueChange={(val) => setData('company', val)}
                                        >
                                            <SelectTrigger id="company" className="h-10 text-sm" aria-invalid={!!errors.company}>
                                                <SelectValue placeholder="Seleccione Compañía" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companies.map((c) => (
                                                    <SelectItem key={c} value={c}>
                                                        {c}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.company} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="general_registry_number" className="text-sm font-medium">
                                            N° Registro General <span className="text-xs font-normal text-muted-foreground">(Opcional)</span>
                                        </Label>
                                        <Input
                                            id="general_registry_number"
                                            value={data.general_registry_number}
                                            onChange={(e) => setData('general_registry_number', e.target.value)}
                                            placeholder="Ej: 155"
                                            className="h-10 text-sm font-mono"
                                            aria-invalid={!!errors.general_registry_number}
                                        />
                                        <InputError message={errors.general_registry_number} />
                                    </div>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-col-reverse gap-3 pt-6 border-t border-border/60 sm:flex-row sm:items-center sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                    disabled={processing}
                                >
                                    <Link href={`/admin/firefighters/${firefighter.id}`}>
                                        Cancelar
                                    </Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="gap-2 shadow-xs"
                                >
                                    <Save className="size-4" />
                                    <span>Guardar Cambios</span>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
