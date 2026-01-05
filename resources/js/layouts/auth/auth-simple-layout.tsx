import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    appName?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
    appName = 'CBPA',
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-6">
                    <Link
                        href={dashboard()}
                        className="flex flex-col items-center gap-2 font-medium"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <AppLogoIcon className="size-8" />
                        </div>
                        <span className="sr-only">{appName}</span>
                    </Link>
                    <div className="text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}
