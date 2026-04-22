import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { HelpCircle } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from './ui/button';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { url } = usePage();

    const getHelpSection = () => {
        if (url.startsWith('/vehicles')) return 'vehicles';
        if (url.startsWith('/my-profile') || url.startsWith('/settings')) return 'profile';
        if (url.startsWith('/admin')) return 'admin';
        return 'general';
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild className="rounded-full h-8 w-8 text-muted-foreground hover:text-primary">
                    <Link href={`/help/${getHelpSection()}`} title="Ayuda y Manual">
                        <HelpCircle className="h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </header>
    );
}
