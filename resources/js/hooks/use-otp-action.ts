import { usePage } from '@inertiajs/react';
import { useCallback, useState } from 'react';

/**
 * Hook to manage OTP verification before sensitive actions.
 */
export function useOtpAction() {
    const { auth } = usePage().props as any;
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    const performWithOtp = useCallback((action: () => void) => {
        // Now mandatory: if user doesn't have 2FA enabled, show modal to inform
        if (!auth.user?.two_factor_confirmed_at) {
            setIsOtpModalOpen(true);
            return;
        }

        // Check if recently verified (within 5 mins)
        if (auth.otp_verified) {
            action();
            return;
        }

        // Need verification
        setPendingAction(() => action);
        setIsOtpModalOpen(true);
    }, [auth]);

    const handleVerified = useCallback(() => {
        if (pendingAction) {
            pendingAction();
            setPendingAction(null);
        }
    }, [pendingAction]);

    const closeOtpModal = useCallback(() => {
        setIsOtpModalOpen(false);
        setPendingAction(null);
    }, []);

    return {
        isOtpModalOpen,
        performWithOtp,
        handleVerified,
        closeOtpModal,
    };
}
