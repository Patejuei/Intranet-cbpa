import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Check, Shield } from 'lucide-react';
import { FormEventHandler } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    company: string;
    role: string;
    permissions: string[] | null;
}

const availablePermissions = [
    { id: 'batteries', label: 'Baterías' },
    { id: 'equipment', label: 'Material Menor' },
    { id: 'tickets', label: 'Ticketera' },
    { id: 'admin', label: 'Administrador' },
];

const companies = [
    'Primera Compañía',
    'Segunda Compañía',
    'Tercera Compañía',
    'Cuarta Compañía',
    'Quinta Compañía',
    'Séptima Compañía',
    'Octava Compañía',
    'Novena Compañía',
    'Décima Compañía',
    'Comandancia',
];

export default function UserEdit({ user }: { user: User }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        company: user.company,
        role: user.role,
        permissions: user.permissions ?? ([] as string[]),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    const togglePermission = (id: string) => {
        if (data.permissions.includes(id)) {
            setData(
                'permissions',
                data.permissions.filter((p) => p !== id),
            );
        } else {
            setData('permissions', [...data.permissions, id]);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Usuarios', href: '/admin/users' },
                {
                    title: 'Editar Usuario',
                    href: `/admin/users/${user.id}/edit`,
                },
            ]}
        >
            <Head title="Editar Usuario" />

            <div className="flex flex-col gap-6 p-4">
                <div className="max-w-2xl rounded-xl border bg-card p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-foreground">
                            Editar Usuario: {user.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Modifique los detalles del usuario. Deje la
                            contraseña en blanco para mantener la actual.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Datos Básicos */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Contraseña (Opcional)
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                        placeholder="••••••••"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Compañía
                                    </label>
                                    <select
                                        value={data.company}
                                        onChange={(e) =>
                                            setData('company', e.target.value)
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    >
                                        <option value="">
                                            Seleccione una Compañía
                                        </option>
                                        {companies.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.company && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.company}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Roles y Permisos */}
                        <div className="rounded-lg border p-4">
                            <h3 className="mb-4 flex items-center gap-2 font-medium">
                                <Shield className="size-4" /> Roles y Permisos
                            </h3>

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium">
                                    Rol del Sistema
                                </label>
                                <select
                                    value={data.role}
                                    onChange={(e) =>
                                        setData('role', e.target.value)
                                    }
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                >
                                    <option value="user">
                                        Usuario Estándar
                                    </option>
                                    <option value="admin">
                                        Administrador del Sistema
                                    </option>
                                </select>
                            </div>

                            {data.role !== 'admin' && (
                                <div>
                                    <label className="mb-3 block text-sm font-medium">
                                        Acceso a Módulos
                                    </label>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {availablePermissions.map((perm) => (
                                            <div
                                                key={perm.id}
                                                onClick={() =>
                                                    togglePermission(perm.id)
                                                }
                                                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                                                    data.permissions.includes(
                                                        perm.id,
                                                    )
                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                        : 'hover:bg-muted/50'
                                                }`}
                                            >
                                                <div
                                                    className={`flex size-5 items-center justify-center rounded border ${
                                                        data.permissions.includes(
                                                            perm.id,
                                                        )
                                                            ? 'border-primary bg-primary text-primary-foreground'
                                                            : 'border-muted-foreground'
                                                    }`}
                                                >
                                                    {data.permissions.includes(
                                                        perm.id,
                                                    ) && (
                                                        <Check className="size-3" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {perm.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground text-white transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50"
                            >
                                Gardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
