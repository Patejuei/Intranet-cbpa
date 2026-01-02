import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Shield } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Bienvenidos" />
            <div className="flex min-h-screen flex-col bg-background text-foreground">
                <header className="flex h-16 items-center justify-between border-b px-6 lg:px-12">
                    <div className="flex items-center gap-2 font-bold text-primary">
                        <Shield className="size-6" />
                        <span>Intranet CBPA</span>
                    </div>
                    <nav>
                        {auth.user ? (
                            <Link href="/dashboard">
                                <Button>Ir al Panel</Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button>Iniciar Sesión</Button>
                            </Link>
                        )}
                    </nav>
                </header>

                <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                    <div className="mx-auto max-w-2xl space-y-6">
                        <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-primary/10">
                            <Shield className="size-12 text-primary" />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                            Cuerpo de Bomberos de{' '}
                            <span className="text-primary">Puente Alto</span>
                        </h1>
                        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                            Plataforma de gestión interna para el control de
                            inventario, material menor y bitácoras.
                        </p>
                        <div className="flex justify-center gap-4">
                            {auth.user ? (
                                <Link href="/dashboard">
                                    <Button
                                        size="lg"
                                        className="h-12 px-8 text-lg"
                                    >
                                        Acceder al Sistema
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/login">
                                    <Button
                                        size="lg"
                                        className="h-12 px-8 text-lg"
                                    >
                                        Ingresar
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </main>

                <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} Cuerpo de Bomberos de
                        Puente Alto. Todos los derechos reservados.
                    </p>
                </footer>
            </div>
        </>
    );
}
