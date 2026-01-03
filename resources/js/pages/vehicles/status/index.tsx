import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function VehicleStatus() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Material Mayor', href: '/vehicles/dashboard' },
                { title: 'Estado de Carros', href: '/vehicles/status' },
            ]}
        >
            <Head title="Estado de Carros" />
            <div className="p-4">
                <h1 className="text-2xl font-bold">Estado de los Carros</h1>
            </div>
        </AppLayout>
    );
}
