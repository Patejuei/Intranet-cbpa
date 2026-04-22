import { Wrench } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function WorkshopSection() {
    return (
        <div>
            <SectionHeader
                title="Taller Mecánico"
                icon={Wrench}
                roles={['Mecánico', 'Inspector MM']}
            />
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                    El módulo de <strong>Taller Mecánico</strong> gestiona todas las intervenciones técnicas realizadas en las unidades por el personal de mantenimiento de la institución.
                </p>
                <div className="grid gap-6 md:grid-cols-2 mt-8">
                    <div className="p-4 rounded-lg border">
                        <h4 className="font-bold">Mantenimiento Preventivo</h4>
                        <p className="text-sm text-muted-foreground mt-1">Acciones programadas según calendario o lecturas de horómetro/odómetro para evitar fallas futuras.</p>
                    </div>
                    <div className="p-4 rounded-lg border">
                        <h4 className="font-bold">Mantenimiento Correctivo</h4>
                        <p className="text-sm text-muted-foreground mt-1">Reparaciones de fallas reportadas a través del módulo de Incidencias.</p>
                    </div>
                </div>
                <h3 className="mt-8 text-xl font-semibold">Repuestos e Insumos</h3>
                <p>
                    Cada orden de trabajo en el taller permite descontar repuestos de la <strong>Bodega MM</strong>, manteniendo un costo asociado a cada reparación y un control estricto del inventario del taller.
                </p>
            </div>
        </div>
    );
}
