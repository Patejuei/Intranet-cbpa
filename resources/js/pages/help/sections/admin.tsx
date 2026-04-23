import { AlertTriangle, Users } from 'lucide-react';
import { SectionHeader } from '../components/section-header';

export function AdminSection() {
    return (
        <div className="space-y-12">
            <div className="space-y-4">
                <SectionHeader
                    title="Administración de Usuarios"
                    icon={Users}
                    roles={['Administrador del Sistema', 'Comandancia', 'Capitán']}
                />
                <p className="text-lg text-muted-foreground">
                    Guía para la creación de usuarios, asignación de roles, permisos granulares y vehículos autorizados.
                </p>
            </div>

            <div className="space-y-8">
                {/* --- 1. Formulario de Creación / Permisos --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Roles, Permisos y Vehículos Autorizados
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El sistema maneja permisos híbridos: algunos roles tienen acceso total implícito por su jerarquía (ej. Comandante), mientras que roles estándar requieren asignación granular por cada submódulo.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md max-w-4xl mx-auto p-6 space-y-6">
                            
                            <div className="rounded border p-4 space-y-4 relative">
                                <div className="font-semibold border-b pb-2">Datos Básicos</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Nombre Completo</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">Juan Pérez</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Correo Electrónico</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">juan.perez@bomberos.cl</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">RUT (Sin puntos y Con guión)</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">12345678-9</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Contraseña</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">••••••••</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Compañía</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center justify-between bg-background">Primera Compañía <span>▼</span></div>
                                    </div>
                                    <div className="space-y-1.5 relative">
                                        <div className="text-sm font-medium">Rol del Sistema</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center justify-between bg-background">Maquinista <span>▼</span></div>
                                        <span className="absolute -right-3 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 md:col-span-2">
                                        <div className="h-4 w-4 rounded border bg-primary flex items-center justify-center text-white text-[10px]">✓</div>
                                        <span className="text-sm font-medium">Usuario Habilitado</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded border p-4 space-y-4 relative">
                                <div className="font-semibold border-b pb-2">Permisos por Módulo</div>
                                <div className="text-sm font-medium">Material Mayor</div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">M. Mayor - Bitácora</span>
                                        <div className="flex gap-1 text-xs">
                                            <div className="px-2 py-1 rounded border">Ninguno</div>
                                            <div className="px-2 py-1 rounded border bg-blue-100 text-blue-700">Ver</div>
                                            <div className="px-2 py-1 rounded border bg-green-100 text-green-700 font-medium border-green-200">Editar</div>
                                        </div>
                                    </div>
                                </div>
                                <span className="absolute -right-2 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                            </div>

                            <div className="rounded border p-4 space-y-4 relative">
                                <div className="font-semibold border-b pb-2">Vehículos Permitidos (Maquinistas)</div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    <div className="flex items-center gap-2"><div className="h-4 w-4 rounded border"></div><span className="text-sm">B-1 (Primera)</span></div>
                                    <div className="flex items-center gap-2"><div className="h-4 w-4 rounded border bg-primary flex items-center justify-center text-white text-[10px]">✓</div><span className="text-sm">R-1 (Primera)</span></div>
                                </div>
                                <span className="absolute -left-3 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">3</span>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Estado y Empresa:</strong> Puedes deshabilitar a un voluntario (bloqueando su acceso) sin borrar su historial. "Compañía" restringe qué información puede ver.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Permisos Granulares:</strong> Cuando el rol no es administrativo (ej: Voluntario regular), debes especificar submódulo por submódulo si puede Ver o Editar.</span>
                            </div>
                            <div className="flex items-start gap-2 md:col-span-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">3</span>
                                <span><strong>Autorización de Conducción:</strong> Clave para los Maquinistas. Si un vehículo no está marcado aquí, el conductor no podrá registrar bitácoras, cargas de combustible ni reportar incidencias para esa máquina.</span>
                            </div>
                        </div>
                        
                        <div className="mt-8 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-destructive">
                                <AlertTriangle className="h-4 w-4" />
                                VALIDACIÓN OTP OBLIGATORIA
                            </h4>
                            <p className="mt-1 text-xs text-destructive">
                                La creación, modificación o eliminación de usuarios requiere validación 2FA por parte del administrador que ejecuta la acción para dejar trazabilidad auditable.
                            </p>
                        </div>
                    </section>
                </div>

                {/* --- Permisos --- */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">2. Permisos y Roles (Delegación)</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        La creación de cuentas puede ser delegada jerárquicamente. Un Capitán puede crear usuarios, pero solo para su propia compañía.
                    </p>
                    <div className="overflow-hidden rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3 text-left font-medium">Rol Creador</th>
                                    <th className="p-3 text-center font-medium">Crear Usuarios</th>
                                    <th className="p-3 text-left font-medium">Límites y Reglas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y bg-background">
                                <tr>
                                    <td className="p-3 font-medium">Administrador del Sistema</td>
                                    <td className="p-3 text-center text-green-600">✓</td>
                                    <td className="p-3 text-left">Acceso total. Puede crear cuentas para cualquier compañía y asignar cualquier rol, incluyendo a otros administradores.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Comandancia</td>
                                    <td className="p-3 text-center text-green-600">✓</td>
                                    <td className="p-3 text-left">Puede crear cuentas globales, pero su acceso está sujeto a auditoría de la plataforma administrativa.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Capitán</td>
                                    <td className="p-3 text-center text-green-600">✓</td>
                                    <td className="p-3 text-left">Solo puede crear usuarios (Bomberos, Maquinistas, Ayudantes) asignados <strong>forzosamente</strong> a su misma compañía.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Otros Roles (Inspector, Voluntario)</td>
                                    <td className="p-3 text-center text-red-500">✗</td>
                                    <td className="p-3 text-left">Sin acceso a la administración de usuarios.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
