import { Archive } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function InventorySection() {
    return (
        <div>
            <SectionHeader
                title="Bodega de Material Mayor"
                icon={Archive}
                roles={['Inspector MM', 'Administrador']}
            />
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                    El módulo de <strong>Bodega</strong> permite el control estricto de repuestos, lubricantes e insumos específicos para las unidades de bomberos.
                </p>
                <h3 className="mt-6 text-xl font-semibold">Conceptos Clave</h3>
                <ul className="list-disc pl-6 space-y-3 mt-4">
                    <li><strong>Stock Mínimo:</strong> Cada artículo tiene definido un nivel de seguridad. Si el stock baja de ese nivel, el sistema genera una alerta visual.</li>
                    <li><strong>Egresos por OT:</strong> Los repuestos solo pueden salir de bodega vinculándolos a una Orden de Trabajo del taller, asegurando trazabilidad total.</li>
                    <li><strong>Categorización:</strong> Los repuestos se agrupan por familia (Motor, Transmisión, Suspensión, Equipamiento, etc.).</li>
                </ul>
            </div>
        </div>
    );
}
