import { Settings, User } from 'lucide-react';
import { SectionHeader } from '../components/section-header';

export function ProfileSection() {
    return (
        <div>
            <SectionHeader
                title="Mi Perfil"
                icon={User}
                roles={['Todos los usuarios']}
            />
            <div className="space-y-12">
                {/* 1. Módulo Principal: Mi Perfil (/my-profile) */}
                <div className="space-y-8">
                    {/* Contexto */}
                    <section>
                        <h3 className="text-xl font-semibold">Contexto</h3>
                        <p className="mt-2 text-muted-foreground">
                            El módulo de <strong>Mi Perfil</strong> es tu
                            espacio principal dentro de la intranet. Aquí puedes
                            visualizar tus datos vinculados (rol, compañía,
                            estado de bombero), además de configurar tu Firma
                            Digital para la posterior validación de documentos
                            oficiales. Desde este apartado también tendrás un
                            punto de acceso directo a la configuración de
                            seguridad y cuenta.
                        </p>
                    </section>

                    {/* Quick Start */}
                    <section>
                        <h3 className="text-xl font-semibold">Quick Start</h3>
                        <ul className="mt-4 ml-6 list-decimal space-y-2 text-muted-foreground">
                            <li>
                                <strong>Accede a tu perfil:</strong> Haz clic en
                                el menú lateral o en tu nombre en la barra
                                superior y selecciona "Mi Perfil".
                            </li>
                            <li>
                                <strong>Verifica tus datos:</strong> Revisa que
                                tu rol y compañía (o estado de bombero
                                vinculado) sean correctos en tu tarjeta
                                principal.
                            </li>
                            <li>
                                <strong>Sube tu firma digital:</strong> En la
                                pestaña inferior, selecciona una imagen con tu
                                firma para usar en los reportes y actas
                                (opcional pero recomendado).
                            </li>
                        </ul>
                    </section>

                    {/* Detalle Visual (Mockup de Mi Perfil) */}
                    <section>
                        <h3 className="text-xl font-semibold">
                            Detalle Visual - Mi Perfil
                        </h3>
                        <p className="mt-2 mb-4 text-muted-foreground">
                            Conoce las áreas principales de tu perfil de
                            usuario:
                        </p>
                        <div className="relative overflow-hidden rounded-xl border bg-background shadow-sm">
                            {/* Fake UI Header/Card */}
                            <div className="relative flex h-32 items-center gap-6 border-b bg-muted/10 p-6">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 font-bold text-primary">
                                    JD
                                </div>
                                <div className="flex flex-1 flex-col gap-1">
                                    <div className="h-4 w-32 rounded bg-muted-foreground/30"></div>
                                    <div className="h-3 w-48 rounded bg-muted-foreground/20"></div>
                                    <div className="mt-1 h-4 w-24 rounded bg-green-200"></div>
                                </div>
                                <div className="flex h-8 w-28 items-center justify-center rounded border bg-background text-xs">
                                    Configuración
                                </div>
                                {/* Hotspot 1 */}
                                <span className="absolute top-6 left-6 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                    1
                                </span>
                                {/* Hotspot 2 */}
                                <span className="absolute top-12 right-6 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                    2
                                </span>
                            </div>
                            {/* Fake UI Body (Tabs) */}
                            <div className="relative bg-accent/5 p-6">
                                <div className="mb-4 flex gap-2 border-b pb-2">
                                    <div className="border-b-2 border-primary px-4 py-1 text-sm font-medium">
                                        Firma Digital
                                    </div>
                                    <div className="px-4 py-1 text-sm text-muted-foreground">
                                        Otras Opciones...
                                    </div>
                                </div>
                                <div className="flex h-24 w-full flex-col gap-2 rounded border bg-background p-4">
                                    <div className="h-3 w-32 rounded bg-muted-foreground/20"></div>
                                    <div className="h-8 w-full rounded border bg-muted/10"></div>
                                </div>
                                {/* Hotspot 3 */}
                                <span className="absolute top-8 left-6 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                    3
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    1
                                </span>
                                <span>
                                    <strong>Tarjeta de Identidad:</strong>{' '}
                                    Muestra tu rol, compañía y si tienes perfil
                                    de bombero validado.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    2
                                </span>
                                <span>
                                    <strong>Acceso a Configuración:</strong>{' '}
                                    Botón directo a tus opciones de cuenta y
                                    seguridad.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    3
                                </span>
                                <span>
                                    <strong>Pestañas de Acción:</strong>{' '}
                                    Administra firmas digitales, prendas u otras
                                    utilidades.
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Tabla de Roles */}
                    <section>
                        <h3 className="text-xl font-semibold">
                            Permisos por Rol
                        </h3>
                        <div className="mt-4 rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-3 text-left font-medium">
                                            Rol
                                        </th>
                                        <th className="p-3 text-left font-medium">
                                            Acceso a Mi Perfil
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="p-3 font-medium">
                                            Todos los Usuarios
                                        </td>
                                        <td className="p-3 text-muted-foreground">
                                            Pueden ver su perfil propio, subir
                                            firma y acceder a su configuración
                                            de cuenta.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                <hr className="border-border" />

                {/* 2. Submódulo: Configuración de Usuario (/settings/profile) */}
                <div className="space-y-8">
                    <section>
                        <h3 className="flex items-center gap-2 text-2xl font-bold">
                            <Settings className="h-6 w-6 text-primary" />
                            Configuración de Cuenta
                        </h3>
                        <p className="mt-2 text-muted-foreground">
                            Subcategoría dedicada a la gestión de credenciales,
                            activación de autenticación de dos pasos (2FA) y
                            personalización visual (modo oscuro/claro).
                        </p>
                    </section>

                    <section>
                        <h4 className="text-lg font-semibold">
                            Detalle Visual - Configuración
                        </h4>
                        <div className="relative mt-4 overflow-hidden rounded-xl border bg-background shadow-sm">
                            {/* Fake UI Header */}
                            <div className="flex h-12 items-center justify-between border-b bg-muted/20 px-6">
                                <div className="font-medium">
                                    Configuración de Cuenta
                                </div>
                            </div>
                            {/* Fake UI Body */}
                            <div className="flex h-56 bg-accent/10">
                                {/* Sidebar Mock */}
                                <div className="w-48 space-y-2 border-r p-4">
                                    <div className="group relative flex h-8 items-center rounded bg-primary/10 px-2 text-sm font-medium text-primary">
                                        Perfil
                                        <span className="absolute top-1/2 -left-2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            1
                                        </span>
                                    </div>
                                    <div className="relative flex h-8 items-center rounded bg-transparent px-2 text-sm text-muted-foreground">
                                        Autenticación de dos factores
                                        <span className="absolute top-1/2 -left-2 flex h-4 w-4 -translate-y-1/2 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                            2
                                        </span>
                                    </div>
                                </div>
                                {/* Content Mock */}
                                <div className="relative flex-1 p-6">
                                    <div className="mb-4 h-5 w-1/3 rounded bg-muted"></div>
                                    <div className="space-y-3">
                                        <div className="h-8 w-full rounded border bg-background"></div>
                                        <div className="h-8 w-full rounded border bg-background"></div>
                                        <div className="mt-2 ml-auto h-8 w-24 rounded bg-primary"></div>
                                    </div>
                                    <span className="absolute top-8 right-8 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-blue-500 text-[10px] text-white shadow ring-2 ring-background">
                                        3
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
                                    <strong>Pestaña Perfil:</strong> Edita tus
                                    datos personales como nombre y correo.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    2
                                </span>
                                <span>
                                    <strong>
                                        Autenticación de dos factores:
                                    </strong>{' '}
                                    Activa el 2FA para mayor seguridad.
                                </span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                                    3
                                </span>
                                <span>
                                    <strong>Área de Edición:</strong> Modifica
                                    la información y guarda los cambios.
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
