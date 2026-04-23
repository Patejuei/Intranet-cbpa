import { Truck } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function StatusSection() {
    return (
        <div>
            <SectionHeader
                title="Control de Unidades"
                icon={Truck}
                roles={['Todos', 'Comandancia', 'Capitán', 'Maquinista']}
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
                            El módulo de <strong>Control de Unidades</strong> es el panel central de gestión de la flota del Cuerpo de Bomberos. Te permite obtener una vista general inmediata de la disponibilidad operativa de cada vehículo (En Servicio, En Taller o Fuera de Servicio), acceder a detalles técnicos (Patente, marca, modelo) y administrar nuevos ingresos según tus niveles de permiso.
                        </p>
                    </section>

                    {/* Quick Start */}
                    <section>
                        <h3 className="text-xl font-semibold">Quick Start</h3>
                        <ul className="ml-6 mt-4 list-decimal space-y-2 text-muted-foreground">
                            <li>
                                <strong>Revisa el Estado:</strong> El color de la etiqueta (Verde, Amarillo, Rojo) te indicará inmediatamente si el carro está operativo.
                            </li>
                            <li>
                                <strong>Explora Compañías:</strong> Si tienes rol de Comandancia, verás un listado desplegable por compañía; de lo contrario, solo verás los carros de tu propia compañía.
                            </li>
                            <li>
                                <strong>Ver Detalles:</strong> Haz clic en "Ver Detalles" en la tarjeta de cualquier unidad para entrar a su ficha técnica completa, incidentes y bitácoras.
                            </li>
                        </ul>
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
                                    {/* Hotspot 1 */}
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
                                                {/* Hotspot 2 */}
                                                <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                                    2
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mb-4 text-xs text-muted-foreground">Renault Camiva 2010</div>
                                        <div className="text-xs text-muted-foreground">PPU: BC-DF-45</div>
                                        <div className="mb-4 text-xs font-medium text-muted-foreground">Cupón: 123456</div>
                                        <div className="flex h-8 w-full items-center justify-center rounded border text-xs relative">
                                            Ver Detalles
                                            {/* Hotspot 3 */}
                                            <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                                3
                                            </span>
                                        </div>
                                    </div>
                                    {/* Card 2 */}
                                    <div className="rounded-lg border bg-background p-4 relative shadow-sm opacity-60">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="text-xl font-bold">R-1</div>
                                            <div className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 relative">
                                                En Taller
                                            </div>
                                        </div>
                                        <div className="mb-4 text-xs text-muted-foreground">Crimson Spartan 2018</div>
                                        <div className="text-xs text-muted-foreground">PPU: XX-YY-99</div>
                                        <div className="mb-4 text-xs font-medium text-muted-foreground">Cupón: -</div>
                                        <div className="flex h-8 w-full items-center justify-center rounded border text-xs">
                                            Ver Detalles
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
                                    <strong>Acción de Creación:</strong> Exclusivo para administradores y comandancia. Permite ingresar una nueva máquina.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    2
                                </span>
                                <span>
                                    <strong>Estado Operativo:</strong> Etiqueta visual clara sobre si el carro está operativo, en taller o de baja.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    3
                                </span>
                                <span>
                                    <strong>Ficha Completa:</strong> Ingreso a los detalles específicos, reportes y revisión documental de la unidad.
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Tabla de Roles */}
                    <section>
                        <h3 className="text-xl font-semibold">Permisos por Rol</h3>
                        <p className="mb-4 mt-2 text-muted-foreground">
                            Resumen de accesos para interactuar con la grilla de vehículos.
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
                                        <td className="p-3 font-medium">Bombero / Teniente</td>
                                        <td className="p-3">Lectura (Compañía)</td>
                                        <td className="p-3 text-muted-foreground">
                                            Solo pueden visualizar los vehículos asignados a su propia compañía.
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Comandancia / Admin</td>
                                        <td className="p-3">Total (Global)</td>
                                        <td className="p-3 text-muted-foreground">
                                            Pueden ver todos los carros mediante un menú desplegable y crear nuevas unidades.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>


                {/* --- 2. Ficha Técnica de la Unidad --- */}
                <div className="space-y-8 pt-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Ficha Técnica de la Unidad
                    </h2>

                    {/* Contexto */}
                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            La vista individual del vehículo (Ficha Técnica) consolida toda su información: datos duros (patente, año, modelo), fechas de vencimiento de documentación legal (Seguro, Revisión Técnica), y un historial transparente de todo el mantenimiento y las incidencias pasadas que ha tenido la máquina.
                        </p>
                    </section>

                    {/* Quick Start */}
                    <section>
                        <h3 className="text-xl font-semibold">Quick Start</h3>
                        <ul className="ml-6 mt-4 list-decimal space-y-2 text-muted-foreground">
                            <li>
                                <strong>Verificar Alertas:</strong> En la parte superior encontrarás cajas rojas o amarillas indicando si algún documento clave está vencido o próximo a vencer.
                            </li>
                            <li>
                                <strong>Actualizar Documentos:</strong> Si tienes permiso, usa el botón "Actualizar Vencimientos" para registrar la renovación del Seguro, Permiso de Circulación o Revisión Técnica.
                            </li>
                            <li>
                                <strong>Ver Historial:</strong> Desplázate hacia abajo para ver la tabla con todas las Órdenes de Trabajo previas asociadas a la máquina y sus costos (si tienes permiso).
                            </li>
                        </ul>
                    </section>

                    {/* Detalle Visual (Mockup con Hotspots) */}
                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <p className="mb-4 mt-2 text-muted-foreground">
                            Interfaz de la ficha técnica individual:
                        </p>
                        <div className="relative overflow-hidden rounded-xl border bg-background shadow-sm">
                            {/* Fake UI Header */}
                            <div className="flex items-center justify-between border-b bg-muted/10 p-6">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-2xl font-bold">B-1</div>
                                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                            En Servicio
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">Primera Compañía - Renault Camiva</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex h-8 items-center justify-center rounded border bg-background px-4 text-xs font-medium">
                                        Ver Bitácora
                                    </div>
                                    <div className="flex h-8 items-center justify-center rounded border bg-background px-4 text-xs font-medium">
                                        Ver Checklists
                                    </div>
                                    <div className="flex h-8 items-center justify-center rounded bg-secondary px-4 text-xs font-medium text-secondary-foreground relative">
                                        Actualizar Vencimientos
                                        {/* Hotspot 1 */}
                                        <span className="absolute -left-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            1
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Fake UI Body */}
                            <div className="p-6 space-y-4">
                                {/* Alertas Documentales */}
                                <div className="rounded-lg border-l-4 border-l-yellow-500 bg-yellow-50 p-4 relative">
                                    <div className="flex items-start gap-2">
                                        <div className="mt-0.5 h-4 w-4 rounded-full border border-yellow-600 bg-yellow-500"></div>
                                        <div>
                                            <div className="text-sm font-bold text-yellow-800">Revisión Técnica Por Vencer</div>
                                            <div className="text-xs text-yellow-700">Vence: 2026-05-10 (15 días restantes)</div>
                                        </div>
                                    </div>
                                    {/* Hotspot 2 */}
                                    <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                        2
                                    </span>
                                </div>

                                {/* Widgets Layout */}
                                <div className="grid grid-cols-3 gap-4">
                                    {/* Info Panel */}
                                    <div className="col-span-2 rounded-lg border p-4">
                                        <div className="font-bold mb-4">Información del Vehículo</div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-xs text-muted-foreground">Patente</div>
                                                <div className="text-sm font-semibold">BC-DF-45</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-muted-foreground">Cupón Combustible</div>
                                                <div className="text-sm font-semibold">123456</div>
                                            </div>
                                        </div>
                                        {/* Caja de Inversión */}
                                        <div className="mt-4 rounded bg-blue-50 p-3 relative">
                                            <div className="text-xs font-bold text-blue-800">Inversión Total en Mantenimiento</div>
                                            <div className="text-lg font-bold text-blue-900">$2.500.000</div>
                                            {/* Hotspot 3 */}
                                            <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                                3
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Widget */}
                                    <div className="rounded-lg border-green-200 bg-green-50 p-4 border relative">
                                        <div className="font-bold text-green-800 flex items-center gap-2">
                                            Unidad Operativa
                                        </div>
                                        <div className="mt-2 text-xs text-green-700">
                                            La unidad se encuentra operativa y disponible para el servicio.
                                        </div>
                                        {/* Hotspot 4 */}
                                        <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            4
                                        </span>
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
                                    <strong>Actualizar Vencimientos:</strong> Botón de acceso exclusivo para modificar las fechas de caducidad documental.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    2
                                </span>
                                <span>
                                    <strong>Alertas Automáticas:</strong> El sistema avisa 30 días antes si un documento expira. Se vuelve rojo si está vencido.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    3
                                </span>
                                <span>
                                    <strong>Costos Acumulados:</strong> Vista exclusiva de Comandancia/Admin para auditar cuánto se ha invertido en reparaciones en este vehículo.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    4
                                </span>
                                <span>
                                    <strong>Status Dinámico:</strong> Cambia de verde a rojo (motivo de baja) o amarillo (tareas del taller) según los reportes.
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Tabla de Roles Ficha Técnica */}
                    <section>
                        <h3 className="text-xl font-semibold">Permisos en Ficha Técnica</h3>
                        <p className="mb-4 mt-2 text-muted-foreground">
                            Qué pueden ver y hacer los diferentes usuarios dentro de una unidad específica.
                        </p>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-3 text-left font-medium">Rol</th>
                                        <th className="p-3 text-left font-medium">Acciones</th>
                                        <th className="p-3 text-left font-medium">Visibilidad Especial</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Bombero / Teniente</td>
                                        <td className="p-3 text-muted-foreground">Ver info, navegar a Bitácora y Checklists.</td>
                                        <td className="p-3 text-muted-foreground">Solo historial de fallas, <strong>sin costos</strong>.</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Inspector / Capitán</td>
                                        <td className="p-3 text-muted-foreground">Actualizar vencimientos, Editar Unidad.</td>
                                        <td className="p-3 text-muted-foreground">Solo historial de fallas, <strong>sin costos</strong>.</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">Comandancia / Admin</td>
                                        <td className="p-3 text-muted-foreground">Control total y exportación de reportes PDF/Excel.</td>
                                        <td className="p-3 font-bold text-blue-600">Ven costos de mantenimiento y sumatoria histórica.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
