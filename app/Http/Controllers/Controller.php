<?php

namespace App\Http\Controllers;

abstract class Controller
{
    protected function validateOtp(\Illuminate\Http\Request $request)
    {
        $user = $request->user();

        // Use two_factor_confirmed_at to ensure it's fully active
        if (!$user->two_factor_confirmed_at) {
            if ($request->expectsJson()) {
                abort(response()->json([
                    'otp_setup_required' => true,
                    'message' => 'Debe activar la autenticación de dos factores para realizar esta acción.'
                ], 403));
            }
            
            abort(403, 'Debe activar la autenticación de dos factores para realizar esta acción.');
        }

        $lastVerifiedAt = $request->session()->get('otp_verified_at');
        $isRecentlyVerified = $lastVerifiedAt && (now()->timestamp - $lastVerifiedAt) < 300; // 5 minutes

        if (!$isRecentlyVerified) {
            if ($request->expectsJson()) {
                abort(response()->json([
                    'otp_required' => true,
                    'message' => 'Se requiere verificación OTP para esta acción.'
                ], 403));
            }
            
            abort(403, 'Se requiere verificación OTP para esta acción.');
        }
    }
}
