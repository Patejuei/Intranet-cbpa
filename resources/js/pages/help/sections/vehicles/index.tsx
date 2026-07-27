import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Archive,
    BookOpen,
    ClipboardList,
    FileText,
    Truck,
    Wrench,
} from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

const SUBMODULES = [
    {
        id: 'status',
        title: 'Control de Unidades',
        description: 'Visualización de estados operativos y documentos legales.',
        icon: Truck,
        color: 'text-blue-500',
    },
    {
        id: 'incidents',
        title: 'Incidencias',
        description: 'Reporte de fallas y seguimiento de reparaciones.',
        icon: AlertTriangle,
        color: 'text-amber-500',
    },
    {
        id: 'logs',
        title: 'Bitácoras',
        description: 'Registro de movimientos, horas y kilómetros.',
        icon: BookOpen,
        color: 'text-emerald-500',
    },
    {
        id: 'workshop',
        title: 'Taller Mecánico',
        description: 'Gestión de mantenciones preventivas y correctivas.',
        icon: Wrench,
        color: 'text-slate-500',
    },
    {
        id: 'checklists',
        title: 'Checklists',
        description: 'Inspecciones periódicas y firmas digitales.',
        icon: ClipboardList,
        color: 'text-purple-500',
    },
    {
        id: 'inventory',
        title: 'Bodega MM',
        description: 'Control de repuestos y stock de insumos.',
        icon: Archive,
        color: 'text-indigo-500',
    },
    {
        id: 'renditions',
        title: 'Rendiciones',
        description: 'Gestión de gastos y digitalización de facturas.',
        icon: FileText,
        color: 'text-rose-500',
    },
    {
        id: 'reports',
        title: 'Reportes',
        description: 'Generación de documentos PDF e informes del material mayor.',
        icon: FileText,
        color: 'text-orange-500',
    },
];

export function VehiclesLanding() {
    return (
        <div>
            <SectionHeader
                title="Material Mayor"
                icon={Truck}
                roles={[
                    'Maquinista',
                    'Capitán',
                    'Inspector MM',
                    'Comandancia',
                    'Mecánico',
                    'Cuartelero',
                ]}
            />
            
            <div className="prose prose-slate dark:prose-invert max-w-none mb-10">
                <p className="text-lg">
                    El sistema de Material Mayor está compuesto por diversos módulos interconectados que aseguran que el ciclo de vida de cada unidad sea auditado y gestionado eficientemente.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SUBMODULES.map((sub) => (
                    <Link
                        key={sub.id}
                        href={`/help/vehicles/${sub.id}`}
                        className="group relative flex flex-col items-start rounded-xl border bg-card p-6 shadow-sm transition-all hover:bg-accent hover:shadow-md"
                    >
                        <div className={`mb-4 rounded-lg bg-background p-2 group-hover:scale-110 transition-transform ${sub.color}`}>
                            <sub.icon className="h-6 w-6" />
                        </div>
                        <h4 className="font-bold text-lg">{sub.title}</h4>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                            {sub.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
