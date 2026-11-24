import ActionOtpVerificationModal from '@/components/action-otp-verification-modal';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useOtpAction } from '@/hooks/use-otp-action';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Shield, Truck, UserPlus } from 'lucide-react';
import { FormEventHandler, useMemo, useState } from 'react';

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
    // 'Brigada Juvenil',
    'Comandancia',
];

const modules = [
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
        { value: 'maquinista', label: 'Maquinista' },
        { value: 'ayudante', label: 'Ayudante' },
        { value: 'cuartelero', label: 'Cuartelero' },
        { value: 'mechanic', label: 'Taller Mecánico' },
        { value: 'inspector', label: 'Inspector General' },
        {
            value: 'secretaria_adquisiciones',
            label: 'Secretaria de Adquisiciones',
        },
    ];

    if (currentUserRole === 'capitan' || currentUserRole === 'ayudante') {
        const allowed = ['user', 'ayudante', 'maquinista', 'cuartelero'];
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
            'vehicles',
            'equipment',
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
    const { isOtpModalOpen, performWithOtp, handleVerified, closeOtpModal } = useOtpAction();
    const [formKey] = useState(() => 'user-create-' + Math.random().toString(36).substring(2, 9));

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        rut: '',
        password: '',
        password_confirmation: '',
        company: currentUserRole === 'capitan' ? user.company || '' : '',
        role: 'user',
        department: '',
        is_enabled: true,
        permissions: [] as string[],
        driver_vehicles: [] as number[],
    });

    const filteredRoles = getFilteredRoles(currentUserRole);
    const filteredModules = getFilteredModules(currentUserRole);

    const groupedVehicles = useMemo(() => {
        if (!availableVehicles || availableVehicles.length === 0) return [];

        const companyPriority: Record<string, number> = {
            'Primera Compañía': 1,
            'Segunda Compañía': 2,
            'Tercera Compañía': 3,
            'Cuarta Compañía': 4,
            'Quinta Compañía': 5,
            'Séptima Compañía': 7,
            'Octava Compañía': 8,
            'Novena Compañía': 9,
            'Décima Compañía': 10,
            'Comandancia': 99,
        };

        const groups: Record<string, any[]> = {};
        for (const vehicle of availableVehicles) {
            const comp = vehicle.company || 'Otras';
            if (!groups[comp]) groups[comp] = [];
            groups[comp].push(vehicle);
        }

        for (const comp in groups) {
            groups[comp].sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }),
            );
        }

        return Object.keys(groups)
            .sort((a, b) => {
                const priorityA = companyPriority[a] ?? 50;
                const priorityB = companyPriority[b] ?? 50;
                if (priorityA !== priorityB) return priorityA - priorityB;
                return a.localeCompare(b);
            })
            .map((companyName) => ({
                company: companyName,
                vehicles: groups[companyName],
            }));
    }, [availableVehicles]);

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
        performWithOtp(() => {
            post('/admin/users');
        });
    };

    const handlePermissionChange = (moduleId: string, value: string) => {
        const newPermissions = data.permissions.filter(
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

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 sm:p-6">
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-foreground"
                        asChild
                    >
                        <Link href="/admin/users">
                            <ArrowLeft className="size-4" />
                            <span>Volver a la lista de usuarios</span>
                        </Link>
                    </Button>
                </div>

                <Card className="rounded-2xl border border-border/70 shadow-xs">
                    <CardContent className="p-6 sm:p-8">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <UserPlus className="size-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                    Registrar Nuevo Usuario
                                </h1>
                                <p className="text-xs text-muted-foreground sm:text-sm">
                                    Configura los datos personales, compañía, rol y accesos a los módulos.
                                </p>
                            </div>
                        </div>

                        <form key={formKey} onSubmit={submit} className="space-y-6">
                            {/* Datos Básicos */}
                            <div className="space-y-4">
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                                    Información Personal y Credenciales
                                </h2>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-foreground">
                                            Nombre Completo <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="Ej: Juan Pérez Morales"
                                            className="h-10 text-sm"
                                            required
                                            aria-invalid={!!errors.name}
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                            Correo Electrónico <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            placeholder="ejemplo@cbpa.cl"
                                            className="h-10 text-sm"
                                            required
                                            aria-invalid={!!errors.email}
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="rut" className="text-sm font-medium text-foreground">
                                            RUT (Sin puntos y con guión)
                                        </Label>
                                        <Input
                                            id="rut"
                                            type="text"
                                            placeholder="12345678-K"
                                            value={data.rut || ''}
                                            onChange={(e) =>
                                                setData('rut', e.target.value)
                                            }
                                            className="h-10 text-sm"
                                            aria-invalid={!!errors.rut}
                                        />
                                        <InputError message={errors.rut} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="company" className="text-sm font-medium text-foreground">
                                            Compañía
                                        </Label>
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
                                            <SelectTrigger id="company" className="h-10 text-sm">
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
                                            <InputError message={errors.company} />
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                            Contraseña <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData('password', e.target.value)
                                            }
                                            className="h-10 text-sm"
                                            required
                                            aria-invalid={!!errors.password}
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-foreground">
                                            Confirmar Contraseña <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-10 text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="is_enabled"
                                        checked={data.is_enabled}
                                        onCheckedChange={(checked) =>
                                            setData('is_enabled', !!checked)
                                        }
                                    />
                                    <div className="grid gap-1 leading-none">
                                        <Label
                                            htmlFor="is_enabled"
                                            className="text-sm font-medium cursor-pointer"
                                        >
                                            Usuario Habilitado
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Si se desmarca, el usuario no podrá iniciar sesión en la intranet.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Roles y Permisos */}
                            <div className="space-y-4 rounded-xl border border-border/70 bg-muted/10 p-5 shadow-xs">
                                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Shield className="size-4 text-primary" />
                                    <span>Roles y Permisos del Sistema</span>
                                </h2>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="role" className="text-sm font-medium text-foreground">
                                            Rol del Sistema
                                        </Label>
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
                                                        value === 'mechanic' ||
                                                        value ===
                                                            'secretaria_adquisiciones' ||
                                                        value === 'central_operator'
                                                            ? []
                                                            : prev.permissions,
                                                    company:
                                                        value === 'comandante' ||
                                                        value === 'inspector' ||
                                                        value === 'central_operator'
                                                            ? 'Comandancia'
                                                            : prev.company,
                                                }));
                                            }}
                                        >
                                            <SelectTrigger id="role" className="h-10 text-sm">
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
                                        <div className="grid gap-2">
                                            <Label htmlFor="department" className="text-sm font-medium text-foreground">
                                                Departamento
                                            </Label>
                                            <Select
                                                value={data.department}
                                                onValueChange={(value) =>
                                                    setData('department', value)
                                                }
                                            >
                                                <SelectTrigger id="department" className="h-10 text-sm">
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
                                </div>

                                {data.role !== 'admin' &&
                                    data.role !== 'comandante' &&
                                    data.role !== 'capitan' &&
                                    data.role !== 'maquinista' &&
                                    data.role !== 'inspector' &&
                                    data.role !== 'cuartelero' &&
                                    data.role !== 'ayudante' &&
                                    data.role !== 'mechanic' &&
                                    data.role !== 'secretaria_adquisiciones' && (
                                        <div className="pt-2">
                                            <Label className="mb-3 block text-sm font-medium text-foreground">
                                                Permisos Granulares por Módulo
                                            </Label>
                                            <div className="space-y-4">
                                                {moduleCategories.map(
                                                    (category) =>
                                                        filteredModules.some(
                                                            (m) =>
                                                                m.category ===
                                                                category,
                                                        ) && (
                                                            <div
                                                                key={category}
                                                                className="rounded-xl border border-border/70 bg-card p-4 shadow-xs"
                                                            >
                                                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
                                                                    {category}
                                                                </h3>
                                                                <div className="divide-y divide-border/60">
                                                                    {filteredModules
                                                                        .filter(
                                                                            (m) =>
                                                                                m.category ===
                                                                                category,
                                                                        )
                                                                        .map((module) => (
                                                                            <div
                                                                                key={module.id}
                                                                                className="flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                                                                            >
                                                                                <span className="text-sm font-medium text-foreground">
                                                                                    {module.label}
                                                                                </span>
                                                                                <div className="inline-flex rounded-lg border border-border/70 bg-muted/50 p-1">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            handlePermissionChange(
                                                                                                module.id,
                                                                                                'none',
                                                                                            )
                                                                                        }
                                                                                        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                                                                            getPermissionValue(
                                                                                                module.id,
                                                                                            ) === 'none'
                                                                                                ? 'bg-background text-foreground shadow-xs font-semibold'
                                                                                                : 'text-muted-foreground hover:text-foreground'
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
                                                                                        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                                                                            getPermissionValue(
                                                                                                module.id,
                                                                                            ) === 'view'
                                                                                                ? 'bg-sky-500/15 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300 shadow-xs font-semibold'
                                                                                                : 'text-muted-foreground hover:text-foreground'
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
                                                                                        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                                                                            getPermissionValue(
                                                                                                module.id,
                                                                                            ) === 'edit'
                                                                                                ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300 shadow-xs font-semibold'
                                                                                                : 'text-muted-foreground hover:text-foreground'
                                                                                        }`}
                                                                                    >
                                                                                        Editar
                                                                                    </button>
                                                                                    {(module.id === 'vehicles' ||
                                                                                        module.id === 'equipment') && (
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() =>
                                                                                                handlePermissionChange(
                                                                                                    module.id,
                                                                                                    'full',
                                                                                                )
                                                                                            }
                                                                                            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                                                                                                getPermissionValue(
                                                                                                    module.id,
                                                                                                ) === 'full'
                                                                                                    ? 'bg-purple-500/15 text-purple-700 dark:bg-purple-500/25 dark:text-purple-300 shadow-xs font-semibold'
                                                                                                    : 'text-muted-foreground hover:text-foreground'
                                                                                            }`}
                                                                                        >
                                                                                            Total
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                </div>
                                                            </div>
                                                        ),
                                                )}
                                            </div>
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                * El permiso de 'Editar' incluye automáticamente las atribuciones de 'Ver'.
                                            </p>
                                        </div>
                                    )}
                            </div>

                            {/* Vehículos Permitidos */}
                            {availableVehicles && availableVehicles.length > 0 && (
                                <div className="space-y-3 rounded-xl border border-border/70 bg-muted/10 p-5 shadow-xs">
                                    <div className="flex items-center justify-between">
                                        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <Truck className="size-4 text-primary" />
                                            <span>Vehículos Autorizados por Compañía</span>
                                        </h2>
                                        <span className="text-xs text-muted-foreground">
                                            {data.driver_vehicles.length} {data.driver_vehicles.length === 1 ? 'seleccionado' : 'seleccionados'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Seleccione los carros organizados por compañía que este usuario está habilitado para conducir y registrar en bitácoras.
                                    </p>
                                    <ScrollArea className="h-[280px] w-full rounded-xl border border-border/70 bg-card p-4">
                                        <div className="space-y-5">
                                            {groupedVehicles.map(({ company, vehicles }) => (
                                                <div key={company} className="space-y-2.5">
                                                    <div className="flex items-center gap-2 border-b border-border/50 pb-1">
                                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                            {company}
                                                        </span>
                                                        <span className="rounded-full bg-muted/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                            {vehicles.length}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                                                        {vehicles.map((vehicle) => (
                                                            <div
                                                                className="flex items-center space-x-2.5 rounded-lg border border-border/40 bg-muted/20 p-2.5 transition hover:bg-muted/50"
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
                                                                    className="text-xs font-medium cursor-pointer text-foreground"
                                                                >
                                                                    <span className="font-semibold text-primary">{vehicle.name}</span>
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}

                            <div className="flex flex-col-reverse justify-end gap-3 pt-4 sm:flex-row sm:items-center">
                                <Button
                                    variant="outline"
                                    type="button"
                                    asChild
                                    className="w-full sm:w-auto"
                                >
                                    <Link href="/admin/users">
                                        Cancelar
                                    </Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full gap-2 shadow-xs sm:w-auto"
                                >
                                    <UserPlus className="size-4" />
                                    <span>Registrar Usuario</span>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <ActionOtpVerificationModal
                    isOpen={isOtpModalOpen}
                    onClose={closeOtpModal}
                    onVerified={handleVerified}
                />
            </div>
        </AppLayout>
    );
}
