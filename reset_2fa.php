<?php
// Script to reset 2FA for a specific user - run once and delete!

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

// Change this to the user's email
$email = 'user@test.cl'; 

$user = User::where('email', $email)->first();
if (!$user) {
    echo "User not found: $email\n";
    exit(1);
}

echo "Resetting 2FA for: " . $user->email . "\n";
echo "Old secret: " . ($user->two_factor_secret ? decrypt($user->two_factor_secret) : 'none') . "\n";

// Reset all 2FA fields
$user->two_factor_secret = null;
$user->two_factor_recovery_codes = null;
$user->two_factor_confirmed_at = null;
$user->save();

echo "2FA reset successfully. The user must now go to Settings > Two-Factor Auth and enable it again.\n";
