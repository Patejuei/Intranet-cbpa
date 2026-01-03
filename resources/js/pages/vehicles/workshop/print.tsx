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
        <div className="min-h-screen bg-white p-8 text-black">
            <Head title={`Orden de Taller #${maintenance.id}`} />

            {/* Print Button - Hidden on Print */}
            <div className="mb-8 flex justify-end print:hidden">
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 size-4" /> Imprimir Documento
                </Button>
            </div>

            {/* Document Content */}
            <div className="mx-auto max-w-4xl space-y-8 border-2 border-slate-900 p-8 print:border-none print:p-0">
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6">
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
                        <h3 className="text-xl font-bold">ORDEN DE INGRESO</h3>
                        <p className="font-mono text-lg">
                            #{String(maintenance.id).padStart(6, '0')}
                        </p>
                        <p className="text-sm text-slate-600">
                            {formatDate(new Date().toISOString())}
                        </p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    <div>
                        <span className="block text-xs font-bold text-slate-500 uppercase">
                            Unidad / Carro
                        </span>
                        <p className="text-lg font-semibold uppercase">
                            {maintenance.vehicle.name}
                        </p>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-slate-500 uppercase">
                            Compañía
                        </span>
                        <p className="text-lg font-semibold uppercase">
                            {maintenance.vehicle.company}
                        </p>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-slate-500 uppercase">
                            Patente
                        </span>
                        <p className="text-lg font-semibold uppercase">
                            {maintenance.vehicle.plate || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-slate-500 uppercase">
                            Taller Asignado
                        </span>
                        <p className="text-lg font-semibold uppercase">
                            {maintenance.workshop_name}
                        </p>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-slate-500 uppercase">
                            Fecha Ingreso
                        </span>
                        <p className="text-lg font-semibold">
                            {formatDate(maintenance.entry_date)}
                        </p>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-slate-500 uppercase">
                            Fecha Tentativa Salida
                        </span>
                        <p className="text-lg font-semibold">
                            {maintenance.tentative_exit_date
                                ? formatDate(maintenance.tentative_exit_date)
                                : '--/--/----'}
                        </p>
                    </div>
                </div>

                {/* Issues List */}
                {maintenance.issues.length > 0 && (
                    <div>
                        <div className="mb-2 border-b border-slate-300 pb-1">
                            <span className="text-sm font-bold text-slate-900 uppercase">
                                Incidencias a Reparar
                            </span>
                        </div>
                        <ul className="list-inside list-disc space-y-1 text-sm">
                            {maintenance.issues.map((issue) => (
                                <li key={issue.id}>
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
                    <div>
                        <div className="mb-2 border-b border-slate-300 pb-1">
                            <span className="text-sm font-bold text-slate-900 uppercase">
                                Trabajos a Realizar
                            </span>
                        </div>
                        <ul className="list-inside list-disc space-y-1 text-sm">
                            {maintenance.tasks.map((task, idx) => (
                                <li key={idx}>{task.description}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Description / Works */}
                <div className="min-h-[200px] rounded border border-slate-300 p-4">
                    <span className="mb-2 block text-sm font-bold text-slate-700 uppercase">
                        Detalle de Trabajo Solicitado / Observaciones
                    </span>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {maintenance.description}
                    </p>
                </div>

                {/* Signatures */}
                <div className="mt-12 grid grid-cols-2 gap-16 pt-12">
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
                <div className="mt-auto border-t text-center text-xs text-slate-400">
                    <p>Generado automáticmente por Intranet CBPA</p>
                </div>
            </div>
        </div>
    );
}
