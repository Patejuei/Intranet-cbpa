import { Truck } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function StatusSection() {
    return (
        <div>
            <SectionHeader
                title="Control de Unidades"
                icon={Truck}
                roles={['Comandante', 'Inspector MM', 'Taller Mecánico', 'Capitán', 'Maquinista', 'Cuartelero']}
            />
            
            <div className="space-y-16">
                
                {/* --- 1. Vista General de Flota --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Vista General de la Flota
                    </h2>

                    {/* Contexto */}
                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El módulo de <strong>Control de Unidades</strong> es el panel central de gestión de la flota del Cuerpo de Bomberos. Permite obtener una vista general inmediata de la disponibilidad operativa de cada vehículo (En Servicio, En Taller o Fuera de Servicio), acceder a detalles técnicos y administrar los activos de la institución.
                        </p>
                    </section>

                    {/* Detalle Visual (Mockup con Hotspots) */}
                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <p className="mb-4 mt-2 text-muted-foreground">
                            Conoce las áreas principales de tu pantalla de Estado de Flota:
                        </p>
                        <div className="relative overflow-hidden rounded-xl border bg-background shadow-sm">
                            {/* Fake UI Header */}
                            <div className="flex h-16 items-center justify-between border-b bg-muted/10 px-6">
                                <div>
                                    <div className="text-lg font-bold">Estado de la Flota</div>
                                    <div className="text-xs text-muted-foreground">Vista General de todas las compañías.</div>
                                </div>
                                <div className="flex h-8 items-center justify-center rounded bg-primary px-4 text-xs font-medium text-primary-foreground relative">
                                    + Nuevo Vehículo
                                    <span className="absolute -left-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                        1
                                    </span>
                                </div>
                            </div>
                            {/* Fake UI Body (Grid of Cards) */}
                            <div className="bg-accent/5 p-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Card 1 */}
                                    <div className="rounded-lg border bg-background p-4 relative shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="text-xl font-bold">B-1</div>
                                            <div className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 relative">
                                                En Servicio
                                                <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                                    2
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mb-4 text-xs text-muted-foreground">Renault Camiva 2010 | BC-DF-45</div>
                                        <div className="flex h-8 w-full items-center justify-center rounded border text-xs relative">
                                            Ver Detalles
                                            <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                                3
                                            </span>
                                        </div>
                                    </div>
                                    {/* Card 2 */}
                                    <div className="rounded-lg border bg-background p-4 relative shadow-sm opacity-60">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="text-xl font-bold">R-1</div>
                                            <div className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                                                En Taller
                                            </div>
                                        </div>
                                        <div className="mb-4 text-xs text-muted-foreground">Spartan 2018 | XX-YY-99</div>
                                        <div className="flex h-8 w-full items-center justify-center rounded border text-xs">
                                            Ver Detalles
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Ingreso de Unidades:</strong> Botón para registrar nuevos vehículos en el sistema (Solo roles con escritura).</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Estado Operativo:</strong> Semáforo visual: Verde (Operativo), Amarillo (Taller), Rojo (Fuera de Servicio).</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">3</span>
                                <span><strong>Ficha Técnica:</strong> Acceso a toda la información histórica y técnica de la máquina.</span>
                            </div>
                        </div>
                    </section>

                    {/* Tabla de Roles General */}
                    <section>
                        <h3 className="text-xl font-semibold">Permisos de Acceso General</h3>
                        <div className="mt-4 overflow-x-auto rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-3 text-left font-medium">Rol</th>
                                        <th className="p-3 text-left font-medium">Lectura</th>
                                        <th className="p-3 text-left font-medium">Escritura (Crear/Editar)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Comandante / Inspector MM</td>
                                        <td className="p-3 text-green-700 font-bold">Todas las Unidades</td>
                                        <td className="p-3 text-green-700 font-bold">Todas las Unidades</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Mecánico (Taller)</td>
                                        <td className="p-3 text-green-700">Todas las Unidades</td>
                                        <td className="p-3 text-red-700 italic">Sin Permisos</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Capitán / Maquinista / Cuartelero</td>
                                        <td className="p-3 text-blue-700">Unidades de su Compañía</td>
                                        <td className="p-3 text-red-700 italic">Sin Permisos</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Usuarios Autorizados</td>
                                        <td className="p-3 text-muted-foreground italic">
                                            Su Compañía (o todas si es de Comandancia). Dependiendo de permisos.
                                        </td>
                                        <td className="p-3 text-red-700 italic">Sin Permisos</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* --- 2. Gestión de Vehículos (Creación y Edición) --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Creación y Edición de Vehículos
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Formulario de Registro</h3>
                        <p className="mt-2 text-muted-foreground">
                            El sistema permite registrar nuevas unidades o modificar las existentes. Para garantizar la integridad de los datos, ciertos campos técnicos solo pueden definirse al crear la unidad.
                        </p>
                        
                        {/* Mockup Formulario */}
                        <div className="mt-6 max-w-3xl mx-auto rounded-xl border bg-card shadow-sm overflow-hidden">
                            <div className="border-b bg-muted/30 p-4">
                                <div className="text-sm font-bold">Detalles de la Unidad</div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Nombre (Sigla)</div>
                                        <div className="h-9 border rounded px-3 flex items-center text-sm bg-background relative">
                                            B-1
                                            <span className="absolute -right-2 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Patente</div>
                                        <div className="h-9 border rounded px-3 flex items-center text-sm bg-muted/30 italic">AA-BB-12</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Marca</div>
                                        <div className="h-9 border rounded px-3 flex items-center text-sm bg-muted/30 italic">Renault</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Modelo</div>
                                        <div className="h-9 border rounded px-3 flex items-center text-sm bg-muted/30 italic">Midlum 220</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Año</div>
                                        <div className="h-9 border rounded px-3 flex items-center text-sm bg-muted/30 italic">2023</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Compañía</div>
                                        <div className="h-9 border rounded px-3 flex items-center text-sm bg-background">Primera Compañía</div>
                                    </div>
                                </div>

                                <div className="border-t pt-4 space-y-4">
                                    <div className="text-xs font-bold uppercase tracking-wider text-primary">Documentación Vigente</div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1 relative">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase">Revisión Técnica</div>
                                            <div className="h-9 border rounded px-3 flex items-center text-sm bg-background italic">DD-MM-YYYY</div>
                                            <span className="absolute -right-2 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase">Permiso Circulación</div>
                                            <div className="h-9 border rounded px-3 flex items-center text-sm bg-background italic">DD-MM-YYYY</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase">Seguro Obligatorio</div>
                                            <div className="h-9 border rounded px-3 flex items-center text-sm bg-background italic">DD-MM-YYYY</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between border-t pt-4">
                                    <div className="h-9 px-4 border rounded text-xs flex items-center bg-red-50 text-red-600 font-bold">DAR DE BAJA</div>
                                    <div className="h-9 px-4 rounded bg-primary text-white text-xs flex items-center font-bold">GUARDAR CAMBIOS</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <div>
                                    <strong>Identificación y Datos Técnicos:</strong>
                                    <ul className="mt-1 list-disc ml-4 space-y-1">
                                        <li><strong>Nombre (Sigla):</strong> Identificador único (ej: B-1, BX-2).</li>
                                        <li><strong>Patente / Marca / Modelo / Año:</strong> Información de base del activo.</li>
                                        <li><strong>Compañía:</strong> Define quién es dueño y quién ve la unidad.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <div>
                                    <strong>Documentación Legal:</strong>
                                    <ul className="mt-1 list-disc ml-4 space-y-1">
                                        <li><strong>Vencimientos:</strong> RT, Permiso y SOAP. Generan alertas críticas en el Dashboard.</li>
                                        <li><strong>Botón Dar de Baja:</strong> Elimina lógicamente la unidad (Solo Comandancia).</li>
                                        <li><strong>Guardar Cambios:</strong> Aplica las modificaciones de forma inmediata.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 3. Ficha Técnica de la Unidad --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        3. Ficha Técnica (Detalle de Unidad)
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Composición de la Ficha</h3>
                        <p className="mt-2 text-muted-foreground">
                            La Ficha Técnica centraliza toda la información operativa, legal e histórica de un vehículo en una sola vista.
                        </p>
                        
                        {/* Mockup Ficha Técnica */}
                        <div className="mt-6 border rounded-xl bg-background shadow-sm overflow-hidden">
                            {/* Header */}
                            <div className="p-6 border-b bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded border flex items-center justify-center bg-background">⬅</div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-2xl font-bold">B-1</h4>
                                            <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">En Servicio</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground uppercase font-medium tracking-tight">Primera Compañía — Renault Midlum 220</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 relative">
                                    <div className="h-8 border rounded px-3 flex items-center text-[10px] font-bold bg-background">BITÁCORA</div>
                                    <div className="h-8 border rounded px-3 flex items-center text-[10px] font-bold bg-background">CHECKLISTS</div>
                                    <div className="h-8 border rounded px-3 flex items-center text-[10px] font-bold bg-primary text-white uppercase">Editar Unidad</div>
                                    <div className="h-8 border rounded px-3 flex items-center text-[10px] font-bold bg-background">REPORTES ▾</div>
                                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                </div>
                            </div>

                            {/* Alertas */}
                            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b bg-accent/5">
                                <div className="border-l-4 border-l-red-500 bg-red-50 p-3 rounded-r relative">
                                    <div className="text-[10px] font-bold text-red-700 uppercase">Seguro Obligatorio Vencido</div>
                                    <div className="text-[10px] text-red-600 font-medium">Venció hace 5 días</div>
                                    <span className="absolute -right-2 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Col Izquierda */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="border rounded-lg p-4 space-y-4">
                                        <div className="text-sm font-bold">Información del Vehículo</div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <div><div className="text-[10px] text-muted-foreground uppercase font-bold">Patente</div><div className="text-sm font-semibold">BC-DF-45</div></div>
                                            <div><div className="text-[10px] text-muted-foreground uppercase font-bold">Año</div><div className="text-sm font-semibold">2010</div></div>
                                            <div><div className="text-[10px] text-muted-foreground uppercase font-bold">Cupón</div><div className="text-sm font-semibold">123456</div></div>
                                        </div>
                                        <div className="border-t pt-4">
                                            <div className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Fechas de Documentación</div>
                                            <div className="grid grid-cols-3 gap-2 text-[10px] font-medium italic">
                                                <div>RT: 15-05-2026</div>
                                                <div>PC: 31-03-2026</div>
                                                <div>SOAP: 31-03-2026</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Command Card */}
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex justify-between items-center relative">
                                        <div>
                                            <div className="text-xs font-bold text-blue-800 uppercase">Inversión Total en Mantenimiento</div>
                                            <div className="text-2xl font-black text-blue-900">$2.500.000</div>
                                        </div>
                                        <div className="text-[10px] text-blue-700 italic text-right max-w-[150px]">Suma histórica de todas las reparaciones.</div>
                                        <span className="absolute -right-2 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">3</span>
                                    </div>
                                </div>

                                {/* Col Derecha */}
                                <div className="space-y-4">
                                    <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                                        <div className="text-sm font-bold text-green-800 flex items-center gap-2">✅ Unidad Operativa</div>
                                        <p className="text-[10px] text-green-700 mt-1">La unidad se encuentra operativa y disponible para el servicio de la comunidad.</p>
                                    </div>
                                    <div className="border rounded-lg p-4 opacity-50 bg-muted/20">
                                        <div className="text-[10px] font-bold uppercase text-muted-foreground">Último Ingreso Taller</div>
                                        <p className="text-[10px] mt-1 italic">Sin trabajos en curso.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">1</span>
                                <div>
                                    <p className="text-sm font-bold text-foreground">Botones de Acceso y Acciones:</p>
                                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="rounded border p-2 bg-muted/5">
                                            <p className="font-bold text-[11px] uppercase">Ver Bitácora</p>
                                            <p className="text-[10px] text-muted-foreground">Acceso directo al historial de movimientos, salidas y odómetro de la unidad.</p>
                                        </div>
                                        <div className="rounded border p-2 bg-muted/5">
                                            <p className="font-bold text-[11px] uppercase">Ver Checklists</p>
                                            <p className="text-[10px] text-muted-foreground">Muestra todas las revisiones técnicas (diarias/semanales) realizadas al vehículo.</p>
                                        </div>
                                        <div className="rounded border p-2 bg-muted/5">
                                            <p className="font-bold text-[11px] uppercase">Editar Unidad</p>
                                            <p className="text-[10px] text-muted-foreground">Permite modificar datos técnicos o administrativos (Solo roles autorizados).</p>
                                        </div>
                                        <div className="rounded border p-2 bg-muted/5">
                                            <p className="font-bold text-[11px] uppercase">Reportes</p>
                                            <p className="text-[10px] text-muted-foreground">Despliega un menú para generar la <strong>Hoja de Vida</strong> o <strong>Reporte de Checklist</strong> en PDF.</p>
                                        </div>
                                        <div className="rounded border p-2 bg-blue-50 border-blue-200">
                                            <p className="font-bold text-[11px] uppercase text-blue-800">Actualizar Vencimientos</p>
                                            <p className="text-[10px] text-blue-700">Acceso rápido para renovar fechas de documentos sin entrar al formulario completo.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">2</span>
                                <div>
                                    <p className="text-sm font-bold text-foreground">Alertas Documentales:</p>
                                    <p className="text-xs text-muted-foreground italic">El sistema genera avisos automáticos en la parte superior cuando un documento legal está por expirar (30 días) o ya venció (Rojo).</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">3</span>
                                <div>
                                    <p className="text-sm font-bold text-foreground">Control Financiero (Comandancia):</p>
                                    <p className="text-xs text-muted-foreground">Widget exclusivo para roles administrativos que suma el costo de todas las Órdenes de Trabajo históricas del vehículo.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                    {/* Tabla de Roles Ficha Técnica */}
                    <section>
                        <h3 className="text-xl font-semibold">Permisos Específicos en Ficha Técnica</h3>
                        <div className="mt-4 overflow-x-auto rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-3 text-left font-medium">Rol</th>
                                        <th className="p-3 text-left font-medium">Visualización</th>
                                        <th className="p-3 text-left font-medium">Acciones Permitidas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Comandante - Inspector MM</td>
                                        <td className="p-3 text-green-700 font-bold">Todas las Unidades (Incluye Costos $)</td>
                                        <td className="p-3">Escritura Total (Editar, Vencimientos, Bajas)</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Taller Mecánico</td>
                                        <td className="p-3 text-blue-700 font-medium">Todas las Unidades (Sin Costos)</td>
                                        <td className="p-3 text-red-600 italic">Sin permisos de escritura</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Capitán - Maquinista - Cuartelero</td>
                                        <td className="p-3 text-blue-700 italic">Solo Unidades de su Compañía</td>
                                        <td className="p-3 text-red-600 italic">Sin permisos de escritura</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Usuarios con Permisos</td>
                                        <td className="p-3 text-muted-foreground italic">
                                            Su Compañía (o todas si es de Comandancia)
                                        </td>
                                        <td className="p-3 text-red-600 italic">Sin permisos de escritura</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
    );
}
