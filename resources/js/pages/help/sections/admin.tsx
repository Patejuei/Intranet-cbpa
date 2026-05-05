import { AlertTriangle, Users, Pencil, Trash, UserPlus, Shield, Truck, Check, ChevronDown } from 'lucide-react';
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

            <div className="space-y-16">
                {/* 1. Módulo Principal: Gestión de Usuarios */}
                <div className="space-y-8">
                    <section>
                        <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                            1. Panel de Gestión de Usuarios
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Este panel permite visualizar y administrar a todos los operadores del sistema. Desde aquí puedes filtrar por compañía, identificar roles rápidamente mediante etiquetas de color y gestionar el estado de habilitación de cada cuenta.
                        </p>
                    </section>

                    {/* Detalle Visual - User List */}
                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual - Listado de Usuarios (/admin/users)</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md max-w-5xl mx-auto">
                            {/* Header Mockup */}
                            <div className="p-6 border-b flex justify-between items-center bg-muted/5">
                                <div>
                                    <div className="text-xl font-bold text-foreground">Gestión de Usuarios</div>
                                    <div className="text-xs text-muted-foreground">Administra usuarios, roles y permisos.</div>
                                </div>
                                <div className="h-9 px-4 rounded bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 shadow">
                                    <UserPlus className="h-3.5 w-3.5" /> Nuevo Usuario
                                </div>
                            </div>

                            {/* Table Mockup */}
                            <div className="overflow-x-auto p-4 relative">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead className="bg-muted/50 text-muted-foreground border-b">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Nombre</th>
                                            <th className="px-4 py-3 font-medium">Compañía</th>
                                            <th className="px-4 py-3 font-medium">Rol</th>
                                            <th className="px-4 py-3 font-medium">Permisos</th>
                                            <th className="px-4 py-3 font-medium text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-4 font-semibold text-foreground">Juan Delgado</td>
                                            <td className="px-4 py-4 text-muted-foreground">Primera Compañía</td>
                                            <td className="px-4 py-4">
                                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">Maquinista</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex gap-1">
                                                    <span className="rounded border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">vehicles.logs.view</span>
                                                    <span className="rounded border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">+2</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 flex justify-center gap-2">
                                                <div className="h-7 w-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100"><Pencil className="h-3.5 w-3.5" /></div>
                                                <div className="h-7 w-7 rounded bg-red-50 text-red-600 flex items-center justify-center border border-red-100"><Trash className="h-3.5 w-3.5" /></div>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-4 font-semibold text-foreground">Inspector General</td>
                                            <td className="px-4 py-4 text-muted-foreground">Comandancia</td>
                                            <td className="px-4 py-4">
                                                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 uppercase">Inspector</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-[10px] text-muted-foreground font-medium uppercase italic">Acceso Total</span>
                                            </td>
                                            <td className="px-4 py-4 flex justify-center gap-2">
                                                <div className="h-7 w-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100"><Pencil className="h-3.5 w-3.5" /></div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <span className="absolute top-2 left-2 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Visualización Rápida:</strong> Los roles con privilegios globales (Admin/Inspector) se destacan en color púrpura. Los roles operativos de compañía aparecen en azul.</span>
                            </div>
                        </div>
                    </section>
                </div>

                <hr className="border-border" />

                {/* 2. Creación y Permisos Detallados */}
                <div className="space-y-8">
                    <section>
                        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <Shield className="h-6 w-6 text-primary" />
                            2. Roles, Permisos y Vehículos Autorizados
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            El sistema utiliza un esquema de <strong>Control de Acceso Basado en Roles (RBAC)</strong> con la capacidad de añadir permisos granulares por módulo cuando sea necesario.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-foreground">Configuración de Nuevo Usuario</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md max-w-4xl mx-auto">
                            <div className="p-8 space-y-8 relative overflow-y-auto max-h-[500px]">
                                {/* Datos Básicos Section */}
                                <div className="space-y-4">
                                    <div className="text-base font-bold text-foreground">Crear Nuevo Usuario</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <div className="text-xs font-medium text-foreground">Nombre Completo</div>
                                            <div className="h-9 w-full rounded border border-input bg-background px-3 flex items-center text-xs text-muted-foreground">Juan Delgado</div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="text-xs font-medium text-foreground">RUT</div>
                                            <div className="h-9 w-full rounded border border-input bg-background px-3 flex items-center text-xs text-muted-foreground">12345678-9</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 rounded border-2 border-primary bg-primary flex items-center justify-center text-white">
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <div className="text-xs font-medium text-foreground">Usuario Habilitado</div>
                                    </div>
                                </div>

                                {/* Roles & Permissions Mock */}
                                <div className="pt-6 border-t space-y-4 relative">
                                    <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                        <Shield className="h-4 w-4" /> Roles y Permisos
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-xs font-medium text-muted-foreground">Rol del Sistema</div>
                                        <div className="h-9 w-full rounded border border-input bg-background px-3 flex items-center justify-between text-xs text-foreground">
                                            Maquinista <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>

                                    {/* Permission Table Mockup */}
                                    <div className="rounded-md border p-4 space-y-4 bg-muted/10">
                                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Material Mayor</div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between border-b pb-2">
                                                <div className="text-xs font-medium text-foreground">Bitácora de Carros</div>
                                                <div className="flex gap-1 bg-muted p-1 rounded">
                                                    <div className="px-3 py-1 rounded text-[10px] font-bold text-muted-foreground">Ninguno</div>
                                                    <div className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold shadow-sm">Ver</div>
                                                    <div className="px-3 py-1 rounded text-[10px] font-bold text-muted-foreground">Editar</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="absolute top-0 right-[-20px] flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                </div>

                                {/* Vehicles Section Mock */}
                                <div className="pt-6 border-t space-y-4 relative">
                                    <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                        <Truck className="h-4 w-4" /> Vehículos Autorizados
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 h-32 border rounded-md p-3 overflow-y-scroll bg-background">
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 rounded border-2 border-primary bg-primary flex items-center justify-center text-white"><Check className="h-3 w-3" /></div>
                                            <div className="text-[11px] font-medium leading-none text-foreground">B-1 <span className="text-[10px] text-muted-foreground">(Primera)</span></div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 rounded border-2 border-muted"></div>
                                            <div className="text-[11px] font-medium leading-none text-foreground">B-2 <span className="text-[10px] text-muted-foreground">(Segunda)</span></div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 rounded border-2 border-primary bg-primary flex items-center justify-center text-white"><Check className="h-3 w-3" /></div>
                                            <div className="text-[11px] font-medium leading-none text-foreground">BX-1 <span className="text-[10px] text-muted-foreground">(Primera)</span></div>
                                        </div>
                                    </div>
                                    <span className="absolute top-0 right-[-20px] flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <div className="h-10 px-8 rounded bg-primary text-primary-foreground text-sm font-bold flex items-center shadow-lg">Registrar Usuario</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <div>
                                    <strong>Permisos Granulares:</strong> Si el rol no tiene permisos implícitos, puedes configurar accesos específicos:
                                    <ul className="mt-1 ml-4 list-disc space-y-1 text-xs">
                                        <li><strong>Ver:</strong> Solo lectura del módulo.</li>
                                        <li><strong>Editar:</strong> Permite crear y modificar registros.</li>
                                        <li><strong>Total:</strong> Incluye borrado y configuraciones críticas (según módulo).</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Autorización de Conducción:</strong> Es vital marcar los vehículos que el Maquinista está autorizado a operar. Esto filtra qué carros verá en su propia bitácora y checklists.</span>
                            </div>
                        </div>
                    </section>

                    <div className="mt-8 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            VALIDACIÓN OTP OBLIGATORIA
                        </h4>
                        <p className="mt-1 text-xs text-destructive">
                            Cualquier cambio en permisos o creación de usuarios requiere validación mediante código de seguridad (OTP) enviado al correo del administrador para dejar trazabilidad auditable.
                        </p>
                    </div>
                </div>

                <hr className="border-border" />

                {/* 3. Permisos y Roles (Delegación) */}
                <div className="space-y-4 pt-8">
                    <h2 className="text-xl font-semibold text-foreground">3. Permisos y Roles (Delegación)</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        La creación de cuentas puede ser delegada jerárquicamente. Un Capitán puede crear usuarios, pero solo para su propia compañía.
                    </p>
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm text-foreground">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3 text-left font-medium text-foreground">Rol Creador</th>
                                    <th className="p-3 text-center font-medium text-foreground">Crear Usuarios</th>
                                    <th className="p-3 text-left font-medium text-foreground">Límites y Reglas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y bg-background">
                                <tr>
                                    <td className="p-3 font-medium text-foreground">Administrador del Sistema</td>
                                    <td className="p-3 text-center text-green-600 font-bold">✓</td>
                                    <td className="p-3 text-left text-muted-foreground">Acceso total. Puede crear cuentas para cualquier compañía y asignar cualquier rol, incluyendo a otros administradores.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium text-foreground">Comandancia</td>
                                    <td className="p-3 text-center text-green-600 font-bold">✓</td>
                                    <td className="p-3 text-left text-muted-foreground">Puede crear cuentas globales, pero su acceso está sujeto a auditoría de la plataforma administrativa.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium text-foreground">Capitán</td>
                                    <td className="p-3 text-center text-green-600 font-bold">✓</td>
                                    <td className="p-3 text-left text-muted-foreground">Solo puede crear usuarios (Bomberos, Maquinistas, Ayudantes) asignados <strong>forzosamente</strong> a su misma compañía.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium text-foreground">Otros Roles (Inspector, Voluntario)</td>
                                    <td className="p-3 text-center text-red-500 font-bold">✗</td>
                                    <td className="p-3 text-left text-muted-foreground">Sin acceso a la administración de usuarios.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
