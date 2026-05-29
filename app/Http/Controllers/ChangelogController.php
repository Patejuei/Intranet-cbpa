<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ChangelogController extends Controller
{
    /**
     * Display the changelog.
     */
    public function index()
    {
        $changelogEntries = [
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

        return Inertia::render('changelog', [
            'changelogEntries' => $changelogEntries,
        ]);
    }
}
