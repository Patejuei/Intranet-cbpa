import { usePage } from '@inertiajs/react';
import { useCallback, useState } from 'react';

// Declare global variable for window to avoid typescript errors
declare global {
    interface Window {
        __last_otp_verified_at?: number;
    }
}

/**
 * Hook to manage OTP verification before sensitive actions.
 */
export function useOtpAction() {
    const { auth, server_time } = usePage().props as any;
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    const performWithOtp = useCallback((action: () => void) => {
        // Now mandatory: if user doesn't have 2FA enabled, show modal to inform
        if (!auth?.user?.two_factor_confirmed_at) {
            setIsOtpModalOpen(true);
            return;
        }

        // Calculate if OTP is recently verified (within 5 mins)
        const nowSec = Date.now() / 1000;
        let isVerified = false;

        // 1. Check local verification timestamp
        if (window.__last_otp_verified_at) {
            const localElapsed = nowSec - window.__last_otp_verified_at;
            if (localElapsed >= 0 && localElapsed < 290) { // 290s to have a safety buffer (5 mins = 300s)
                isVerified = true;
            }
        }

        // 2. Check server verification timestamp with drift correction
        if (!isVerified && auth?.otp_verified_at && server_time) {
            const drift = server_time - nowSec;
            const estimatedServerNow = nowSec + drift;
            const serverElapsed = estimatedServerNow - auth.otp_verified_at;
            if (serverElapsed >= 0 && serverElapsed < 290) {
                isVerified = true;
            }
        }

        // 3. Fallback to auth.otp_verified (for backwards compatibility)
        if (!isVerified && auth?.otp_verified) {
            isVerified = true;
        }

        if (isVerified) {
            action();
            return;
        }

        // Need verification
        setPendingAction(() => action);
        setIsOtpModalOpen(true);
    }, [auth, server_time]);

    const handleVerified = useCallback(() => {
        if (typeof window !== 'undefined') {
            window.__last_otp_verified_at = Date.now() / 1000;
        }
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
