import React from 'react';
import { Link } from '@inertiajs/react';
import { ClipboardList, FileText, Radio, Shield } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

const SUBMODULES = [
    {
        id: 'duty',
        title: 'Puestas en Servicio',
        description: 'Gestión de disponibilidad de unidades, personal y oficiales a cargo en tiempo real.',
        icon: ClipboardList,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
    },
    {
        id: 'reports',
        title: 'Reportes Central',
        description: 'Análisis estadístico de operatividad, tiempos de respuesta e informes institucionales.',
        icon: FileText,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
    },
];

export function CentralLanding() {
    return (
        <div className="space-y-8">
            <SectionHeader
                title="Manual de Central de Alarmas"
                icon={Radio}
                roles={['Operadores', 'Comandancia', 'Oficiales de Guardia']}
            />

            <div className="grid gap-6 sm:grid-cols-2">
                {SUBMODULES.map((sub) => (
                    <Link
                        key={sub.id}
                        href={`/help/central/${sub.id}`}
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

            <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>
                <div className="relative flex flex-col md:flex-row items-center gap-6">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                        <Shield className="h-8 w-8" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold mb-1">Módulo de Misión Crítica</h3>
                        <p className="text-muted-foreground text-sm">
                            Este módulo gestiona la disponibilidad operativa del Cuerpo de Bomberos. Cualquier error en el registro puede afectar el despacho de unidades. Use las herramientas con responsabilidad.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
