import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { type HTMLAttributes } from 'react';

const formatErrorMessage = (msg?: string) => {
    if (!msg) return '';
    if (msg === 'auth.failed' || msg === 'auth.invalid') {
        return 'Las credenciales ingresadas son incorrectas o no coinciden con nuestros registros.';
    }
    if (msg === 'auth.throttle') {
        return 'Demasiados intentos de acceso fallidos. Por favor, intente nuevamente en unos momentos.';
    }
    if (msg === 'auth.password') {
        return 'La contraseña proporcionada es incorrecta.';
    }
    return msg;
};

export default function InputError({
    message,
    className = '',
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    const text = formatErrorMessage(message);

    return text ? (
        <p
            role="alert"
            {...props}
            className={cn(
                'flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in-50 slide-in-from-top-0.5',
                className,
            )}
        >
            <AlertCircle className="size-3.5 shrink-0 text-destructive/90" />
            <span className="leading-tight">{text}</span>
        </p>
    ) : null;
}
