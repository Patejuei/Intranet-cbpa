import { FileText } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function RenditionsSection() {
    return (
        <div>
            <SectionHeader
                title="Rendiciones y Gastos"
                icon={FileText}
                roles={['Admin', 'Comandancia', 'Secretaría Adquisiciones']}
            />

            <h1 className="p-3 italic text-red-600 font-bold text-center"> *** PENDIENTE REVISIÓN CON TESORERO GENERAL *** </h1>
            
            <div className="space-y-16">
                {/* --- 1. Panel General --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Panel de Rendiciones
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Este panel agrupa todas las compras asociadas a reparaciones o insumos del Taller Mecánico. Centraliza el flujo de caja, permitiendo la validación masiva de gastos y la exportación de planillas para rendiciones institucionales.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-sm">
                            <div className="border-b bg-muted/10 p-4 flex justify-between items-center">
                                <div className="font-bold text-lg">Rendiciones y Gastos</div>
                                <div className="flex gap-2">
                                    <div className="flex h-8 items-center rounded bg-green-600 px-3 text-xs font-medium text-white">+ Validar (2)</div>
                                    <div className="flex h-8 items-center rounded border px-3 text-xs font-medium">Exportar Excel</div>
                                    <span className="absolute right-32 top-4 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                        1
                                    </span>
                                </div>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/30">
                                        <tr>
                                            <th className="p-3 w-10"><input type="checkbox" checked readOnly /></th>
                                            <th className="p-3">Nº Doc</th>
                                            <th className="p-3">Concepto</th>
                                            <th className="p-3 text-right">Monto</th>
                                            <th className="p-3 text-right">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="p-3"><input type="checkbox" checked readOnly /></td>
                                            <td className="p-3 font-mono text-xs text-muted-foreground">78441</td>
                                            <td className="p-3 font-medium text-blue-600">Pastillas de Freno B-1</td>
                                            <td className="p-3 text-right">$ 85.000</td>
                                            <td className="p-3 text-right relative">
                                                <span className="rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-xs">Pendiente</span>
                                                <span className="absolute -left-2 top-[30%] flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                                    2
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="border-t bg-muted/5">
                                            <td className="p-3"><input type="checkbox" checked readOnly /></td>
                                            <td className="p-3 font-mono text-xs text-muted-foreground">12040</td>
                                            <td className="p-3 font-medium text-blue-600">Llave de Torque</td>
                                            <td className="p-3 text-right">$ 45.990</td>
                                            <td className="p-3 text-right">
                                                <span className="rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-xs">Pendiente</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Validación Masiva:</strong> Permite aprobar múltiples gastos de una sola vez. Al validar, el sistema solicita un código OTP para firmar digitalmente la aprobación.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Flujo de Auditoría:</strong> Cada gasto nace como "Pendiente" y solo pasa a "Validado" cuando Adquisiciones o Comandancia lo revisan.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 2. Ingreso e Integración --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Nueva Rendición e Integración con Bodega
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El registro de una factura permite inyectar el ítem comprado directamente a los inventarios (Bodega MM o Bodega Menor), automatizando la entrada de stock y el cálculo de costos medios.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md max-w-4xl mx-auto p-6 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg relative">
                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Nº Factura / Boleta</div>
                                    <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">123456</div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Monto Total</div>
                                    <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">$ 150.000</div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Tipo de Gasto</div>
                                    <div className="h-9 rounded border px-3 text-sm flex items-center justify-between bg-background">Insumos Taller <span>▼</span></div>
                                </div>
                                <span className="absolute -left-3 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                            </div>

                            <div className="rounded border p-4 bg-primary/5 space-y-4 relative">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-8 rounded-full bg-primary flex items-center px-0.5 justify-end"><div className="h-4 w-4 bg-white rounded-full"></div></div>
                                    <span className="text-sm font-medium">Generar Alta en Bodega</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Cantidad Ingresada</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center bg-background">10</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Destino Stock</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center justify-between bg-background">Bodega Material Menor <span>▼</span></div>
                                    </div>
                                </div>
                                <span className="absolute -left-3 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                            </div>

                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground bg-muted/5 relative">
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">📄</div>
                                <span className="text-sm font-medium text-foreground">Subir Respaldo Digital</span>
                                <span className="text-xs">Adjunte PDF de Factura o foto de la Boleta.</span>
                                <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">3</span>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Clasificación:</strong> El tipo de gasto determina si el sistema sugerirá el ingreso a Bodega MM (Repuestos) o Bodega Menor (Herramientas).</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Sincronización:</strong> Si activas el switch, el ítem se creará automáticamente en el inventario correspondiente con el costo unitario derivado de la factura.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">3</span>
                                <span><strong>Trazabilidad:</strong> Es obligatorio subir el documento físico digitalizado para que la rendición pueda ser validada por Comandancia.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Permisos */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">3. Matriz de Responsabilidades</h2>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3">Rol</th>
                                    <th className="p-3">Ver Gastos</th>
                                    <th className="p-3">Ingresar Facturas</th>
                                    <th className="p-3">Validar (Firma OTP)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Comandancia / Admin</td>
                                    <td className="p-3 text-green-700 font-bold">Total</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-green-600 font-bold">Habilitado</td>
                                </tr>
                                <tr className="border-t bg-muted/10">
                                    <td className="p-3 font-medium text-primary">Secretaría Adquisiciones</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-green-600 font-bold">Habilitado</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Inspectoría MM</td>
                                    <td className="p-3 text-blue-700">Solo Lectura</td>
                                    <td className="p-3 text-red-600">No</td>
                                    <td className="p-3 text-red-600">No</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Capitán / Compañía</td>
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
