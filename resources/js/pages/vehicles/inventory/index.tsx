import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function VehicleInventory() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Material Mayor', href: '/vehicles/dashboard' },
                { title: 'Inventario', href: '/vehicles/inventory' },
            ]}
        >
            <Head title="Inventario Material Mayor" />
            <div className="p-4">
                <h1 className="text-2xl font-bold">
                    Inventario del Material Mayor
                </h1>
            </div>
        </AppLayout>
    );
}
