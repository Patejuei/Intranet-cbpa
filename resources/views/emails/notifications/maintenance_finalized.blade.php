<x-mail::message>
# 🚒 Orden de Trabajo Finalizada — Unidad Lista para Entrega

Se informa que han finalizado los trabajos de mantenimiento y reparación en el Taller Mecánico para la unidad **{{ $vehicle->name }}** asignada a **{{ $vehicle->company }}**, y la unidad se encuentra **lista para su entrega / retiro**.

**Detalles de la Orden de Trabajo #{{ $maintenance->id }}:**
- **Unidad:** **{{ $vehicle->name }}** (PPU: {{ $vehicle->plate ?? 'S/P' }})
- **Compañía:** {{ $vehicle->company }}
- **Taller / Responsable:** {{ $maintenance->workshop_name }} (*{{ $maintenance->responsible_person }}*)
- **Fecha de Ingreso:** {{ $maintenance->entry_date ? \Carbon\Carbon::parse($maintenance->entry_date)->format('d/m/Y') : '-' }}
- **Fecha de Finalización:** {{ $maintenance->exit_date ? \Carbon\Carbon::parse($maintenance->exit_date)->format('d/m/Y') : now()->format('d/m/Y') }}
- **Finalizado por:** {{ $finalizerUser->name ?? 'Personal de Taller' }}

@if($tasks->isNotEmpty())
**Trabajos Realizados:**
@foreach($tasks as $index => $task)
{{ $index + 1 }}. {{ $task->is_completed ? '✅' : '⚙️' }} {{ $task->description }}
@endforeach
@endif

👉 *Puede coordinar el retiro e inspeccionar la orden de trabajo aquí:*  
🔗 **[Ver Orden de Trabajo en la Intranet]({{ $url }})**

---
Atentamente,  
**{{ config('app.name') }}**
</x-mail::message>
