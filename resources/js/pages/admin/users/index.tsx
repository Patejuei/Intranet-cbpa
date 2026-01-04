import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash, UserPlus } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions: string[];
    company: string;
}

interface PageProps {
    users: {
        data: User[];
        links: any[];
    };
}

export default function UserIndex({ users }: PageProps) {
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Administración', href: '/admin/users' },
            ]}
        >
            <Head title="Gestión de Usuarios" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Gestión de Usuarios
                        </h2>
                        <p className="text-muted-foreground">
                            Administra usuarios, roles y permisos.
                        </p>
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        <UserPlus className="size-4" />
                        Nuevo Usuario
                    </Link>
                </div>

                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Nombre
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Compañía
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Rol
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Permisos
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-muted/30"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {user.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.company || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {user.role === 'admin' ? (
                                                    <span className="text-xs text-muted-foreground">
                                                        Acceso Total
                                                    </span>
                                                ) : (
                                                    (Array.isArray(
                                                        user.permissions,
                                                    )
                                                        ? user.permissions
                                                        : []
                                                    ).map((perm) => (
                                                        <span
                                                            key={perm}
                                                            className="rounded border bg-background px-1.5 py-0.5 text-xs text-muted-foreground"
                                                        >
                                                            {perm}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                    className="rounded p-1 text-blue-600 hover:bg-blue-100"
                                                >
                                                    <Pencil className="size-4" />
                                                </Link>
                                                {user.id !== 1 && ( // Prevent deleting main admin
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                user.id,
                                                            )
                                                        }
                                                        className="rounded p-1 text-red-600 hover:bg-red-100"
                                                    >
                                                        <Trash className="size-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination links={users.links} />
            </div>
        </AppLayout>
    );
}
