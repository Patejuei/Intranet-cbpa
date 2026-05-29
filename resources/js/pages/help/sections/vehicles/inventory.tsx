import { Package } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function InventorySection() {
    return (
        <div>
            <SectionHeader
                title="Bodega Material Mayor"
                icon={Package}
                roles={['Inspector MM', 'Comandancia', 'Mecánico', 'Administración']}
            />
            
            <div className="space-y-16">
                
                {/* --- 1. Panel General --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Panel General y Control de Stock
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            La Bodega es el centro neurálgico para la gestión de repuestos, insumos (aceites, refrigerantes) y herramientas del taller mecánico. Controla el inventario valorizado y alerta automáticamente cuando los niveles bajan del stock crítico.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 rounded-xl border bg-background shadow-sm">
                            <div className="border-b bg-muted/10 p-4 flex justify-between items-center">
                                <div className="font-bold text-lg">Bodega Material Mayor</div>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <div className="flex h-8 items-center rounded border px-3 text-xs font-medium">Descargar Excel</div>
                                        {/* Hotspot 3 */}
                                        <span className="absolute -top-2 -right-2 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">3</span>
                                    </div>
                                    <div className="relative">
                                        <div className="flex h-8 items-center rounded bg-primary px-3 text-xs font-medium text-primary-foreground">+ Nuevo Ítem</div>
                                        {/* Hotspot 4 */}
                                        <span className="absolute -top-2 -right-2 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">4</span>
                                    </div>
                                    <div className="relative">
                                        <div className="flex h-8 items-center rounded border px-3 text-xs font-medium bg-muted/50">⌚ Ajustes Taller</div>
                                        {/* Hotspot 1 */}
                                        <span className="absolute -top-2 -right-2 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-b bg-muted/5 flex gap-4 relative">
                                <div className="h-9 flex-1 rounded border bg-background px-3 flex items-center text-sm text-muted-foreground">
                                    🔍 Buscar por nombre, SKU o ubicación...
                                </div>
                                <div className="h-9 w-48 rounded border bg-background px-3 flex items-center text-sm justify-between">
                                    Categoría <span>▼</span>
                                </div>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/30">
                                        <tr>
                                            <th className="p-3">SKU</th>
                                            <th className="p-3">Nombre</th>
                                            <th className="p-3">Categoría</th>
                                            <th className="p-3 text-right">Stock</th>
                                            <th className="p-3 text-right">Costo Unit.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="p-3 font-mono text-xs text-muted-foreground">FIL-ACE-01</td>
                                            <td className="p-3 font-medium text-blue-600 relative">
                                                Filtro de Aceite Volvo
                                                {/* Hotspot 5 */}
                                                <span className="absolute left-0 top-1 flex h-4 w-4 -translate-x-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">5</span>
                                            </td>
                                            <td className="p-3">
                                                <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs">Repuesto</span>
                                            </td>
                                            <td className="p-3 text-right relative">
                                                <div className="font-bold text-red-600">2</div>
                                                <div className="text-[10px] font-medium text-red-500">Bajo Stock</div>
                                                {/* Hotspot 2 */}
                                                <span className="absolute -left-2 top-4 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                                            </td>
                                            <td className="p-3 text-right text-muted-foreground">$ 45.000</td>
                                        </tr>
                                        <tr className="border-t bg-muted/5">
                                            <td className="p-3 font-mono text-xs text-muted-foreground">INS-LIQ-05</td>
                                            <td className="p-3 font-medium text-blue-600">Líquido Refrigerante</td>
                                            <td className="p-3">
                                                <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-xs">Insumo</span>
                                            </td>
                                            <td className="p-3 text-right font-medium">15</td>
                                            <td className="p-3 text-right text-muted-foreground">$ 12.500</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Tarificación de Taller:</strong> Permite configurar el valor de la Hora Hombre (HH) y parámetros de despacho. Este valor es el que usa el sistema para costear automáticamente la labor en todas las órdenes de trabajo.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Control de Existencias Críticas:</strong> El sistema resalta en rojo los ítems que alcanzaron su nivel mínimo. Esto asegura que la comandancia pueda gestionar reposiciones antes de que se produzca un quiebre de stock.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">3</span>
                                <span><strong>Reportería:</strong> Genera un archivo Excel con el listado completo, SKUs, ubicaciones físicas y valoración de inventario en tiempo real.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">4</span>
                                <span><strong>Ingreso de Mercadería:</strong> Permite crear nuevos registros definiendo no solo los datos básicos, sino también la compatibilidad técnica con los vehículos de la flota.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">5</span>
                                <span><strong>Trazabilidad:</strong> El nombre del ítem funciona como un enlace al historial completo de movimientos, permitiendo auditar ingresos por compra y egresos por órdenes de trabajo.</span>
                            </div>
                        </div>
                    </section>
                </div>


                {/* --- 2. Nuevo Ítem --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Creación de Nuevo Ítem
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El formulario de ingreso permite tipificar el producto (Insumo, Repuesto o Herramienta) y, lo más importante, definir con qué vehículos de la flota es compatible. Esto evita errores al momento de despachar repuestos desde Taller.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 rounded-xl border bg-background shadow-md max-w-4xl mx-auto p-6 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Nombre del Ítem</div>
                                    <div className="h-9 rounded border px-3 text-sm flex items-center bg-background">Filtro de Aceite Volvo</div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">SKU / Código (Opcional)</div>
                                    <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">FIL-ACE-01</div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Categoría</div>
                                    <div className="h-9 rounded border px-3 text-sm flex items-center justify-between bg-background">Repuesto (Parte) <span>▼</span></div>
                                </div>
                                <div className="space-y-1.5 relative">
                                    <div className="text-sm font-medium">Unidad de Medida</div>
                                    <div className="h-9 rounded border px-3 text-sm flex items-center justify-between bg-background">Unidades <span>▼</span></div>
                                    {/* Hotspot 3 */}
                                    <span className="absolute -top-1 -right-2 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">3</span>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Ubicación en Bodega</div>
                                    <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">Estante A, Nivel 2</div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Stock Inicial</div>
                                    <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">20</div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Stock Mínimo (Alerta)</div>
                                    <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">5</div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Costo Unitario (CLP)</div>
                                    <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">$ 45.000</div>
                                </div>
                                <span className="absolute -left-4 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                            </div>

                            <div className="space-y-3 relative">
                                <div className="text-sm font-medium">Compatibilidad (Vehículos)</div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border rounded bg-muted/5">
                                    <div className="flex items-center gap-2"><div className="h-4 w-4 rounded border bg-primary flex items-center justify-center text-white text-[10px]">✓</div><span className="text-sm">Todos los Vehículos</span></div>
                                    <div className="flex items-center gap-2"><div className="h-4 w-4 rounded border"></div><span className="text-sm">B-1 (XX-YY-11)</span></div>
                                    <div className="flex items-center gap-2"><div className="h-4 w-4 rounded border bg-primary flex items-center justify-center text-white text-[10px]">✓</div><span className="text-sm">B-2 (ZZ-AA-22)</span></div>
                                </div>
                                <span className="absolute -right-2 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                            </div>

                            <div className="space-y-1.5">
                                <div className="text-sm font-medium">Descripción Adicional</div>
                                <div className="h-16 rounded border p-2 text-sm text-muted-foreground bg-background">Filtro principal para motor D13. Proveedor: Kaufmann.</div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <div className="h-9 px-4 rounded bg-primary text-white text-sm font-medium flex items-center shadow-sm gap-2">
                                    Guardar Ítem
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Datos Críticos:</strong> El Stock Inicial y el Costo Unitario ingresados aquí crearán automáticamente el primer movimiento de "ALTA" en el historial Kárdex.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Regla de Herramientas:</strong> Si la categoría seleccionada es "Herramienta", el sistema marcará por defecto la compatibilidad con "Todos los Vehículos", ya que una llave o gata aplica para cualquier carro.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">3</span>
                                <span><strong>Relación de Magnitud:</strong> Es imperativo que el Stock y el Costo guarden relación directa con la Unidad de Medida (ej: si se mide en "Litros", el costo debe ser por litro), garantizando una valorización precisa ante consumos parciales.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 3. Historial de Movimientos --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        3. Detalle e Historial de Movimientos (Kardex)
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            La bodega requiere trazabilidad absoluta. Cada vez que se crea un producto, se añade stock manual, o se consume en una orden de trabajo, el sistema registra quién lo hizo, cuándo, y cuál es el nuevo saldo del producto (Kardex).
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md">
                            
                            <div className="grid md:grid-cols-3 gap-0">
                                {/* Info Tarjeta */}
                                <div className="border-r bg-muted/10 p-6 space-y-4">
                                    <div className="flex gap-2 items-center text-lg font-bold">
                                        📦 Información del Ítem
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-xs uppercase text-muted-foreground font-medium">Categoría</div>
                                            <div className="text-sm font-medium">Repuesto</div>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div>
                                                <div className="text-xs uppercase text-muted-foreground font-medium">Stock Actual</div>
                                                <div className="text-sm font-bold text-red-500">2 Unidades</div>
                                            </div>
                                            <div>
                                                <div className="text-xs uppercase text-muted-foreground font-medium">Costo Unitario</div>
                                                <div className="text-sm font-medium">$ 45.000</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabla Historia */}
                                <div className="md:col-span-2 p-6 relative">
                                    <div className="flex gap-2 items-center text-lg font-bold mb-4">
                                        Historial de Cambios
                                    </div>
                                    <div className="rounded border overflow-hidden">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-muted/30">
                                                <tr>
                                                    <th className="p-2">Fecha</th>
                                                    <th className="p-2">Tipo</th>
                                                    <th className="p-2 text-right">Variación</th>
                                                    <th className="p-2 text-right">Saldo</th>
                                                    <th className="p-2">Descripción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-t">
                                                    <td className="p-2 text-muted-foreground">20/04/2026 15:30</td>
                                                    <td className="p-2"><span className="bg-red-50 text-red-700 border border-red-200 px-1 py-0.5 rounded">REMOVE</span></td>
                                                    <td className="p-2 text-right font-bold text-red-600">-1</td>
                                                    <td className="p-2 text-right font-mono">2</td>
                                                    <td className="p-2">Consumo en Orden #105 (B-1)</td>
                                                </tr>
                                                <tr className="border-t bg-muted/5">
                                                    <td className="p-2 text-muted-foreground">15/04/2026 10:00</td>
                                                    <td className="p-2"><span className="bg-green-50 text-green-700 border border-green-200 px-1 py-0.5 rounded">ADD</span></td>
                                                    <td className="p-2 text-right font-bold text-green-600">+3</td>
                                                    <td className="p-2 text-right font-mono">3</td>
                                                    <td className="p-2">Compra Proveedor Local</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <span className="absolute -left-3 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Kardex Intocable:</strong> El historial de movimientos es inmutable. Si se descuenta un producto por error en una Orden, se debe generar un movimiento manual de compensación (ADD). Nunca se borran los registros previos.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Permisos */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">4. Matriz de Responsabilidades</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        El acceso a la bodega está restringido al personal técnico y de mando. Los usuarios de compañía no tienen visibilidad sobre este módulo.
                    </p>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3">Rol</th>
                                    <th className="p-3">Acceso a Bodega</th>
                                    <th className="p-3">Crear Ítems / Stock</th>
                                    <th className="p-3">Ajustes de Valor (HH)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Inspector MM / Comandante</td>
                                    <td className="p-3 text-green-700 font-bold">Total</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-green-600 font-bold">Habilitado</td>
                                </tr>
                                <tr className="border-t bg-muted/10">
                                    <td className="p-3 font-medium text-primary">Mecánico / Taller</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-red-600 italic">Solo Lectura</td>
                                    <td className="p-3 text-red-600">No</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Capitán / Maquinista</td>
                                    <td className="p-3 text-red-600">Sin Acceso</td>
                                    <td className="p-3 text-red-600">No</td>
                                    <td className="p-3 text-red-600">No</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
