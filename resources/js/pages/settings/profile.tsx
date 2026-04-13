import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
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

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

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
            <Head title="Configuración de perfil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Información del perfil"
                        description="Actualice su RUT"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="rut">RUT</Label>

                                    <Input
                                        id="rut"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.rut ?? ''}
                                        name="rut"
                                        autoComplete="off"
                                        placeholder="Ej: 12345678-9"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.rut}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Su dirección de correo
                                                electrónico no está verificada.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Haga clic aquí para reenviar
                                                    el correo de verificación.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    Se ha enviado un nuevo
                                                    enlace de verificación a su
                                                    dirección de correo
                                                    electrónico.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Guardar
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Guardado
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>

                    {/* Separate Signature Form */}
                    <div className="border-t border-gray-200 pt-6">
                        <HeadingSmall
                            title="Firma Digital"
                            description="Suba una imagen de su firma para usar en documentos"
                        />
                        <form
                            onSubmit={submitSignature}
                            className="mt-6 space-y-6"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="signature">
                                    Subir nueva firma (Imagen)
                                </Label>
                                <Input
                                    id="signature"
                                    type="file"
                                    className="mt-1 block w-full"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (
                                            e.target.files &&
                                            e.target.files[0]
                                        ) {
                                            setData(
                                                'signature',
                                                e.target.files[0],
                                            );
                                        }
                                    }}
                                />
                                {auth.user.signature_path && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Firma actual:
                                        </p>
                                        <img
                                            src={`/${auth.user.signature_path}?t=${Date.now()}`} // Cache buster
                                            alt="Firma actual"
                                            className="h-16 rounded border border-gray-200 object-contain p-1"
                                        />
                                    </div>
                                )}
                                <InputError
                                    className="mt-2"
                                    message={errors.signature}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>
                                    Guardar Firma
                                </Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">
                                        Firma Guardada
                                    </p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
