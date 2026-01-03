import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Battery,
    Box,
    FileText,
    LayoutGrid,
    Package,
    Shield,
    Ticket,
    Users,
} from 'lucide-react'; // Added icons

export function AppSidebar({ user }: { user: any }) {
    const filteredNavItems: NavItem[] = [
        {
            title: 'Panel Principal',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    const hasPermission = (module: string) =>
        user.role === 'admin' ||
        user.role === 'capitan' ||
        (user.permissions as string[])?.includes(module + '.view') ||
        (user.permissions as string[])?.includes(module + '.edit');

    if (hasPermission('batteries')) {
        filteredNavItems.push({
            title: 'Baterías',
            href: '/batteries',
            icon: Battery,
        });
    }

    if (hasPermission('equipment')) {
        filteredNavItems.push({
            title: 'Material Menor',
            href: '/equipment',
            icon: Box,
        });
    }

    // New Modules
    if (hasPermission('inventory')) {
        filteredNavItems.push({
            title: 'Inventario',
            href: '/inventory',
            icon: Package,
        });
    }

    if (hasPermission('deliveries')) {
        filteredNavItems.push({
            title: 'Actas de Entrega',
            href: '/deliveries',
            icon: FileText,
        });
    }

    if (hasPermission('tickets')) {
        filteredNavItems.push({
            title: 'Ticketera',
            href: '/tickets',
            icon: Ticket,
        });
    }

    if (user.role === 'admin' || user.role === 'capitan') {
        filteredNavItems.push({
            title: 'Administrar Usuarios',
            href: '/admin/users',
            icon: Shield,
        });
        filteredNavItems.push({
            title: 'Administrar Bomberos',
            href: '/admin/firefighters',
            icon: Users,
        });
    }

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
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
