import { FileText } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function RenditionsSection() {
    return (
        <div>
            <SectionHeader
                title="Rendiciones y Gastos"
                icon={FileText}
                roles={['Capitán', 'Comandancia', 'Secretario']}
            />
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                    El módulo de <strong>Rendiciones</strong> permite transparentar y digitalizar todos los gastos asociados al Material Mayor, desde reparaciones externas hasta compras de insumos menores.
                </p>
                <div className="mt-8 overflow-hidden rounded-xl border bg-accent/50">
                    <div className="p-6">
                        <h4 className="font-bold underline">Requisitos de Rendición</h4>
                        <ul className="mt-4 space-y-2 list-inside list-disc">
                            <li>Carga de imagen o PDF del documento legal (Factura/Boleta).</li>
                            <li>Clasificación del gasto según centro de costos.</li>
                            <li>Aprobación digital por parte de la Comandancia.</li>
                        </ul>
                    </div>
                </div>
                <h3 className="mt-8 text-xl font-semibold">Cierres de Caja</h3>
                <p>
                    Periódicamente, se deben realizar cierres de rendiciones para conciliar los fondos utilizados y generar los reportes contables necesarios para la institución.
                </p>
            </div>
        </div>
    );
}
