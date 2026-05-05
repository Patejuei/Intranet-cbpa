import { FileText, Search, BarChart3, Download } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function CentralReportsSection() {
    return (
        <div>
            <SectionHeader
                title="Reportes Central"
                icon={FileText}
                roles={['Operadores de Central', 'Comandancia', 'Administración']}
            />
            
            <div className="space-y-16">
                
                {/* --- 1. Generación de Reportes Operativos --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Reportes y Estadísticas
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El módulo de <strong>Reportes Central</strong> permite extraer datos consolidados sobre la operatividad del Cuerpo. Facilita el análisis de tiempos de respuesta, frecuencia de puestas en servicio y disponibilidad de personal por compañía.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Panel de Filtros</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-sm p-6 space-y-4 max-w-3xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Compañía</div>
                                    <div className="h-9 rounded border bg-muted/5 flex items-center px-3 text-sm">Todas...</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Desde</div>
                                    <div className="h-9 rounded border bg-muted/5 flex items-center px-3 text-sm">01/04/2026</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase">Hasta</div>
                                    <div className="h-9 rounded border bg-muted/5 flex items-center px-3 text-sm">30/04/2026</div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2 relative">
                                <div className="flex h-9 items-center rounded bg-primary px-6 text-sm font-medium text-white gap-2">
                                    <BarChart3 className="h-4 w-4" />
                                    Generar Reporte
                                </div>
                                <span className="absolute -right-3 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Visualización de Datos:</strong> El sistema procesa miles de registros de puestas en servicio para entregar promedios de disponibilidad y picos de actividad horaria.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 2. Exportación de Datos --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Exportación a Excel y PDF
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Formatos Soportados</h3>
                        <p className="mt-2 text-muted-foreground">
                            Todos los reportes generados pueden ser exportados para su presentación en consejos de capitanes o informes de comandancia.
                        </p>
                        <div className="mt-6 flex gap-4 justify-center">
                            <div className="flex flex-col items-center gap-2 p-6 rounded-xl border bg-muted/5 w-40 hover:bg-muted/10 transition-colors border-dashed relative">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">📊</div>
                                <div className="text-xs font-bold uppercase">Excel (.xlsx)</div>
                                <div className="text-[10px] text-muted-foreground">Datos Crudos</div>
                                <span className="absolute -right-2 top-0 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-6 rounded-xl border bg-muted/5 w-40 hover:bg-muted/10 transition-colors border-dashed">
                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">📄</div>
                                <div className="text-xs font-bold uppercase">PDF</div>
                                <div className="text-[10px] text-muted-foreground">Informe Formal</div>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Auditoría:</strong> Los reportes incluyen la marca de tiempo y el usuario que generó el documento para asegurar la validez institucional de la información.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- Permisos --- */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">3. Control de Acceso</h2>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3">Rol</th>
                                    <th className="p-3 text-center">Ver Reportes Básicos</th>
                                    <th className="p-3 text-center">Exportar Datos Crudos</th>
                                    <th className="p-3 text-center">Estadísticas Globales</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Oficial de Compañía</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Solo su Cía</td>
                                    <td className="p-3 text-center text-red-600">No</td>
                                    <td className="p-3 text-center text-red-600">No</td>
                                </tr>
                                <tr className="border-t bg-muted/10">
                                    <td className="p-3 font-medium text-primary">Operador Central</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Comandancia / Admin</td>
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
