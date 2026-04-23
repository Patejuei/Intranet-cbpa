import { ClipboardCheck } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function ChecklistsSection() {
    return (
        <div>
            <SectionHeader
                title="Checklists Preventivos"
                icon={ClipboardCheck}
                roles={['Maquinista', 'Capitán', 'Inspector MM', 'Comandancia']}
            />
            
            <div className="space-y-16">
                
                {/* --- 1. Vista General --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Historial de Checklists
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El historial de checklists funciona como el archivo oficial de las revisiones rutinarias de las unidades. Permite auditar qué maquinista realizó la revisión, la fecha, y si se identificaron elementos urgentes o para próxima mantención.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-sm">
                            <div className="border-b bg-muted/10 p-4 flex justify-between items-center">
                                <div className="font-bold text-lg">Historial de Checklists</div>
                                <div className="flex gap-2">
                                    <div className="flex h-8 items-center rounded bg-primary px-3 text-xs font-medium text-primary-foreground">+ Nuevo Checklist</div>
                                    <div className="flex h-8 items-center rounded border px-3 text-xs font-medium">Reporte Excel</div>
                                    <span className="absolute right-4 top-4 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                        1
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 border-b bg-muted/5 flex gap-2 relative">
                                <div className="h-9 w-64 rounded border bg-background px-3 flex items-center text-sm text-muted-foreground justify-between">
                                    Filtrar por Vehículo <span>▼</span>
                                </div>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/30">
                                        <tr>
                                            <th className="p-3">ID</th>
                                            <th className="p-3">Vehículo</th>
                                            <th className="p-3">Realizado Por</th>
                                            <th className="p-3">Estado</th>
                                            <th className="p-3 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="p-3 font-medium">#1024</td>
                                            <td className="p-3">
                                                <div className="font-medium">B-1</div>
                                                <div className="text-xs text-muted-foreground">Primera Compañía</div>
                                            </td>
                                            <td className="p-3">Juan Maquinista</td>
                                            <td className="p-3 relative">
                                                <span className="rounded-full bg-green-500/10 text-green-700 border border-green-500/20 px-2 py-0.5 text-xs">Completed</span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="inline-flex h-7 px-2 rounded border items-center justify-center text-xs font-medium text-muted-foreground">Ver Detalles</div>
                                                <span className="absolute right-4 top-[70%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                                    2
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Reportes y Creación:</strong> Desde aquí puedes exportar todo el historial a Excel o iniciar una nueva revisión preventiva (si tienes los permisos).</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Visualización de Detalles:</strong> Al hacer clic en "Ver Detalles" accederás al reporte completo y al flujo de visaciones obligatorias.</span>
                            </div>
                        </div>
                    </section>
                </div>


                {/* --- 2. Nuevo Checklist --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Nuevo Checklist Preventivo
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Formulario de evaluación en terreno estructurado por categorías (ej: Cabina, Motor, Chasis). Obliga al evaluador a categorizar el estado de cada componente e ingresar observaciones adicionales.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md max-w-3xl mx-auto p-6 space-y-6">
                            
                            <div className="space-y-1.5 relative">
                                <div className="text-sm font-medium">Vehículo</div>
                                <div className="flex h-9 items-center rounded border px-3 text-sm justify-between bg-muted/5">
                                    B-1 (XX-YY-11) - Primera Compañía <span>▼</span>
                                </div>
                            </div>

                            {/* Categoria Ejemplo */}
                            <div className="rounded border overflow-hidden">
                                <div className="bg-muted/50 p-3 font-bold border-b text-sm">Sistema Eléctrico y Luces</div>
                                
                                <div className="p-4 grid grid-cols-[1fr_auto_1fr] gap-4 items-center border-b last:border-0 relative">
                                    <div className="font-medium text-sm">Luces de emergencia (Balizas)</div>
                                    
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1"><div className="h-4 w-4 rounded-full border-4 border-green-600"></div><span className="text-xs font-bold text-green-700">OK</span></div>
                                        <div className="flex items-center gap-1"><div className="h-4 w-4 rounded-full border border-muted-foreground"></div><span className="text-xs font-bold text-yellow-700">Próx. Mant.</span></div>
                                        <div className="flex items-center gap-1"><div className="h-4 w-4 rounded-full border border-muted-foreground"></div><span className="text-xs font-bold text-red-700">Urgente</span></div>
                                    </div>
                                    
                                    <div><div className="h-8 rounded border flex items-center px-2 text-xs text-muted-foreground bg-muted/5">Observaciones (opcional)</div></div>
                                    <span className="absolute -left-3 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                </div>

                                <div className="p-4 grid grid-cols-[1fr_auto_1fr] gap-4 items-center relative">
                                    <div className="font-medium text-sm">Focos faeneros</div>
                                    
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1"><div className="h-4 w-4 rounded-full border border-muted-foreground"></div><span className="text-xs font-bold text-green-700">OK</span></div>
                                        <div className="flex items-center gap-1"><div className="h-4 w-4 rounded-full border border-muted-foreground"></div><span className="text-xs font-bold text-yellow-700">Próx. Mant.</span></div>
                                        <div className="flex items-center gap-1"><div className="h-4 w-4 rounded-full border-4 border-red-600"></div><span className="text-xs font-bold text-red-700">Urgente</span></div>
                                    </div>
                                    
                                    <div><div className="h-8 rounded border flex items-center px-2 text-xs">Foco lateral derecho quemado</div></div>
                                    <span className="absolute -left-3 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm font-medium">Observaciones Generales</div>
                                <div className="h-20 rounded border bg-muted/5 p-2 text-sm text-muted-foreground">Comentarios generales sobre el estado del vehículo...</div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <div className="h-9 px-6 rounded bg-primary text-white text-sm font-medium flex items-center shadow-sm">Registrar Checklist</div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Evaluación Obligatoria:</strong> Cada ítem de la lista debe tener marcado al menos su estado. Por defecto se inicializa en "OK".</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Observaciones Específicas:</strong> Si se marca "Urgente" o "Próx. Mant.", es una buena práctica (y exigido por el mando) colocar un detalle textual de qué es lo que falló exactamente en ese componente.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 3. Detalle y Visación --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        3. Detalle y Flujo de Visación (Show)
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Una vez enviado el Checklist, no puede ser modificado. Entra en un flujo de revisión estricto que depende de a quién pertenece el vehículo (Compañías regulares vs. Comandancia) y requiere firma electrónica de doble factor (2FA).
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            {/* Columna Izquierda */}
                            <div className="space-y-6 relative">
                                <div>
                                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                                        Checklist #1024 <span className="bg-primary px-2 py-0.5 rounded text-xs text-white">Completed</span>
                                    </h1>
                                    <p className="text-muted-foreground text-sm mt-1">2026-04-20 - Realizado por Juan Maquinista</p>
                                </div>
                                
                                <div className="rounded border shadow-sm p-4 space-y-4">
                                    <div className="font-bold border-b pb-2 text-sm">Estado de Revisión (Flujo Cía.)</div>
                                    <div className="flex justify-between items-center p-2 border rounded">
                                        <div>
                                            <div className="font-bold text-sm">Capitán</div>
                                            <div className="text-xs text-muted-foreground">Pedro Capitán</div>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-green-600 font-medium">✓ 2026-04-20</div>
                                    </div>
                                    <div className="flex justify-between items-center p-2 border rounded">
                                        <div>
                                            <div className="font-bold text-sm">Maquinista (Teniente de Máquinas)</div>
                                            <div className="text-xs text-muted-foreground">Pendiente</div>
                                        </div>
                                        <div className="px-2 py-0.5 rounded border text-xs text-muted-foreground">Pendiente</div>
                                    </div>
                                </div>
                                <span className="absolute -left-3 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                            </div>

                            {/* Columna Derecha */}
                            <div className="space-y-6">
                                <div className="flex justify-end relative">
                                    <div className="h-10 px-4 rounded bg-green-600 text-white font-medium flex items-center shadow-sm gap-2">
                                        ✓ Visar Checklist
                                    </div>
                                    <span className="absolute -right-2 -top-2 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                                </div>

                                <div className="rounded border shadow-sm overflow-hidden relative">
                                    <div className="bg-muted/50 p-3 font-bold border-b text-sm">Sistema Eléctrico y Luces</div>
                                    <div className="p-4 flex flex-col gap-2">
                                        <div className="flex justify-between items-center pb-2 border-b">
                                            <div className="font-medium text-sm">Luces de emergencia</div>
                                            <div className="flex items-center gap-2"><span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">OK</span></div>
                                            <div className="text-xs text-muted-foreground italic">Sin observaciones</div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="font-medium text-sm">Focos faeneros</div>
                                            <div className="flex items-center gap-2"><span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">Urgente</span></div>
                                            <div className="text-xs text-muted-foreground italic">Foco lateral derecho quemado</div>
                                        </div>
                                    </div>
                                    <span className="absolute -right-3 top-[60%] flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">3</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Flujos Diferenciados:</strong> Si el vehículo es de Compañía, debe ser visado por el Capitán y Teniente de Máquinas. Si es de Comandancia, lo visa el Comandante y el Inspector MM.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Visación con 2FA:</strong> El botón "Visar Checklist" lanza el modal de Autenticación de Dos Factores (Código al correo) garantizando que la firma electrónica sea estrictamente personal.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">3</span>
                                <span><strong>Detalle Resumido:</strong> Los resultados del formulario se exponen de forma visual con colores rojo/amarillo/verde, priorizando que los mandos vean rápido qué está fallando.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- Permisos --- */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">Permisos y Roles</h2>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3">Rol</th>
                                    <th className="p-3">Ver Historial</th>
                                    <th className="p-3">Crear Checklist</th>
                                    <th className="p-3">Visar (Firma Digital)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Bombero / Maquinista</td>
                                    <td className="p-3 text-green-600">Solo su Cía</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-red-600">No</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Capitán / Tte. de Máquinas</td>
                                    <td className="p-3 text-green-600">Solo su Cía</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-green-600 font-bold">Sí (Vehículos de su Cía)</td>
                                </tr>
                                <tr className="border-t bg-muted/10">
                                    <td className="p-3 font-medium text-primary">Inspector MM / Comandancia</td>
                                    <td className="p-3 text-green-600 font-bold">Todas las Cías</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-green-600 font-bold">Sí (Vehículos de Comandancia)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
