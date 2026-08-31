<x-mail::message>
# ✅ Ticket de Soporte Creado

Su ticket de soporte ha sido creado exitosamente.

**Detalles del Ticket:**
- **Ticket:** #{{ $ticket->id }}
- **Asunto:** {{ $ticket->subject }}
- **Categoría:** {{ $ticket->category ?? 'Sin categoría' }}
- **Prioridad:** {{ $ticket->priority }}
- **Estado:** Abierto
- **Fecha:** {{ \Carbon\Carbon::parse($ticket->created_at)->format('d/m/Y H:i') }}

Nuestro equipo de soporte revisará su solicitud a la brevedad.

👉 *Puede hacer seguimiento de su ticket aquí:*
🔗 **[Ver Ticket en la Intranet]({{ $url }})**

---
Atentamente,
**{{ config('app.name') }}**
</x-mail::message>
