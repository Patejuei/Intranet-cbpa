import { FileText } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function ReportsSection() {
    return (
        <div>
            <SectionHeader
                title="Informes y Reportes PDF"
                icon={FileText}
                roles={['Admin', 'Comandancia', 'Inspector MM', 'Capitán', 'Maquinista', 'Cuartelero']}
            />

            <div className="space-y-16">
                {/* --- 1. Introducción --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Generación de Documentos e Informes
                    </h2>
                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El módulo de **Reportes** consolida los datos operacionales de Material Mayor y genera documentos en formato PDF listos para impresión, auditoría interna o presentación a Comandancia.
                        </p>
                    </section>
                </div>

                {/* --- 2. Tipos de Reportes Generales --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Reportes Generales de la Flota
                    </h2>

                    <section className="space-y-4">
                        <p className="text-muted-foreground">
                            El sistema cuenta con tres informes generales que agrupan información de todo el Cuerpo de Bomberos o filtrados por rangos de fecha y compañía:
                        </p>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-lg border p-4 bg-muted/5">
                                <h4 className="font-bold text-sm text-primary mb-1">Reporte de Incidencias</h4>
                                <p className="text-xs text-muted-foreground">
                                    Resumen de todas las fallas reportadas, clasificadas por estado (Pendiente, En Taller, Resuelto) y nivel de gravedad. Ideal para auditar la confiabilidad de la flota.
                                </p>
                            </div>
                            <div className="rounded-lg border p-4 bg-muted/5">
                                <h4 className="font-bold text-sm text-primary mb-1">Reporte de Taller (Workshop)</h4>
                                <p className="text-xs text-muted-foreground">
                                    Listado consolidado de mantenciones preventivas y correctivas. Detalla talleres utilizados, costos de mano de obra y repuestos en un periodo de tiempo.
                                </p>
                            </div>
                            <div className="rounded-lg border p-4 bg-muted/5">
                                <h4 className="font-bold text-sm text-primary mb-1">Reporte de Checklists</h4>
                                <p className="text-xs text-muted-foreground">
                                    Historial consolidado de inspecciones preventivas. Permite supervisar qué compañías están al día con sus revisiones y el resultado de las mismas.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 3. Reportes Individuales --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        3. Informes Individuales por Unidad
                    </h2>

                    <section className="space-y-4">
                        <p className="text-muted-foreground">
                            Desde la ficha de cada unidad o desde el historial de checklists, se pueden emitir dos informes clave en PDF:
                        </p>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border p-4 bg-muted/5">
                                <h4 className="font-bold text-sm text-primary mb-1">Hoja de Vida del Vehículo</h4>
                                <p className="text-xs text-muted-foreground mb-2">
                                    Accesible desde la Ficha Técnica de la unidad en **Control de Unidades** (Menú "Reportes").
                                </p>
                                <ul className="list-disc ml-4 text-[11px] text-muted-foreground space-y-1">
                                    <li>Historial completo de kilometrajes y horas de motor.</li>
                                    <li>Registro cronológico de ingresos a Taller Mecánico con costos asociados.</li>
                                    <li>Bitácora de fallas e incidencias resueltas.</li>
                                </ul>
                            </div>
                            <div className="rounded-lg border p-4 bg-muted/5">
                                <h4 className="font-bold text-sm text-primary mb-1">Ficha de Checklist Individual</h4>
                                <p className="text-xs text-muted-foreground mb-2">
                                    Accesible al hacer clic en "Ver Detalles" de cualquier checklist visado.
                                </p>
                                <ul className="list-disc ml-4 text-[11px] text-muted-foreground space-y-1">
                                    <li>Estado detallado de cada componente evaluado (OK, Mantención, Urgente).</li>
                                    <li>Firmas digitales (nombres y estampas de tiempo) de quienes realizaron y visaron la inspección.</li>
                                    <li>Observaciones ingresadas en terreno.</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 4. Matriz de Permisos de Reportes --- */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">4. Matriz de Acceso a Reportes</h2>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3">Rol</th>
                                    <th className="p-3">Reportes Generales</th>
                                    <th className="p-3">Hoja de Vida de Unidad</th>
                                    <th className="p-3">Checklist Individual</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Comandancia / Admin</td>
                                    <td className="p-3 text-green-600 font-bold">Acceso Total</td>
                                    <td className="p-3 text-green-600 font-bold">Cualquier Unidad</td>
                                    <td className="p-3 text-green-600 font-bold">Cualquier Unidad</td>
                                </tr>
                                <tr className="border-t bg-muted/10">
                                    <td className="p-3 font-medium text-primary">Inspectoría MM</td>
                                    <td className="p-3 text-green-600 font-bold">Acceso Total</td>
                                    <td className="p-3 text-green-600 font-bold">Cualquier Unidad</td>
                                    <td className="p-3 text-green-600 font-bold">Cualquier Unidad</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Capitán / Compañía</td>
                                    <td className="p-3 text-red-600">Sin Acceso</td>
                                    <td className="p-3 text-blue-700 font-bold">Solo Cía. Propia</td>
                                    <td className="p-3 text-blue-700 font-bold">Solo Cía. Propia</td>
                                </tr>
                                <tr className="border-t bg-muted/10">
                                    <td className="p-3 font-medium text-primary">Maquinista / Cuartelero</td>
                                    <td className="p-3 text-red-600">Sin Acceso</td>
                                    <td className="p-3 text-blue-700 font-bold">Solo Cía. Propia</td>
                                    <td className="p-3 text-blue-700 font-bold">Solo Cía. Propia</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
