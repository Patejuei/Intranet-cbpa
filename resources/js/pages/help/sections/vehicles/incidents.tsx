import { AlertTriangle } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function IncidentsSection() {
    return (
        <div>
            <SectionHeader
                title="Incidencias (Reportes de Falla)"
                icon={AlertTriangle}
                roles={['Todos', 'Mecánico', 'Inspector MM']}
            />
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                    El módulo de <strong>Incidencias</strong> permite a cualquier usuario reportar anomalías o fallas detectadas en las unidades, iniciando un flujo de revisión oficial.
                </p>
                <h3 className="mt-6 text-xl font-semibold">Flujo de Trabajo</h3>
                <ol className="list-decimal pl-6 space-y-4 mt-4">
                    <li><strong>Reporte Inicial:</strong> Se describe la falla, se indica la gravedad y (opcionalmente) se adjuntan evidencias.</li>
                    <li><strong>Revisión MM:</strong> El Inspector de Material Mayor recibe la alerta y decide si la unidad requiere atención inmediata.</li>
                    <li><strong>Derivación a Taller:</strong> Si es necesario, la incidencia se convierte en una Orden de Trabajo para el Taller Mecánico.</li>
                </ol>
                <div className="rounded-lg border bg-yellow-50/10 p-4 mt-8 border-yellow-500/20">
                    <h4 className="flex items-center gap-2 font-bold text-yellow-600 dark:text-yellow-400">
                        <AlertTriangle className="h-4 w-4" /> Importante
                    </h4>
                    <p className="text-sm mt-1">
                        Un reporte de incidencia NO pone automáticamente a la unidad "Fuera de Servicio". Esa decisión es exclusiva del Inspector MM tras evaluar la gravedad del reporte.
                    </p>
                </div>
            </div>
        </div>
    );
}
