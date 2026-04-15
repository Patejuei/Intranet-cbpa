<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OtpVerificationController extends Controller
{
    /**
     * Verify the given OTP code.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $user = $request->user();

        if (!$user->two_factor_secret) {
            return response()->json([
                'message' => 'La autenticación de dos factores no está habilitada.',
            ], 403);
        }

        $secret = decrypt($user->two_factor_secret);
        $code   = $request->input('code');

        // Use google2fa directly with an explicit window for flexibility
        $google2fa = app(\PragmaRX\Google2FA\Google2FA::class);
        $google2fa->setWindow(4); // Allow ±2 minutes drift

        $timestamp = $google2fa->verifyKeyNewer($secret, $code, null);
        $isValid   = $timestamp !== false;

        if (!$isValid) {
            return response()->json([
                'message' => 'Código OTP inválido.',
                'errors' => ['code' => ['El código ingresado es incorrecto.']]
            ], 422);
        }

        // Store verification in session
        $request->session()->put('otp_verified_at', now()->timestamp);

        return response()->json([
            'message' => 'Verificación exitosa.',
        ]);
    }

    /**
     * Check if the user is currently verified.
     */
    public function check(Request $request)
    {
        $lastVerifiedAt = $request->session()->get('otp_verified_at');
        
        if ($lastVerifiedAt && (now()->timestamp - $lastVerifiedAt) < 300) {
            return response()->json(['verified' => true]);
        }

        return response()->json(['verified' => false]);
    }
}
