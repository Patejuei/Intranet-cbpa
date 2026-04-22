import { ClipboardList } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function ChecklistsSection() {
    return (
        <div>
            <SectionHeader
                title="Checklist Diario / Semanal"
                icon={ClipboardList}
                roles={['Maquinista', 'Cuartelero', 'Capitán', 'Inspector MM']}
            />
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                    Los <strong>Checklists</strong> son la primera línea de defensa para garantizar que las unidades estén siempre listas para responder a una emergencia.
                </p>
                <h3 className="mt-6 text-xl font-semibold">Proceso de Firma Digital</h3>
                <p>
                    El sistema utiliza un sistema de firmas electrónicas para validar que la revisión fue realizada y supervisada:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Firma Conductor:</strong> Valida que se realizó la inspección física.</li>
                    <li><strong>Firma Oficial/Capitán:</strong> Valida que el mando de la compañía está en conocimiento del estado de su material.</li>
                </ul>
                <p className="mt-6">
                    <strong>Importante:</strong> Un checklist con novedades críticas (puntos rojos) alertará automáticamente al Inspector MM para su evaluación.
                </p>
            </div>
        </div>
    );
}
