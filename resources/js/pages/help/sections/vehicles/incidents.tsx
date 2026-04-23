import { AlertTriangle } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function IncidentsSection() {
    return (
        <div>
            <SectionHeader
                title="Incidencias (Reportes de Falla)"
                icon={AlertTriangle}
                roles={['Todos', 'Mecánico', 'Inspector MM']}
            />
            
            <div className="space-y-16">
                
                {/* --- 1. Registro de Incidencias (Tabla) --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Registro de Incidencias
                    </h2>

                    {/* Contexto */}
                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El módulo de <strong>Incidencias</strong> permite a cualquier usuario autorizado reportar anomalías o fallas detectadas en los vehículos. Esto inicia un flujo de revisión oficial donde el Inspector de Material Mayor evalúa la gravedad y decide si la unidad debe detenerse, enviarse a taller o simplemente mantener la falla en observación.
                        </p>
                        <div className="mt-4 rounded-lg border border-yellow-500/20 bg-yellow-50/50 p-4">
                            <h4 className="flex items-center gap-2 font-bold text-yellow-700 dark:text-yellow-500">
                                <AlertTriangle className="h-4 w-4" /> Importante
                            </h4>
                            <p className="mt-1 text-sm text-yellow-900/80 dark:text-yellow-200/80">
                                Un reporte de incidencia NO pone automáticamente a la unidad "Fuera de Servicio". Esa decisión es exclusiva del Inspector MM tras evaluar la gravedad del reporte.
                            </p>
                        </div>
                    </section>

                    {/* Quick Start */}
                    <section>
                        <h3 className="text-xl font-semibold">Quick Start</h3>
                        <ul className="ml-6 mt-4 list-decimal space-y-2 text-muted-foreground">
                            <li>
                                <strong>Reportar Nueva Incidencia:</strong> Haz clic en el botón "+ Nueva Incidencia", selecciona el vehículo, clasifica la gravedad y describe el problema detalladamente.
                            </li>
                            <li>
                                <strong>Revisar Gravedad y Estado:</strong> Observa las etiquetas de la tabla. El estado cambiará de "Pendiente" a "Revisado", "En Taller" o "Resuelto" según avance el flujo.
                            </li>
                            <li>
                                <strong>Seguimiento Completo:</strong> Presiona el botón "Ver" (ícono de ojo) en cualquier fila para leer la bitácora completa de la falla y la respuesta de Comandancia.
                            </li>
                        </ul>
                    </section>

                    {/* Detalle Visual (Mockup con Hotspots) */}
                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <p className="mb-4 mt-2 text-muted-foreground">
                            Conoce las áreas principales de la tabla de seguimiento de incidencias:
                        </p>
                        <div className="relative overflow-hidden rounded-xl border bg-background shadow-sm">
                            {/* Fake UI Header */}
                            <div className="flex h-16 items-center justify-between border-b bg-muted/10 px-6">
                                <div className="text-lg font-bold">Registro de Incidencias</div>
                                <div className="flex gap-2">
                                    <div className="flex h-8 items-center justify-center rounded bg-primary px-4 text-xs font-medium text-primary-foreground relative">
                                        + Nueva Incidencia
                                        {/* Hotspot 1 */}
                                        <span className="absolute -left-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            1
                                        </span>
                                    </div>
                                    <div className="flex h-8 items-center justify-center rounded border bg-background px-4 text-xs font-medium">
                                        Reporte Excel
                                    </div>
                                </div>
                            </div>
                            {/* Fake UI Body (Table) */}
                            <div className="bg-background">
                                <div className="flex border-b bg-muted/50 px-6 py-3 text-xs font-medium text-muted-foreground">
                                    <div className="w-24">Fecha</div>
                                    <div className="w-24">Unidad</div>
                                    <div className="w-32">Gravedad</div>
                                    <div className="flex-1">Descripción</div>
                                    <div className="w-40">Estado</div>
                                    <div className="w-24">Acciones</div>
                                </div>
                                {/* Row 1 */}
                                <div className="flex border-b px-6 py-4 text-sm hover:bg-muted/30 items-center">
                                    <div className="w-24 text-muted-foreground">2026-04-20</div>
                                    <div className="w-24 font-bold">B-1</div>
                                    <div className="w-32 relative">
                                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800">Alta</span>
                                        {/* Hotspot 2 */}
                                        <span className="absolute -left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            2
                                        </span>
                                    </div>
                                    <div className="flex-1 text-muted-foreground truncate pr-4">Falla en bomba centrífuga al succionar...</div>
                                    <div className="w-40 relative flex flex-col gap-1">
                                        <span className="rounded border border-yellow-500 px-2 py-0.5 text-xs text-yellow-600 w-fit">Pendiente Revisión</span>
                                        {/* Hotspot 3 */}
                                        <span className="absolute -left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            3
                                        </span>
                                    </div>
                                    <div className="w-24 relative">
                                        <div className="flex h-7 w-16 items-center justify-center rounded border text-xs">Ver</div>
                                        {/* Hotspot 4 */}
                                        <span className="absolute -left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            4
                                        </span>
                                    </div>
                                </div>
                                {/* Row 2 */}
                                <div className="flex border-b px-6 py-4 text-sm hover:bg-muted/30 items-center opacity-70">
                                    <div className="w-24 text-muted-foreground">2026-04-18</div>
                                    <div className="w-24 font-bold">R-1</div>
                                    <div className="w-32">
                                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">Media</span>
                                    </div>
                                    <div className="flex-1 text-muted-foreground truncate pr-4">Luz de cabina parpadea intermitentemente.</div>
                                    <div className="w-40 flex flex-col gap-1">
                                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 w-fit">En Taller</span>
                                    </div>
                                    <div className="w-24">
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
                                    <strong>Reportar Incidencia:</strong> Abre el formulario para registrar un nuevo problema. Requiere seleccionar unidad y gravedad.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    2
                                </span>
                                <span>
                                    <strong>Nivel de Gravedad:</strong> Clasificación de Baja a Crítica que ayuda a priorizar la atención mecánica.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    3
                                </span>
                                <span>
                                    <strong>Estado de Revisión:</strong> Indica en qué etapa se encuentra (Pendiente, Revisado, En Taller o Resuelto). También marca si el vehículo fue detenido por este motivo.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    4
                                </span>
                                <span>
                                    <strong>Ver Detalle:</strong> Entra a la vista individual para ver respuestas oficiales y flujo de trabajo.
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Tabla de Roles */}
                    <section>
                        <h3 className="text-xl font-semibold">Permisos en Registro</h3>
                        <p className="mb-4 mt-2 text-muted-foreground">
                            Resumen de accesos para interactuar con la tabla general de incidencias.
                        </p>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-3 text-left font-medium">Rol</th>
                                        <th className="p-3 text-left font-medium">Acceso</th>
                                        <th className="p-3 text-left font-medium">Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Bombero / Todos</td>
                                        <td className="p-3">Reportar</td>
                                        <td className="p-3 text-muted-foreground">
                                            Pueden crear incidencias pero no pueden cambiar su estado ni revisarlas oficialmente.
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Inspector MM / Comandancia</td>
                                        <td className="p-3">Gestión Total</td>
                                        <td className="p-3 text-muted-foreground">
                                            Pueden revisar, derivar a taller, resolver incidencias y detener máquinas.
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Taller / Mecánico</td>
                                        <td className="p-3">Lectura y Resolución</td>
                                        <td className="p-3 text-muted-foreground">
                                            Pueden ver las fallas derivadas a taller y marcarlas como reparadas.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>


                {/* --- 2. Detalle y Revisión de Incidencia --- */}
                <div className="space-y-8 pt-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Detalle y Revisión de Incidencia
                    </h2>

                    {/* Contexto */}
                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            La vista detallada (Show) centraliza toda la información de un reporte. Aquí los usuarios leen la falla completa, y los oficiales (Comandancia/Inspectores) toman acción: pueden marcar "Fuera de Servicio", enviar al Taller, o notificar a otras áreas. Es el corazón resolutivo del módulo.
                        </p>
                    </section>

                    {/* Quick Start */}
                    <section>
                        <h3 className="text-xl font-semibold">Quick Start</h3>
                        <ul className="ml-6 mt-4 list-decimal space-y-2 text-muted-foreground">
                            <li>
                                <strong>Revisar Novedad:</strong> Si tienes permiso de Oficial/Inspector, usa el botón azul superior para abrir el formulario de revisión.
                            </li>
                            <li>
                                <strong>Monitorear Notificaciones:</strong> En el panel lateral puedes ver si Taller, Material Mayor o Comandancia ya leyeron ("Visto") el reporte.
                            </li>
                            <li>
                                <strong>Detener la Unidad:</strong> Durante la revisión, puedes tildar "Material Fuera de Servicio". Esto se reflejará instantáneamente en el dashboard y en la vista general de la flota con una etiqueta roja.
                            </li>
                        </ul>
                    </section>

                    {/* Detalle Visual (Mockup con Hotspots) */}
                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <p className="mb-4 mt-2 text-muted-foreground">
                            Interfaz de revisión y detalle de falla:
                        </p>
                        <div className="relative overflow-hidden rounded-xl border bg-background shadow-sm">
                            {/* Fake UI Header */}
                            <div className="flex items-center justify-between border-b bg-muted/10 p-6">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-2xl font-bold">Incidencia #104</div>
                                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                            Alta
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">Reporte de la unidad B-1</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex h-9 items-center justify-center rounded bg-primary px-4 text-sm font-medium text-primary-foreground shadow-lg relative">
                                        <div className="mr-2 h-4 w-4 rounded-full border-2 border-primary-foreground"></div>
                                        Revisar Novedad
                                        {/* Hotspot 1 */}
                                        <span className="absolute -left-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            1
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Fake UI Body */}
                            <div className="p-6">
                                <div className="grid grid-cols-3 gap-6">
                                    {/* Info Panel Left */}
                                    <div className="col-span-2 space-y-6">
                                        <div className="rounded-lg border p-6">
                                            <div className="font-bold mb-6 text-primary flex items-center gap-2 border-b pb-2">
                                                Detalle del Reporte
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <div className="text-xs font-medium text-muted-foreground uppercase">Reportado Por</div>
                                                    <div className="text-sm font-bold mt-1">Juan Pérez (Maquinista)</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-medium text-muted-foreground uppercase">Estado Actual</div>
                                                    <div className="mt-1 flex gap-2 relative">
                                                        <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 border border-yellow-200">
                                                            PENDIENTE REVISIÓN
                                                        </span>
                                                        {/* Hotspot 2 */}
                                                        <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                                            2
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rounded-lg bg-muted/30 p-4 border">
                                                <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Descripción</div>
                                                <div className="text-sm leading-relaxed">
                                                    Al momento de encender la bomba centrífuga para succión, se percibe un ruido metálico fuerte y pérdida de presión en la línea principal.
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar Right */}
                                    <div className="col-span-1">
                                        <div className="rounded-lg border bg-muted/10 p-5 relative">
                                            <div className="font-bold mb-4 flex items-center gap-2 text-primary">
                                                Notificaciones y Vistos
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between border-b pb-2">
                                                    <span className="text-sm">Material Mayor</span>
                                                    <span className="rounded bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700 border border-yellow-200">ENVIADO</span>
                                                </div>
                                                <div className="flex items-center justify-between border-b pb-2">
                                                    <span className="text-sm">Taller Mecánico</span>
                                                    <span className="rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-200">VISTO</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm">Comandancia</span>
                                                    <span className="text-xs text-muted-foreground italic">No aplica</span>
                                                </div>
                                            </div>
                                            {/* Hotspot 3 */}
                                            <span className="absolute -left-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                                3
                                            </span>
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
                                    <strong>Botón Revisar:</strong> Exclusivo para Oficiales. Abre un modal para dictaminar qué hacer con el vehículo (dar de baja, derivar, etc).
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    2
                                </span>
                                <span>
                                    <strong>Etiquetas de Estado:</strong> Muestran si está "Pendiente", "En Taller", "Resuelto", o explícitamente "FUERA DE SERVICIO".
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    3
                                </span>
                                <span>
                                    <strong>Panel de Vistos:</strong> Permite saber quiénes han leído el reporte oficialmente en las demás áreas operativas.
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Tabla de Roles Revisión */}
                    <section>
                        <h3 className="text-xl font-semibold">Permisos en Detalle de Incidencia</h3>
                        <p className="mb-4 mt-2 text-muted-foreground">
                            Qué pueden ver y hacer los diferentes usuarios al entrar al reporte.
                        </p>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-3 text-left font-medium">Rol</th>
                                        <th className="p-3 text-left font-medium">Acciones Restringidas</th>
                                        <th className="p-3 text-left font-medium">Paneles Visibles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Bombero / Reportador</td>
                                        <td className="p-3 text-muted-foreground">Ninguna (Solo lectura del estado).</td>
                                        <td className="p-3 text-muted-foreground">Detalle del Reporte.</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Inspector MM / Comandancia</td>
                                        <td className="p-3 font-bold text-blue-600">Botón "Revisar Novedad" y Marcar Visto.</td>
                                        <td className="p-3 text-muted-foreground">Detalles, Vistos y Panel de Revisión.</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Mecánico</td>
                                        <td className="p-3 text-muted-foreground">Marcar como Visto (Taller).</td>
                                        <td className="p-3 text-muted-foreground">Detalles y Vistos.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>


                {/* --- 3. Formulario de Revisión (Modal) --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        3. Formulario de Revisión (Modal)
                    </h2>

                    {/* Contexto */}
                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Cuando un Oficial presiona "Revisar Novedad", se despliega un formulario crítico. Este modal centraliza la toma de decisiones: permite clasificar si la falla es invalidante (dejando el vehículo Fuera de Servicio), si ya fue resuelta en el momento, y a qué departamentos debe ser escalada la notificación para iniciar reparaciones o compras.
                        </p>
                    </section>

                    {/* Detalle Visual (Mockup con Hotspots) */}
                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <p className="mb-4 mt-2 text-muted-foreground">
                            Interfaz del modal de revisión:
                        </p>
                        <div className="relative mx-auto max-w-[500px] overflow-hidden rounded-xl border bg-background shadow-2xl">
                            {/* Fake Modal Header */}
                            <div className="border-b p-6 pb-4">
                                <div className="text-lg font-bold">Revisión de Incidencia</div>
                                <div className="text-sm text-muted-foreground mt-1">Determine acciones a seguir para la unidad B-1</div>
                            </div>
                            
                            {/* Fake Modal Body */}
                            <div className="p-6 space-y-6">
                                {/* Detener Material */}
                                <div className="rounded-lg border border-red-500/20 bg-red-50 p-4 relative">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 h-4 w-4 shrink-0 rounded border border-red-500 bg-red-500 flex items-center justify-center text-white text-[10px]">✓</div>
                                        <div>
                                            <div className="text-sm font-bold uppercase tracking-wide text-red-600">Material Fuera de Servicio</div>
                                            <div className="text-xs text-red-800/70 mt-1">Marcar si el vehículo no puede operar.</div>
                                        </div>
                                    </div>
                                    {/* Hotspot 1 */}
                                    <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                        1
                                    </span>
                                </div>

                                {/* Estado */}
                                <div className="rounded-lg border bg-muted/30 p-4">
                                    <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3">Estado de la Novedad</div>
                                    <div className="flex items-center gap-3 relative">
                                        <div className="h-4 w-4 shrink-0 rounded border border-input bg-background"></div>
                                        <div className="text-sm font-medium text-green-700">Marcar como RESUELTO</div>
                                        {/* Hotspot 2 */}
                                        <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            2
                                        </span>
                                    </div>
                                </div>

                                {/* Escalabilidad */}
                                <div className="rounded-lg border bg-muted/30 p-4">
                                    <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3">Notificaciones</div>
                                    <div className="space-y-3 relative">
                                        <div className="flex items-center gap-3">
                                            <div className="h-4 w-4 shrink-0 rounded border bg-primary flex items-center justify-center text-white text-[10px]">✓</div>
                                            <div className="text-sm font-medium">Reportar a Material Mayor</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-4 w-4 shrink-0 rounded border bg-primary flex items-center justify-center text-white text-[10px]">✓</div>
                                            <div className="text-sm font-medium">Reportar a Taller Mecánico</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-4 w-4 shrink-0 rounded border border-input bg-background"></div>
                                            <div className="text-sm font-medium">Reportar a Comandancia</div>
                                        </div>
                                        {/* Hotspot 3 */}
                                        <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            3
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Fake Modal Footer */}
                            <div className="bg-muted/30 p-4 border-t flex justify-end">
                                <div className="flex h-10 w-full items-center justify-center rounded bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm relative">
                                    Guardar Revisión y Notificar
                                    {/* Hotspot 4 */}
                                    <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                        4
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    1
                                </span>
                                <span>
                                    <strong>Fuera de Servicio:</strong> Esta acción cambia el estado global del vehículo en todo el sistema. Requiere extrema responsabilidad.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    2
                                </span>
                                <span>
                                    <strong>Resolución Rápida:</strong> Si la falla era menor (ej: cambiar una ampolleta) y ya se hizo, se marca resuelto directamente sin pasar por taller.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    3
                                </span>
                                <span>
                                    <strong>Escalamiento:</strong> Dispara notificaciones a los roles correspondientes para que lo vean en sus paneles de control.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    4
                                </span>
                                <span>
                                    <strong>Confirmación Segura:</strong> Ciertas acciones críticas (como dar de baja) solicitarán confirmación por PIN (OTP) antes de guardarse.
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
