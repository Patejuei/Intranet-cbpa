import { Truck } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function StatusSection() {
    return (
        <div>
            <SectionHeader
                title="Control de Unidades"
                icon={Truck}
                roles={['Todos', 'Inspector MM', 'Administrador']}
            />
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                    El módulo de <strong>Control de Unidades</strong> es el corazón de la gestión de flota. Permite tener una visión panorámica de la disponibilidad y estado técnico de cada vehículo del Cuerpo.
                </p>
                <h3 className="mt-6 text-xl font-semibold">Funcionalidades Principales</h3>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Monitoreo en Tiempo Real:</strong> Visualización del estado operativo (Disponible, En Servicio, Fuera de Servicio, etc.).</li>
                    <li><strong>Ficha Técnica:</strong> Acceso a datos críticos como VIN, Patente, Año, y especificaciones del motor.</li>
                    <li><strong>Gestión Documental:</strong> Alertas y carga de documentos legales (Revisión Técnica, Seguro, Permiso de Circulación).</li>
                </ul>
                <h3 className="mt-8 text-xl font-semibold">Responsabilidades</h3>
                <p className="mt-2 text-muted-foreground">
                    Mientras que todos los usuarios pueden consultar la disponibilidad, solo el <strong>Inspector de Material Mayor</strong> y el <strong>Administrador</strong> tienen permisos para modificar la información técnica o cambiar estados administrativos de las unidades.
                </p>
            </div>
        </div>
    );
}
