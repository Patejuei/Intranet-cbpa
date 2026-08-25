<x-mail::message>
# 📝 Nuevo Checklist Realizado — Pendiente de Visación

Se ha realizado un nuevo checklist para la unidad **{{ $vehicle->name }}** asignada a **{{ $vehicle->company }}** y se encuentra pendiente de su firma / visación digital.

**Resumen del Checklist:**
- **Unidad:** {{ $vehicle->name }} (PPU: {{ $vehicle->plate ?? 'S/P' }})
- **Compañía:** {{ $vehicle->company }}
- **Realizado por:** {{ $user->name ?? 'Voluntario / Conductor' }}
- **Fecha:** {{ $checklist->created_at->format('d/m/Y H:i') }}
- **Resultados:**
  1. ✅ **Ítems OK:** {{ $okCount }}
  2. ⚠️ **Próximo Mantenimiento:** {{ $nextMaintCount }}
  3. 🚨 **Urgentes / Fallas:** {{ $urgentCount }}
@if($checklist->general_observations)
- **Observaciones Generales:** *{{ $checklist->general_observations }}*
@endif

👉 *Ingrese a la plataforma para revisar ítem por ítem y realizar su visación:*  
🔗 **[Visar Checklist en la Intranet]({{ $url }})**

---
Atentamente,  
**{{ config('app.name') }}**
</x-mail::message>
