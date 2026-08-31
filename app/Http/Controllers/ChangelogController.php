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
                'version' => 'v1.1.6',
                'date' => '31-08-2026',
                'changes' => [
                    'Habilitación de Ticketera para Soporte',
                ],
            ],
            [
                'version' => 'v1.1.5',
                'date' => '27-08-2026',
                'changes' => [
                    'Corrección de bug de Edición de Unidades desde el usuario de Capitán',
                    'Corrección de bug de aparición de módulo de rendiciones en el DashBoard desde el usuario de Capitán',
                ],
            ],
            [
                'version' => 'v1.1.4',
                'date' => '25-08-2026',
                'changes' => [
                    'Corrección de bug donde se ocultaba el acceso al Estado de Unidades para el rol de Maquinista',
                    'Implementación de notificación por Correo Electrónico al crear una nueva incidencia, al revisar una incidencia, al finalizar una orden de trabajo, al realizar un Checklist y al crear una nueva entrada de rendiciones',
                    'Adición de filtros para la exportación de bitácoras e incidencias a Excel, incluyendo filtros por fecha y vechículo, así como la opción de exportar todas las bitácoras sin filtros.',
                ],
            ],
            [
                'version' => 'v1.1.3',
                'date' => '29-07-2026',
                'changes' => [
                    'Corrección de bug en el taller mecánico que borraba las tareas de mantenimiento y los trabajos externos al guardar cambios debido a comparaciones estrictas de tipos en los identificadores de base de datos.',
                    'Optimización en el módulo de bodega para que los ítems compatibles con el vehículo se carguen de forma consistente sin fallar por problemas de tipo de datos',
                ],
            ],
            [
                'version' => 'v1.1.2',
                'date' => '27-07-2026',
                'changes' => [
                    'Captura directa desde la cámara del dispositivo al añadir imágenes en el módulo de Incidencias.',
                    'Captura directa desde la cámara del dispositivo al añadir fotografía de boleta/vale en el módulo de Bitácoras.',
                ],
            ],
            [
                'version' => 'v1.1.1',
                'date' => '26-07-2026',
                'changes' => [
                    'Columna de combustible añadida al listado de bitácoras con check verde y cruz roja para identificar rápidamente las cargas.',
                    'Recuadro de Gravedad Reportada agregado en el detalle de las incidencias sobre el panel de notificaciones.',
                    'Registro e indicación visual de la fecha y hora exacta en la que un usuario notificado (Material Mayor, Taller Mecánico, Comandancia) visualizó la incidencia en el panel de notificaciones.',
                ],
            ],
            [
                'version' => 'v1.1.0',
                'date' => '26-07-2026',
                'changes' => [
                    'Edición de severidad de incidencias del Material Mayor por el autor antes de la revisión y por el Inspector/Comandante después de la revisión.',
                    'Subida de hasta 3 imágenes de hasta 5MB por incidencia con capacidad de descarga y eliminación por el autor.',
                    'Limpieza automática de imágenes adjuntas 7 días después de haberse resuelto la incidencia.',
                ],
            ],
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

