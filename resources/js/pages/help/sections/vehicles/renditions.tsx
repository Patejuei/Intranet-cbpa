import React from 'react';

export function RenditionsSection() {
    return (
        <div className="space-y-12">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    Rendiciones y Gastos
                </h1>
                <p className="text-lg text-muted-foreground">
                    Guía para el registro de facturas, boletas y la integración automática de compras con el inventario del Taller Mecánico.
                </p>
            </div>

            <div className="space-y-8">
                {/* --- 1. Panel General --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Panel de Rendiciones
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Este panel agrupa todas las compras asociadas a reparaciones o insumos del Taller. Permite la validación masiva y exportación a Excel.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md max-w-4xl mx-auto p-6 space-y-4">
                            
                            <div className="flex justify-between items-center relative">
                                <div className="space-y-1">
                                    <h4 className="text-lg font-bold">Rendiciones y Gastos</h4>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-9 px-4 rounded bg-green-600 text-white text-sm font-medium flex items-center shadow-sm gap-2">
                                        <div className="h-4 w-4 rounded-full border-2 border-white"></div> Validar (2)
                                    </div>
                                    <div className="h-9 px-4 rounded border text-sm font-medium flex items-center shadow-sm">
                                        Exportar Excel (2)
                                    </div>
                                </div>
                                <span className="absolute right-36 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                            </div>

                            <div className="rounded-md border relative">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 text-muted-foreground">
                                        <tr>
                                            <th className="p-3 text-left w-[50px]"><input type="checkbox" checked readOnly /></th>
                                            <th className="p-3 text-left">Nº Doc</th>
                                            <th className="p-3 text-left">Concepto</th>
                                            <th className="p-3 text-left">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="p-3"><input type="checkbox" checked readOnly /></td>
                                            <td className="p-3">78441</td>
                                            <td className="p-3">Pastillas de Freno B-1</td>
                                            <td className="p-3"><span className="text-xs px-2 py-1 border border-orange-200 text-orange-600 rounded-full">Pendiente Validación</span></td>
                                        </tr>
                                        <tr>
                                            <td className="p-3"><input type="checkbox" checked readOnly /></td>
                                            <td className="p-3">12040</td>
                                            <td className="p-3">Llave de Torque</td>
                                            <td className="p-3"><span className="text-xs px-2 py-1 border border-orange-200 text-orange-600 rounded-full">Pendiente Validación</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <span className="absolute -left-2 top-[60%] flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Validación Masiva:</strong> Aprobación en bloque (batch) de las rendiciones seleccionadas. Requiere validación OTP para garantizar autoría.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Selección Múltiple:</strong> Las casillas permiten seleccionar qué registros específicos validar o exportar a la vez.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 2. Integración con Bodega --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Nueva Rendición e Integración
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El registro de una factura permite inyectar el ítem comprado directamente a los inventarios (Bodega MM o Bodega Menor), evitando doble digitación.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md max-w-4xl mx-auto p-6 space-y-6">
                            
                            {/* Bloque Facturación */}
                            <div className="rounded border p-4 space-y-4">
                                <div className="font-semibold border-b pb-2">Detalles de la Facturación</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">RUT Proveedor</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">76.123.456-K</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Fecha Factura</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">22/04/2026</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Nº Factura / Boleta</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">123456</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Monto Total (CLP)</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">$ 50.000</div>
                                    </div>
                                </div>
                            </div>

                            {/* Bloque Gasto */}
                            <div className="rounded border p-4 space-y-4">
                                <div className="font-semibold border-b pb-2">Detalles del Gasto</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Unidad / Carro</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center justify-between bg-background">B-1 (XX-YY-11) <span>▼</span></div>
                                    </div>
                                    <div className="space-y-1.5 relative">
                                        <div className="text-sm font-medium">Tipo de Gasto</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center justify-between bg-background">Insumos por Reparación <span>▼</span></div>
                                        <span className="absolute -right-3 top-[50%] flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <div className="text-sm font-medium">Concepto / Descripción</div>
                                        <div className="h-16 rounded border p-2 text-sm text-muted-foreground bg-background">Filtros de Aire y Cambio de Aceite</div>
                                    </div>
                                </div>
                            </div>

                            {/* Bloque Comprobantes */}
                            <div className="rounded border p-4 space-y-4">
                                <div className="font-semibold border-b pb-2">Comprobantes</div>
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">☁️</div>
                                    <span className="text-sm font-medium text-foreground">Haga clic para subir archivos</span>
                                    <span className="text-xs">Adjunte imagen de la factura/boleta enviada por Taller.</span>
                                </div>
                                <span className="absolute -left-2 top-[60%] flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                            </div>

                            {/* Bloque Bodega */}
                            <div className="rounded border p-4 bg-muted/10 space-y-4 relative">
                                <div className="font-semibold border-b pb-2">Integración con Bodega (Opcional)</div>
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-8 rounded-full bg-primary flex items-center px-0.5 justify-end"><div className="h-4 w-4 bg-white rounded-full"></div></div>
                                    <span className="text-sm font-medium">Nuevo Ingreso a Bodega</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Cantidad Inicial</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center bg-background text-muted-foreground">10</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Unidad de Medida</div>
                                        <div className="h-9 rounded border px-3 text-sm flex items-center justify-between bg-background">UNIDAD <span>▼</span></div>
                                    </div>
                                </div>
                                <span className="absolute -left-3 top-[50%] flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">3</span>
                            </div>

                            <div className="rounded border p-4 bg-amber-50 dark:bg-amber-900/20 space-y-2 relative">
                                <div className="text-sm text-amber-700 dark:text-amber-300">
                                    Este ítem se ingresará automáticamente al inventario de <strong>Material Menor</strong>.
                                </div>
                                <ul className="list-disc list-inside text-sm text-amber-700/80 dark:text-amber-300/80">
                                    <li>Compañía: Comandancia</li>
                                    <li>Dependencia: Taller Mecánico</li>
                                </ul>
                                <span className="absolute -right-2 top-[50%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">4</span>
                            </div>

                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Regla de Tipos:</strong> El tipo de gasto define el destino en el sistema. "Repuestos/Insumos" apuntan a la Bodega MM. "Herramientas" apuntan a Material Menor.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Comprobantes Obligatorios:</strong> Toda rendición exige subir el respaldo digital de la compra (Factura o Boleta).</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">3</span>
                                <span><strong>Alta o Reabastecimiento:</strong> El switch permite decidir si el repuesto comprado ya existía (se suma stock al Kárdex) o si se creará una ficha de ítem completamente nueva.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">4</span>
                                <span><strong>Desvío a Material Menor:</strong> Cuando se compran "Herramientas", el sistema asume que no son repuestos consumibles y delega el activo al módulo de Material Menor, asignándolo a la dependencia "Taller Mecánico" bajo "Comandancia".</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- Permisos --- */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">3. Permisos y Roles</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        El acceso financiero es delicado. Solo roles administrativos pueden ingresar compras, y la validación requiere altos privilegios.
                    </p>
                    <div className="overflow-hidden rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3 text-left font-medium">Rol</th>
                                    <th className="p-3 text-center font-medium">Ver Historial</th>
                                    <th className="p-3 text-center font-medium">Crear Rendición</th>
                                    <th className="p-3 text-center font-medium">Validar (Aprobar)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y bg-background">
                                <tr>
                                    <td className="p-3 font-medium">Admin / Comandancia</td>
                                    <td className="p-3 text-center text-green-600">✓</td>
                                    <td className="p-3 text-center text-green-600">✓</td>
                                    <td className="p-3 text-center text-green-600">✓ (Con OTP)</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Secretaría Adquisiciones / Compras</td>
                                    <td className="p-3 text-center text-green-600">✓</td>
                                    <td className="p-3 text-center text-green-600">✓</td>
                                    <td className="p-3 text-center text-green-600">✓ (Con OTP)</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Inspectoría MM / Mecánico</td>
                                    <td className="p-3 text-center text-green-600">✓</td>
                                    <td className="p-3 text-center text-red-500">✗</td>
                                    <td className="p-3 text-center text-red-500">✗</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Bomberos / Oficiales Cía</td>
                                    <td className="p-3 text-center text-red-500">✗ (Sin acceso)</td>
                                    <td className="p-3 text-center text-red-500">✗</td>
                                    <td className="p-3 text-center text-red-500">✗</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
