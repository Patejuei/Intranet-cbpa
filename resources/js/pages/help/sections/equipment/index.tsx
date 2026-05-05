import React from 'react';
import { Link } from '@inertiajs/react';
import { Package, Box, Hammer, FileText, Ticket, Battery } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

const SUBMODULES = [
    {
        id: 'inventory',
        title: 'Inventario General',
        description: 'Control de stock, kárdex de movimientos y alertas de stock crítico.',
        icon: Package,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
    },
    {
        id: 'equipment',
        title: 'Material Menor',
        description: 'Gestión de herramientas, mangueras y equipos asignados a compañías.',
        icon: Box,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
    },
    {
        id: 'repairs',
        title: 'Reparaciones',
        description: 'Bitácora de mantenciones y reparaciones de equipos menores.',
        icon: Hammer,
        color: 'text-red-600',
        bg: 'bg-red-100',
    },
    {
        id: 'certificates',
        title: 'Actas y Certificados',
        description: 'Generación de documentos de entrega y recepción de material.',
        icon: FileText,
        color: 'text-green-600',
        bg: 'bg-green-100',
    },
    {
        id: 'tickets',
        title: 'Ticketera de Soporte',
        description: 'Gestión de solicitudes de soporte técnico y mensajería interna.',
        icon: Ticket,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
    },
    {
        id: 'batteries',
        title: 'Control de Baterías',
        description: 'Programación y seguimiento de cambios de batería en equipos.',
        icon: Battery,
        color: 'text-amber-600',
        bg: 'bg-amber-100',
    },
];

export function EquipmentLanding() {
    return (
        <div className="space-y-8">
            <SectionHeader
                title="Manual de Material Menor"
                icon={Package}
                roles={['Logística', 'Comandancia', 'Capitanes', 'Oficiales']}
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {SUBMODULES.map((sub) => (
                    <Link
                        key={sub.id}
                        href={`/help/equipment/${sub.id}`}
                        className="group relative flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
                    >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${sub.bg} ${sub.color} transition-transform group-hover:scale-110`}>
                            <sub.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                {sub.title}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                {sub.description}
                            </p>
                        </div>
                        <div className="mt-auto pt-4 flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Ver manual <span className="ml-1">→</span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-12 rounded-2xl bg-muted/30 p-8 border border-dashed">
                <h3 className="text-xl font-bold mb-4">¿No encuentras lo que buscas?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl">
                    Si tienes dudas sobre el funcionamiento de algún módulo de Material Menor que no aparezca en esta lista, por favor contacta al administrador del sistema a través de la <strong>Ticketera de Soporte</strong>.
                </p>
                <Link
                    href="/help/equipment/tickets"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    Ir a Soporte Técnico
                </Link>
            </div>
        </div>
    );
}
