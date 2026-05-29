import { Box, ShieldCheck, History, Users } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function EqMaterialSection() {
    return (
        <div>
            <SectionHeader
                title="Material Menor"
                icon={Box}
                roles={['Todos los usuarios', 'Comandancia', 'Capitán', 'Ayudante']}
            />
            
            <div className="space-y-16">
                
                {/* --- 1. Inventario de Material Menor --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Gestión de Material Menor
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El módulo de <strong>Material Menor</strong> permite gestionar todos los activos y herramientas que no forman parte integral de un vehículo (mangueras, pitones, equipos ERA, herramientas forestales, etc.). Facilita la asignación de materiales a compañías, dependencias o incluso a voluntarios específicos.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-sm">
                            <div className="border-b bg-muted/10 p-4 flex justify-between items-center">
                                <div className="font-bold text-lg">Inventario Material Menor</div>
                                <div className="flex gap-2">
                                    <div className="flex h-8 items-center rounded bg-primary px-3 text-xs font-medium text-white">+ Nuevo Material</div>
                                    <div className="flex h-8 items-center rounded border px-3 text-xs font-medium">Exportar</div>
                                    <span className="absolute right-24 top-4 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                        1
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 border-b bg-muted/5 flex gap-2 relative">
                                <div className="h-9 w-64 rounded border bg-background px-3 flex items-center text-sm text-muted-foreground">Buscar material...</div>
                                <div className="h-9 w-40 rounded border bg-background px-3 flex items-center text-sm justify-between">
                                    Categoría <span>▼</span>
                                </div>
                                <span className="absolute left-64 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                    2
                                </span>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/30">
                                        <tr>
                                            <th className="p-3">Nombre</th>
                                            <th className="p-3">Categoría</th>
                                            <th className="p-3">Ubicación</th>
                                            <th className="p-3 text-right">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="p-3">
                                                <div className="font-medium text-blue-600">Pitón Protek 366</div>
                                                <div className="text-xs text-muted-foreground">SKU: PIT-PRO-01</div>
                                            </td>
                                            <td className="p-3">Agua</td>
                                            <td className="p-3">Primera Compañía</td>
                                            <td className="p-3 text-right font-bold">12</td>
                                        </tr>
                                        <tr className="border-t bg-muted/5">
                                            <td className="p-3">
                                                <div className="font-medium text-blue-600">ERA Scott X3</div>
                                                <div className="text-xs text-muted-foreground">SKU: ERA-SCO-05</div>
                                            </td>
                                            <td className="p-3">Protección Respiratoria</td>
                                            <td className="p-3">Segunda Compañía</td>
                                            <td className="p-3 text-right font-bold text-red-600">2 <span className="text-[10px] block font-normal">Crítico</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Gestión de Altas:</strong> Los administradores pueden crear nuevos tipos de materiales y definir su stock inicial y parámetros de alerta.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Filtros Avanzados:</strong> Permite filtrar por compañía para ver qué materiales tiene asignados cada unidad del Cuerpo.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 2. Asignaciones y Movimientos --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Asignaciones y Control de Destino
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Cada material puede estar "En Bodega" o "Asignado". Las asignaciones permiten saber exactamente qué material tiene cada voluntario o en qué dependencia se encuentra físicamente una herramienta.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md max-w-3xl mx-auto p-6 space-y-4">
                            <div className="flex items-center gap-4 border-b pb-4">
                                <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center text-primary">📦</div>
                                <div className="flex-1">
                                    <div className="font-bold">Pitón Protek 366</div>
                                    <div className="text-xs text-muted-foreground">Stock Total: 12 unidades</div>
                                </div>
                                <div className="flex h-8 items-center rounded border bg-primary px-3 text-xs font-medium text-white">Nueva Asignación</div>
                            </div>
                            
                            <div className="space-y-3 relative">
                                <div className="text-sm font-semibold">Material Asignado a:</div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 rounded border bg-muted/5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">JP</div>
                                            <div>
                                                <div className="text-sm font-medium">Juan Pérez</div>
                                                <div className="text-[10px] text-muted-foreground">Primera Compañía</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold">2 Unid.</div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded border bg-muted/5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">🏠</div>
                                            <div>
                                                <div className="text-sm font-medium">Pañol Central</div>
                                                <div className="text-[10px] text-muted-foreground">Dependencia</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold">5 Unid.</div>
                                    </div>
                                </div>
                                <span className="absolute -right-3 top-10 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Trazabilidad de Entrega:</strong> Al asignar material a un voluntario, el sistema puede generar automáticamente un "Certificado de Entrega" que queda vinculado a su ficha personal.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 3. Bajas de Material --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        3. Solicitudes de Baja
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Cuando un material se daña o cumple su vida útil, se debe iniciar un proceso de "Baja". Este flujo requiere la validación de un Inspector o Comandante para asegurar que el inventario se actualice con motivos justificados.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Flujo de Estados</h3>
                        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-xl border bg-muted/5 relative">
                            <div className="flex flex-col items-center gap-2 text-center w-32">
                                <div className="h-10 w-10 rounded-full border-2 border-primary flex items-center justify-center font-bold text-primary">1</div>
                                <div className="text-xs font-medium">Solicitud (Cía)</div>
                            </div>
                            <div className="hidden md:block h-0.5 flex-1 bg-muted"></div>
                            <div className="flex flex-col items-center gap-2 text-center w-32">
                                <div className="h-10 w-10 rounded-full border-2 border-orange-500 flex items-center justify-center font-bold text-orange-500">2</div>
                                <div className="text-xs font-medium">Revisión Inspector</div>
                            </div>
                            <div className="hidden md:block h-0.5 flex-1 bg-muted"></div>
                            <div className="flex flex-col items-center gap-2 text-center w-32">
                                <div className="h-10 w-10 rounded-full border-2 border-green-600 flex items-center justify-center font-bold text-green-600">3</div>
                                <div className="text-xs font-medium">Aprobación Final</div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- Permisos --- */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">4. Permisos y Roles</h2>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3">Rol</th>
                                    <th className="p-3">Ver Inventario</th>
                                    <th className="p-3">Asignar Material</th>
                                    <th className="p-3">Aprobar Bajas</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Bombero</td>
                                    <td className="p-3 text-green-600 font-bold">Solo propio</td>
                                    <td className="p-3 text-red-600">No</td>
                                    <td className="p-3 text-red-600">No</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Capitán / Ayudante</td>
                                    <td className="p-3 text-green-600 font-bold">Su Cía</td>
                                    <td className="p-3 text-green-600 font-bold">Sí (En Cía)</td>
                                    <td className="p-3 text-red-600">No (Solo solicita)</td>
                                </tr>
                                <tr className="border-t bg-muted/10">
                                    <td className="p-3 font-medium text-primary">Inspector / Comandancia</td>
                                    <td className="p-3 text-green-600 font-bold">Global</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
