import Pagination from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Search, Trash, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface PageProps {
    firefighters: {
        data: Firefighter[];
        links: any[];
    };
    filters: {
        search: string;
    };
}

export default function FirefighterIndex({ firefighters, filters }: PageProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isEdit, setIsEdit] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Form handling
    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: 0,
        general_registry_number: '',
        full_name: '',
        rut: '',
        company: '',
        email: '',
    });

    const openCreate = () => {
        reset();
        setIsEdit(false);
        setIsOpen(true);
    };

    const openEdit = (firefighter: Firefighter) => {
        setData({
            id: firefighter.id,
            general_registry_number: firefighter.general_registry_number || '',
            full_name: firefighter.full_name,
            rut: firefighter.rut,
            company: firefighter.company,
            email: firefighter.email || '',
        });
        setIsEdit(true);
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/firefighters/${data.id}`, {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            post('/admin/firefighters', {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este bombero?')) {
            router.delete(`/admin/firefighters/${id}`);
        }
    };

    // Debounced search
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        // Basic debounce implementation or just direct replace for now?
        // Let's us simple timeout or just a keypress effect if possible, but setState is immediate.
        // We will trigger router visit on a debounce effect.
    };

    // Effect for debounce
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (typingTimeout) clearTimeout(typingTimeout);

        setTypingTimeout(
            setTimeout(() => {
                router.get(
                    '/admin/firefighters',
                    { search: value },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    },
                );
            }, 300),
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Administración', href: '/admin/firefighters' },
            ]}
        >
            <Head title="Gestión de Bomberos" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Gestión de Bomberos
                        </h2>
                        <p className="text-muted-foreground">
                            Administra el personal de bomberos.
                        </p>
                    </div>
                    <Button onClick={openCreate} className="gap-2">
                        <UserPlus className="size-4" />
                        Nuevo Bombero
                    </Button>
                </div>

                <div className="flex max-w-sm items-center gap-2">
                    <Search className="size-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre, RUT o N° Reg..."
                        value={searchTerm}
                        onChange={onSearchChange}
                        className="h-9"
                    />
                </div>
                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        N° Reg. General
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Nombre Completo
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        RUT
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Compañía
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {firefighters.data.length > 0 ? (
                                    firefighters.data.map((firefighter) => (
                                        <tr
                                            key={firefighter.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3">
                                                {firefighter.general_registry_number ||
                                                    '-'}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {firefighter.full_name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {firefighter.rut}
                                            </td>
                                            <td className="px-4 py-3">
                                                {firefighter.company}
                                            </td>
                                            <td className="px-4 py-3">
                                                {firefighter.email || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openEdit(
                                                                firefighter,
                                                            )
                                                        }
                                                        className="rounded p-1 text-blue-600 hover:bg-blue-100"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                firefighter.id,
                                                            )
                                                        }
                                                        className="rounded p-1 text-red-600 hover:bg-red-100"
                                                    >
                                                        <Trash className="size-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No se encontraron bomberos en esta
                                            página.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination links={firefighters.links} />
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Editar Bombero' : 'Nuevo Bombero'}
                        </DialogTitle>
                        <DialogDescription>
                            Complete los datos del bombero.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="company">Compañía</Label>
                            {/* Assuming Admin can set company, or filtering by user's company logic */}
                            <Select
                                value={data.company}
                                onValueChange={(value) =>
                                    setData('company', value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione Compañía" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Primera Compañía">
                                        Primera Compañía
                                    </SelectItem>
                                    <SelectItem value="Segunda Compañía">
                                        Segunda Compañía
                                    </SelectItem>
                                    <SelectItem value="Tercera Compañía">
                                        Tercera Compañía
                                    </SelectItem>
                                    <SelectItem value="Cuarta Compañía">
                                        Cuarta Compañía
                                    </SelectItem>
                                    <SelectItem value="Quinta Compañía">
                                        Quinta Compañía
                                    </SelectItem>
                                    <SelectItem value="Séptima Compañía">
                                        Séptima Compañía
                                    </SelectItem>
                                    <SelectItem value="Octava Compañía">
                                        Octava Compañía
                                    </SelectItem>
                                    <SelectItem value="Novena Compañía">
                                        Novena Compañía
                                    </SelectItem>
                                    <SelectItem value="Décima Compañía">
                                        Décima Compañía
                                    </SelectItem>
                                    <SelectItem value="Comandancia">
                                        Comandancia
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.company && (
                                <p className="text-sm text-red-500">
                                    {errors.company}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="full_name">Nombre Completo</Label>
                            <Input
                                id="full_name"
                                value={data.full_name}
                                onChange={(e) =>
                                    setData('full_name', e.target.value)
                                }
                                required
                            />
                            {errors.full_name && (
                                <p className="text-sm text-red-500">
                                    {errors.full_name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="rut">RUT</Label>
                            <Input
                                id="rut"
                                value={data.rut}
                                onChange={(e) => setData('rut', e.target.value)}
                                placeholder="12.345.678-9"
                                required
                            />
                            {errors.rut && (
                                <p className="text-sm text-red-500">
                                    {errors.rut}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="general_registry_number">
                                N° Registro General
                            </Label>
                            <Input
                                id="general_registry_number"
                                value={data.general_registry_number}
                                onChange={(e) =>
                                    setData(
                                        'general_registry_number',
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.general_registry_number && (
                                <p className="text-sm text-red-500">
                                    {errors.general_registry_number}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="bombero@ejemplo.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {isEdit ? 'Guardar Cambios' : 'Crear Bombero'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
