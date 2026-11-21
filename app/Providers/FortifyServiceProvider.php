<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Fortify::authenticateUsing(function (Request $request) {
            $rawInput = (string) $request->input('email', '');
            $input = trim($rawInput);
            $password = (string) $request->input('password', '');

            if ($input === '' || $password === '') {
                return null;
            }

            $user = null;

            // 1. Check if input is Email
            if (filter_var($input, FILTER_VALIDATE_EMAIL)) {
                $user = \App\Models\User::whereRaw('LOWER(email) = ?', [strtolower($input)])->first();
            } else {
                // 2. Treat as Chilean RUT
                // Strip all non-alphanumeric (removes spaces, dots, dashes, slashes, etc.)
                $rutClean = strtoupper(preg_replace('/[^0-9kK]/', '', $input));

                if (strlen($rutClean) > 1) {
                    $body = substr($rutClean, 0, -1);
                    $dv = substr($rutClean, -1);
                    $rutFormatted = $body . '-' . $dv;
                    $rutWithDots = (is_numeric($body) ? number_format((int)$body, 0, '', '.') : $body) . '-' . $dv;

                    $possibleFormats = array_unique([
                        $rutFormatted,
                        strtolower($rutFormatted),
                        $rutClean,
                        strtolower($rutClean),
                        $rutWithDots,
                        strtolower($rutWithDots),
                    ]);

                    $user = \App\Models\User::whereIn('rut', $possibleFormats)->first();

                    if (!$user) {
                        // Fallback matching in DB removing dots, hyphens, and spaces
                        $user = \App\Models\User::whereRaw(
                            "REPLACE(REPLACE(REPLACE(UPPER(rut), '.', ''), '-', ''), ' ', '') = ?",
                            [$rutClean]
                        )->first();
                    }
                } else {
                    $user = \App\Models\User::where('rut', $rutClean)
                        ->orWhere('rut', strtolower($rutClean))
                        ->first();
                }
            }

            if ($user && Hash::check($password, $user->password)) {
                if (!$user->is_enabled) {
                    throw ValidationException::withMessages([
                        Fortify::username() => 'Esta cuenta se encuentra deshabilitada. Contacte al administrador.',
                    ]);
                }
                return $user;
            }

            return null;
        });

        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn(Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'canRegister' => Features::enabled(Features::registration()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn(Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));

        Fortify::requestPasswordResetLinkView(fn(Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn(Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn() => Inertia::render('auth/register'));

        Fortify::twoFactorChallengeView(fn() => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn() => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())) . '|' . $request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}
