import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Apariencia y Tema',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Apariencia y Tema" />

            <SettingsLayout>
                <Card className="rounded-2xl border border-border/70 shadow-xs">
                    <CardContent className="p-6 space-y-6">
                        <HeadingSmall
                            title="Apariencia y Tema del Sistema"
                            description="Personalice la apariencia visual de la intranet seleccionando entre el modo claro, modo oscuro o según la configuración de su dispositivo."
                        />
                        <AppearanceTabs />
                    </CardContent>
                </Card>
            </SettingsLayout>
        </AppLayout>
    );
}