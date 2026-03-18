## AGENTS.MD — Guía para agentes y IAs

Este documento define **cómo deben trabajar los agentes (IA y humanos usando asistencia de IA)** dentro de este repositorio.  
El objetivo es mantener la **coherencia funcional**, la **seguridad de permisos** y un **código limpio y mantenible** en toda la intranet del Cuerpo de Bomberos de Puente Alto.

- La aplicación está escrita en **Laravel 12 (PHP 8.2+)** con **Inertia.js**, **React 19**, **Vite 7**, **Tailwind 4** y componentes tipo **shadcn/Radix**.
- Todas las interfaces de usuario y textos visibles deben mantenerse en **español**.
- Para una visión funcional y de instalación, consulta `README.md`. Este archivo se centra en **cómo modificar el código de forma segura**.

Siempre que vayas a hacer un cambio relevante, **lee primero esta guía** y los skills específicos indicados.

---

## 1. Resumen de arquitectura del proyecto

- **Monolito Laravel + Inertia + React**:
  - Las rutas HTTP viven principalmente en `routes/web.php` (y `routes/settings.php`).
  - Cada ruta que renderiza una vista usa **Inertia** (`Inertia::render('...')`) y se corresponde con un componente de página en `resources/js/pages`.
- **Front-end**:
  - Punto de entrada principal: `resources/js/app.tsx`.
  - Páginas por dominio: `resources/js/pages/...` (por ejemplo `vehicles/*`, `equipment/*`, `tickets/*`, `settings/*`, `admin/*`, `dashboard.tsx`).
  - Layouts compartidos: `resources/js/layouts/...` (por ejemplo `app-layout`, `app-sidebar-layout`, `settings/layout`, `auth-card-layout`).
  - Componentes reutilizables de UI: `resources/js/components/ui/*` (botones, inputs, tablas, diálogos, sidebar, etc.) y componentes de dominio (`CompanyFilter`, `MaterialForm`, etc.).
- **Backend**:
  - Controladores: `app/Http/Controllers/*` agrupados por módulo (vehicles, equipment, tickets, admin, settings, etc.).
  - Modelos: `app/Models/*` (por ejemplo `Vehicle`, `Material`, `BatteryLog`, `Ticket`, `AssignedMaterial`, `Firefighter`, etc.).
  - Middleware: `app/Http/Middleware/*` (incluye `CheckModuleAccess` y `HandleInertiaRequests`).
  - Multiempresa: `CompanyScopeTrait` y filtros explícitos por `company`/`role`/`department`.
- **PDFs y reportes**:
  - Plantillas Blade en `resources/views/pdf/*` (certificados de entrega y recepción, listados, actas, etc.).
  - Generación usualmente vía DOMPDF desde controladores.

Antes de tocar una zona del sistema, **localiza siempre**:
- La ruta Laravel asociada.
- El controlador y modelo implicados.
- La página de React/Inertia que consume esos datos.

---

## 2. Reglas generales de backend (Laravel)

### 2.1 Rutas y módulos

- Define y modifica rutas principalmente en:
  - `routes/web.php` → rutas generales de la intranet.
  - `routes/settings.php` → rutas del módulo de ajustes (`/settings/...`).
- Respeta siempre los grupos de middleware existentes:
  - Autenticación y verificación: `auth`, `verified`.
  - Acceso por módulo: `module:vehicles`, `module:equipment`, `module:tickets`, `module:admin`, etc.
- Cuando agregues una **nueva funcionalidad**:
  - Ubica la ruta dentro del grupo de módulo que corresponda (por ejemplo, nuevas rutas de vehículos bajo el grupo `prefix('vehicles')` y `module:vehicles`).
  - Mantén la misma estructura de URL y nombres de rutas ya existentes en ese módulo.

### 2.2 Controladores

- Añade nuevos controladores en el **namespace apropiado** según módulo:
  - Vehículos y material mayor: `app/Http/Controllers/Vehicles/...`.
  - Material menor / equipo: `app/Http/Controllers/Equipment/...`.
  - Tickets: `app/Http/Controllers/Tickets/...`.
  - Administración y usuarios: `app/Http/Controllers/Admin/...`.
  - Ajustes: `app/Http/Controllers/Settings/...`.
- Sigue estos principios:
  - Mantén los métodos cortos y con una sola responsabilidad (listar, mostrar formulario, guardar, actualizar, etc.).
  - No mezcles lógica de negocio compleja en el controlador; extrae a métodos privados o servicios si es necesario.
  - Usa **Inertia** para vistas (`return Inertia::render('ruta/de/pagina', [...])`) y **JSON** sólo cuando sea realmente una API auxiliar.

### 2.3 Modelos, consultas y multiempresa

- Los modelos viven en `app/Models`. Usa nombres claros en singular (por ejemplo `Vehicle`, `Material`, `TicketMessage`).
- Al leer información que está asociada a una compañía:
  - **Siempre** filtra por el `company` (u otro campo equivalente) del usuario autenticado, salvo que la lógica sea explícitamente global (por ejemplo, vistas de administración a nivel comando).
  - Ten en cuenta también `role` y `department` cuando el comportamiento actual los usa.
- Cuando ya exista un patrón (por ejemplo un scope o el `CompanyScopeTrait`), **reutilízalo en lugar de duplicar lógica**.
- Al modificar consultas existentes:
  - Revisa que no rompes las restricciones actuales para `inspector`, `comandante`, `admin`, `capitan`, `maquinista`, etc.
  - Comprueba el comportamiento en el dashboard y en listados críticos.

### 2.4 Flujos de estados y lógica de negocio sensible

Hay varios flujos con múltiples estados y roles (por ejemplo, bajas de material, rendiciones de caja chica, checklists de vehículos, tickets).  
Al modificarlos:

- **No renombres ni elimines estados existentes** (por ejemplo `pending_inspector`, `pending_comandante`, etc.) sin revisar todo el flujo:
  - Controladores.
  - Vistas de React/Inertia.
  - Migraciones y datos existentes.
  - PDFs o reportes que dependan de esos estados.
- Mantén coherencia con las condiciones usadas en el **dashboard** (tarjetas de pendientes, próximos vencimientos, etc.).

Para detalles avanzados de Laravel (Eloquent, colas, testing, etc.) consulta el skill:  
`/.agents/skills/laravel-specialist/SKILL.md`.

---

## 3. Reglas generales de frontend (React + Inertia)

### 3.1 Convención Inertia y estructura de páginas

- Cada llamada a `Inertia::render('ruta/de/pagina')` debe corresponder **1 a 1** con un archivo en `resources/js/pages`:
  - Ejemplo: `Inertia::render('dashboard')` → `resources/js/pages/dashboard.tsx`.
  - Ejemplo: `Inertia::render('settings/profile')` → `resources/js/pages/settings/profile.tsx`.
- Agrupa las nuevas páginas por dominio, siguiendo la estructura existente:
  - `resources/js/pages/vehicles/...`
  - `resources/js/pages/equipment/...`
  - `resources/js/pages/tickets/...`
  - `resources/js/pages/admin/...`
  - `resources/js/pages/settings/...`

### 3.2 Layouts y componentes compartidos

- Reutiliza siempre los **layouts existentes**:
  - `app-layout`, `app-sidebar-layout`, `settings/layout`, `auth-card-layout`, etc.
- Para nuevos componentes:
  - Prefiere construirlos a partir de los componentes de `resources/js/components/ui/*` (por ejemplo `button`, `input`, `select`, `dialog`, `table`, `sidebar`, `switch`).
  - Coloca componentes de dominio reutilizables en `resources/js/components/*` (por ejemplo filtros, formularios, tarjetas).
- Mantén un diseño consistente:
  - Usa Tailwind CSS siguiendo el estilo de las vistas existentes.
  - Evita CSS inline innecesario; prefiere clases utilitarias o componentes ya definidos.

### 3.3 Idioma, textos y accesibilidad

- Todos los textos visibles para usuarios deben estar en **español**.
- Conserva el tono y terminología usada actualmente (por ejemplo “Revisión Técnica”, “Permiso de Circulación”, “Caja Chica”, “Bitácora”, “Rendición”).
- Cuando agregues nuevos botones o etiquetas:
  - Asegúrate de que las etiquetas sean claras y concisas.
  - Usa iconos de Lucide sólo cuando aporten claridad adicional, no como sustituto del texto.

### 3.4 Hooks, permisos y estado

- Antes de inventar nuevos hooks, revisa `resources/js/hooks/*`:
  - Usa `use-permissions` para condicionar la UI según los permisos/roles del usuario.
  - Usa otros hooks existentes para navegación móvil, iniciales de usuario, etc.
- No dupliques lógica de permisos en mil componentes:
  - Centraliza la lógica en hooks o helpers compartidos.
  - Evita checks ad-hoc como `if (user.role === 'admin')` repartidos por toda la UI; reutiliza patrones ya existentes.

### 3.5 Performance y patrones avanzados

Para reglas detalladas de rendimiento y arquitectura React (evitar waterfalls, manejar efectos, suspense, etc.), consulta:  
`/.agent/skills/vercel-react-best-practices/AGENTS.md`.

- Aplica estas guías especialmente en:
  - Páginas con muchas tablas o filtros.
  - Componentes que se renderizan frecuentemente en toda la app (sidebar, header, etc.).

Para responsive design y shadcn/ui, consulta también:
- `/.agents/skills/responsive-design/SKILL.md`
- `/.agents/skills/shadcn-ui/SKILL.md`

---

## 4. Permisos, roles y multiempresa

Este proyecto es **multiempresa** y **multirol**, por lo que los permisos son críticos.

### 4.1 Datos de usuario

- El modelo `User` incluye campos como:
  - `company` (u otro identificador de compañía).
  - `role` (por ejemplo `admin`, `inspector`, `comandante`, `capitan`, `maquinista`, `mechanic`, etc.).
  - `department` u otros atributos de contexto.
- Las consultas deben respetar estos atributos:
  - Usuarios no administradores suelen ver sólo datos de su `company`.
  - Ciertos roles (Comandancia, Administración) pueden ver datos globales o de múltiples compañías.

### 4.2 Middleware y módulos

- El middleware `module:*` (ej. `module:vehicles`, `module:equipment`, etc.) controla el acceso a secciones completas.
- El middleware `CheckModuleAccess` refuerza estas reglas.
- Cuando agregues rutas nuevas:
  - Asigna siempre el `module:*` correcto según el dominio funcional.
  - No crees rutas sin módulo para funcionalidades internas de vehículos, equipo, tickets, etc., salvo que se trate de utilidades de sistema muy específicas.

### 4.3 Dashboard y visibilidad

- El dashboard (`dashboard` en `routes/web.php`) ya implementa lógica compleja para decidir:
  - Qué tarjetas mostrar.
  - Qué datos incluir según `company`, `role`, `department`.
- Al cambiar lógica relacionada con:
  - Tickets “en proceso” vs “abiertos”.
  - Vehículos detenidos, en taller o con documentos por vencer.
  - Rendiciones pendientes de revisión.
  - Stock crítico en inventario.
- Revisa siempre:
  - Que los filtros por rol/compañía sigan siendo correctos.
  - Que no se expongan datos de otras compañías a usuarios que no deberían verlos.

### 4.4 UI y permisos

- En el frontend, usa `use-permissions` (u otros hooks equivalentes) para ocultar o desactivar acciones según permisos.
- No expongas botones de acciones administrativas a usuarios sin permisos, aunque el backend siga validando.
- Mantén la UI y el backend alineados:
  - Si una acción requiere cierto rol o módulo, la UI debe reflejarlo claramente.

---

## 5. Flujos de trabajo críticos

A continuación se listan flujos especialmente sensibles. Evita cambiar su comportamiento sin entender **todo el recorrido**.

### 5.1 Checklist de vehículos

- Involucra varios roles (por ejemplo operador, inspector, comandancia).
- Los estados pendientes de checklist se usan tanto:
  - En la sección de vehículos.
  - En el dashboard (tarjetas de checklists pendientes).
- Si cambias condiciones o estados:
  - Revisa controladores de vehículos.
  - Revisa páginas React de `resources/js/pages/vehicles/*`.
  - Revisa la lógica de selección de pendientes en `routes/web.php`.

### 5.2 Bajas de material

- El flujo de bajas de material (`MaterialBajaRequest`, `MaterialBajaHistory`, `MaterialBajaValidation`, etc.) suele incluir:
  - Solicitud de baja.
  - Revisión por inspector/comandancia.
  - Registro histórico y posibles PDFs asociados.
- Cambios en este flujo deben:
  - Mantener los estados existentes o migrarlos cuidadosamente.
  - Mantener coherencia entre backend, frontend y PDFs.

### 5.3 Rendiciones de caja chica

- Las rendiciones de caja chica implican estados de revisión por diferentes roles (inspector, comandancia, administración).
- El dashboard muestra rendiciones pendientes según quién esté autenticado.
- Al tocar este flujo:
  - Asegúrate de que las tarjetas y contadores del dashboard sigan reflejando la realidad.
  - Mantén los nombres de estados alineados entre base de datos, código y textos de la UI.

### 5.4 Tickets de soporte

- El módulo de tickets permite:
  - Crear tickets con estado y prioridad.
  - Enviar mensajes (`TicketMessage`).
  - Cambiar estados (abierto, en proceso, resuelto, etc.).
- Este flujo impacta:
  - Listados de tickets.
  - Dashboard (tickets abiertos/en proceso).
  - Notificaciones internas.
- No simplifiques la lógica de estados sin revisar su impacto en todas estas áreas.

---

## 6. Patrones para generación de PDFs y reportes

- Los PDFs se generan típicamente con el patrón:
  - Controlador obtiene datos → pasa datos a una vista Blade en `resources/views/pdf/*` → se genera un PDF (DOMPDF u otra librería).
- Ejemplos principales:
  - Certificados de entrega (`DeliveryCertificate`).
  - Certificados de recepción (`ReceptionCertificate`).
  - Listas de material asignado, actas de reparación, documentos de baja, etc.

Cuando agregues un **nuevo PDF**:

1. Crea una vista Blade en `resources/views/pdf/nombre-documento.blade.php` siguiendo el estilo de las existentes.
2. Crea un método en el controlador correspondiente que:
   - Valide permisos y filtros por empresa/rol.
   - Obtenga los datos necesarios.
   - Devuelva el PDF usando el mismo enfoque que los ejemplos existentes.
3. Asegúrate de que:
   - Los textos estén en español.
   - La estructura visual sea coherente con los documentos ya usados en la institución.

---

## 7. Testing y herramientas

- Este proyecto usa pruebas de feature (Pest) en `tests/Feature/*`, especialmente para:
  - Autenticación y registro (Fortify).
  - Ajustes de perfil, contraseña y seguridad.
- Al modificar lógica **crítica** de negocio o permisos:
  - Considera añadir o actualizar tests de feature que cubran esos casos.
  - Sigue el estilo existente en el directorio de tests.

En frontend:
- Existen reglas de ESLint/Prettier/TypeScript (ver configuraciones en la raíz del proyecto).
- El código nuevo de React/TypeScript debe compilar sin errores y respetar el estilo aplicado por estas herramientas.

---

## 8. Relación con otros documentos y skills

Este `AGENTS.MD` se complementa con:

- `README.md`: visión funcional del sistema, módulos principales y guía de instalación.
- `/.agents/skills/laravel-specialist/SKILL.md`: detalles para trabajar con Laravel (Eloquent, routing, colas, pruebas, etc.).
- `/.agents/skills/responsive-design/SKILL.md`: patrones modernos de diseño responsive.
- `/.agents/skills/shadcn-ui/SKILL.md`: guía de uso de componentes estilo shadcn con Tailwind y Radix.
- `/.agent/skills/vercel-react-best-practices/AGENTS.md`: mejores prácticas avanzadas de React (performance, arquitectura de componentes, patrones de datos).

Para cambios grandes de arquitectura o flujos nuevos complejos, considera crear documentación adicional (por ejemplo, en una futura carpeta `docs/`) y enlazarla desde aquí.

---

## 9. Ejemplos cortos y buenas prácticas

### 9.1 Agregar una nueva ruta + página Inertia

Supongamos que quieres agregar una página para ver el historial de mantenimientos de un vehículo.

1. **Ruta en Laravel** (dentro del grupo de vehículos y módulo correcto):
   - Ubícala en `routes/web.php` bajo el grupo `prefix('vehicles')` y middleware `module:vehicles`.
   - Usa `auth` y `verified` si aplica (siguiendo el patrón del resto de rutas de vehículos).
2. **Controlador**:
   - Añade un método en el controlador de vehículos que:
     - Verifique permisos.
     - Filtre los mantenimientos por `company` y vehículo.
     - Devuelva `Inertia::render('vehicles/maintenance-history', [...])` con los datos necesarios.
3. **Página Inertia**:
   - Crea `resources/js/pages/vehicles/maintenance-history.tsx`.
   - Usa un layout existente (por ejemplo `app-sidebar-layout`).
   - Muestra los datos en una tabla basada en los componentes de `resources/js/components/ui/table`.

### 9.2 Agregar un botón en la UI respetando permisos

Supongamos que quieres agregar un botón “Crear ticket” en una página de soporte:

1. Usa el componente de botón de `resources/js/components/ui/button`.
2. Obtén permisos usando `use-permissions` (u otro hook de permisos existente).
3. Renderiza el botón sólo si el usuario tiene permiso para crear tickets.
4. Usa un texto en español claro, por ejemplo “Crear ticket”.

Ejemplo de enfoque (a nivel conceptual):
- Determina si el usuario puede crear tickets con el hook de permisos.
- Si puede, muestra el botón reutilizando el componente de UI estándar.
- Navega a la página de creación de ticket usando los helpers de ruta/navegación ya presentes en el proyecto.

---

## 10. Resumen final para agentes

- **Piensa siempre en permisos, compañía y rol** antes de exponer o consultar datos.
- **Reutiliza** patrones existentes de rutas, controladores, modelos, layouts y componentes de UI.
- **No simplifiques flujos críticos** (checklists, bajas, rendiciones, tickets) sin revisar todo su recorrido en backend, frontend y PDFs.
- **Apóyate en los skills y documentos asociados** (`.agents` y `.agent`) para decisiones más avanzadas de Laravel, React, responsive design y rendimiento.

Si sigues estas reglas, tus cambios tendrán muchas más probabilidades de ser seguros, coherentes y fáciles de mantener a largo plazo.

