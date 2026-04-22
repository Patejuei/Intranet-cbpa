import { Settings, Shield, User } from 'lucide-react';
import { SectionHeader } from '../components/section-header';

export function ProfileSection() {
    return (
        <div>
            <SectionHeader
                title="Perfil de Usuario"
                icon={User}
                roles={['Todos los usuarios']}
            />
            <div className="space-y-8">
                <section>
                    <h3 className="flex items-center gap-2 text-xl font-semibold">
                        <Settings className="h-5 w-5 text-primary" />
                        Gestión de Cuenta
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                        Cada usuario tiene acceso a su perfil personal para
                        gestionar su información y seguridad.
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border bg-accent/50 p-4">
                            <h4 className="font-medium">
                                Cambio de Contraseña
                            </h4>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Accesible desde Configuración para asegurar la
                                integridad de tu cuenta.
                            </p>
                        </div>
                        <div className="rounded-lg border bg-accent/50 p-4">
                            <h4 className="font-medium">
                                Verificación en Dos Pasos (2FA)
                            </h4>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Implementada para acciones sensibles. Requiere
                                el código de tu aplicación autenticadora.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="flex items-center gap-2 text-xl font-semibold">
                        <Shield className="h-5 w-5 text-primary" />
                        Limitaciones por Rol
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                        Tu perfil muestra tus permisos actuales. Si no ves un
                        módulo, es posible que tu rol no tenga acceso o el
                        módulo no esté habilitado para tu compañía.
                    </p>
                </section>
            </div>
        </div>
    );
}
