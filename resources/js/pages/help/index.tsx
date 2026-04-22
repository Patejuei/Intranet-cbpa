import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Info, Truck, User, Users } from 'lucide-react';
import { AdminSection } from './sections/admin';
import { GeneralSection } from './sections/general';
import { ProfileSection } from './sections/profile';
import { ChecklistsSection } from './sections/vehicles/checklists';
import { IncidentsSection } from './sections/vehicles/incidents';
import { VehiclesLanding } from './sections/vehicles/index';
import { InventorySection } from './sections/vehicles/inventory';
import { LogsSection } from './sections/vehicles/logs';
import { RenditionsSection } from './sections/vehicles/renditions';
import { StatusSection } from './sections/vehicles/status';
import { WorkshopSection } from './sections/vehicles/workshop';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Ayuda', href: '/help' }];

const VEHICLE_SUBMODULES = [
    { id: 'status', title: 'Control de Unidades' },
    { id: 'incidents', title: 'Incidencias' },
    { id: 'logs', title: 'Bitácoras' },
    { id: 'workshop', title: 'Taller Mecánico' },
    { id: 'checklists', title: 'Checklists' },
    { id: 'inventory', title: 'Bodega MM' },
    { id: 'renditions', title: 'Rendiciones' },
];

const SECTIONS = [
    {
        id: 'general',
        title: 'Introducción',
        icon: Info,
    },
    {
        id: 'profile',
        title: 'Perfil de Usuario',
        icon: User,
    },
    {
        id: 'vehicles',
        title: 'Material Mayor',
        icon: Truck,
        submodules: VEHICLE_SUBMODULES,
    },
    {
        id: 'admin',
        title: 'Administración',
        icon: Users,
    },
];

interface HelpPageProps {
    activeSection: string;
    activeSubmodule?: string;
}

export default function HelpIndex({
    activeSection = 'general',
    activeSubmodule,
}: HelpPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Centro de Ayuda" />

            <div className="flex h-[calc(100vh-8rem)] gap-6 p-4 md:p-6">
                {/* Manual Sidebar */}
                <aside className="hidden w-64 flex-col gap-2 md:flex">
                    <h2 className="mb-4 px-2 text-lg font-semibold">
                        Manual de Usuario
                    </h2>
                    <ScrollArea className="flex-1">
                        <div className="flex flex-col gap-1 pr-4">
                            {SECTIONS.map((section) => (
                                <div key={section.id} className="flex flex-col gap-1">
                                    <Link
                                        href={`/help/${section.id}`}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                                            activeSection === section.id
                                                ? 'bg-accent text-accent-foreground'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        <section.icon className="h-4 w-4" />
                                        <span className="flex-1">{section.title}</span>
                                        {section.submodules && (
                                            <ChevronRight className={cn(
                                                "h-3 w-3 transition-transform",
                                                activeSection === section.id && "rotate-90"
                                            )} />
                                        )}
                                    </Link>
                                    
                                    {/* Submodules Dropdown Logic */}
                                    {section.submodules && activeSection === section.id && (
                                        <div className="ml-6 flex flex-col gap-1 border-l pl-2 mt-1">
                                            {section.submodules.map((sub) => (
                                                <Link
                                                    key={sub.id}
                                                    href={`/help/${section.id}/${sub.id}`}
                                                    className={cn(
                                                        'rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                                                        activeSubmodule === sub.id
                                                            ? 'bg-accent/50 text-accent-foreground'
                                                            : 'text-muted-foreground',
                                                    )}
                                                >
                                                    {sub.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </aside>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto rounded-xl border bg-card text-card-foreground shadow-sm">
                    <ScrollArea className="h-full">
                        <div className="mx-auto max-w-4xl p-8 lg:p-12">
                            {/* General/Profile/Admin Sections */}
                            {activeSection === 'general' && <GeneralSection />}
                            {activeSection === 'profile' && <ProfileSection />}
                            {activeSection === 'admin' && <AdminSection />}

                            {/* Vehicles Section with Submodule Logic */}
                            {activeSection === 'vehicles' && (
                                <>
                                    {!activeSubmodule && <VehiclesLanding />}
                                    {activeSubmodule === 'status' && <StatusSection />}
                                    {activeSubmodule === 'incidents' && <IncidentsSection />}
                                    {activeSubmodule === 'logs' && <LogsSection />}
                                    {activeSubmodule === 'workshop' && <WorkshopSection />}
                                    {activeSubmodule === 'checklists' && <ChecklistsSection />}
                                    {activeSubmodule === 'inventory' && <InventorySection />}
                                    {activeSubmodule === 'renditions' && <RenditionsSection />}
                                </>
                            )}
                        </div>
                    </ScrollArea>
                </main>
            </div>
        </AppLayout>
    );
}
