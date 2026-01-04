import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { Printer } from 'lucide-react';

interface Issue {
    id: number;
    description: string;
    date: string;
    severity: string;
}

interface Maintenance {
    id: number;
    entry_date: string;
    tentative_exit_date?: string;
    workshop_name: string;
    description: string;
    status: string;
    responsible_person?: string;
    mileage_in?: number;
    traction?: string;
    fuel_type?: string;
    transmission?: string;
    entry_checklist?: Record<string, string>;
    vehicle: {
        name: string;
        company: string;
        plate: string;
    };
    tasks: { description: string }[];
    issues: Issue[];
}

export default function WorkshopPrint({
    maintenance,
}: {
    maintenance: Maintenance;
}) {
    return (
        <>
            <Head title={`Orden de Taller #${maintenance.id}`} />
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
                                ORDEN DE INGRESO
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
                        {/* ... content remains same, just ensuring wrapper has no-break if needed, or maybe just the container */}
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
                                Responsable Entrega
                            </span>
                            <p className="text-sm font-semibold uppercase">
                                {maintenance.responsible_person || 'N/A'}
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
                                Kilometraje
                            </span>
                            <p className="text-sm font-semibold">
                                {maintenance.mileage_in || '--'} km
                            </p>
                        </div>
                        {/* Specs Row */}
                        <div className="col-span-2 grid grid-cols-3 gap-4 border-t border-slate-200 pt-2">
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase">
                                    Tracción
                                </span>
                                <p className="text-sm font-semibold">
                                    {maintenance.traction || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase">
                                    Transmisión
                                </span>
                                <p className="text-sm font-semibold">
                                    {maintenance.transmission || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase">
                                    Combustible
                                </span>
                                <p className="text-sm font-semibold">
                                    {maintenance.fuel_type || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Checklist Section */}
                    {maintenance.entry_checklist && (
                        <div className="mt-6">
                            <div className="no-break mb-2 border-b border-slate-300 pb-1">
                                <span className="text-sm font-bold text-slate-900 uppercase">
                                    Checklist de Recepción
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                                {Object.entries(
                                    maintenance.entry_checklist,
                                ).map(([item, status]) => (
                                    <div
                                        key={item}
                                        className="no-break flex justify-between border-b border-slate-100 py-1"
                                    >
                                        <span>{item}</span>
                                        <span
                                            className={
                                                status === 'Fallas'
                                                    ? 'font-bold text-red-600'
                                                    : ''
                                            }
                                        >
                                            {status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Issues List */}
                    {maintenance.issues.length > 0 && (
                        <div className="mt-6">
                            <div className="no-break mb-2 border-b border-slate-300 pb-1">
                                <span className="text-sm font-bold text-slate-900 uppercase">
                                    Incidencias Reportadas
                                </span>
                            </div>
                            <ul className="list-inside list-disc space-y-1 text-sm">
                                {maintenance.issues.map((issue) => (
                                    <li key={issue.id} className="no-break">
                                        <span className="font-semibold">
                                            {formatDate(issue.date)}:
                                        </span>{' '}
                                        {issue.description} ({issue.severity})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Tasks List */}
                    {maintenance.tasks && maintenance.tasks.length > 0 && (
                        <div className="mt-6">
                            <div className="no-break mb-2 border-b border-slate-300 pb-1">
                                <span className="text-sm font-bold text-slate-900 uppercase">
                                    Trabajos a Realizar
                                </span>
                            </div>
                            <ul className="list-inside list-disc space-y-1 text-sm">
                                {maintenance.tasks.map((task, idx) => (
                                    <li key={idx} className="no-break">
                                        {task.description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Description / Works */}
                    <div className="mt-6 min-h-[150px] rounded border border-slate-300 p-4">
                        <span className="no-break mb-2 block text-sm font-bold text-slate-700 uppercase">
                            Detalle de Trabajo Solicitado / Observaciones
                        </span>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {maintenance.description}
                        </p>
                    </div>

                    {/* Signatures */}
                    <div className="no-break mt-12 grid grid-cols-2 gap-16 pt-8">
                        <div className="border-t border-slate-900 pt-2 text-center">
                            <p className="text-sm font-bold uppercase">
                                Firma Responsable Taller
                            </p>
                            <p className="text-xs text-slate-500">
                                (Recepción Conforme)
                            </p>
                        </div>
                        <div className="border-t border-slate-900 pt-2 text-center">
                            <p className="text-sm font-bold uppercase">
                                Firma Maquinista / Conductor
                            </p>
                            <p className="text-xs text-slate-500">
                                (Entrega Conforme)
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
