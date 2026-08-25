<x-mail::message>
# 📋 Incidencia Revisada y Derivada

Se ha completado la revisión de la incidencia para la unidad **{{ $vehicle->name }}** y ha sido derivada a su departamento / área correspondiente.

**Detalles de la Revisión:**
- **Unidad:** {{ $vehicle->name }} (PPU: {{ $vehicle->plate ?? 'S/P' }})
- **Compañía:** {{ $vehicle->company }}
- **Revisado por:** {{ $reviewer->name ?? 'Oficial de Compañía' }}
- **Fecha de Revisión:** {{ $issue->reviewed_at ? \Carbon\Carbon::parse($issue->reviewed_at)->format('d/m/Y H:i') : now()->format('d/m/Y H:i') }}
- **Estado Operativo:** {{ $issue->is_stopped ? '🔴 *Fuera de Servicio (Detenido)*' : '🟢 *En Servicio*' }}
- **Gravedad:** *{{ $issue->severity }}*
- **Derivado a:** **{{ !empty($destinations) ? implode(', ', $destinations) : 'Registrado' }}**
- **Descripción Original:** {{ $issue->description }}

👉 *Para gestionar o ver la información completa de esta incidencia:*  
🔗 **[Ver Incidencia en la Intranet]({{ $url }})**

---
Atentamente,  
**{{ config('app.name') }}**
</x-mail::message>
