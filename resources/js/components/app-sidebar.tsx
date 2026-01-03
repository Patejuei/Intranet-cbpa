import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Battery,
    BookOpen,
    Box,
    ClipboardList,
    FileText,
    LayoutGrid,
    Package,
    Shield,
    Ticket,
    Truck,
    Users,
    Wrench,
} from 'lucide-react'; // Added icons

export function AppSidebar({ user }: { user: any }) {
    const hasPermission = (module: string) =>
        user.role === 'admin' ||
        user.role === 'capitan' ||
        (user.permissions as string[])?.includes(module + '.view') ||
        (user.permissions as string[])?.includes(module + '.edit');

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* General Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>General</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip="Panel Principal"
                            >
                                <Link href="/dashboard">
                                    <LayoutGrid />
                                    <span>Panel Principal</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                {/* Material Menor Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Material Menor</SidebarGroupLabel>
                    <SidebarMenu>
                        {hasPermission('inventory') && (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Inventario">
                                    <Link href="/inventory">
                                        <Package />
                                        <span>Inventario</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                        {hasPermission('batteries') && (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Baterías">
                                    <Link href="/batteries">
                                        <Battery />
                                        <span>Baterías</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                        {hasPermission('equipment') && (
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Material Menor"
                                >
                                    <Link href="/equipment">
                                        <Box />
                                        <span>Material Menor</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                        {hasPermission('deliveries') && (
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Actas de Entrega"
                                >
                                    <Link href="/deliveries">
                                        <FileText />
                                        <span>Actas de Entrega</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                        {hasPermission('tickets') && (
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Ticketera">
                                    <Link href="/tickets">
                                        <Ticket />
                                        <span>Ticketera</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Material Mayor Group (New) */}
                {(user.role === 'admin' ||
                    user.role === 'capitan' ||
                    hasPermission('vehicles')) && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Material Mayor</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Dashboard M. Mayor"
                                >
                                    <Link href="/vehicles/dashboard">
                                        <LayoutGrid className="text-blue-500" />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Estado de los Carros"
                                >
                                    <Link href="/vehicles/status">
                                        <Truck />
                                        <span>Estado Carros</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Ingreso a Taller"
                                >
                                    <Link href="/vehicles/workshop">
                                        <Wrench />
                                        <span>Taller Mecánico</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Incidencias"
                                >
                                    <Link href="/vehicles/incidents">
                                        <AlertTriangle />
                                        <span>Incidencias</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Bitácora">
                                    <Link href="/vehicles/logs">
                                        <BookOpen />
                                        <span>Bitácora</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Inventario M. Mayor"
                                >
                                    <Link href="/vehicles/inventory">
                                        <ClipboardList />
                                        <span>Inventario</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                )}

                {/* Administración Group */}
                {(user.role === 'admin' || user.role === 'capitan') && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Administración</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Administrar Usuarios"
                                >
                                    <Link href="/admin/users">
                                        <Shield />
                                        <span>Usuarios</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Administrar Bomberos"
                                >
                                    <Link href="/admin/firefighters">
                                        <Users />
                                        <span>Bomberos</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
