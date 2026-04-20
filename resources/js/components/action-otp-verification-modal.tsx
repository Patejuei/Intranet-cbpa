import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { verify as otpVerify } from '@/routes/otp';
import { show as twoFactorShow } from '@/routes/two-factor';
import { usePage } from '@inertiajs/react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface ActionOtpVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified: () => void;
}

export default function ActionOtpVerificationModal({
    isOpen,
    onClose,
    onVerified,
}: ActionOtpVerificationModalProps) {
    const { auth, csrf_token } = usePage().props as any;
    const [code, setCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const isSetupRequired = !auth.user?.two_factor_confirmed_at;

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length < 6) return;

        setIsVerifying(true);
        setLocalError(null);
        try {
            const response = await fetch(otpVerify.url(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        csrf_token ||
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content ||
                        '',
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (response.ok) {
                // Success: just proceed
                onVerified();
                onClose();
                setCode('');
            } else {
                setLocalError(data.message || 'Error al verificar el código.');
            }
        } catch (error) {
            setLocalError(
                'Ocurrió un error inesperado al conectar con el servidor.',
            );
        } finally {
            setIsVerifying(false);
        }
    };

    const handleClose = () => {
        setLocalError(null);
        setCode('');
        onClose();
    };

    if (isSetupRequired) {
        return (
            <Dialog
                open={isOpen}
                onOpenChange={(open) => !open && handleClose()}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <ShieldCheck className="h-5 w-5" />
                            2FA Requerido
                        </DialogTitle>
                        <DialogDescription className="text-foreground">
                            Para realizar esta acción, es **obligatorio** tener
                            activada la autenticación de dos factores (2FA).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Esta es una medida de seguridad adicional para
                            proteger acciones sensibles en el sistema.
                        </p>
                    </div>
                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="w-full sm:w-auto"
                        >
                            Cerrar
                        </Button>
                        <Button
                            type="button"
                            className="w-full bg-primary sm:w-auto"
                            onClick={() => {
                                handleClose();
                                window.location.href = twoFactorShow.url();
                            }}
                        >
                            Ir a configurar 2FA
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        Verificación de Seguridad
                    </DialogTitle>
                    <DialogDescription>
                        Ingrese el código OTP de su aplicación para autorizar
                        esta acción.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleVerify} className="space-y-4 py-4">
                    {localError && (
                        <div className="mb-2 animate-in rounded-md border border-destructive/20 bg-destructive/15 p-3 text-sm text-destructive duration-200 fade-in zoom-in">
                            {localError}
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-1.5">
                        <Label htmlFor="otp-code">Código de 6 dígitos</Label>
                        <InputOTP
                            id="otp-code"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={code}
                            onChange={(value) => {
                                setLocalError(null);
                                setCode(value);
                            }}
                            className="h-14 font-mono text-2xl tracking-[0.5em]"
                            autoFocus
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isVerifying}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isVerifying || code.length < 6}
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verificando...
                                </>
                            ) : (
                                'Verificar y Continuar'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
