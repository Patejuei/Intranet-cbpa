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
import { Battery, Box, LayoutGrid, Ticket } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Baterías',
        href: '/batteries',
        icon: Battery,
    },
    {
        title: 'Material Menor',
        href: '/equipment',
        icon: Box,
    },
    {
        title: 'Ticketera',
        href: '/tickets',
        icon: Ticket,
    },
];

import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Shield } from 'lucide-react'; // Add Shield icon for Admin

// ... (keep helper component imports)

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // Define items logic dynamically inside component
    const filteredNavItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    // Helper check
    const hasPermission = (module: string) =>
        user.role === 'admin' ||
        (user.permissions as string[])?.includes(module);

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

    if (hasPermission('tickets')) {
        filteredNavItems.push({
            title: 'Ticketera',
            href: '/tickets',
            icon: Ticket,
        });
    }

    if (user.role === 'admin') {
        filteredNavItems.push({
            title: 'Admin Usuarios',
            href: '/admin/users',
            icon: Shield,
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
