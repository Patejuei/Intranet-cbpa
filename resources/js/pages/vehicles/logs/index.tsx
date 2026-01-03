import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function VehicleLogs() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Material Mayor', href: '/vehicles/dashboard' },
                { title: 'Bitácora', href: '/vehicles/logs' },
            ]}
        >
            <Head title="Bitácora" />
            <div className="p-4">
                <h1 className="text-2xl font-bold">
                    Bitácora del Material Mayor
                </h1>
            </div>
        </AppLayout>
    );
}
