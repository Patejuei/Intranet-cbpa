import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function VehicleDashboard() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Material Mayor', href: '/vehicles/dashboard' },
            ]}
        >
            <Head title="Material Mayor Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Dashboard Material Mayor</h1>
                <p className="text-muted-foreground">
                    Bienvenido al sistema de administración de Material Mayor.
                </p>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50 p-4">
                        <h3 className="font-semibold">Estado de la Flota</h3>
                        {/* Summary widgets will go here */}
                    </div>
                    <div className="aspect-video rounded-xl bg-muted/50 p-4">
                        <h3 className="font-semibold">Incidencias Activas</h3>
                    </div>
                    <div className="aspect-video rounded-xl bg-muted/50 p-4">
                        <h3 className="font-semibold">En Taller</h3>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
