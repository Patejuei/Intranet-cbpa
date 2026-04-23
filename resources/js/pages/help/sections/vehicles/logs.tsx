import { BookOpen } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function LogsSection() {
    return (
        <div>
            <SectionHeader
                title="Bitácoras de Material Mayor"
                icon={BookOpen}
                roles={['Todos (Maquinistas)', 'Inspector MM']}
            />
            
            <div className="space-y-16">
                
                {/* --- 1. Historial de Bitácoras --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Historial de Bitácoras
                    </h2>

                    {/* Contexto */}
                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El módulo de <strong>Bitácoras</strong> centraliza el registro de kilometraje y movimientos físicos de las unidades. A diferencia de las Incidencias (enfocadas en fallas), la bitácora es el registro obligatorio de cada salida del vehículo de su cuartel, ya sea por emergencias, academias, carga de combustible o trámites.
                        </p>
                    </section>

                    {/* Quick Start */}
                    <section>
                        <h3 className="text-xl font-semibold">Quick Start</h3>
                        <ul className="ml-6 mt-4 list-decimal space-y-2 text-muted-foreground">
                            <li>
                                <strong>Consultar Movimientos:</strong> Usa el selector superior para filtrar por vehículo y ver su historial de salidas.
                            </li>
                            <li>
                                <strong>Exportar a Excel:</strong> Si necesitas un reporte formal de kilómetros recorridos, haz clic en el botón de exportación ubicado arriba a la derecha de la tabla.
                            </li>
                            <li>
                                <strong>Ver Detalle:</strong> Presiona el botón "Ver" para examinar si hubo carga de combustible o se adjuntaron boletas en esa salida.
                            </li>
                        </ul>
                    </section>

                    {/* Detalle Visual (Mockup con Hotspots) */}
                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <p className="mb-4 mt-2 text-muted-foreground">
                            Conoce la estructura de la tabla de historial de movimientos:
                        </p>
                        <div className="relative overflow-hidden rounded-xl border bg-background shadow-sm">
                            {/* Fake UI Header */}
                            <div className="flex h-16 items-center justify-between border-b bg-muted/10 px-6">
                                <div className="text-lg font-bold">Historial de Bitácoras</div>
                                <div className="flex gap-2 relative">
                                    <div className="flex h-8 items-center justify-center rounded border bg-background px-4 text-xs font-medium text-muted-foreground">
                                        Todos los Vehículos
                                    </div>
                                    <div className="flex h-8 items-center justify-center rounded border bg-background px-4 text-xs font-medium">
                                        Exportar Excel
                                    </div>
                                    {/* Hotspot 1 */}
                                    <span className="absolute -left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                        1
                                    </span>
                                </div>
                            </div>
                            {/* Fake UI Body (Table) */}
                            <div className="bg-background">
                                <div className="flex border-b bg-muted/50 px-6 py-3 text-xs font-medium text-muted-foreground">
                                    <div className="w-24">Fecha / Hrs</div>
                                    <div className="w-20">Unidad</div>
                                    <div className="w-32">Actividad</div>
                                    <div className="flex-1">Destino</div>
                                    <div className="w-24">Km Salida</div>
                                    <div className="w-24">Km Llegada</div>
                                    <div className="w-24 text-right">Acciones</div>
                                </div>
                                {/* Row 1 */}
                                <div className="flex border-b px-6 py-4 text-sm hover:bg-muted/30 items-center">
                                    <div className="w-24 text-muted-foreground flex flex-col text-xs">
                                        <span className="font-medium text-foreground">2026-04-22</span>
                                        <span>S: 14:00</span>
                                        <span>L: 16:30</span>
                                    </div>
                                    <div className="w-20 font-bold">B-1</div>
                                    <div className="w-32 relative">
                                        <span className="rounded border px-2 py-0.5 text-xs text-muted-foreground">Emergencia</span>
                                        {/* Hotspot 2 */}
                                        <span className="absolute -left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            2
                                        </span>
                                    </div>
                                    <div className="flex-1 text-muted-foreground truncate pr-4">Llamado 10-0-1, Esquina Central</div>
                                    <div className="w-24 font-mono text-xs">154,200</div>
                                    <div className="w-24 font-mono text-xs relative">
                                        154,215
                                        {/* Hotspot 3 */}
                                        <span className="absolute -left-4 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            3
                                        </span>
                                    </div>
                                    <div className="w-24 relative flex justify-end">
                                        <div className="flex h-7 w-16 items-center justify-center rounded border text-xs">Ver</div>
                                    </div>
                                </div>
                                {/* Row 2 */}
                                <div className="flex border-b px-6 py-4 text-sm hover:bg-muted/30 items-center opacity-70">
                                    <div className="w-24 text-muted-foreground flex flex-col text-xs">
                                        <span className="font-medium text-foreground">2026-04-21</span>
                                        <span>S: 09:00</span>
                                        <span>L: 09:45</span>
                                    </div>
                                    <div className="w-20 font-bold">R-1</div>
                                    <div className="w-32">
                                        <span className="rounded border px-2 py-0.5 text-xs text-muted-foreground">CargaCombustible</span>
                                    </div>
                                    <div className="flex-1 text-muted-foreground truncate pr-4">Servicentro Copec</div>
                                    <div className="w-24 font-mono text-xs">80,100</div>
                                    <div className="w-24 font-mono text-xs">80,112</div>
                                    <div className="w-24 flex justify-end">
                                        <div className="flex h-7 w-16 items-center justify-center rounded border text-xs">Ver</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    1
                                </span>
                                <span>
                                    <strong>Filtros y Reportes:</strong> Útiles para auditorías. Comandancia o Inspectores pueden cruzar datos de Excel con el GPS de los vehículos.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    2
                                </span>
                                <span>
                                    <strong>Categorización de Actividad:</strong> Clasifica las salidas (Academia, Emergencia, Carga de Combustible) para análisis de consumo.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    3
                                </span>
                                <span>
                                    <strong>Odómetro Continuo:</strong> El sistema pre-carga el último kilometraje registrado (Llegada anterior) en la siguiente Salida.
                                </span>
                            </div>
                        </div>
                    </section>
                </div>


                {/* --- 2. Registro de Movimiento --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Registro de Movimiento (Formulario)
                    </h2>

                    {/* Contexto */}
                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Esta pestaña es de uso constante por los maquinistas u operadores. El formulario es inteligente: al seleccionar un vehículo, autocompleta el Kilometraje de Inicio con el último registro conocido, minimizando errores de tipeo. Además, tiene un flujo dinámico para registros de combustible.
                        </p>
                    </section>

                    {/* Detalle Visual (Mockup con Hotspots) */}
                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <p className="mb-4 mt-2 text-muted-foreground">
                            Interfaz de ingreso de datos:
                        </p>
                        <div className="relative mx-auto max-w-[600px] overflow-hidden rounded-xl border bg-background shadow-md">
                            {/* Fake Card Header */}
                            <div className="border-b bg-muted/10 p-6 pb-4">
                                <div className="text-lg font-bold">Nueva Entrada de Bitácora</div>
                                <div className="text-sm text-muted-foreground">Registre la salida o movimiento de una unidad.</div>
                            </div>
                            
                            {/* Fake Card Body */}
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5 relative">
                                        <div className="text-sm font-medium">Vehículo</div>
                                        <div className="flex h-9 items-center rounded border px-3 text-sm">B-1</div>
                                        {/* Hotspot 1 */}
                                        <span className="absolute -left-2 top-[60%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            1
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Fecha</div>
                                        <div className="flex h-9 items-center rounded border px-3 text-sm">2026-04-23</div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Dirección / Destino</div>
                                    <div className="flex h-9 items-center rounded border px-3 text-sm text-muted-foreground">Av. Concha y Toro 3349</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5 relative">
                                        <div className="text-sm font-medium">Kilometraje Inicio</div>
                                        <div className="flex h-9 items-center rounded border bg-muted/20 px-3 text-sm text-muted-foreground">154215</div>
                                        {/* Hotspot 2 */}
                                        <span className="absolute -left-2 top-[60%] flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            2
                                        </span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Kilometraje Fin (Opcional)</div>
                                        <div className="flex h-9 items-center rounded border px-3 text-sm text-muted-foreground">154228</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Hora de Salida <span className="text-red-500">*</span></div>
                                        <div className="flex h-9 items-center rounded border px-3 text-sm">14:00</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-sm font-medium">Hora de Regreso <span className="text-red-500">*</span></div>
                                        <div className="flex h-9 items-center rounded border px-3 text-sm">16:30</div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Tipo de Actividad</div>
                                    <div className="flex h-9 items-center rounded border px-3 text-sm">Emergencia</div>
                                </div>

                                <div className="rounded-lg border p-4 bg-muted/5 relative">
                                    <div className="flex items-center gap-3">
                                        <div className="h-5 w-9 rounded-full bg-primary relative flex items-center px-0.5">
                                            <div className="h-4 w-4 rounded-full bg-white ml-auto"></div>
                                        </div>
                                        <div className="text-sm font-medium">¿Fue a Cargar Combustible?</div>
                                    </div>
                                    {/* Sub-form de combustible */}
                                    <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
                                        <div className="space-y-1.5">
                                            <div className="text-sm font-medium">Litros Cargados</div>
                                            <div className="flex h-9 items-center rounded border px-3 text-sm text-muted-foreground">0.0</div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="text-sm font-medium">Nº Cupón / Vale</div>
                                            <div className="flex h-9 items-center rounded border px-3 text-sm text-muted-foreground">Nº Documento</div>
                                        </div>
                                        <div className="col-span-2 space-y-1.5">
                                            <div className="text-sm font-medium">Fotografía Boleta/Vale</div>
                                            <div className="flex h-9 items-center justify-center rounded border border-dashed bg-muted/20 px-3 text-xs text-muted-foreground">
                                                Seleccionar archivo...
                                            </div>
                                        </div>
                                    </div>
                                    {/* Hotspot 3 */}
                                    <span className="absolute -left-2 top-6 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                        3
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="text-sm font-medium">Observaciones (Opcional)</div>
                                    <div className="flex min-h-[80px] rounded border px-3 py-2 text-sm text-muted-foreground">Detalle cualquier novedad o incidencia...</div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <div className="flex h-9 items-center justify-center rounded bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm">
                                        Registrar Movimiento
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    1
                                </span>
                                <span>
                                    <strong>Selección Dinámica:</strong> Al elegir una unidad, el formulario va a la base de datos a rescatar los últimos parámetros registrados.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    2
                                </span>
                                <span>
                                    <strong>Kilometraje Pre-cargado:</strong> Para evitar errores, el Kilometraje de Inicio no se debe inventar; se autocompleta con la última llegada. Solo se puede alterar si el Inspector MM lo autoriza (corrigiendo el odómetro manualmente).
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    3
                                </span>
                                <span>
                                    <strong>Control de Combustible:</strong> Si se activa el switch de carga, se despliega un formulario anidado donde se puede adjuntar la boleta fotografiada y el código del cupón corporativo asociado al vehículo (que también se autocompleta).
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Tabla de Roles Generales */}
                    <section>
                        <h3 className="text-xl font-semibold">Permisos en Módulo Bitácoras</h3>
                        <p className="mb-4 mt-2 text-muted-foreground">
                            Qué pueden hacer los usuarios dentro de esta sección:
                        </p>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-3 text-left font-medium">Rol</th>
                                        <th className="p-3 text-left font-medium">Acceso</th>
                                        <th className="p-3 text-left font-medium">Capacidades</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Maquinista Autorizado</td>
                                        <td className="p-3 font-bold text-blue-600">Crear y Leer</td>
                                        <td className="p-3 text-muted-foreground">
                                            Puede registrar bitácoras de su compañía y ver el historial de los vehículos a los que tiene acceso.
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Inspector MM / Comandancia</td>
                                        <td className="p-3 font-bold text-blue-600">Gestión Total</td>
                                        <td className="p-3 text-muted-foreground">
                                            Ven el historial de todo el Cuerpo, exportan reportes globales y pueden editar kilometrajes en caso de desfase (se hace desde Control de Unidades).
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Bombero Estandar</td>
                                        <td className="p-3 text-muted-foreground text-red-600">Sin Acceso</td>
                                        <td className="p-3 text-muted-foreground">
                                            La bitácora es una responsabilidad exclusiva de quien conduce. No es visible para personal no autorizado.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* --- 3. Detalle de Bitácora (Show) --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        3. Detalle de Bitácora
                    </h2>

                    {/* Contexto */}
                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            La vista de detalle permite auditar cada movimiento individual. Es especialmente importante para cruzar la información del odómetro y para fiscalizar las cargas de combustible, comprobando la boleta fotográfica y los litros ingresados contra los registros del servicentro.
                        </p>
                    </section>

                    {/* Detalle Visual (Mockup con Hotspots) */}
                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <p className="mb-4 mt-2 text-muted-foreground">
                            Interfaz de lectura de una bitácora específica:
                        </p>
                        <div className="relative mx-auto overflow-hidden rounded-xl border bg-background shadow-sm">
                            {/* Fake Header */}
                            <div className="border-b bg-muted/10 p-6">
                                <div className="text-xl font-bold">Detalle de Bitácora #1024</div>
                                <div className="text-sm text-muted-foreground mt-1">Registro de movimiento de la unidad B-1.</div>
                            </div>
                            
                            {/* Fake Body */}
                            <div className="p-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                                {/* Left Side: Info */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="rounded-xl border shadow-sm">
                                        <div className="border-b p-4 font-bold flex items-center gap-2">
                                            <span className="h-4 w-4 rounded-full bg-primary" /> Información del Movimiento
                                        </div>
                                        <div className="grid grid-cols-2 gap-6 p-4">
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="text-xs font-medium uppercase text-muted-foreground">Horario</div>
                                                    <div className="font-semibold text-sm">14:00 - 16:30</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium uppercase text-muted-foreground">Conductor/Responsable</div>
                                                    <div className="font-semibold text-sm relative">
                                                        Juan Pérez
                                                        {/* Hotspot 1 */}
                                                        <span className="absolute -left-4 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                                            1
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="text-xs font-medium uppercase text-muted-foreground">Kilometraje</div>
                                                    <div className="text-sm">Inicio: <span className="font-semibold">154,200 km</span></div>
                                                    <div className="text-sm relative">
                                                        Término: <span className="font-semibold">154,215 km</span>
                                                        {/* Hotspot 2 */}
                                                        <span className="absolute -left-4 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                                            2
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 inline-flex rounded bg-muted px-2 py-0.5 text-xs font-medium">Recorrido: 15 km</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Observaciones */}
                                    <div className="rounded-xl border shadow-sm">
                                        <div className="border-b p-4 font-bold">Observaciones</div>
                                        <div className="p-4">
                                            <div className="rounded bg-muted/50 p-3 text-sm italic">
                                                "Se cargó combustible al regresar del llamado."
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Combustible */}
                                <div className="lg:col-span-1">
                                    <div className="rounded-xl border shadow-sm bg-muted/5">
                                        <div className="border-b p-4 font-bold flex items-center gap-2">
                                            <span className="h-4 w-4 rounded-full bg-primary" /> Carga de Combustible
                                        </div>
                                        <div className="p-4 space-y-4">
                                            <div>
                                                <div className="text-xs font-medium uppercase text-muted-foreground">Litros Cargados</div>
                                                <div className="text-lg font-bold">45.5 L</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium uppercase text-muted-foreground">Nº Cupón / Vale</div>
                                                <div className="font-semibold text-sm">VALE-99382</div>
                                            </div>
                                            <div className="pt-2 relative">
                                                <div className="text-xs font-medium uppercase text-muted-foreground mb-2">Comprobante de Carga</div>
                                                <div className="aspect-square w-full rounded-lg border-2 border-dashed bg-muted/20 flex items-center justify-center text-xs text-muted-foreground">
                                                    [Fotografía de Boleta]
                                                </div>
                                                {/* Hotspot 3 */}
                                                <span className="absolute -left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                                    3
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    1
                                </span>
                                <span>
                                    <strong>Auditoría de Conductor:</strong> Queda un registro inmutable de qué usuario del sistema realizó el movimiento.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    2
                                </span>
                                <span>
                                    <strong>Cálculo Automático:</strong> El sistema calcula el "Recorrido" restando la llegada y salida para ayudar en los reportes de rendimiento.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    3
                                </span>
                                <span>
                                    <strong>Visualización de Boletas:</strong> El visor de imágenes permite ampliar o descargar el comprobante adjuntado (PDF o Imagen) para rendiciones financieras.
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
