import { Settings, User, User as UserIcon, Signature, ShieldCheck } from 'lucide-react';
import { SectionHeader } from '../components/section-header';

export function ProfileSection() {
    return (
        <div>
            <SectionHeader
                title="Mi Perfil"
                icon={User}
                roles={['Todos los usuarios']}
            />
            <div className="space-y-16">
                {/* 1. Módulo Principal: Mi Perfil */}
                <div className="space-y-8">
                    <section>
                        <h2 className="border-b pb-2 text-2xl font-bold tracking-tight">
                            1. Mi Perfil e Identidad Digital
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Este es tu centro de identidad en la Intranet. Aquí no solo visualizas tu información institucional (Compañía, Rol, Cargo), sino que también gestionas tu <strong>Firma Digital</strong>, requisito indispensable para validar documentos y checklists mediante códigos de seguridad (OTP).
                        </p>
                    </section>

                    {/* Quick Start */}
                    <section>
                        <h3 className="text-xl font-semibold">Acciones Rápidas</h3>
                        <ul className="mt-4 ml-6 list-decimal space-y-2 text-muted-foreground">
                            <li>
                                <strong>Identidad:</strong> Verifica que tu Compañía y Rol coincidan con tu estado actual en el Cuerpo.
                            </li>
                            <li>
                                <strong>Perfil de Bombero:</strong> Revisa el estado de vinculación con tu ficha oficial de bombero (RUT/Email).
                            </li>
                            <li>
                                <strong>Firma Digital:</strong> Sube tu firma para usar en reportes y visaciones electrónicas.
                            </li>
                        </ul>
                    </section>

                    {/* Detalle Visual - My Profile */}
                    <section>
                        <h3 className="text-xl font-semibold">Detalle Visual - Mi Perfil (/my-profile)</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md max-w-4xl mx-auto">
                            {/* Profile Header Card Mockup */}
                            <div className="p-6 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left border-b relative">
                                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground border">
                                    JD
                                </div>
                                <div className="flex flex-col items-center space-y-1 sm:items-start flex-1">
                                    <div className="text-2xl font-bold">Juan Delgado</div>
                                    <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
                                        <UserIcon className="h-4 w-4" />
                                        <span className="font-medium">Maquinista</span>
                                        <span>•</span>
                                        <span>Primera Compañía</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">j.delgado@cbpa.cl</div>
                                    <div className="mt-2 inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                                        Perfil de Bombero Vinculado
                                    </div>
                                </div>
                                <div className="mt-4 sm:absolute sm:top-6 sm:right-6 sm:mt-0">
                                    <div className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm gap-2">
                                        <Settings className="h-4 w-4" /> Configuración
                                    </div>
                                </div>
                                <span className="absolute top-2 left-2 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                            </div>

                            {/* Tabs Mockup */}
                            <div className="p-6 bg-muted/5">
                                <div className="flex w-full lg:w-[400px] bg-muted p-1 rounded-lg gap-1 mb-4">
                                    <div className="flex-1 bg-background text-foreground shadow-sm rounded-md px-3 py-1.5 text-sm font-medium text-center">Firma Digital</div>
                                </div>
                                
                                {/* Signature Content */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm relative">
                                    <div className="p-6 space-y-1">
                                        <div className="font-semibold leading-none tracking-tight flex items-center gap-2">
                                            <Signature className="h-5 w-5" /> Firma Digital
                                        </div>
                                        <div className="text-sm text-muted-foreground">Configuración de firma digital.</div>
                                    </div>
                                    <div className="p-6 pt-0 space-y-6">
                                        <div className="grid gap-2">
                                            <div className="text-sm font-medium leading-none">Subir nueva firma (Imagen)</div>
                                            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background text-muted-foreground italic">Seleccionar archivo...</div>
                                            <div className="mt-2">
                                                <div className="text-sm text-muted-foreground mb-1">Firma actual:</div>
                                                <div className="h-32 w-full max-w-md rounded border border-gray-200 bg-white object-contain flex items-center justify-center italic text-muted-foreground">
                                                    [Previsualización de Firma]
                                                </div>
                                            </div>
                                        </div>
                                        <div className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow">Guardar Firma</div>
                                    </div>
                                    <span className="absolute top-4 left-[-10px] flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Header Institucional:</strong> Muestra tu identidad oficial. El estado "Vinculado" asegura que tus reportes se asocien correctamente a tu hoja de vida.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Gestión de Firma:</strong> Sube una imagen (PNG/JPG) de tu firma manuscrita. Se usará para firmar visualmente documentos.</span>
                            </div>
                        </div>
                    </section>
                </div>

                <hr className="border-border" />

                {/* 2. Configuración de Cuenta */}
                <div className="space-y-8">
                    <section>
                        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <Settings className="h-6 w-6 text-primary" />
                            2. Configuración y Seguridad (/settings)
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Panel dedicado a la gestión de credenciales, protección mediante 2FA y datos básicos del usuario. Se divide en sub-apartados accesibles desde el menú lateral de configuración.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold">Perfil y Seguridad 2FA</h3>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-md max-w-4xl mx-auto flex h-[450px]">
                            {/* Settings Sidebar */}
                            <div className="w-56 border-r bg-muted/5 p-4 space-y-1 relative">
                                <div className="text-xs font-bold text-muted-foreground px-3 mb-2 uppercase tracking-wider">Ajustes</div>
                                <div className="h-8 rounded bg-primary/10 text-primary px-3 text-xs font-bold flex items-center">Perfil</div>
                                <div className="h-8 rounded text-muted-foreground px-3 text-xs font-medium flex items-center">Autenticación de 2 Factores</div>
                                <span className="absolute top-8 left-2 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">1</span>
                            </div>
                            
                            {/* Settings Content */}
                            <div className="flex-1 p-8 space-y-10 relative overflow-y-auto">
                                {/* RUT Section */}
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <div className="text-sm font-bold">Información del perfil</div>
                                        <div className="text-xs text-muted-foreground italic">Actualice su RUT</div>
                                    </div>
                                    <div className="grid gap-1.5 max-w-sm">
                                        <div className="text-xs font-medium">RUT</div>
                                        <div className="h-9 w-full rounded border border-input bg-background px-3 flex items-center text-xs">12.345.678-9</div>
                                    </div>
                                    <div className="h-8 w-20 rounded bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow">Guardar</div>
                                </div>

                                {/* 2FA Section Mock */}
                                <div className="pt-8 border-t space-y-4">
                                    <div className="space-y-1">
                                        <div className="text-sm font-bold">Autenticación de Dos Factores</div>
                                        <div className="text-xs text-muted-foreground">Añade una capa extra de seguridad.</div>
                                    </div>
                                    <div className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                                        Deshabilitado
                                    </div>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        Cuando habilite la autenticación de dos factores, se le solicitará un PIN durante el inicio de sesión.
                                    </p>
                                    <div className="h-9 px-4 rounded bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 w-fit shadow">
                                        <ShieldCheck className="h-3.5 w-3.5" /> Habilitar 2FA
                                    </div>
                                </div>
                                <span className="absolute top-8 right-8 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">2</span>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">1</span>
                                <span><strong>Navegación:</strong> Cambia entre las distintas pestañas de configuración.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">2</span>
                                <span><strong>Seguridad 2FA:</strong> Sigue el asistente para escanear el código QR con una App como Google Authenticator o Authy.</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

