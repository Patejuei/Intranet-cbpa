import { FileText, ClipboardCheck, Printer, ShieldCheck } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function EqCertificatesSection() {
    return (
        <div>
            <SectionHeader
                title="Actas y Certificados"
                icon={FileText}
                roles={['Capitán', 'Ayudante', 'Comandancia', 'Secretaría']}
            />
            
            <div className="space-y-16">
                
                {/* --- 1. Certificados de Entrega --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Certificados de Entrega de Material
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Cada vez que se asigna material menor (EPP, uniformes, herramientas) a un voluntario, el sistema genera un **Certificado de Entrega**. Este documento es la garantía legal de que el voluntario ha recibido el equipo en buenas condiciones y se hace responsable de su cuidado.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-sm max-w-4xl mx-auto">
                            <div className="border-b bg-muted/10 p-4 flex justify-between items-center">
                                <div className="font-bold text-lg">Historial de Entregas</div>
                                <div className="flex h-8 items-center rounded bg-primary px-3 text-xs font-medium text-white">+ Nueva Acta</div>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/30">
                                        <tr>
                                            <th className="p-3">Folio</th>
                                            <th className="p-3">Recibe</th>
                                            <th className="p-3">Fecha</th>
                                            <th className="p-3 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="p-3 font-mono text-xs">#2026-045</td>
                                            <td className="p-3 font-medium">Juan Pérez Muñoz</td>
                                            <td className="p-3 text-muted-foreground">22 Abr 2026</td>
                                            <td className="p-3 text-right space-x-2 relative">
                                                <span className="inline-flex h-8 w-8 items-center justify-center rounded border bg-background text-blue-600">📄</span>
                                                <span className="inline-flex h-8 w-8 items-center justify-center rounded border bg-background text-orange-600">🖨️</span>
                                                <span className="absolute -left-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Generación Automática:</strong> Al finalizar la asignación, puedes descargar el PDF listo para impresión o envío digital, con todos los campos reglamentarios del CBPA.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 2. Recepción de Material --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Acta de Recepción (Retorno)
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Cuando un voluntario deja la institución o devuelve material para recambio, se debe generar un **Acta de Recepción**. Este documento certifica que el material ha vuelto a los inventarios centrales y libera al voluntario de su responsabilidad.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Control de Estado</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Al recibir material, el sistema obliga a calificar el estado del equipo:
                        </p>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg border bg-green-50/50 border-green-200">
                                <div className="text-green-700 font-bold text-xs uppercase mb-1">Bueno</div>
                                <p className="text-[11px] text-green-700/70">Equipo apto para ser reasignado inmediatamente.</p>
                            </div>
                            <div className="p-4 rounded-lg border bg-orange-50/50 border-orange-200">
                                <div className="text-orange-700 font-bold text-xs uppercase mb-1">Regular</div>
                                <p className="text-[11px] text-orange-700/70">Requiere mantención preventiva antes de reasignar.</p>
                            </div>
                            <div className="p-4 rounded-lg border bg-red-50/50 border-red-200">
                                <div className="text-red-700 font-bold text-xs uppercase mb-1">Malo / Dañado</div>
                                <p className="text-[11px] text-red-700/70">Equipo para baja definitiva o reparación mayor.</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- Permisos --- */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">3. Roles y Firmas</h2>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3">Acción</th>
                                    <th className="p-3 text-center">Ayudante General</th>
                                    <th className="p-3 text-center">Secretaría Adquisiciones</th>
                                    <th className="p-3 text-center">Comandancia</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Emitir Certificado</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                </tr>
                                <tr className="border-t bg-muted/10">
                                    <td className="p-3 font-medium">Anular Certificado</td>
                                    <td className="p-3 text-center text-red-600">No</td>
                                    <td className="p-3 text-center text-red-600">No</td>
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
