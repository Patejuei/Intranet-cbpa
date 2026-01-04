import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { Printer } from 'lucide-react';

interface Task {
    id: number;
    description: string;
    is_completed: boolean;
    cost: number | null;
}

interface Issue {
    id: number;
    description: string;
    status: string;
    date?: string;
    severity?: string;
}

interface Maintenance {
    id: number;
    vehicle: {
        name: string;
        plate: string;
        make: string;
        model: string;
        company: string;
    };
    workshop_name: string;
    description: string;
    entry_date: string;
    exit_date: string | null;
    status: string;
    responsible_person?: string;
    mileage_in?: number;
    traction?: string;
    fuel_type?: string;
    transmission?: string;
    entry_checklist?: Record<string, string>;
    issues: Issue[];
    tasks: Task[];
}

export default function MaintenanceExitPrint({
    maintenance,
}: {
    maintenance: Maintenance;
}) {
    return (
        <>
            <Head title={`Orden de Salida #${maintenance.id}`} />
            <style>{`
                @media print {
                    @page {
                        size: letter;
                        margin: 1cm;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .no-break {
                        break-inside: avoid;
                    }
                }
            `}</style>
            <div className="min-h-screen bg-white p-8 text-black print:p-0">
                {/* Print Button - Hidden on Print */}
                <div className="mb-4 flex justify-end print:hidden">
                    <Button onClick={() => window.print()}>
                        <Printer className="mr-2 size-4" /> Imprimir Documento
                    </Button>
                </div>

                {/* Document Content */}
                <div className="mx-auto max-w-[21.5cm] space-y-6 border-2 border-slate-900 p-8 print:border-none print:p-0">
                    {/* Header */}
                    <div className="no-break flex items-center justify-between border-b-2 border-slate-900 pb-4">
                        <div className="flex items-center gap-4">
                            <img
                                src="/images/cbpa_logo.jpg"
                                alt="Logo CBPA"
                                className="h-16 w-16 object-contain"
                            />
                            <div>
                                <h1 className="text-2xl font-bold tracking-wider uppercase">
                                    Cuerpo de Bomberos Puente Alto
                                </h1>
                                <h2 className="text-lg font-semibold text-slate-700 uppercase">
                                    Depto. Material Mayor
                                </h2>
                            </div>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xl font-bold">
                                ORDEN DE SALIDA
                            </h3>
                            <p className="font-mono text-lg">
                                #{String(maintenance.id).padStart(6, '0')}
                            </p>
                            <p className="text-sm text-slate-600">
                                {formatDate(new Date().toISOString())}
                            </p>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="no-break grid grid-cols-2 gap-x-12 gap-y-3">
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">
                                Unidad / Carro
                            </span>
                            <p className="text-sm font-semibold uppercase">
                                {maintenance.vehicle.name}
                            </p>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">
                                Compañía
                            </span>
                            <p className="text-sm font-semibold uppercase">
                                {maintenance.vehicle.company}
                            </p>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">
                                Patente
                            </span>
                            <p className="text-sm font-semibold uppercase">
                                {maintenance.vehicle.plate || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">
                                Taller Responsable
                            </span>
                            <p className="text-sm font-semibold uppercase">
                                {maintenance.workshop_name}
                            </p>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">
                                Fecha Ingreso
                            </span>
                            <p className="text-sm font-semibold">
                                {formatDate(maintenance.entry_date)}
                            </p>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">
                                Fecha Salida
                            </span>
                            <p className="text-sm font-semibold">
                                {maintenance.exit_date
                                    ? formatDate(maintenance.exit_date)
                                    : 'Pendiente'}
                            </p>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">
                                Kilometraje Ingreso
                            </span>
                            <p className="text-sm font-semibold">
                                {maintenance.mileage_in || '--'} km
                            </p>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-slate-500 uppercase">
                                Responsable Ingreso
                            </span>
                            <p className="text-sm font-semibold">
                                {maintenance.responsible_person || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Entry Conditions Ref */}
                    {maintenance.entry_checklist && (
                        <div className="mt-6 rounded border border-slate-200 bg-slate-50 p-4">
                            <h4 className="no-break mb-2 text-xs font-bold text-slate-500 uppercase">
                                Resumen Condiciones de Ingreso (Fallas
                                Detectadas)
                            </h4>
                            <div className="no-break text-sm">
                                {Object.entries(maintenance.entry_checklist)
                                    .filter(
                                        ([_, status]) => status === 'Fallas',
                                    )
                                    .map(([item, _]) => item)
                                    .join(', ') ||
                                    'Ninguna falla reportada al ingreso.'}
                            </div>
                        </div>
                    )}

                    {/* Issues List - Resolved */}
                    {maintenance.issues.some(
                        (i) => i.status === 'Resolved',
                    ) && (
                        <div className="mt-6">
                            <div className="no-break mb-2 border-b border-slate-300 pb-1">
                                <span className="text-sm font-bold text-slate-900 uppercase">
                                    Incidencias Resueltas
                                </span>
                            </div>
                            <ul className="list-inside list-disc space-y-1 text-sm">
                                {maintenance.issues
                                    .filter((i) => i.status === 'Resolved')
                                    .map((issue) => (
                                        <li key={issue.id} className="no-break">
                                            {issue.description}{' '}
                                            <span className="text-xs font-bold text-green-600 uppercase">
                                                (Resuelto)
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}

                    {/* Tasks List - Completed */}
                    {maintenance.tasks.length > 0 && (
                        <div className="mt-6">
                            <div className="no-break mb-2 border-b border-slate-300 pb-1">
                                <span className="text-sm font-bold text-slate-900 uppercase">
                                    Trabajos Realizados
                                </span>
                            </div>
                            <ul className="list-inside list-disc space-y-1 text-sm">
                                {maintenance.tasks.map((task) => (
                                    <li key={task.id} className="no-break">
                                        {task.description}{' '}
                                        <span
                                            className={`text-xs font-bold uppercase ${
                                                task.is_completed
                                                    ? 'text-green-600'
                                                    : 'text-slate-400'
                                            }`}
                                        >
                                            (
                                            {task.is_completed
                                                ? 'Realizado'
                                                : 'No Realizado'}
                                            )
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Description / Works */}
                    <div className="mt-6 min-h-[150px] rounded border border-slate-300 p-4">
                        <span className="no-break mb-2 block text-sm font-bold text-slate-700 uppercase">
                            Observaciones Finales
                        </span>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {maintenance.description || 'Sin observaciones.'}
                        </p>
                    </div>

                    {/* Signatures */}
                    <div className="no-break mt-12 grid grid-cols-2 gap-16 pt-8">
                        <div className="border-t border-slate-900 pt-2 text-center">
                            <p className="text-sm font-bold uppercase">
                                Firma Mecánico Jefe
                            </p>
                            <p className="text-xs text-slate-500">
                                (Aceptación de Trabajos)
                            </p>
                        </div>
                        <div className="border-t border-slate-900 pt-2 text-center">
                            <p className="text-sm font-bold uppercase">
                                Firma Maquinista / Receptor
                            </p>
                            <p className="text-xs text-slate-500">
                                (Conformidad de Entrega)
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="no-break border-t pt-4 text-center text-xs text-slate-400">
                        <p>Generado automáticamente por Intranet CBPA</p>
                    </div>
                </div>
            </div>
        </>
    );
}
