import { BookOpen } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function LogsSection() {
    return (
        <div>
            <SectionHeader
                title="Bitácoras de Uso"
                icon={BookOpen}
                roles={['Maquinista', 'Cuartelero', 'Comandancia']}
            />
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                    La <strong>Bitácora</strong> es el registro legal y operativo de cada movimiento de la unidad. Es fundamental para el control de mantenimiento preventivo basado en uso.
                </p>
                <h3 className="mt-6 text-xl font-semibold">Datos Obligatorios</h3>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Conductor y Oficial:</strong> Quién opera la unidad y quién está a cargo del servicio.</li>
                    <li><strong>Odómetro y Horómetro:</strong> Lecturas iniciales y finales para calcular el desgaste real.</li>
                    <li><strong>Detalle del Servicio:</strong> Motivo de la salida (Llamado, Ejercicio, Recopilación de datos, etc.).</li>
                </ul>
                <h3 className="mt-8 text-xl font-semibold">Carga de Combustible</h3>
                <p>
                    Dentro de cada registro de bitácora, se puede (y se debe) registrar si se realizó una carga de combustible, indicando litros y costo según corresponda para el control de rendimiento.
                </p>
            </div>
        </div>
    );
}
