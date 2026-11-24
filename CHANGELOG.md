# Changelog

Todas las modificaciones notables a este proyecto están documentadas en este archivo.

## [v1.1.13] - 23-11-2026

### Añadido y Corregido
- **Control de Bitácora para Maquinistas y Conductores**: Restricción estricta en el registro de movimientos de Material Mayor. Exclusivamente conductores autorizados con unidades asignadas pueden realizar y registrar bitácoras, impidiendo que maquinistas o usuarios sin carros asignados registren salidas.
- **Validación Backend & Frontend**: Se refuerza la validación en `VehicleLogController` (`create` y `store`), middleware y en `use-permissions` para garantizar que cada usuario únicamente pueda registrar movimientos en los carros donde es conductor habilitado.
- **Internacionalización y Textos de Autenticación**: Soporte completo de archivos de traducción en español (`lang/es/auth.php`, `lang/es/passwords.php`, `lang/es/pagination.php`, `lang/es.json`), eliminando errores de textos sin traducir como `auth.invalid` o `auth.failed`.
- **Diseño Visual de Errores en Formularios (`InputError`)**: Rediseño de componentes de error con iconografía (`AlertCircle`), animación de entrada suave, accesibilidad `role="alert"` y mapeo de errores amigables para el usuario.
- **Diccionario de Validación en Español**: Ampliación de nombres de atributos en `lang/es/validation.php` para todos los campos de formularios del sistema.
- **Corrección de Visibilidad de Rendiciones en Dashboard**: Implementación de listas blancas estrictas para roles como maquinistas, cuarteleros, ayudantes y capitanes en el panel principal (`dashboard.tsx`), evitando que usuarios sin facultades de rendición vean el módulo en la cuadrícula de accesos.
- **Seguridad en Widget de Rendiciones Pendientes**: Restricción de la consulta en backend (`web.php`) y visualización en frontend de rendiciones pendientes de revisión exclusivamente a roles autorizados (`admin`, `comandante`, `inspector` de Material Mayor y `secretaria_adquisiciones`), excluyendo a mecánicos y roles sin atribuciones de visto bueno.
- **Sincronización de Permisos Multi-rol**: Alineación de permisos y reglas de acceso entre `dashboard.tsx`, `app-sidebar.tsx`, `use-permissions.ts` y modelo `User.php`, garantizando consistencia y coherencia en toda la plataforma.

## [v1.1.12] - 21-11-2026
- BugFix inicio de sesión con RUT.

## [v1.1.11] - 19-11-2026
- Habilitación de la Ticketera de Soporte para todos los usuarios de la plataforma, indiferente a su rol.
- Canalización de las solicitudes y reportes de soporte dirigidas a los usuarios con rol de Administrador.
- Gestión y asignación centralizada de requerimientos.
