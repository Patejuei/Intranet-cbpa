import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/user-password';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { Check, KeyRound } from 'lucide-react';
import { useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración de contraseña',
        href: edit().url,
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Actualizar Contraseña" />

            <SettingsLayout>
                <Card className="rounded-2xl border border-border/70 shadow-xs">
                    <CardContent className="p-6 space-y-6">
                        <HeadingSmall
                            title="Actualizar Contraseña"
                            description="Utilice una contraseña segura de al menos 8 caracteres para proteger su cuenta institucional."
                        />

                        <Form
                            {...PasswordController.update.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnError={[
                                'password',
                                'password_confirmation',
                                'current_password',
                            ]}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) {
                                    passwordInput.current?.focus();
                                }

                                if (errors.current_password) {
                                    currentPasswordInput.current?.focus();
                                }
                            }}
                            className="space-y-5"
                        >
                            {({ errors, processing, recentlySuccessful }) => (
                                <>
                                    <div className="grid gap-2 max-w-md">
                                        <Label htmlFor="current_password" className="text-sm font-medium text-foreground">
                                            Contraseña Actual
                                        </Label>
                                        <Input
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            type="password"
                                            className="h-10 text-sm"
                                            autoComplete="current-password"
                                            placeholder="Ingrese su contraseña actual"
                                        />
                                        <InputError
                                            className="mt-1"
                                            message={errors.current_password}
                                        />
                                    </div>

                                    <div className="grid gap-2 max-w-md">
                                        <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                            Nueva Contraseña
                                        </Label>
                                        <Input
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            type="password"
                                            className="h-10 text-sm"
                                            autoComplete="new-password"
                                            placeholder="Ingrese su nueva contraseña"
                                        />
                                        <InputError className="mt-1" message={errors.password} />
                                    </div>

                                    <div className="grid gap-2 max-w-md">
                                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-foreground">
                                            Confirmar Nueva Contraseña
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            className="h-10 text-sm"
                                            autoComplete="new-password"
                                            placeholder="Repita su nueva contraseña"
                                        />
                                        <InputError
                                            className="mt-1"
                                            message={errors.password_confirmation}
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <Button
                                            disabled={processing}
                                            data-test="update-password-button"
                                            className="gap-2 shadow-xs"
                                        >
                                            <KeyRound className="size-4" />
                                            <span>Actualizar Contraseña</span>
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
                                                Contraseña actualizada
                                            </span>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </SettingsLayout>
        </AppLayout>
    );
}