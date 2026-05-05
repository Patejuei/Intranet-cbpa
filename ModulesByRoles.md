# Lista de Modulos

## Módulos Base

- Panel Principal.
- Perfil.

## Módulos de Material Mayor

- Control de Unidades.
- Incidencias.
- Bitácoras.
- Taller Mecánico.
- Checklist.
- Bodega Taller.
- Rendiciones Taller.

# Lista de Roles con sus Permisos

## Administrador

_Acceso Total_

## Comandante

| Módulo              | Permisos     | Observaciones                                               |
| ------------------- | ------------ | ----------------------------------------------------------- |
| Control de Unidades | Ver y Editar | Visualización de Gastos Totales en Mantenimiento por Unidad |
| Incidencias         | Ver y Editar |
| Bitácoras           | Ver y Editar |
| Taller Mecánico     | Ver y Editar | Puede editar el Valor Hora del Taller Mecánico              |
| Checklist           | Ver y Editar | Visación de Checklists de Unidades de Comandancia           |
| Bodega Taller       | Ver          |
| Rendiciones Taller  | Ver          | Puede editar el Valor Hora del Taller Mecánico              |

## Inspector de Material Mayor

| Módulo              | Permisos     | Observaciones                                               |
| ------------------- | ------------ | ----------------------------------------------------------- |
| Control de Unidades | Ver y Editar | Visualización de Gastos Totales en Mantenimiento por Unidad |
| Incidencias         | Ver y Editar | Solo las reportadas al Rol                                  |
| Bitácoras           | Ver y Editar |
| Taller Mecánico     | Ver          | Puede editar el Valor Hora del Taller Mecánico              |
| Checklist           | Ver y Editar | Visación de Checklists de Unidades de Comandancia           |
| Bodega Taller       | Ver y Editar | Puede editar el Valor Hora del Taller Mecánico              |
| Rendiciones Taller  | Sin Permisos |

## Secretaria Adquisiciones

| Módulo              | Permisos     | Observaciones |
| ------------------- | ------------ | ------------- |
| Control de Unidades | Sin Permisos |
| Incidencias         | Sin Permisos |
| Bitácoras           | Sin Permisos |
| Taller Mecánico     | Sin Permisos |
| Checklist           | Sin Permisos |
| Bodega Taller       | Sin Permisos |
| Rendiciones Taller  | Ver y Editar |

## Taller Mecánico

| Módulo              | Permisos     | Observaciones |
| ------------------- | ------------ | ------------- |
| Control de Unidades | Ver          |
| Incidencias         | Ver          |
| Bitácoras           | Ver          |
| Taller Mecánico     | Ver y Editar |
| Checklist           | Ver          |
| Bodega Taller       | Ver y Editar |
| Rendiciones Taller  | Sin Permisos |

## Capitán

| Módulo              | Permisos     | Observaciones                                                                                  |
| ------------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| Control de Unidades | Ver          | Visualización de las Unidades de su Compañía                                                   |
| Incidencias         | Ver y Editar | Puede revisar y reportar a las entidades que correspondan, solo de las unidades de su compañía |
| Bitácoras           | Ver y Editar | Visualización de las Bitácoras de su Compañía                                                  |
| Taller Mecánico     | Ver          | Solo Visualiza las unidades de su compañía                                                     |
| Checklist           | Ver y Editar | Visación de Checklists de las unidades de su compañía                                          |
| Bodega Taller       | Sin Permisos |
| Rendiciones Taller  | Sin Permisos |

## Maquinista

| Módulo              | Permisos     | Observaciones       |
| ------------------- | ------------ | ------------------- |
| Control de Unidades | Ver          | Solo de Su Compañía |
| Incidencias         | Ver y Editar | Solo de Su Compañía |
| Bitácoras           | Ver y Editar | Solo de Su Compañía |
| Taller Mecánico     | Ver          | Solo de Su Compañía |
| Checklist           | Ver y Editar | Solo de Su Compañía |
| Bodega Taller       | Sin Permisos |
| Rendiciones Taller  | Sin Permisos |

## Cuartelero

| Módulo              | Permisos     | Observaciones       |
| ------------------- | ------------ | ------------------- |
| Control de Unidades | Ver          | Solo de Su Compañía |
| Incidencias         | Ver          | Solo de Su Compañía |
| Bitácoras           | Ver y Editar | Solo de Su Compañía |
| Taller Mecánico     | Ver          | Solo de Su Compañía |
| Checklist           | Ver y Editar | Solo de Su Compañía |
| Bodega Taller       | Sin Permisos |
| Rendiciones Taller  | Sin Permisos |

## Usuario Estandar

Sus permisos dependerán de los asignados al ser creado.
| Módulo | Permisos | Observaciones |
| ------------------- | ------------ | ------------------- |
| Control de Unidades | Ver | Solo de Su Compañía |
| Incidencias | Ver y Editar | Solo de Su Compañía |
| Bitácoras | Ver y Editar | Solo de Su Compañía |
| Taller Mecánico | Sin Permisos | |
| Checklist | Ver y Editar | Solo de Su Compañía |
| Bodega Taller | Sin Permisos |
| Rendiciones Taller | Sin Permisos |
