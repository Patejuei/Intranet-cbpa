import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { edit as editPassword } from '@/routes/user-password';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import {
    Form,
    Head,
    Link,
    useForm as useInertiaForm,
    usePage,
} from '@inertiajs/react';
import { Check, FileSignature, KeyRound, Shield, Upload } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración de perfil',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors, recentlySuccessful } =
        useInertiaForm({
            _method: 'PATCH',
            signature: null as File | null,
        });

    const submitSignature = (e: React.FormEvent) => {
        e.preventDefault();
        post(ProfileController.update.url(), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración de Perfil" />

            <SettingsLayout>
                <div className="space-y-6">
                    {/* Basic Info */}
                    <Card className="rounded-2xl border border-border/70 shadow-xs">
                        <CardContent className="p-6 space-y-5">
                            <HeadingSmall
                                title="Información Personal"
                                description="Verifique o actualice su RUT y antecedentes institucionales."
                            />

                            <Form
                                {...ProfileController.update.form()}
                                options={{
                                    preserveScroll: true,
                                }}
                                className="space-y-5"
                            >
                                {({ processing, recentlySuccessful, errors }) => (
                                    <>
                                        <div className="grid gap-2 max-w-md">
                                            <Label htmlFor="rut" className="text-sm font-medium text-foreground">
                                                RUT Institucional
                                            </Label>
                                            <Input
                                                id="rut"
                                                className="h-10 text-sm"
                                                defaultValue={auth.user.rut ?? ''}
                                                name="rut"
                                                autoComplete="off"
                                                placeholder="Ej: 12345678-9"
                                            />
                                            <InputError
                                                className="mt-1"
                                                message={errors.rut}
                                            />
                                        </div>

                                        {mustVerifyEmail &&
                                            auth.user.email_verified_at === null && (
                                                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-200">
                                                    Su dirección de correo electrónico no está verificada.{' '}
                                                    <Link
                                                        href={send()}
                                                        as="button"
                                                        className="font-semibold underline underline-offset-4 hover:opacity-80"
                                                    >
                                                        Haga clic aquí para reenviar el correo de verificación.
                                                    </Link>
                                                    {status === 'verification-link-sent' && (
                                                        <div className="mt-2 font-medium text-emerald-600 dark:text-emerald-400">
                                                            Se ha enviado un nuevo enlace de verificación a su casilla de correo.
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        <div className="flex items-center gap-3 pt-2">
                                            <Button
                                                disabled={processing}
                                                data-test="update-profile-button"
                                                className="shadow-xs gap-2"
                                            >
                                                <span>Guardar RUT</span>
                                            </Button>

                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out duration-200"
                                                enterFrom="opacity-0 translate-x-1"
                                                leave="transition ease-in-out duration-300"
                                                leaveTo="opacity-0"
                                            >
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                    <Check className="size-3.5" />
                                                    Guardado correctamente
                                                </span>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Signature Form */}
                    <Card className="rounded-2xl border border-border/70 shadow-xs">
                        <CardContent className="p-6 space-y-5">
                            <HeadingSmall
                                title="Firma Digital"
                                description="Suba una imagen clara de su firma para timbres y actas del sistema."
                            />

                            <form onSubmit={submitSignature} className="space-y-5">
                                <div className="grid gap-2 max-w-md">
                                    <Label htmlFor="signature" className="text-sm font-medium text-foreground">
                                        Subir nueva firma (Imagen PNG o JPG)
                                    </Label>
                                    <Input
                                        id="signature"
                                        type="file"
                                        className="h-10 text-sm cursor-pointer"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setData('signature', e.target.files[0]);
                                            }
                                        }}
                                    />
                                    {auth.user.signature_path && (
                                        <div className="mt-3 space-y-1.5">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Firma actual registrada:
                                            </span>
                                            <div className="w-fit rounded-xl border border-border/70 bg-white p-3 shadow-xs">
                                                <img
                                                    src={`/${auth.user.signature_path}?t=${Date.now()}`}
                                                    alt="Firma actual"
                                                    className="h-14 max-w-[200px] object-contain"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <InputError className="mt-1" message={errors.signature} />
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <Button disabled={processing} className="shadow-xs gap-2">
                                        <Upload className="size-4" />
                                        <span>Guardar Firma</span>
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out duration-200"
                                        enterFrom="opacity-0 translate-x-1"
                                        leave="transition ease-in-out duration-300"
                                        leaveTo="opacity-0"
                                    >
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                            <Check className="size-3.5" />
                                            Firma guardada
                                        </span>
                                    </Transition>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Security Shortcut */}
                    <Card className="rounded-2xl border border-border/70 shadow-xs">
                        <CardContent className="p-6">
                            <HeadingSmall
                                title="Seguridad de la Cuenta"
                                description="Administre su contraseña de acceso y mantenga su sesión protegida."
                            />
                            <div className="mt-4 flex flex-col gap-4 rounded-xl border border-border/60 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-foreground">
                                        Contraseña de acceso
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Puede actualizar su clave en cualquier momento para mantener la privacidad de su cuenta.
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" asChild className="gap-2 shadow-xs shrink-0">
                                    <Link href={editPassword().url}>
                                        <KeyRound className="size-3.5" />
                                        <span>Cambiar Contraseña</span>
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}