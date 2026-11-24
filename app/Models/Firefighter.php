<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Firefighter extends Model
{
    use HasFactory;

    private const SURNAME_PARTICLES = ['DE', 'DEL', 'LA', 'LAS', 'LOS', 'SAN', 'SANTA'];

    protected $fillable = [
        'general_registry_number',
        'first_name',
        'middle_name',
        'paternal_last_name',
        'maternal_last_name',
        'full_name',
        'rut',
        'company',
        'email',
    ];

    protected static function booted(): void
    {
        static::saving(function (Firefighter $firefighter) {
            if (filled($firefighter->first_name)) {
                $firefighter->full_name = static::buildFullName([
                    'first_name' => $firefighter->first_name,
                    'middle_name' => $firefighter->middle_name,
                    'paternal_last_name' => $firefighter->paternal_last_name,
                    'maternal_last_name' => $firefighter->maternal_last_name,
                ]);
            } elseif (filled($firefighter->full_name)) {
                $parts = static::splitFullName($firefighter->full_name);
                $firefighter->first_name = $parts['first_name'];
                $firefighter->middle_name = $parts['middle_name'];
                $firefighter->paternal_last_name = $parts['paternal_last_name'];
                $firefighter->maternal_last_name = $parts['maternal_last_name'];
                $firefighter->full_name = static::buildFullName($parts);
            }
        });
    }

    /**
     * Split a full name into first_name, middle_name (including extra given names),
     * paternal_last_name, and maternal_last_name.
     *
     * @return array{first_name: string, middle_name: string|null, paternal_last_name: string, maternal_last_name: string}
     */
    public static function splitFullName(string $fullName): array
    {
        $normalized = preg_replace('/\s+/', ' ', trim($fullName)) ?? '';
        if ($normalized === '') {
            return [
                'first_name' => '',
                'middle_name' => null,
                'paternal_last_name' => '',
                'maternal_last_name' => '',
            ];
        }

        $tokens = explode(' ', $normalized);
        $count = count($tokens);

        if ($count === 1) {
            return [
                'first_name' => $tokens[0],
                'middle_name' => null,
                'paternal_last_name' => '',
                'maternal_last_name' => '',
            ];
        }

        if ($count === 2) {
            return [
                'first_name' => $tokens[0],
                'middle_name' => null,
                'paternal_last_name' => $tokens[1],
                'maternal_last_name' => '',
            ];
        }

        $maternalLastName = static::extractLastNameFromRight($tokens, 2);
        $paternalLastName = static::extractLastNameFromRight($tokens, 1);

        $firstName = array_shift($tokens) ?? '';
        $middleName = count($tokens) > 0 ? implode(' ', $tokens) : null;

        return [
            'first_name' => $firstName,
            'middle_name' => $middleName,
            'paternal_last_name' => $paternalLastName,
            'maternal_last_name' => $maternalLastName,
        ];
    }

    /**
     * Build normalized full_name from separated name parts.
     *
     * @param  array{first_name?: string|null, middle_name?: string|null, paternal_last_name?: string|null, maternal_last_name?: string|null}  $parts
     */
    public static function buildFullName(array $parts): string
    {
        $ordered = [
            $parts['first_name'] ?? null,
            $parts['middle_name'] ?? null,
            $parts['paternal_last_name'] ?? null,
            $parts['maternal_last_name'] ?? null,
        ];

        $filtered = array_filter(
            array_map(fn ($value) => is_string($value) ? trim($value) : '', $ordered),
            fn ($value) => $value !== ''
        );

        return implode(' ', $filtered);
    }

    /**
     * Pop a surname (including leading particles like DEL, DE, SAN) from the end of tokens.
     *
     * @param  array<int, string>  $tokens
     */
    private static function extractLastNameFromRight(array &$tokens, int $minRemainingTokens): string
    {
        $lastNameParts = [array_pop($tokens)];

        while (count($tokens) > $minRemainingTokens) {
            $previous = $tokens[count($tokens) - 1];
            if (!in_array(mb_strtoupper($previous, 'UTF-8'), self::SURNAME_PARTICLES, true)) {
                break;
            }
            array_unshift($lastNameParts, array_pop($tokens));
        }

        return implode(' ', $lastNameParts);
    }

    public function deliveryCertificates()
    {
        return $this->hasMany(DeliveryCertificate::class);
    }

    public function assignedMaterials()
    {
        return $this->hasMany(AssignedMaterial::class);
    }
}
