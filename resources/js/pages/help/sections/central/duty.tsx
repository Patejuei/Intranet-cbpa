import { ClipboardList, Radio, Clock, UserCheck } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function CentralDutySection() {
    return (
        <div>
            <SectionHeader
                title="Puestas en Servicio"
                icon={ClipboardList}
                roles={['Operadores de Central', 'Oficiales de Guardia', 'Comandancia']}
            />
            
            <div className="space-y-16">
                
                {/* --- 1. Control de Disponibilidad --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Registro de Puestas en Servicio
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Este módulo permite a la **Central de Alarmas** llevar un registro histórico de cuándo las piezas de material mayor (carros) y su personal (maquinistas/oficiales) se declaran disponibles para el servicio. Es la herramienta principal para la gestión operativa en tiempo real.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-sm max-w-4xl mx-auto">
                            <div className="border-b bg-muted/10 p-4 flex justify-between items-center">
                                <div className="font-bold text-lg">Puestas en Servicio Activas</div>
                                <div className="flex h-8 items-center rounded bg-primary px-3 text-xs font-medium text-white">+ Registrar Disponibilidad</div>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/30">
                                        <tr>
                                            <th className="p-3">Unidad</th>
                                            <th className="p-3">Maquinista</th>
                                            <th className="p-3 text-center">Hora Inicio</th>
                                            <th className="p-3 text-right">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="p-3 font-bold text-blue-600">B-1</td>
                                            <td className="p-3 font-medium">Pedro Sánchez</td>
                                            <td className="p-3 text-center text-muted-foreground">08:00 hrs</td>
                                            <td className="p-3 text-right relative">
                                                <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[10px] font-bold">EN SERVICIO</span>
                                                <span className="absolute -left-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                            </td>
                                        </tr>
                                        <tr className="border-t bg-muted/5">
                                            <td className="p-3 font-bold text-blue-600">Q-2</td>
                                            <td className="p-3 font-medium">Luis Gómez</td>
                                            <td className="p-3 text-center text-muted-foreground">08:15 hrs</td>
                                            <td className="p-3 text-right">
                                                <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[10px] font-bold">FUERA DE SERVICIO</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Estado Operativo:</strong> Permite a los operadores ver de un vistazo qué unidades están listas para despachar en caso de una emergencia de 6-3 (llamado estructural) u otros códigos.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 2. Formulario de Registro --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Formulario de Puesta en Servicio
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Datos Requeridos</h3>
                        <p className="mt-2 text-muted-foreground">
                            Al registrar una puesta en servicio, se deben completar los siguientes campos obligatorios para asegurar la trazabilidad del personal a cargo:
                        </p>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto p-6 rounded-xl border bg-card shadow-sm relative">
                            <div className="space-y-2">
                                <div className="text-xs font-bold text-muted-foreground uppercase">Maquinista</div>
                                <div className="h-10 rounded border bg-muted/5 flex items-center px-3 text-sm italic text-muted-foreground">Seleccione Bombero...</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-xs font-bold text-muted-foreground uppercase">Oficial a Cargo</div>
                                <div className="h-10 rounded border bg-muted/5 flex items-center px-3 text-sm italic text-muted-foreground">Seleccione Oficial...</div>
                            </div>
                            <div className="space-y-2 md:col-span-2 relative">
                                <div className="text-xs font-bold text-muted-foreground uppercase">Observaciones / Confección</div>
                                <div className="h-20 rounded border bg-muted/5 flex p-3 text-sm italic text-muted-foreground">Ej: Confección de 2 voluntarios...</div>
                                <span className="absolute -right-3 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Detalles Operativos:</strong> Es vital registrar la composición de la pieza (cuántos voluntarios suben) para que Central sepa la capacidad de respuesta de la unidad.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- Permisos --- */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">3. Roles y Permisos</h2>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3">Rol</th>
                                    <th className="p-3 text-center">Ver Disponibilidad</th>
                                    <th className="p-3 text-center">Registrar Puesta</th>
                                    <th className="p-3 text-center">Ver Historial</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Bombero / Maquinista</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-red-600">No</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                </tr>
                                <tr className="border-t bg-muted/10">
                                    <td className="p-3 font-medium text-primary">Operador Central</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Comandancia</td>
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
