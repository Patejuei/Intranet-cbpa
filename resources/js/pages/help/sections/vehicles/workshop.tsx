import { Wrench } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function WorkshopSection() {
    return (
        <div>
            <SectionHeader
                title="Taller Mecánico"
                icon={Wrench}
                roles={['Inspector MM', 'Comandancia', 'Mecánico', 'Administración']}
            />
            
            <div className="space-y-16">
                
                {/* --- 1. Vista General --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Vista General de Órdenes
                    </h2>

                    {/* Contexto */}
                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El tablero principal del Taller Mecánico permite gestionar el ciclo de vida de los mantenimientos de los vehículos del Cuerpo. Centraliza todos los ingresos, permitiendo filtrar por estado (Activos, Historial) y emitir reportes en Excel de todo el trabajo realizado en la flota.
                        </p>
                    </section>

                    {/* Quick Start */}
                    <section>
                        <h3 className="text-xl font-semibold">Quick Start</h3>
                        <ul className="ml-6 mt-4 list-decimal space-y-2 text-muted-foreground">
                            <li>
                                <strong>Filtrar Órdenes:</strong> Usa el buscador o el selector de estado para aislar los mantenimientos que están "En Taller" o "Finalizados".
                            </li>
                            <li>
                                <strong>Nuevo Ingreso:</strong> Presiona el botón de "Nuevo Ingreso" para abrir una orden de trabajo para una máquina.
                            </li>
                            <li>
                                <strong>Reportes:</strong> Genera planillas Excel con el costo y el historial de reparaciones utilizando el botón "Reporte Excel".
                            </li>
                        </ul>
                    </section>

                    {/* Detalle Visual (Mockup con Hotspots) */}
                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-sm">
                            <div className="border-b bg-muted/10 p-4 flex justify-between items-center">
                                <div className="font-bold text-lg">Taller Mecánico</div>
                                <div className="flex gap-2">
                                    <div className="flex h-8 items-center rounded bg-primary px-3 text-xs font-medium text-primary-foreground">+ Nuevo Ingreso</div>
                                    <div className="flex h-8 items-center rounded border px-3 text-xs font-medium">Reporte Excel</div>
                                    {/* Hotspot 1 */}
                                    <span className="absolute right-4 top-4 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                        1
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 border-b bg-muted/5 flex gap-2 relative">
                                <div className="h-9 w-64 rounded border bg-background px-3 flex items-center text-sm text-muted-foreground">Buscar vehículo...</div>
                                <div className="h-9 w-48 rounded border bg-background px-3 flex items-center text-sm text-muted-foreground justify-between">
                                    Activos (En Taller) <span>▼</span>
                                </div>
                                {/* Hotspot 2 */}
                                <span className="absolute left-64 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                    2
                                </span>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/30">
                                        <tr>
                                            <th className="p-3">Vehículo</th>
                                            <th className="p-3">Taller</th>
                                            <th className="p-3">Estado</th>
                                            <th className="p-3 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="p-3">
                                                <div className="font-medium">B-1</div>
                                                <div className="text-xs text-muted-foreground">XX-YY-11</div>
                                            </td>
                                            <td className="p-3">Taller Central</td>
                                            <td className="p-3 relative">
                                                <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">En Taller</span>
                                            </td>
                                            <td className="p-3 text-right flex justify-end gap-2 relative">
                                                <div className="h-7 w-7 rounded border flex items-center justify-center text-muted-foreground">👁️</div>
                                                <div className="h-7 w-7 rounded border flex items-center justify-center text-muted-foreground">🖨️</div>
                                                {/* Hotspot 3 */}
                                                <span className="absolute right-4 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                                    3
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
                                <span><strong>Exportación Global:</strong> Emite un Excel consolidado de todos los mantenimientos para reportes de comandancia.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Filtros Persistentes:</strong> Permite aislar rápidamente las unidades que están físicamente en el taller versus las ya entregadas.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">3</span>
                                <span><strong>Acciones Directas:</strong> Visualiza la orden (👁️) o imprime (🖨️) el documento PDF de la Orden de Trabajo directamente.</span>
                            </div>
                        </div>
                    </section>
                </div>


                {/* --- 2. Formulario de Ingreso --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Formulario de Ingreso a Taller
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Es el punto de inicio para cualquier reparación. Permite abrir la orden de trabajo capturando datos técnicos (Kms, Horas), vincular incidencias reportadas por las compañías y generar un <strong>Checklist de Recepción</strong> que define el alcance del trabajo.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md max-w-3xl mx-auto p-6 space-y-6">
                            
                            {/* Bloque 1 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 relative">
                                    <div className="text-sm font-medium">Vehículo</div>
                                    <div className="flex h-9 items-center rounded border px-3 text-sm">Buscar vehículo...</div>
                                    <span className="absolute -left-3 top-[60%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Taller / Lugar</div>
                                    <div className="flex h-9 items-center rounded border bg-muted/20 px-3 text-sm text-muted-foreground">Nemesio Vicuña 275</div>
                                </div>
                            </div>

                            {/* Alerta de Vehículo en Taller */}
                            <div className="rounded border border-yellow-500/20 bg-yellow-500/10 p-3 relative">
                                <div className="font-bold text-yellow-600 text-sm">⚠️ Este vehículo ya se encuentra en taller.</div>
                                <span className="absolute -left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                            </div>

                            {/* Detalles Tecnicos */}
                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Fecha de Ingreso</div>
                                    <div className="flex h-9 items-center rounded border px-3 text-sm">2026-04-23</div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Bombero Responsable</div>
                                    <div className="flex h-9 items-center rounded border px-3 text-sm"></div>
                                </div>
                            </div>

                            {/* Botoneras Técnicas */}
                            <div className="grid grid-cols-3 gap-4 border-t pt-4">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Tracción</div>
                                    <div className="flex gap-1 rounded bg-muted/50 p-1 text-xs"><div className="flex-1 bg-white shadow rounded px-2 py-1 text-center font-medium">4x2</div><div className="flex-1 px-2 py-1 text-center text-muted-foreground">4x4</div></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Transmisión</div>
                                    <div className="flex gap-1 rounded bg-muted/50 p-1 text-xs"><div className="flex-1 bg-white shadow rounded px-2 py-1 text-center font-medium">Manual</div><div className="flex-1 px-2 py-1 text-center text-muted-foreground">Auto</div></div>
                                </div>
                            </div>

                            {/* Checklist */}
                            <div className="rounded border p-4 relative">
                                <div className="font-medium text-sm mb-3">Checklist de Ingreso</div>
                                <div className="rounded border p-2 flex flex-col gap-1">
                                    <div className="text-sm font-medium">Sistema de frenos</div>
                                    <div className="flex gap-1 rounded bg-muted/50 p-1 text-xs">
                                        <div className="flex-1 text-muted-foreground text-center py-1">Funcional</div>
                                        <div className="flex-1 bg-red-100 text-red-700 rounded shadow text-center py-1 font-bold">Fallas</div>
                                        <div className="flex-1 text-muted-foreground text-center py-1">N/A</div>
                                    </div>
                                </div>
                                <span className="absolute -left-3 top-6 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">3</span>
                            </div>

                            {/* Vincular Incidencias */}
                            <div className="rounded border p-4 bg-muted/5 relative">
                                <div className="text-sm font-medium mb-3">Vincular Incidencias Pendientes</div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 rounded border bg-background p-2 text-xs">
                                        <div className="h-4 w-4 rounded border border-primary bg-primary flex items-center justify-center text-[10px] text-white">✓</div>
                                        <div className="flex-1">
                                            <span className="font-bold">#1024</span> - Falla en sirena electrónica
                                        </div>
                                        <div className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">Crítica</div>
                                    </div>
                                    <div className="flex items-center gap-2 rounded border bg-background p-2 text-xs opacity-50">
                                        <div className="h-4 w-4 rounded border"></div>
                                        <div className="flex-1">
                                            <span className="font-bold">#1021</span> - Foco trasero trizado
                                        </div>
                                    </div>
                                </div>
                                <span className="absolute -left-3 top-6 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">5</span>
                            </div>

                            {/* Trabajos a Realizar */}
                            <div className="space-y-2 relative">
                                <div className="text-sm font-medium">Trabajos a Realizar</div>
                                <div className="flex h-9 items-center rounded border px-3 text-sm">Revisar: Sistema de frenos</div>
                                <div className="flex h-9 items-center rounded border px-3 text-sm text-muted-foreground border-dashed justify-center">+ Agregar Trabajo</div>
                                <span className="absolute -left-3 top-6 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">4</span>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Selección Inteligente:</strong> Al elegir la unidad, se cargan automáticamente sus datos técnicos y las incidencias activas reportadas por los maquinistas.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Validación de Integridad:</strong> Si la unidad ya tiene una orden abierta, el sistema muestra una alerta visual amarilla para evitar duplicidades, recomendando cerrar la anterior primero.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">3</span>
                                <span><strong>Checklist Evaluativo:</strong> Categoriza cada sistema del carro (Frenos, Luces, Hidráulica). Si marcas "Fallas", el sistema automatiza una respuesta en la sección de Trabajos.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">4</span>
                                <span><strong>Automatización de Tareas:</strong> Las fallas detectadas en el checklist se inyectan como "Tareas a realizar" directamente, ahorrando tiempo de tipeo.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">5</span>
                                <span><strong>Resolución de Incidencias:</strong> Permite adjuntar fallas reportadas previamente por las compañías a esta orden de trabajo. Al cerrar la orden, las incidencias vinculadas cambiarán su estado a "Reparado" automáticamente.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 3. Detalle de Orden (Show) --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        3. Gestión y Detalle de Orden
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Es la vista donde ocurre la ejecución. Aquí se actualiza el estado (En Taller, Pruebas, Entregado), se asignan repuestos descontando del inventario, se calculan costos laborales y externos, y se marcan trabajos e incidencias como resueltas.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Columna Izquierda */}
                            <div className="lg:col-span-1 space-y-4">
                                <div className="rounded border shadow-sm p-4 space-y-4 relative">
                                    <div className="font-bold border-b pb-2 text-sm">Estado y Fechas</div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">Estado Actual</div>
                                        <div className="h-9 rounded border flex items-center px-2 text-sm justify-between bg-muted/10">
                                            En Espera de Repuestos <span>▼</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">Fecha Tentativa Salida</div>
                                        <div className="h-9 rounded border flex items-center px-2 text-sm">2026-05-01</div>
                                    </div>
                                    <span className="absolute -left-3 top-10 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                </div>

                                <div className="rounded border shadow-sm p-4 space-y-4">
                                    <div className="font-bold border-b pb-2 text-sm">Detalles del Ingreso</div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div><span className="text-xs text-muted-foreground block">Responsable</span> Juan Pérez</div>
                                        <div><span className="text-xs text-muted-foreground block">Kilometraje</span> 120.500 km</div>
                                        <div><span className="text-xs text-muted-foreground block">Tracción</span> 4x4</div>
                                        <div><span className="text-xs text-muted-foreground block">Transmisión</span> Manual</div>
                                        <div className="col-span-2"><span className="text-xs text-muted-foreground block">Combustible</span> Diésel</div>
                                    </div>
                                </div>

                                <div className="rounded border shadow-sm p-4 space-y-4">
                                    <div className="font-bold border-b pb-2 text-sm">Mano de Obra (HH)</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><div className="text-xs text-muted-foreground">Horas</div><div className="h-8 rounded border px-2 flex items-center text-sm">4.5</div></div>
                                        <div><div className="text-xs text-muted-foreground">Precio/Hr</div><div className="h-8 rounded border px-2 flex items-center text-sm">15000</div></div>
                                    </div>
                                    <div className="flex justify-between border-t border-dashed pt-2 text-xs">
                                        <span>Subtotal Labor:</span><span className="font-bold">$67.500</span>
                                    </div>
                                </div>

                                <div className="rounded border shadow-sm p-4 relative">
                                    <div className="font-bold border-b pb-2 text-sm">Incidencias Vinculadas</div>
                                    <div className="p-2 border rounded mt-2 flex gap-2 items-start bg-muted/5">
                                        <div className="h-4 w-4 rounded border bg-primary flex items-center justify-center text-[10px] text-white">✓</div>
                                        <div className="flex-1">
                                            <div className="text-sm">Frenos largos al detenerse.</div>
                                            <div className="text-xs flex justify-between text-muted-foreground mt-1">2026-04-20 <span className="bg-primary text-white px-1.5 rounded">Marcado para Resolver</span></div>
                                        </div>
                                    </div>
                                    <span className="absolute -left-3 top-10 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">5</span>
                                </div>
                            </div>

                            {/* Columna Derecha */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="rounded border shadow-sm p-4 space-y-4 relative">
                                    <div className="font-bold border-b pb-2 text-sm flex justify-between">
                                        Repuestos e Insumos <span className="bg-muted px-2 rounded-full text-xs flex items-center">2 Ítems</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-9 flex-1 rounded border flex items-center px-3 text-sm text-muted-foreground bg-muted/10">Seleccionar ítem...</div>
                                        <div className="h-9 w-20 rounded border flex items-center px-3 text-sm bg-muted/10">1</div>
                                        <div className="h-9 px-4 rounded bg-primary text-white text-sm flex items-center">Agregar</div>
                                    </div>
                                    <span className="absolute -left-3 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                                    
                                    <table className="w-full text-xs">
                                        <thead className="bg-muted/30">
                                            <tr>
                                                <th className="p-2 text-left">Ítem</th>
                                                <th className="p-2 text-right">Cant.</th>
                                                <th className="p-2 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="p-2">Aceite Motor 15W40</td>
                                                <td className="p-2 text-right">2</td>
                                                <td className="p-2 text-right">$40.000</td>
                                            </tr>
                                        </tbody>
                                        <tfoot className="bg-muted/10 font-semibold">
                                            <tr>
                                                <td colSpan={2} className="p-2 text-right">Total Repuestos:</td>
                                                <td className="p-2 text-right">$40.000</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <div className="rounded border shadow-sm p-4 space-y-4 relative">
                                    <div className="font-bold border-b pb-2 text-sm flex justify-between">
                                        Listado de Trabajos <span className="bg-muted px-2 rounded-full text-xs flex items-center border">1/2 Completados</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 p-2 border rounded">
                                            <div className="h-4 w-4 rounded border bg-primary flex items-center justify-center text-[10px] text-white">✓</div>
                                            <div className="text-sm line-through text-muted-foreground">Revisar sistema de frenos</div>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 border rounded">
                                            <div className="h-4 w-4 rounded border"></div>
                                            <div className="text-sm">Cambio de aceite y filtro</div>
                                        </div>
                                    </div>
                                    <span className="absolute -left-3 top-10 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">6</span>
                                </div>

                                <div className="rounded border shadow-sm p-4 space-y-4 relative">
                                    <div className="font-bold border-b pb-2 text-sm flex justify-between">
                                        Trabajos Externos
                                        <div className="h-6 px-2 text-xs rounded border flex items-center">+ Agregar Externo</div>
                                    </div>
                                    <table className="w-full text-xs">
                                        <thead className="bg-muted/30">
                                            <tr>
                                                <th className="p-2 text-left">Descripción</th>
                                                <th className="p-2 text-left">Proveedor</th>
                                                <th className="p-2 text-right">Costo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="p-2">Rectificado de discos</td>
                                                <td className="p-2">Frenos Juanito Spa</td>
                                                <td className="p-2 text-right">$85.000</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <span className="absolute -left-3 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">3</span>
                                </div>

                                <div className="rounded-lg bg-primary/5 p-4 flex justify-between items-center">
                                    <div className="font-bold text-primary">Total Inversión de Orden:</div>
                                    <div className="font-bold text-primary text-xl">$192.500</div>
                                </div>

                                <div className="rounded border shadow-sm p-4 space-y-2">
                                    <div className="font-bold border-b pb-2 text-sm">Detalle General</div>
                                    <div className="text-xs text-muted-foreground">Descripción de la orden (se puede actualizar a medida que avanza el trabajo)</div>
                                    <div className="h-20 rounded border bg-muted/5 p-2 text-sm">Se realiza mantención preventiva y corrección de frenos largos reportados por maquinista. Vehículo queda operativo.</div>
                                </div>
                                
                                <div className="flex justify-end gap-2 pt-2 relative">
                                    <div className="h-9 px-4 rounded border text-sm font-medium flex items-center shadow-sm">Imprimir Ingreso</div>
                                    <div className="h-9 px-4 rounded bg-primary text-white text-sm font-medium flex items-center shadow-sm">Guardar</div>
                                    <div className="h-9 px-4 rounded bg-red-600 text-white text-sm font-medium flex items-center shadow-sm">Finalizar y Entregar</div>
                                    <span className="absolute -top-3 right-6 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">4</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Máquina de Estados:</strong> Al cambiar el estado a "Entregado", se gatilla un modal de retiro donde se exige el Nombre y RUT de quien retira físicamente la unidad.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Integración con Bodega:</strong> Los ítems se descuentan en tiempo real del stock físico. El costo unitario se extrae directamente del inventario para el costeo automático.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">3</span>
                                <span><strong>Trabajos Externos:</strong> Permite registrar servicios realizados por terceros (ej. Tornería, Scanner, etc.), detallando proveedor y costo para sumarlo al gran total de la orden.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">4</span>
                                <span><strong>Cierre y Automatización:</strong> Al finalizar la orden, se bloquean las ediciones, se suman horas de labor + repuestos + trabajos externos y las Incidencias marcadas pasan a estado "Resuelto" a nivel global en el sistema.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">5</span>
                                <span><strong>Incidencias Vinculadas:</strong> Muestra las fallas reportadas previamente que se están resolviendo. Al finalizar la orden, estas incidencias se cierran automáticamente en el historial global.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">6</span>
                                <span><strong>Control de Tareas:</strong> Listado granular de los trabajos realizados. Permite marcar avances individuales para mantener la trazabilidad de la reparación. Permite adicionar nuevas tareas en el transcurso de la mantención.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Permisos */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">Matriz de Responsabilidades</h2>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3">Rol</th>
                                    <th className="p-3">Ver Órdenes</th>
                                    <th className="p-3">Crear/Editar</th>
                                    <th className="p-3">Finalizar Orden</th>
                                    <th className="p-3">Alcance Territorial</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Capitán / Maquinista / Cuartelero</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-red-600">No</td>
                                    <td className="p-3 text-red-600">No</td>
                                    <td className="p-3 text-muted-foreground">Solo unidades de su propia Compañía.</td>
                                </tr>
                                <tr className="border-t bg-muted/10">
                                    <td className="p-3 font-medium text-primary">Mecánico / Personal de Taller</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-muted-foreground">Todas las Unidades del Cuerpo.</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Inspector MM / Comandancia</td>
                                    <td className="p-3 text-green-700 font-bold">Sí</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-muted-foreground">Control total y supervisión económica de la flota.</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Usuarios / Voluntarios</td>
                                    <td className="p-3 text-red-600">No</td>
                                    <td className="p-3 text-red-600">No</td>
                                    <td className="p-3 text-red-600">No</td>
                                    <td className="p-3 text-muted-foreground">Módulo oculto para personal no autorizado.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
