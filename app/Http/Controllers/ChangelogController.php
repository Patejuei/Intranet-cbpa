<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ChangelogController extends Controller
{
    /**
     * Get all changelog entries.
     */
    public static function getEntries(): array
    {
        return [
            [
                'version' => 'v1.0.7',
                'date' => '26-07-2026',
                'changes' => [
                    'Corrección en el formulario de creación de usuarios para permitir la autogeneración consecutiva de contraseñas por el navegador sin requerir recarga manual.',
                    'Optimización en la verificación de seguridad OTP con estimación y cálculo dinámico de expiración en el frontend, previniendo errores HTTP 403 innecesarios.',
                    'Kilometraje de término establecido como campo obligatorio en el registro de bitácoras de vehículos.',
                ],
            ],
            [
                'version' => 'v1.0.6',
                'date' => '19-07-2026',
                'changes' => [
                    'Paginación agregada al listado general de Bitácoras del Material Mayor para la navegación entre registros.',
                ],
            ],
            [
                'version' => 'v1.0.5',
                'date' => '17-07-2026',
                'changes' => [
                    'Corrección de bug en el formulario de bitácoras que impedía guardar el registro al activar y luego desactivar el switch de combustible.',
                    'Sanitización y validación robusta de datos de combustible en el servidor.',
                    'Mensajes de error de validación visibles en el formulario de combustible para evitar fallos silenciosos.',
                    'Eliminación del enlace al Manual de Usuario de la pantalla de LogIn.',
                ],
            ],
            [
                'version' => 'v1.0.4',
                'date' => '08-06-2026',
                'changes' => [
                    'Implementación del campo "Clave" en la bitácora de vehículos.',
                    'Filtros por clave en el historial y exportaciones a Excel.',
                ],
            ],
            [
                'version' => 'v1.0.3',
                'date' => '02-06-2026',
                'changes' => [
                    'Reestructuración del módulo de Rendiciones',
                    'Mecánico e Inspector de Material Mayor inciden en el módulo de Rendiciones',
                    'Modificación del Manual de Usuario para reflejar los cambios en el módulo de Rendiciones',
                ],
            ],
            [
                'version' => 'v1.0.2',
                'date' => '28-05-2026',
                'changes' => [
                    'Sincronización automática de IDs de tareas en órdenes de taller para evitar duplicados.',
                    'Corrección de pérdida de datos no guardados al agregar ítems de bodega a una orden.',
                    'Eliminación de tareas de la base de datos al ser quitadas desde la interfaz.',
                    'Indicador de versión de la aplicación y página de Changelog agregados.',
                    'Ajuste para móvil en la visualización del manual de usuario.'
                ],
            ],
            [
                'version' => 'v1.0.1',
                'date' => '04-05-2026',
                'changes' => [
                    'Implementación de rutas de ayuda para cada módulo.',
                    'Administriación de usuarios exclusiva para el Administrador'
                ],
            ],
            [
                'version' => 'v1.0.0',
                'date' => '22-04-2026',
                'changes' => [
                    'Lanzamiento oficial de la nueva Intranet del Cuerpo de Bomberos de Puente Alto.',
                    'Integración de módulos: Perfil de Usuario, Vehículos, Taller Mecánico, Bodega de Taller, Bitácoras, Incidencias y Checklists.',
                    'Sistema de permisos granulares por compañía y rol.',
                    'Dashboard unificado con alertas.',
                ],
            ],
        ];
    }

    /**
     * Get the current application version.
     */
    public static function getAppVersion(): string
    {
        $entries = self::getEntries();
        return !empty($entries) ? $entries[0]['version'] : 'v1.0.0';
    }

    /**
     * Display the changelog.
     */
    public function index()
    {
        return Inertia::render('changelog', [
            'changelogEntries' => self::getEntries(),
        ]);
    }
}

