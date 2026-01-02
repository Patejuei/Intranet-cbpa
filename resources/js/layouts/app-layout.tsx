import { MODULES } from '@/constants/modules';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react'; // Import usePage
import { ReactNode, useEffect } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const RECENT_MODULES_KEY = 'recent_modules';

export default function AppLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {
    const { url } = usePage();

    useEffect(() => {
        // Find matching module
        const currentModule = MODULES.find((m) => m.pattern.test(url));

        if (currentModule) {
            try {
                const stored = localStorage.getItem(RECENT_MODULES_KEY);
                let recent: string[] = stored ? JSON.parse(stored) : [];

                // Remove if exists (to move to top)
                recent = recent.filter((key) => key !== currentModule.key);

                // Add to beginning
                recent.unshift(currentModule.key);

                // Keep only top 4
                recent = recent.slice(0, 4);

                localStorage.setItem(
                    RECENT_MODULES_KEY,
                    JSON.stringify(recent),
                );
            } catch (e) {
                console.error('Error saving recent modules', e);
            }
        }
    }, [url]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
}
