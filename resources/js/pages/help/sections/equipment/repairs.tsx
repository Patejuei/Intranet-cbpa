import { Hammer, History, PenTool, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function EqRepairsSection() {
    return (
        <div>
            <SectionHeader
                title="Reparaciones de Material Menor"
                icon={Hammer}
                roles={['Taller Mecánico', 'Inspector Material Menor', 'Capitán', 'Ayudante']}
            />
            
            <div className="space-y-16">
                
                {/* --- 1. Gestión de Reparaciones --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Registro y Control de Reparaciones
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El módulo de <strong>Reparaciones</strong> permite llevar una bitácora detallada de las mantenciones preventivas y correctivas realizadas a las herramientas y equipos del Cuerpo (motosierras, generadores, equipos ERA, etc.). Asegura que cada equipo tenga un historial de vida útil y costos asociados.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-sm max-w-4xl mx-auto">
                            <div className="border-b bg-muted/10 p-4 flex justify-between items-center">
                                <div className="font-bold text-lg">Historial de Reparaciones</div>
                                <div className="flex h-8 items-center rounded bg-primary px-3 text-xs font-medium text-white">+ Nueva Reparación</div>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/30">
                                        <tr>
                                            <th className="p-3">Fecha</th>
                                            <th className="p-3">Equipo</th>
                                            <th className="p-3">Trabajo Realizado</th>
                                            <th className="p-3 text-right">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="p-3 text-muted-foreground">20 Abr 2026</td>
                                            <td className="p-3">
                                                <div className="font-medium">Motosierra Stihl MS 362</div>
                                                <div className="text-[10px] text-muted-foreground">Segunda Compañía</div>
                                            </td>
                                            <td className="p-3 text-xs italic">Cambio de cadena y limpieza de filtros.</td>
                                            <td className="p-3 text-right relative">
                                                <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[10px] font-bold">TERMINADO</span>
                                                <span className="absolute -left-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                            </td>
                                        </tr>
                                        <tr className="border-t bg-muted/5">
                                            <td className="p-3 text-muted-foreground">22 Abr 2026</td>
                                            <td className="p-3">
                                                <div className="font-medium">Generador Honda 5Kva</div>
                                                <div className="text-[10px] text-muted-foreground">Primera Compañía</div>
                                            </td>
                                            <td className="p-3 text-xs italic">Falla en carburador, pendiente repuestos.</td>
                                            <td className="p-3 text-right">
                                                <span className="rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-[10px] font-bold">EN PROCESO</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Estado de la Reparación:</strong> Permite identificar rápidamente qué equipos están fuera de servicio y cuáles han sido retornados exitosamente a sus compañías.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 2. Integración con Insumos --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Descuento Automático de Insumos
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Al registrar una reparación, el mecánico puede seleccionar insumos del <strong>Inventario General</strong>. Estos se descuentan automáticamente del stock, manteniendo el Kárdex al día sin intervención manual adicional.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle de Insumos</h3>
                        <div className="mt-4 p-4 rounded-lg border bg-muted/5 space-y-4 max-w-md mx-auto relative">
                            <div className="text-sm font-bold border-b pb-2">Insumos Utilizados</div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm p-2 rounded border bg-background">
                                    <span>Bujía NGK</span>
                                    <span className="font-mono font-bold">1 Unid.</span>
                                </div>
                                <div className="flex items-center justify-between text-sm p-2 rounded border bg-background">
                                    <span>Aceite 2 Tiempos</span>
                                    <span className="font-mono font-bold">0.5 Lts.</span>
                                </div>
                            </div>
                            <div className="text-[10px] text-muted-foreground italic flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                Stock actualizado automáticamente en Bodega Menor.
                            </div>
                            <span className="absolute -right-3 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                        </div>
                    </section>
                </div>

                {/* --- Permisos --- */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">3. Permisos y Responsabilidades</h2>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3">Rol</th>
                                    <th className="p-3 text-center">Ver Historial</th>
                                    <th className="p-3 text-center">Registrar Trabajo</th>
                                    <th className="p-3 text-center">Gestionar Insumos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Oficial Cía / Capitán</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-red-600">No</td>
                                    <td className="p-3 text-center text-red-600">No</td>
                                </tr>
                                <tr className="border-t bg-muted/10">
                                    <td className="p-3 font-medium text-primary">Mecánico / Taller</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Inspector / Comandancia</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
