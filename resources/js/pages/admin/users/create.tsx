import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Shield, Truck } from 'lucide-react';
import { FormEventHandler } from 'react';

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

const modules = [
    // Material Menor
    { id: 'inventory', label: 'Inventario', category: 'Material Menor' },
    { id: 'tickets', label: 'Ticketera', category: 'Material Menor' },
    { id: 'batteries', label: 'Baterías', category: 'Material Menor' },
    { id: 'deliveries', label: 'Actas de Entrega', category: 'Material Menor' },
    {
        id: 'reception',
        label: 'Actas de Recepción',
        category: 'Material Menor',
    },
    // Material Mayor
    {
        id: 'vehicles.status',
        label: 'M. Mayor - Estado de Carros',
        category: 'Material Mayor',
    },
    {
        id: 'vehicles.incidents',
        label: 'M. Mayor - Incidencias',
        category: 'Material Mayor',
    },
    {
        id: 'vehicles.checklist',
        label: 'M. Mayor - Checklist',
        category: 'Material Mayor',
    },
    {
        id: 'vehicles.logs',
        label: 'M. Mayor - Bitácora',
        category: 'Material Mayor',
    },
    {
        id: 'vehicles.workshop',
        label: 'M. Mayor - Taller',
        category: 'Material Mayor',
    },
    {
        id: 'vehicles.inventory',
        label: 'M. Mayor - Inventario',
        category: 'Material Mayor',
    },
    // Administración
    { id: 'firefighters', label: 'Bomberos', category: 'Administración' },
];

const moduleCategories = ['Material Menor', 'Material Mayor', 'Administración'];

// Helper to filter options based on current user role
const getFilteredRoles = (currentUserRole: string) => {
    const allRoles = [
        { value: 'user', label: 'Usuario Estándar' },
        { value: 'admin', label: 'Administrador del Sistema' },
        { value: 'comandante', label: 'Comandante' },
        { value: 'capitan', label: 'Capitán' },
        { value: 'teniente', label: 'Teniente' },
        { value: 'maquinista', label: 'Maquinista' },
        { value: 'ayudante', label: 'Ayudante' },
        { value: 'ayudante', label: 'Ayudante' },
        { value: 'cuartelero', label: 'Cuartelero' }, // Added missing ones from backend validation just in case
        { value: 'mechanic', label: 'Taller Mecánico' },
        { value: 'inspector', label: 'Inspector General' },
    ];

    if (currentUserRole === 'capitan') {
        const allowed = ['user', 'teniente', 'maquinista', 'ayudante'];
        return allRoles.filter((r) => allowed.includes(r.value));
    }

    return allRoles;
};

const getFilteredModules = (currentUserRole: string) => {
    if (currentUserRole === 'capitan') {
        const restricted = [
            'vehicles.inventory',
            'vehicles.workshop',
            'firefighters',
            'vehicles', // General Mayor
            'equipment', // General Menor
        ];
        return modules.filter((m) => !restricted.includes(m.id));
    }
    return modules;
};

export default function UserCreate({
    availableVehicles,
}: {
    availableVehicles?: any[];
}) {
    const { props } = usePage<SharedData>();
    const user = props.auth.user;
    const currentUserRole = user?.role || 'user';

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        company: currentUserRole === 'capitan' ? user.company || '' : '',
        role: 'user',
        department: '',
        permissions: [] as string[],
        driver_vehicles: [] as number[],
    });

    const filteredRoles = getFilteredRoles(currentUserRole);
    const filteredModules = getFilteredModules(currentUserRole);

    const handleVehicleToggle = (id: number) => {
        const current = data.driver_vehicles;
        if (current.includes(id)) {
            setData(
                'driver_vehicles',
                current.filter((v) => v !== id),
            );
        } else {
            setData('driver_vehicles', [...current, id]);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/users');
    };

    const handlePermissionChange = (moduleId: string, value: string) => {
        // value: 'none', 'view', 'edit', 'full'
        let newPermissions = data.permissions.filter(
            (p) => !p.startsWith(`${moduleId}.`),
        );

        if (value === 'view') {
            newPermissions.push(`${moduleId}.view`);
        } else if (value === 'edit') {
            newPermissions.push(`${moduleId}.view`, `${moduleId}.edit`);
        } else if (value === 'full') {
            newPermissions.push(
                `${moduleId}.view`,
                `${moduleId}.edit`,
                `${moduleId}.full`,
            );
        }

        // Auto-assign dependencies
        const equipmentDeps = ['inventory', 'deliveries', 'reception'];
        if (
            equipmentDeps.includes(moduleId) &&
            value !== 'none' &&
            !newPermissions.some(
                (p) =>
                    p === 'equipment.view' ||
                    p === 'equipment.edit' ||
                    p === 'equipment.full',
            )
        ) {
            const hasEquipment = newPermissions.some((p) =>
                p.startsWith('equipment.'),
            );

            if (!hasEquipment) {
                newPermissions.push('equipment.view');
            }
        }

        // Material Mayor Dependencies
        const materialMayorModules = [
            'vehicles.status',
            'vehicles.incidents',
            'vehicles.checklist',
            'vehicles.logs',
            'vehicles.workshop',
            'vehicles.inventory',
        ];

        if (materialMayorModules.includes(moduleId) && value !== 'none') {
            // If any MM module is granted, ensure 'vehicles.view' (General Access) is granted
            // We must check specifically for the parent permission, not just any starting with "vehicles"
            // because "vehicles.logs" starts with "vehicles" but does not grant access to the group middleware.
            const hasParentAccess = newPermissions.some(
                (p) =>
                    p === 'vehicles.view' ||
                    p === 'vehicles.edit' ||
                    p === 'vehicles.full',
            );

            if (!hasParentAccess) {
                newPermissions.push('vehicles.view');
            }
        }

        setData('permissions', newPermissions);
    };

    const getPermissionValue = (moduleId: string) => {
        const hasFull = data.permissions.includes(`${moduleId}.full`);
        const hasEdit = data.permissions.includes(`${moduleId}.edit`);
        const hasView = data.permissions.includes(`${moduleId}.view`);

        if (hasFull) return 'full';
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
                                        disabled={
                                            currentUserRole === 'capitan' ||
                                            data.role === 'comandante' ||
                                            data.role === 'inspector'
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
                                    onValueChange={(value) => {
                                        setData((prev) => ({
                                            ...prev,
                                            role: value,
                                            permissions:
                                                value === 'admin' ||
                                                value === 'comandante' ||
                                                value === 'capitan' ||
                                                value === 'maquinista' ||
                                                value === 'inspector' ||
                                                value === 'mechanic'
                                                    ? []
                                                    : prev.permissions,
                                            company:
                                                value === 'comandante' ||
                                                value === 'inspector'
                                                    ? 'Comandancia'
                                                    : prev.company,
                                        }));
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccione un Rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredRoles.map((role) => (
                                            <SelectItem
                                                key={role.value}
                                                value={role.value}
                                            >
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {data.role === 'inspector' && (
                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium">
                                        Departamento
                                    </label>
                                    <Select
                                        value={data.department}
                                        onValueChange={(value) =>
                                            setData('department', value)
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccione Departamento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Material Mayor">
                                                Material Mayor
                                            </SelectItem>
                                            <SelectItem value="Material Menor">
                                                Material Menor
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {data.role !== 'admin' &&
                                data.role !== 'comandante' &&
                                data.role !== 'capitan' &&
                                data.role !== 'maquinista' &&
                                data.role !== 'inspector' && ( // Admin/Capitan/Maquinista/Inspector have implicit permissions
                                    <div>
                                        <label className="mb-3 block text-sm font-medium">
                                            Permisos por Módulo
                                        </label>
                                        <div className="space-y-6">
                                            {moduleCategories.map(
                                                (category) =>
                                                    // Only show category if it has modules allowed
                                                    filteredModules.some(
                                                        (m) =>
                                                            m.category ===
                                                            category,
                                                    ) && (
                                                        <div
                                                            key={category}
                                                            className="rounded-md border p-3"
                                                        >
                                                            <h4 className="mb-2 text-sm font-semibold text-foreground">
                                                                {category}
                                                            </h4>
                                                            <table className="w-full text-sm">
                                                                <tbody className="divide-y">
                                                                    {filteredModules
                                                                        .filter(
                                                                            (
                                                                                m,
                                                                            ) =>
                                                                                m.category ===
                                                                                category,
                                                                        )
                                                                        .map(
                                                                            (
                                                                                module,
                                                                            ) => (
                                                                                <tr
                                                                                    key={
                                                                                        module.id
                                                                                    }
                                                                                >
                                                                                    <td className="w-1/3 py-2.5 font-medium">
                                                                                        {
                                                                                            module.label
                                                                                        }
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
                                                                                            {(module.id ===
                                                                                                'vehicles' ||
                                                                                                module.id ===
                                                                                                    'equipment') && (
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() =>
                                                                                                        handlePermissionChange(
                                                                                                            module.id,
                                                                                                            'full',
                                                                                                        )
                                                                                                    }
                                                                                                    className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
                                                                                                        getPermissionValue(
                                                                                                            module.id,
                                                                                                        ) ===
                                                                                                        'full'
                                                                                                            ? 'bg-purple-100 text-purple-700 shadow-sm'
                                                                                                            : 'text-muted-foreground hover:bg-background/50'
                                                                                                    }`}
                                                                                                >
                                                                                                    Total
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            ),
                                                                        )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ), // Closing paren for the filteredModules.some check
                                            )}
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            'Editar' incluye permisos de 'Ver'.
                                        </p>
                                    </div>
                                )}
                        </div>

                        {/* Vehículos Permitidos */}
                        {availableVehicles && availableVehicles.length > 0 && (
                            <div className="rounded-lg border p-4">
                                <h3 className="mb-4 flex items-center gap-2 font-medium">
                                    <Truck className="size-4" /> Vehículos
                                    Permitidos (Maquinistas)
                                </h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Seleccione los vehículos que este usuario
                                    está autorizado a conducir y registrar en
                                    bitácora.
                                </p>
                                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {availableVehicles.map((vehicle) => (
                                            <div
                                                className="flex items-center space-x-2"
                                                key={vehicle.id}
                                            >
                                                <Checkbox
                                                    id={`v-${vehicle.id}`}
                                                    checked={data.driver_vehicles.includes(
                                                        vehicle.id,
                                                    )}
                                                    onCheckedChange={() =>
                                                        handleVehicleToggle(
                                                            vehicle.id,
                                                        )
                                                    }
                                                />
                                                <label
                                                    htmlFor={`v-${vehicle.id}`}
                                                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {vehicle.name}{' '}
                                                    <span className="text-xs text-muted-foreground">
                                                        ({vehicle.company})
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50"
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
