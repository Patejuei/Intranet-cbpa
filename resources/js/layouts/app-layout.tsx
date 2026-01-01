import { Separator } from '@/components/ui/separator';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function AppLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {
    const [dropdown, setDropdown] = useState(false);
    const toggleDropdown = () => setDropdown(!dropdown);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <nav className="flex gap-4 p-4">
                <Link href="/" className="hover:underline">
                    {' '}
                    Inicio{' '}
                </Link>
                <div className="relative">
                    <button
                        className="hover:underline"
                        onClick={toggleDropdown}
                    >
                        {' '}
                        Nosotros{' '}
                    </button>
                    {dropdown && (
                        <div className="absolute z-10 flex min-w-[150px] flex-col rounded border bg-card p-2 shadow-md">
                            <Link
                                href="/historia"
                                className="py-1 hover:underline"
                            >
                                {' '}
                                Historia
                            </Link>
                            <Link
                                href="/carros"
                                className="py-1 hover:underline"
                            >
                                {' '}
                                Carros{' '}
                            </Link>
                            <Link
                                href="/bomberos"
                                className="py-1 hover:underline"
                            >
                                {' '}
                                Bomberos{' '}
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
            <Separator />
            {children}
        </AppLayoutTemplate>
    );
}
