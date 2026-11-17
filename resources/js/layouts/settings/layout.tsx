import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, isSameUrl, resolveUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { KeyRound, Moon, ShieldCheck, User } from 'lucide-react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Perfil',
        href: edit(),
        icon: User,
    },
    {
        title: 'Contraseña',
        href: editPassword(),
        icon: KeyRound,
    },
    {
        title: 'Autenticación en dos pasos',
        href: show(),
        icon: ShieldCheck,
    },
    {
        title: 'Apariencia y Tema',
        href: editAppearance(),
        icon: Moon,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
            <Heading
                title="Configuración"
                description="Administre su perfil personal, seguridad y preferencias del sistema."
            />

            <div className="flex flex-col gap-8 lg:flex-row">
                <aside className="w-full lg:w-56 shrink-0">
                    <nav className="flex flex-row flex-wrap gap-1 lg:flex-col lg:space-y-1">
                        {sidebarNavItems.map((item, index) => {
                            const active = isSameUrl(currentPath, item.href);
                            return (
                                <Button
                                    key={`${resolveUrl(item.href)}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn(
                                        'justify-start gap-2 h-9 rounded-xl text-xs font-medium transition',
                                        active
                                            ? 'bg-primary/10 text-primary font-semibold hover:bg-primary/15'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                                    )}
                                >
                                    <Link href={item.href}>
                                        {item.icon && (
                                            <item.icon className="size-4 shrink-0" />
                                        )}
                                        <span>{item.title}</span>
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                <div className="flex-1 min-w-0">
                    <section className="space-y-6">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}