import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Activity, CreditCard, Shield, User as UserIcon } from 'lucide-react';

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
    const user = usePage().props.auth.user;

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
                    <CardContent className="flex items-center gap-6 p-6">
                        <Avatar className="h-24 w-24">
                            {/* Initials fallback */}
                            <AvatarFallback className="text-2xl">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <div className="flex items-center gap-2 text-muted-foreground">
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
                    </CardContent>
                </Card>

                {/* Modules Tabs */}
                <Tabs defaultValue="materials" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="materials">
                            Prendas a Cargo
                        </TabsTrigger>
                        <TabsTrigger value="attendance">
                            Asistencias
                        </TabsTrigger>
                        <TabsTrigger value="cootas">Cuotas</TabsTrigger>
                    </TabsList>

                    {/* PRENDAS A CARGO */}
                    <TabsContent value="materials" className="mt-4">
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
                    </TabsContent>

                    {/* ASISTENCIAS */}
                    <TabsContent value="attendance" className="mt-4">
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
                    </TabsContent>

                    {/* CUOTAS */}
                    <TabsContent value="cootas" className="mt-4">
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
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
