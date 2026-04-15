<?php
require __DIR__ . '/vendor/autoload.php';

$g = new PragmaRX\Google2FA\Google2FA();

// Test with a known-good secret (32 chars)
$secret = $g->generateSecretKey(32);
echo "Generated secret: " . $secret . "\n";

$otp1 = $g->getCurrentOtp($secret);
echo "OTP at t=0: " . $otp1 . "\n";

// Force different time slot
$otp2 = $g->getCurrentOtp($secret, time() + 30);
echo "OTP at t+30s: " . $otp2 . "\n";

echo "Are they different? " . ($otp1 !== $otp2 ? "YES (correct TOTP)" : "NO (BROKEN)") . "\n";

echo "\n--- With the old 16-char secret ---\n";
$badSecret = 'YXP2S7ET25ITIKWD'; // 16 chars
$otp3 = $g->getCurrentOtp($badSecret);
$otp4 = $g->getCurrentOtp($badSecret, time() + 30);
echo "OTP at t=0:   " . $otp3 . "\n";
echo "OTP at t+30s: " . $otp4 . "\n";
echo "Are they different? " . ($otp3 !== $otp4 ? "YES" : "NO (BROKEN - 16 char secret issue)") . "\n";

echo "\n--- CONCLUSION ---\n";
echo "Length of bad secret: " . strlen($badSecret) . " bytes\n";
echo "Base32 decoded length: " . strlen(base64_decode(strtr($badSecret, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567', 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef'))) . " bytes\n";
