import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Battery, Box, Ticket } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Principal',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Material Menor - CBPA" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="grid gap-6 md:grid-cols-3">
                    <Link
                        href="/batteries"
                        className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <Battery className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Control de Baterías
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Registro de cambios y cargas
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/equipment"
                        className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <Box className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Material Menor
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Altas y bajas de equipamiento
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/tickets"
                        className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <Ticket className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Ticketera
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Solicitudes y reportes
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="rounded-xl border bg-card p-6">
                    <h2 className="mb-4 text-xl font-semibold">
                        Bienvenido al Sistema de Material Menor
                    </h2>
                    <p className="text-muted-foreground">
                        Seleccione un módulo para comenzar.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
