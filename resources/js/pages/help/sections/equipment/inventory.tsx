import { Package, Search, BarChart3, AlertCircle } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function EqInventorySection() {
    return (
        <div>
            <SectionHeader
                title="Inventario General"
                icon={Package}
                roles={['Admin', 'Comandancia', 'Secretaría Adquisiciones']}
            />
            
            <div className="space-y-16">
                
                {/* --- 1. Control de Stock y Kárdex --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Control de Stock y Kárdex
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Este módulo centraliza el stock físico de insumos y repuestos menores que no están asignados directamente a una unidad. Permite realizar ajustes de inventario, ver el historial de movimientos (Kárdex) y gestionar alertas de stock crítico.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-sm">
                            <div className="border-b bg-muted/10 p-4 flex justify-between items-center">
                                <div className="font-bold text-lg">Panel de Inventario</div>
                                <div className="flex gap-2">
                                    <div className="flex h-8 items-center rounded border px-3 text-xs font-medium">Ajuste de Stock</div>
                                    <div className="flex h-8 items-center rounded bg-primary px-3 text-xs font-medium text-white">Descargar Reporte</div>
                                </div>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider">
                                        <tr>
                                            <th className="p-3">Producto</th>
                                            <th className="p-3">Categoría</th>
                                            <th className="p-3 text-right">Mínimo</th>
                                            <th className="p-3 text-right">Actual</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="p-3">
                                                <div className="font-medium">Ampolleta H7 24V</div>
                                                <div className="text-[10px] text-muted-foreground">Repuestos Iluminación</div>
                                            </td>
                                            <td className="p-3">Consumibles</td>
                                            <td className="p-3 text-right">10</td>
                                            <td className="p-3 text-right font-bold text-orange-600 relative">
                                                8
                                                <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                            </td>
                                        </tr>
                                        <tr className="border-t bg-muted/5">
                                            <td className="p-3">
                                                <div className="font-medium">Aceite Motor 15W40</div>
                                                <div className="text-[10px] text-muted-foreground">Lubricantes</div>
                                            </td>
                                            <td className="p-3">Insumos Taller</td>
                                            <td className="p-3 text-right">20</td>
                                            <td className="p-3 text-right font-bold text-green-600">45</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Alertas Automáticas:</strong> Cuando el stock actual es inferior al mínimo definido, el sistema resalta el ítem en naranja y lo incluye en el reporte de compras sugeridas.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 2. Historial de Movimientos --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Kárdex de Movimientos
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Cada vez que un producto entra (por compra) o sale (por uso en reparación o entrega), queda registrado en el Kárdex, asegurando la trazabilidad total de quién realizó el movimiento y por qué.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle del Kárdex</h3>
                        <div className="mt-4 rounded-lg border bg-muted/5 p-4 space-y-3 relative">
                            <div className="flex items-center justify-between text-xs text-muted-foreground border-b pb-2">
                                <span>Fecha</span>
                                <span>Tipo</span>
                                <span className="w-24 text-right">Cantidad</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex flex-col">
                                    <span className="font-medium">25 Abr 2026</span>
                                    <span className="text-[10px] text-muted-foreground">Ref: Factura 1234</span>
                                </div>
                                <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">ENTRADA</span>
                                <span className="w-24 text-right font-mono text-green-700">+ 10</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex flex-col">
                                    <span className="font-medium">26 Abr 2026</span>
                                    <span className="text-[10px] text-muted-foreground">Uso en B-1 (Mantención)</span>
                                </div>
                                <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">SALIDA</span>
                                <span className="w-24 text-right font-mono text-red-700">- 2</span>
                                <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Trazabilidad Cruzada:</strong> Las salidas automáticas por reparaciones en Taller quedan vinculadas directamente a la Orden de Trabajo correspondiente.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- Permisos --- */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">3. Roles y Acciones</h2>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3">Rol</th>
                                    <th className="p-3 text-center">Ver Stock</th>
                                    <th className="p-3 text-center">Ajustar Stock</th>
                                    <th className="p-3 text-center">Ver Kárdex</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Bombero / Oficial Cía</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-red-600">No</td>
                                    <td className="p-3 text-center text-red-600">No</td>
                                </tr>
                                <tr className="border-t bg-muted/10">
                                    <td className="p-3 font-medium">Secretaría Adquisiciones</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 font-medium text-primary">Admin / Comandancia</td>
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
