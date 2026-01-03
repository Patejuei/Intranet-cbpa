import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function VehicleIncidents() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Material Mayor', href: '/vehicles/dashboard' },
                {
                    title: 'Registro de Incidencias',
                    href: '/vehicles/incidents',
                },
            ]}
        >
            <Head title="Incidencias" />
            <div className="p-4">
                <h1 className="text-2xl font-bold">Registro de Incidencias</h1>
            </div>
        </AppLayout>
    );
}
