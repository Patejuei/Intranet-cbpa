import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function VehicleWorkshop() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Material Mayor', href: '/vehicles/dashboard' },
                { title: 'Ingreso a Taller', href: '/vehicles/workshop' },
            ]}
        >
            <Head title="Taller Mecánico" />
            <div className="p-4">
                <h1 className="text-2xl font-bold">
                    Ingreso a Taller Mecánico
                </h1>
            </div>
        </AppLayout>
    );
}
