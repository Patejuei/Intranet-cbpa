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
        return 'general';
    };

    return (
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/50 bg-background/80 px-4 sm:px-6 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2.5">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild className="rounded-full size-9 sm:size-8 text-muted-foreground hover:text-primary transition-colors">
                    <Link href={`/help/${getHelpSection()}`} title="Ayuda y Manual">
                        <HelpCircle className="h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </header>
    );
}
