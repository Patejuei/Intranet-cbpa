import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import { FormEventHandler } from 'react';

const modules = [
    { id: 'inventory', label: 'Inventario' },
    { id: 'tickets', label: 'Ticketera' },
    { id: 'batteries', label: 'Baterías' },
    { id: 'equipment', label: 'Material Menor' },
    { id: 'deliveries', label: 'Actas de Entrega' },
    { id: 'firefighters', label: 'Bomberos' },
    { id: 'vehicles', label: 'Material Mayor (General)' },
    { id: 'vehicles.incidents', label: 'M. Mayor - Incidencias' },
    { id: 'vehicles.logs', label: 'M. Mayor - Bitácora' },
    { id: 'vehicles.workshop', label: 'M. Mayor - Taller' },
    { id: 'vehicles.inventory', label: 'M. Mayor - Inventario' },
];

const companies = [
    'Primera Compañía',
    'Segunda Compañía',
    'Tercera Compañía',
    'Cuarta Compañía',
    'Quinta Compañía',
    'Sexta Compañía',
    'Séptima Compañía',
    'Octava Compañía',
    'Novena Compañía',
    'Décima Compañía',
    'Brigada Juvenil',
    'Comandancia',
];

const roles = [
    { value: 'user', label: 'Usuario Estándar' },
    { value: 'admin', label: 'Administrador del Sistema' },
    { value: 'capitan', label: 'Capitán' },
    { value: 'teniente', label: 'Teniente' },
    { value: 'maquinista', label: 'Maquinista' },
    { value: 'ayudante', label: 'Ayudante' },
    { value: 'comandancia', label: 'Comandancia' },
];

export default function UserCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        company: '',
        role: 'user',
        permissions: [] as string[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/users');
    };

    const handlePermissionChange = (moduleId: string, value: string) => {
        // value: 'none', 'view', 'edit'
        let newPermissions = data.permissions.filter(
            (p) => !p.startsWith(`${moduleId}.`),
        );

        if (value === 'view') {
            newPermissions.push(`${moduleId}.view`);
        } else if (value === 'edit') {
            newPermissions.push(`${moduleId}.view`, `${moduleId}.edit`);
        }

        setData('permissions', newPermissions);
    };

    const getPermissionValue = (moduleId: string) => {
        const hasEdit = data.permissions.includes(`${moduleId}.edit`);
        const hasView = data.permissions.includes(`${moduleId}.view`);
        if (hasEdit) return 'edit';
        if (hasView) return 'view';
        return 'none';
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Usuarios', href: '/admin/users' },
                { title: 'Nuevo Usuario', href: '/admin/users/create' },
            ]}
        >
            <Head title="Crear Usuario" />

            <div className="flex flex-col gap-6 p-4">
                <div className="max-w-4xl rounded-xl border bg-card p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-foreground">
                            Crear Nuevo Usuario
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Complete los detalles para registrar un nuevo
                            usuario en el sistema.
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
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
                                    <Select
                                        value={data.company}
                                        onValueChange={(value) =>
                                            setData('company', value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccione una Compañía" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map((c) => (
                                                <SelectItem key={c} value={c}>
                                                    {c}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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

                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium">
                                    Rol del Sistema
                                </label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) =>
                                        setData('role', value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccione un Rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">
                                            Usuario (Por Defecto)
                                        </SelectItem>
                                        <SelectItem value="admin">
                                            Administrador
                                        </SelectItem>
                                        <SelectItem value="capitan">
                                            Capitán
                                        </SelectItem>
                                        <SelectItem value="cuartelero">
                                            Cuartelero
                                        </SelectItem>
                                        <SelectItem value="mechanic">
                                            Taller Mecánico
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {data.role !== 'admin' &&
                                data.role !== 'capitan' && ( // Admin naturally has full access, Captain too maybe? Or handle separately
                                    <div>
                                        <label className="mb-3 block text-sm font-medium">
                                            Permisos por Módulo
                                        </label>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-left text-muted-foreground">
                                                        <th className="pb-2 font-medium">
                                                            Módulo
                                                        </th>
                                                        <th className="pb-2 font-medium">
                                                            Nivel de Acceso
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {modules.map((module) => (
                                                        <tr key={module.id}>
                                                            <td className="py-2.5 font-medium">
                                                                {module.label}
                                                            </td>
                                                            <td className="py-2">
                                                                <div className="flex gap-1 rounded-md bg-muted/50 p-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handlePermissionChange(
                                                                                module.id,
                                                                                'none',
                                                                            )
                                                                        }
                                                                        className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                                                            getPermissionValue(
                                                                                module.id,
                                                                            ) ===
                                                                            'none'
                                                                                ? 'bg-background shadow-sm'
                                                                                : 'text-muted-foreground hover:bg-background/50'
                                                                        }`}
                                                                    >
                                                                        Ninguno
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handlePermissionChange(
                                                                                module.id,
                                                                                'view',
                                                                            )
                                                                        }
                                                                        className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                                                            getPermissionValue(
                                                                                module.id,
                                                                            ) ===
                                                                            'view'
                                                                                ? 'bg-blue-100 text-blue-700 shadow-sm'
                                                                                : 'text-muted-foreground hover:bg-background/50'
                                                                        }`}
                                                                    >
                                                                        Ver
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handlePermissionChange(
                                                                                module.id,
                                                                                'edit',
                                                                            )
                                                                        }
                                                                        className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                                                            getPermissionValue(
                                                                                module.id,
                                                                            ) ===
                                                                            'edit'
                                                                                ? 'bg-green-100 text-green-700 shadow-sm'
                                                                                : 'text-muted-foreground hover:bg-background/50'
                                                                        }`}
                                                                    >
                                                                        Editar
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            'Editar' incluye permisos de 'Ver'.
                                        </p>
                                    </div>
                                )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground text-white transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50"
                            >
                                Registrar Usuario
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
