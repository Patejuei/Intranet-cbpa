import { Label } from '@/components/ui/label';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AppearanceToggle() {
    const { appearance, updateAppearance } = useAppearance();
    const { state } = useSidebar();
    
    const [isSystemDark, setIsSystemDark] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        setIsSystemDark(media.matches);

        const listener = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, []);

    const isDark = appearance === 'dark' || (appearance === 'system' && isSystemDark);

    const toggleAppearance = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    if (state === 'collapsed') {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        onClick={toggleAppearance}
                        tooltip={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                    >
                        {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
                        <span>Tema</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="flex items-center justify-between px-2 py-2 w-full">
                    <Label
                        htmlFor="appearance-switch"
                        className="flex items-center gap-2 cursor-pointer grow"
                    >
                        {isDark ? (
                            <Moon className="size-4 text-muted-foreground" />
                        ) : (
                            <Sun className="size-4 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">
                            {isDark ? 'Modo Oscuro' : 'Modo Claro'}
                        </span>
                    </Label>
                    <Switch
                        id="appearance-switch"
                        className="data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700 border border-neutral-300/50 dark:border-neutral-700/50"
                        checked={isDark}
                        onCheckedChange={(checked) =>
                            updateAppearance(checked ? 'dark' : 'light')
                        }
                    />
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
