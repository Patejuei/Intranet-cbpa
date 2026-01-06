import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
    ChevronDown,
    ClipboardCheck,
    ClipboardList,
    FileText,
    LayoutGrid,
    Package,
    Receipt,
    Shield,
    Ticket,
    Truck,
    Users,
    Wrench,
} from 'lucide-react';

// Define the navigation structure
const NAV_GROUPS = [
    {
        title: 'General',
        items: [
            {
                title: 'Panel Principal',
                url: '/dashboard',
                icon: LayoutGrid,
                tooltip: 'Panel Principal',
                permission: undefined,
            },
        ],
    },
    {
        title: 'Material Menor',
        items: [
            {
                title: 'Inventario',
                url: '/inventory',
                icon: Package,
                permission: 'inventory',
                tooltip: 'Inventario',
            },
            {
                title: 'Baterías',
                url: '/batteries',
                icon: Battery,
                permission: 'batteries',
                tooltip: 'Baterías',
            },
            {
                title: 'Material Menor',
                url: '/equipment',
                icon: Box,
                permission: 'equipment',
                tooltip: 'Material Menor',
            },
            {
                title: 'Actas de Entrega',
                url: '/deliveries',
                icon: FileText,
                permission: 'deliveries',
                tooltip: 'Actas de Entrega',
            },
            {
                title: 'Ticketera',
                url: '/tickets',
                icon: Ticket,
                permission: 'tickets',
                tooltip: 'Ticketera',
            },
            {
                title: 'Recepción',
                url: '/reception',
                icon: ClipboardCheck,
                permission: 'reception',
                tooltip: 'Recepción',
            },
        ],
    },
    {
        title: 'Material Mayor',
        items: [
            {
                title: 'Control de Unidades',
                url: '/vehicles/status',
                icon: Truck,
                permission: 'vehicles.status',
                tooltip: 'Control de Unidades',
            },
            {
                title: 'Incidencias',
                url: '/vehicles/incidents',
                icon: AlertTriangle,
                permission: 'vehicles.incidents',
                tooltip: 'Incidencias',
            },
            {
                title: 'Bitácoras',
                url: '/vehicles/logs',
                icon: BookOpen,
                permission: 'vehicles.logs',
                tooltip: 'Bitácoras',
            },
            {
                title: 'Taller Mecánico',
                url: '/vehicles/workshop',
                icon: Wrench,
                permission: 'vehicles.workshop',
                tooltip: 'Taller Mecánico',
            },
            {
                title: 'Checklist',
                url: '/vehicles/checklists',
                icon: ClipboardList,
                permission: 'vehicles.checklist',
                tooltip: 'Checklist',
            },
            {
                title: 'Bodega',
                url: '/vehicles/inventory',
                icon: ClipboardCheck,
                permission: 'vehicles.inventory',
                tooltip: 'Bodega',
            },
            {
                title: 'Caja Chica',
                url: '/vehicles/petty-cash',
                icon: Receipt,
                permission: 'vehicles.petty-cash',
                tooltip: 'Caja Chica',
            },
        ],
    },
    {
        title: 'Administración',
        items: [
            {
                title: 'Usuarios',
                url: '/admin/users',
                icon: Users,
                permission: 'users.index',
                tooltip: 'Usuarios',
            },
            {
                title: 'Bomberos',
                url: '/admin/firefighters',
                icon: Shield,
                permission: 'firefighters.index',
                tooltip: 'Bomberos',
            },
        ],
    },
];

export function AppSidebar({ user }: { user: any }) {
    const hasPermission = (module?: string) => {
        if (!module) return true; // Public items
        if (!user) return false;

        // Admin, Capitan, Comandante have full access
        if (
            user.role === 'admin' ||
            user.role === 'capitan' ||
            user.role === 'comandante'
        )
            return true;

        if (user.role === 'mechanic') {
            const mechanicModules = [
                'vehicles.workshop',
                'vehicles.incidents',
                'vehicles.status',
                'vehicles.checklist',
                'vehicles.logs',
                'vehicles.inventory',
            ];
            if (mechanicModules.includes(module)) return true;
        }

        if (user.role === 'inspector') {
            const dept = (user.department || '').trim();
            if (dept === 'Material Mayor') {
                const allowed = [
                    'vehicles.status',
                    'vehicles.incidents',
                    'vehicles.inventory',
                    'vehicles.logs',
                    'vehicles.workshop',
                    'vehicles.checklist',
                    'vehicles',
                ];
                // Check if likely match
                if (
                    allowed.some(
                        (m) => m === module || m.startsWith(module + '.'),
                    )
                )
                    return true;
                if (allowed.includes(module)) return true;
            } else if (dept === 'Material Menor') {
                const allowed = [
                    'inventory',
                    'tickets',
                    'batteries',
                    'deliveries',
                    'reception',
                    'equipment',
                    'vehicles.petty-cash',
                ];
                if (
                    allowed.some(
                        (m) => m === module || m.startsWith(module + '.'),
                    )
                )
                    return true;
                if (allowed.includes(module)) return true;
            }
        }

        const permissions = (user.permissions as string[]) || [];
        return (
            permissions.includes(module) ||
            permissions.includes(`${module}.view`) ||
            permissions.includes(`${module}.edit`)
        );
    };

    // Filter groups and items based on permissions
    const filteredGroups = NAV_GROUPS.map((group) => {
        const visibleItems = group.items.filter((item) =>
            hasPermission(item.permission),
        );
        return {
            ...group,
            items: visibleItems,
        };
    }).filter((group) => group.items.length > 0);

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
                {filteredGroups.map((group) => {
                    const isSingleItem = group.items.length === 1;

                    if (isSingleItem) {
                        return (
                            <SidebarGroup key={group.title}>
                                <SidebarGroupLabel>
                                    {group.title}
                                </SidebarGroupLabel>
                                <SidebarMenu>
                                    {group.items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.tooltip}
                                            >
                                                <Link href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroup>
                        );
                    }

                    return (
                        <Collapsible
                            key={group.title}
                            asChild
                            defaultOpen
                            className="group/collapsible"
                        >
                            <SidebarGroup>
                                <SidebarGroupLabel asChild>
                                    <CollapsibleTrigger>
                                        {group.title}
                                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                    </CollapsibleTrigger>
                                </SidebarGroupLabel>
                                <CollapsibleContent>
                                    <SidebarMenu>
                                        {group.items.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    tooltip={item.tooltip}
                                                >
                                                    <Link href={item.url}>
                                                        <item.icon />
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </CollapsibleContent>
                            </SidebarGroup>
                        </Collapsible>
                    );
                })}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
