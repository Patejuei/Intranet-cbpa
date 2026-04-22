import { AlertTriangle, Users } from 'lucide-react';
import { SectionHeader } from '../components/section-header';

export function AdminSection() {
    return (
        <div>
            <SectionHeader
                title="Administración de Usuarios"
                icon={Users}
                roles={['Administrador del Sistema']}
            />
            <div className="space-y-8">
                <section>
                    <h3 className="flex items-center gap-2 text-xl font-semibold">
                        <Users className="h-5 w-5 text-primary" />
                        Control de Acceso
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                        El administrador tiene control total sobre quién accede
                        a la plataforma.
                    </p>
                    <ul className="mt-4 space-y-3">
                        <li className="flex items-start gap-2 text-sm">
                            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>
                                <strong>Gestión de Usuarios:</strong> Creación,
                                edición y asignación de Compañía/Compañía y Rol.
                            </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>
                                <strong>Estado Activo:</strong> Capacidad de
                                deshabilitar cuentas instantáneamente para
                                evitar el acceso.
                            </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span>
                                <strong>Reset 2FA/Password:</strong> Asistencia
                                técnica a usuarios que pierdan sus credenciales
                                o acceso al autenticador.
                            </span>
                        </li>
                    </ul>
                </section>

                <div className="mt-8 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        SEGURIDAD CRÍTICA
                    </h4>
                    <p className="mt-1 text-xs text-destructive">
                        Las acciones de administración deben ser auditadas. No
                        compartas cuentas administrativas.
                    </p>
                </div>
            </div>
        </div>
    );
}
