import { Battery, ClipboardList, Calendar, AlertTriangle } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function EqBatteriesSection() {
    return (
        <div>
            <SectionHeader
                title="Control de Baterías"
                icon={Battery}
                roles={['Taller Mecánico', 'Ayudante General', 'Comandancia']}
            />
            
            <div className="space-y-16">
                
                {/* --- 1. Bitácora de Baterías --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Bitácora y Programación de Cambios
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Para asegurar la operatividad de los equipos de emergencia (radios, ERAs, monitores, etc.), el sistema mantiene un control estricto de la fecha de cambio de baterías. El objetivo es evitar fallas en actos de servicio por agotamiento de energía.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-sm max-w-4xl mx-auto">
                            <div className="border-b bg-muted/10 p-4 flex justify-between items-center">
                                <div className="font-bold text-lg">Bitácora de Cambios</div>
                                <div className="flex h-8 items-center rounded bg-primary px-3 text-xs font-medium text-white">+ Nuevo Registro</div>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/30">
                                        <tr>
                                            <th className="p-3">Equipo</th>
                                            <th className="p-3">Último Cambio</th>
                                            <th className="p-3">Próximo Cambio</th>
                                            <th className="p-3">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="p-3 font-medium">ERA-045 (Scott)</td>
                                            <td className="p-3 text-muted-foreground">01 Ene 2026</td>
                                            <td className="p-3 font-bold text-orange-600">01 Jul 2026</td>
                                            <td className="p-3 relative">
                                                <span className="flex h-3 w-3 rounded-full bg-orange-500"></span>
                                                <span className="absolute -right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                            </td>
                                        </tr>
                                        <tr className="border-t bg-muted/5">
                                            <td className="p-3 font-medium">Radio Portátil P-1</td>
                                            <td className="p-3 text-muted-foreground">15 Mar 2026</td>
                                            <td className="p-3 font-bold text-green-600">15 Sep 2026</td>
                                            <td className="p-3">
                                                <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Cálculo Automático:</strong> Al registrar un cambio, el sistema calcula automáticamente la fecha del próximo mantenimiento (usualmente 6 meses) y genera alertas visuales según la proximidad.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 2. Alertas de Vencimiento --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Semáforo de Operatividad
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div className="p-4 rounded-xl border bg-green-50 border-green-200 flex flex-col items-center text-center">
                            <div className="h-8 w-8 bg-green-500 rounded-full mb-2"></div>
                            <div className="text-sm font-bold text-green-700">Operativo</div>
                            <p className="text-xs text-green-700/70">Batería cambiada recientemente.</p>
                        </div>
                        <div className="p-4 rounded-xl border bg-orange-50 border-orange-200 flex flex-col items-center text-center">
                            <div className="h-8 w-8 bg-orange-500 rounded-full mb-2"></div>
                            <div className="text-sm font-bold text-orange-700">Por Vencer</div>
                            <p className="text-xs text-orange-700/70">Faltan menos de 15 días para el cambio.</p>
                        </div>
                        <div className="p-4 rounded-xl border bg-red-50 border-red-200 flex flex-col items-center text-center">
                            <div className="h-8 w-8 bg-red-500 rounded-full mb-2"></div>
                            <div className="text-sm font-bold text-red-700">Vencido</div>
                            <p className="text-xs text-red-700/70">Fecha programada superada. Equipo no confiable.</p>
                        </div>
                    </div>
                </div>

                {/* --- Permisos --- */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">3. Responsabilidades</h2>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3">Rol</th>
                                    <th className="p-3 text-center">Ver Estado</th>
                                    <th className="p-3 text-center">Registrar Cambio</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Bombero Común</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-red-600">No</td>
                                </tr>
                                <tr className="border-t bg-muted/10">
                                    <td className="p-3 font-medium">Ayudante de Compañía</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 font-medium text-primary">Taller Mecánico / Admin</td>
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
