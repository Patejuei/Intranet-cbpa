import { Ticket, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '../../components/section-header';

export function EqTicketsSection() {
    return (
        <div>
            <SectionHeader
                title="Soporte Técnico (Tickets)"
                icon={Ticket}
                roles={['Todos los usuarios', 'Administración IT', 'Comandancia']}
            />
            
            <div className="space-y-16">
                
                {/* --- 1. Gestión de Tickets --- */}
                <div className="space-y-8">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        1. Creación y Seguimiento
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El módulo de <strong>Tickets</strong> es el canal oficial para reportar problemas técnicos, solicitar nuevos usuarios o requerir soporte en el uso de la Intranet. Cada ticket genera una traza de comunicación entre el usuario y el equipo de soporte.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-sm max-w-4xl mx-auto">
                            <div className="border-b bg-muted/10 p-4 flex justify-between items-center">
                                <div className="font-bold text-lg">Mis Tickets de Soporte</div>
                                <div className="flex h-8 items-center rounded bg-primary px-3 text-xs font-medium text-white">+ Nuevo Ticket</div>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-lg border bg-background hover:bg-muted/5 transition-colors relative">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Ticket className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">Error al subir certificado</span>
                                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">ABIERTO</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">Creado hace 2 horas por Juan Pérez</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-medium text-muted-foreground">Prioridad</div>
                                        <div className="text-xs font-bold text-red-600">ALTA</div>
                                    </div>
                                    <span className="absolute -left-2 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/20 opacity-70">
                                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold line-through">Recuperación de contraseña</span>
                                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">RESUELTO</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">Cerrado ayer</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Estado del Ticket:</strong> Los tickets pueden estar en estado: Abierto (recién creado), En Proceso (asignado a un técnico), o Resuelto (finalizado).</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- 2. Chat de Soporte --- */}
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                        2. Comunicación y Resolución
                    </h2>

                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            Dentro de cada ticket existe un sistema de mensajería para adjuntar evidencias (pantallazos) y recibir instrucciones del administrador.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Interfaz de Mensajería</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md max-w-2xl mx-auto p-4 space-y-4">
                            <div className="space-y-4">
                                <div className="flex justify-start">
                                    <div className="bg-muted p-3 rounded-lg max-w-[80%] text-sm">
                                        Hola, no puedo subir el PDF de la factura, me sale un error 500.
                                        <div className="text-[10px] mt-1 text-muted-foreground italic text-right">Hace 10 min</div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%] text-sm relative">
                                        Entendido Juan. Por favor, revisa que el archivo no pese más de 2MB.
                                        <div className="text-[10px] mt-1 text-primary-foreground/70 italic text-right">Hace 5 min</div>
                                        <span className="absolute -right-3 top-1/2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 border-t pt-4">
                                <div className="flex-1 h-9 rounded border bg-muted/10 px-3 text-sm flex items-center text-muted-foreground italic">Escriba un mensaje...</div>
                                <div className="h-9 w-9 rounded bg-primary flex items-center justify-center text-white">✈️</div>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Historial de Conversación:</strong> Todos los mensajes quedan guardados, lo que permite que diferentes administradores puedan retomar el caso con todo el contexto.</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* --- Permisos --- */}
                <div className="space-y-4 pt-8 border-t">
                    <h2 className="text-xl font-semibold">3. Roles y Visibilidad</h2>
                    <div className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3">Acción</th>
                                    <th className="p-3 text-center">Usuario Común</th>
                                    <th className="p-3 text-center">Oficial de Compañía</th>
                                    <th className="p-3 text-center">Soporte IT / Admin</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Crear Ticket</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Sí</td>
                                </tr>
                                <tr className="border-t bg-muted/10">
                                    <td className="p-3 font-medium">Ver Tickets Ajenos</td>
                                    <td className="p-3 text-center text-red-600">No</td>
                                    <td className="p-3 text-center text-blue-600">Solo su Cía</td>
                                    <td className="p-3 text-center text-green-600 font-bold">Global</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3 font-medium">Cambiar Estado / Cerrar</td>
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
