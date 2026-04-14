import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Settings, Signature, User as UserIcon } from 'lucide-react';

interface Firefighter {
    id: number;
    full_name: string;
    company: string;
    rut: string;
    email: string;
    general_registry_number: string;
}

interface AssignedMaterial {
    id: number;
    material: {
        product_name: string;
        brand: string | null;
        model: string | null;
        serial_number: string | null;
        code: string | null;
    };
    quantity: number;
    assigned_at: string;
    condition: string;
}

interface Props {
    firefighter: Firefighter | null;
    assignedMaterials: AssignedMaterial[];
}

export default function MyProfileIndex({
    firefighter,
    assignedMaterials,
}: Props) {
    const user = usePage<SharedData>().props.auth.user;

    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            _method: 'PATCH',
            signature: null as File | null,
        });

    const submitSignature = (e: React.FormEvent) => {
        e.preventDefault();
        post(ProfileController.update.url(), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Mi Perfil', href: '/my-profile' }]}>
            <Head title="Mi Perfil" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {/* Profile Header Card */}
                <Card>
                    <CardContent className="relative flex flex-col items-center gap-6 p-6 text-center sm:flex-row sm:text-left">
                        <Avatar className="h-24 w-24">
                            {/* Initials fallback */}
                            <AvatarFallback className="text-2xl">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-center space-y-1 sm:items-start">
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <div className="flex flex-wrap items-center justify-center gap-2 text-muted-foreground sm:justify-start">
                                <UserIcon className="h-4 w-4" />
                                <span>
                                    {user.role
                                        ? user.role.charAt(0).toUpperCase() +
                                          user.role.slice(1)
                                        : 'Usuario'}
                                </span>
                                <span>•</span>
                                <span>{user.company || 'Sin Compañía'}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {user.email}
                            </div>
                            {firefighter ? (
                                <Badge
                                    variant="outline"
                                    className="mt-2 border-green-200 bg-green-50 text-green-600"
                                >
                                    Perfil de Bombero Vinculado
                                </Badge>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="mt-2 border-amber-200 bg-amber-50 text-amber-600"
                                >
                                    Sin Perfil de Bombero (Solo Usuario)
                                </Badge>
                            )}
                        </div>
                        <div className="mt-4 w-full sm:absolute sm:top-6 sm:right-6 sm:mt-0 sm:w-auto">
                            <Button
                                variant="outline"
                                asChild
                                className="w-full sm:w-auto"
                            >
                                <Link href="/settings/profile">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Configuración
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Modules Tabs */}
                <Tabs defaultValue="signature" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 lg:w-[400px]">
                        <TabsTrigger value="signature">
                            Firma Digital
                        </TabsTrigger>
                        {/* <TabsTrigger value="materials">
                            Prendas a Cargo
                        </TabsTrigger>
                        <TabsTrigger value="attendance">
                            Asistencias
                        </TabsTrigger>
                        <TabsTrigger value="cootas">Cuotas</TabsTrigger> */}
                    </TabsList>
                    <TabsContent value="signature" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Signature className="h-5 w-5" />
                                    Firma Digital
                                </CardTitle>
                                <CardDescription>
                                    Configuración de firma digital.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={submitSignature}
                                    className="space-y-6"
                                >
                                    <div className="grid gap-2">
                                        <Label htmlFor="signature">
                                            Subir nueva firma (Imagen)
                                        </Label>
                                        <Input
                                            id="signature"
                                            type="file"
                                            className="mt-1 block w-full"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (
                                                    e.target.files &&
                                                    e.target.files[0]
                                                ) {
                                                    setData(
                                                        'signature',
                                                        e.target.files[0],
                                                    );
                                                }
                                            }}
                                        />
                                        {user.signature_path && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Firma actual:
                                                </p>
                                                <img
                                                    src={`/${user.signature_path}?t=${Date.now()}`} // Cache buster
                                                    alt="Firma actual"
                                                    className="h-48 rounded border border-gray-200 bg-white object-contain p-1"
                                                />
                                            </div>
                                        )}
                                        <InputError
                                            className="mt-2"
                                            message={errors.signature}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button disabled={processing}>
                                            Guardar Firma
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-neutral-600">
                                                Firma Guardada
                                            </p>
                                        </Transition>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    {/* <TabsContent value="materials" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Mis Prendas a Cargo
                                </CardTitle>
                                <CardDescription>
                                    Listado de material menor y EPP asignado
                                    actualmente a tu cargo.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {assignedMaterials.length > 0 ? (
                                    <div className="rounded-md border">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-muted/50 text-muted-foreground">
                                                <tr>
                                                    <th className="p-3 font-medium">
                                                        Producto
                                                    </th>
                                                    <th className="p-3 font-medium">
                                                        Marca / Modelo
                                                    </th>
                                                    <th className="p-3 font-medium">
                                                        Serie / Código
                                                    </th>
                                                    <th className="p-3 font-medium">
                                                        Estado
                                                    </th>
                                                    <th className="p-3 text-right font-medium">
                                                        Cant.
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {assignedMaterials.map(
                                                    (item) => (
                                                        <tr
                                                            key={item.id}
                                                            className="border-t hover:bg-muted/50"
                                                        >
                                                            <td className="p-3 font-medium">
                                                                {
                                                                    item
                                                                        .material
                                                                        .product_name
                                                                }
                                                            </td>
                                                            <td className="p-3">
                                                                {
                                                                    item
                                                                        .material
                                                                        .brand
                                                                }{' '}
                                                                {
                                                                    item
                                                                        .material
                                                                        .model
                                                                }
                                                            </td>
                                                            <td className="p-3">
                                                                {item.material
                                                                    .serial_number ||
                                                                    item
                                                                        .material
                                                                        .code ||
                                                                    '-'}
                                                            </td>
                                                            <td className="p-3">
                                                                <Badge variant="secondary">
                                                                    {
                                                                        item.condition
                                                                    }
                                                                </Badge>
                                                            </td>
                                                            <td className="p-3 text-right">
                                                                {item.quantity}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                                        <Shield className="mb-3 h-10 w-10 opacity-20" />
                                        <p>
                                            No tienes prendas ni materiales
                                            asignados.
                                        </p>
                                        {!firefighter && (
                                            <p className="mt-1 text-xs text-amber-600">
                                                (Tu cuenta de usuario no está
                                                vinculada a un perfil de bombero
                                                por email)
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent> */}
                    {/* ASISTENCIAS */}
                    {/* <TabsContent value="attendance" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Mis Asistencias
                                </CardTitle>
                                <CardDescription>
                                    Registro de actos de servicio del año
                                    actual.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex h-64 flex-col items-center justify-center text-muted-foreground">
                                <Activity className="mb-4 h-12 w-12 opacity-20" />
                                <h3 className="text-lg font-medium">
                                    Módulo en Construcción
                                </h3>
                                <p>
                                    Próximamente podrás ver aquí tu porcentaje
                                    de asistencia y lista de actos.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent> */}
                    {/* CUOTAS */}
                    {/* <TabsContent value="cootas" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Mis Cuotas
                                </CardTitle>
                                <CardDescription>
                                    Estado de pago de cuotas sociales y
                                    extraordinarias.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex h-64 flex-col items-center justify-center text-muted-foreground">
                                <CreditCard className="mb-4 h-12 w-12 opacity-20" />
                                <h3 className="text-lg font-medium">
                                    Módulo en Construcción
                                </h3>
                                <p>
                                    Próximamente podrás consultar tu estado de
                                    cuenta al día.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent> */}
                </Tabs>
            </div>
        </AppLayout>
    );
}
