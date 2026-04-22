import { Info } from 'lucide-react';
import { SectionHeader } from '../components/section-header';

export function GeneralSection() {
    return (
        <div>
            <SectionHeader
                title="Introducción"
                icon={Info}
                roles={['Todos los usuarios']}
            />
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">
                    Bienvenido a la{' '}
                    <strong>
                        Intranet del Cuerpo de Bomberos de Puente Alto (CBPA)
                    </strong>
                    . Este manual tiene como objetivo guiarte por las
                    funcionalidades activas del sistema, asegurando que cada rol
                    pueda realizar sus tareas de manera eficiente y
                    centralizada.
                </p>

                <h3 className="mt-8 text-xl font-semibold">Consejos Rápidos</h3>
                <ul className="mt-4 list-disc space-y-2 pl-6">
                    <li>
                        Utiliza el ícono <strong>?</strong> en la esquina
                        superior derecha de cada módulo para acceder
                        directamente a su sección del manual.
                    </li>
                    <li>
                        Sigue las notificaciones del Panel Principal para estar
                        al tanto de tareas pendientes.
                    </li>
                    <li>
                        Mantén tu perfil actualizado, especialmente la
                        configuración de seguridad.
                    </li>
                </ul>
            </div>
        </div>
    );
}
