<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use PragmaRX\Google2FA\Google2FA;

// Query real time via NTP
function getNtpTime($server = 'pool.ntp.org')
{
    $sock = @fsockopen('udp://' . $server, 123, $errno, $errstr, 3);
    if (!$sock) return null;
    
    $msg = "\010" . str_repeat("\0", 47);
    fwrite($sock, $msg);
    stream_set_timeout($sock, 3);
    $response = fread($sock, 48);
    fclose($sock);
    
    if (strlen($response) < 48) return null;
    
    $data = unpack('N12', $response);
    $timestamp = $data[9] - 2208988800; // Convert from 1900 epoch to 1970 epoch
    return $timestamp;
}

$serverTs  = time();
$realTs    = getNtpTime();
$offset    = $realTs ? ($realTs - $serverTs) : null;

echo "=== CLOCK COMPARISON ===\n";
echo "Server (PHP time())  : " . $serverTs . " → " . gmdate('Y-m-d H:i:s', $serverTs) . " UTC\n";
if ($realTs) {
    echo "NTP real time        : " . $realTs . " → " . gmdate('Y-m-d H:i:s', $realTs) . " UTC\n";
    echo "Offset               : " . $offset . " seconds (" . round($offset / 60, 1) . " minutes)\n";
    echo "Server clock is      : " . ($offset > 0 ? abs($offset) . "s BEHIND" : abs($offset) . "s AHEAD") . " real time\n";
} else {
    echo "NTP query failed (no internet or UDP blocked)\n";
    echo "Server time          : " . gmdate('Y-m-d H:i:s', $serverTs) . " UTC\n";
}

// Now brute-force find the offset using the user's OTP
$user   = User::whereNotNull('two_factor_secret')->first();
$secret = decrypt($user->two_factor_secret);
$g      = new Google2FA();

echo "\n=== BRUTE-FORCE FIND CLOCK OFFSET FROM LAST CODE ===\n";
$lastCode = '780448'; // The code user got from authenticator earlier

echo "Searching for '$lastCode' in ±24 hours...\n";
$found = false;
for ($i = -2880; $i <= 2880; $i++) {
    $ts  = $serverTs + ($i * 30);
    $ref = $realTs ? ($realTs + ($i * 30)) : null;
    
    // Manually compute TOTP
    $counter = floor($ts / 30);
    $hmac    = hash_hmac('sha1', pack('N*', 0) . pack('N*', $counter), base_convert($secret, 32, 16), true);
    
    // Use the library's verify approach instead
    $g->setWindow(0);
    // We can't pass timestamp directly, so use verifyKeyNewer trick
    break; // Skip this approach
}

// Better approach: use known good code to find offset
echo "Please enter the CURRENT code from your authenticator app: ";
$code = trim(fgets(STDIN));

// Search using NTP-corrected time first
$baseTs = $realTs ?? $serverTs;
echo "\nSearching in a ±24h range...\n";
for ($i = -2880; $i <= 2880; $i++) {
    $counter = floor(($baseTs + ($i * 30)) / 30);
    $hmac = hash_hmac('sha1', pack('J', $counter), base32_decode($secret), true);
    $offset_b = ord($hmac[strlen($hmac) - 1]) & 0x0F;
    $otp = (
        ((ord($hmac[$offset_b]) & 0x7F) << 24) |
        ((ord($hmac[$offset_b + 1]) & 0xFF) << 16) |
        ((ord($hmac[$offset_b + 2]) & 0xFF) << 8) |
        (ord($hmac[$offset_b + 3]) & 0xFF)
    ) % 1000000;
    
    if (str_pad($otp, 6, '0', STR_PAD_LEFT) === $code) {
        $diffSecs = $i * 30;
        echo "✓ FOUND! Clock offset = " . $diffSecs . " seconds (" . round(abs($diffSecs)/60,1) . " min " . ($diffSecs >= 0 ? "AHEAD" : "BEHIND") . ")\n";
        $found = true;
        break;
    }
}
if (!$found) {
    echo "✗ Not found. The secret may truly not match.\n";
}

function base32_decode($data)
{
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $data  = strtoupper($data);
    $bits  = '';
    for ($i = 0; $i < strlen($data); $i++) {
        $val  = strpos($chars, $data[$i]);
        $bits .= str_pad(decbin($val), 5, '0', STR_PAD_LEFT);
    }
    $result = '';
    for ($i = 0; $i + 8 <= strlen($bits); $i += 8) {
        $result .= chr(bindec(substr($bits, $i, 8)));
    }
    return $result;
}
