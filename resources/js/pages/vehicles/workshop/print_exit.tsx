import { Head } from '@inertiajs/react';

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
    issues: Issue[];
    tasks: Task[];
}

export default function MaintenanceExitPrint({
    maintenance,
}: {
    maintenance: Maintenance;
}) {
    const totalCost = maintenance.tasks.reduce(
        (sum, t) => sum + (Number(t.cost) || 0),
        0,
    );

    // Trigger print dialog on load
    if (typeof window !== 'undefined') {
        setTimeout(() => {
            window.print();
        }, 500);
    }

    return (
        <div className="bg-white p-8 text-black print:p-0">
            <Head title={`Orden Salida #${maintenance.id}`} />

            <div className="mb-8 flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                    <img
                        src="/images/logo_cbpa.png"
                        alt="Logo CBPA"
                        className="h-16 w-16 object-contain"
                    />
                    <div>
                        <h1 className="text-xl font-bold uppercase">
                            Cuerpo de Bomberos de Puente Alto
                        </h1>
                        <h2 className="text-sm text-gray-600">
                            Comandancia - Departamento de Material Mayor
                        </h2>
                    </div>
                </div>
                <div className="text-right">
                    <h3 className="text-2xl font-bold">ORDEN DE SALIDA</h3>
                    <p className="text-lg text-gray-500">#{maintenance.id}</p>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase">
                        Vehículo
                    </span>
                    <span className="text-lg font-medium">
                        {maintenance.vehicle.name} ({maintenance.vehicle.plate})
                    </span>
                </div>
                <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase">
                        Compañía
                    </span>
                    <span className="text-lg font-medium">
                        {maintenance.vehicle.company}
                    </span>
                </div>
                <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase">
                        Modelo
                    </span>
                    <span className="text-base">
                        {maintenance.vehicle.make} {maintenance.vehicle.model}
                    </span>
                </div>
                <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase">
                        Taller Responsable
                    </span>
                    <span className="text-base">
                        {maintenance.workshop_name}
                    </span>
                </div>
                <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase">
                        Fecha Ingreso
                    </span>
                    <span className="text-base">{maintenance.entry_date}</span>
                </div>
                <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase">
                        Fecha Salida / Término
                    </span>
                    <span className="rounded bg-gray-100 px-2 py-1 text-base font-bold">
                        {maintenance.exit_date || 'Pendiente'}
                    </span>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="mb-2 border-b border-gray-300 pb-1 text-sm font-bold text-gray-700 uppercase">
                    Resumen de Trabajos Realizados
                </h4>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 text-left">Descripción</th>
                            <th className="w-24 py-2 text-center">Estado</th>
                            <th className="w-32 py-2 text-right">
                                Costo (CLP)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {maintenance.tasks.map((task) => (
                            <tr
                                key={task.id}
                                className="border-b border-gray-100"
                            >
                                <td className="py-2">{task.description}</td>
                                <td className="py-2 text-center">
                                    {task.is_completed
                                        ? 'Realizado'
                                        : 'Pendiente/No Realizado'}
                                </td>
                                <td className="py-2 text-right">
                                    {task.cost
                                        ? `$${Number(task.cost).toLocaleString('es-CL')}`
                                        : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-black text-lg font-bold">
                            <td colSpan={2} className="py-3 text-right">
                                COSTO TOTAL:
                            </td>
                            <td className="py-3 text-right">
                                ${totalCost.toLocaleString('es-CL')}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="mb-6">
                <h4 className="mb-2 border-b border-gray-300 pb-1 text-sm font-bold text-gray-700 uppercase">
                    Incidencias Resueltas
                </h4>
                <ul className="list-disc pl-5 text-sm">
                    {maintenance.issues
                        .filter((i) => i.status === 'Resolved')
                        .map((issue) => (
                            <li key={issue.id} className="mb-1">
                                {issue.description}{' '}
                                <span className="font-bold text-green-600">
                                    (Resuelto)
                                </span>
                            </li>
                        ))}
                    {maintenance.issues
                        .filter((i) => i.status !== 'Resolved')
                        .map((issue) => (
                            <li key={issue.id} className="mb-1 text-gray-400">
                                {issue.description} (Pendiente)
                            </li>
                        ))}
                    {maintenance.issues.length === 0 && (
                        <li className="text-gray-500 italic">
                            No se vincularon incidencias específicas.
                        </li>
                    )}
                </ul>
            </div>

            <div className="mb-6 border p-4 text-xs text-gray-600">
                <span className="font-bold">Observaciones Finales:</span>
                <p className="mt-1">
                    {maintenance.description || 'Sin observaciones.'}
                </p>
            </div>

            <div className="mt-12 flex justify-between gap-8 pt-8">
                <div className="flex-1 border-t border-black pt-2 text-center text-sm">
                    <p className="font-bold">Firma Mecánico Jefe</p>
                    <p className="text-xs text-gray-500">
                        Aceptación de Trabajos
                    </p>
                </div>
                <div className="flex-1 border-t border-black pt-2 text-center text-sm">
                    <p className="font-bold">Firma Maquinista / Receptor</p>
                    <p className="text-xs text-gray-500">
                        Conformidad de Entrega
                    </p>
                </div>
            </div>

            <div className="mt-8 text-center text-[10px] text-gray-400">
                Departamento de Material Mayor - Cuerpo de Bomberos de Puente
                Alto
                <br />
                Generado el {new Date().toLocaleDateString('es-CL')}
            </div>
        </div>
    );
}
