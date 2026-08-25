<x-mail::message>
# 🚨 Nueva Incidencia Reportada

Se ha registrado una nueva incidencia para la unidad **{{ $vehicle->name }}** asignada a **{{ $vehicle->company }}**.

**Detalles de la Incidencia:**
- **Unidad:** {{ $vehicle->name }} (PPU: {{ $vehicle->plate ?? 'S/P' }})
- **Compañía / Asignación:** {{ $vehicle->company }}
- **Fecha de Reporte:** {{ \Carbon\Carbon::parse($issue->date)->format('d/m/Y') }}
- **Reportado por:** {{ $reporter->name ?? 'Usuario' }}
- **Gravedad:** *{{ $issue->severity }}*
- **Descripción:** {{ $issue->description }}

👉 *Por favor, ingrese a la intranet para revisar los detalles:*  
🔗 **[Ver Incidencia en la Intranet]({{ $url }})**

---
Atentamente,  
**{{ config('app.name') }}**
</x-mail::message>
