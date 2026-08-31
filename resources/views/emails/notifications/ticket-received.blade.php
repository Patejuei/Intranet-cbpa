<x-mail::message>
# 🎫 Nuevo Ticket de Soporte Recibido

Se ha recibido un nuevo ticket de soporte que requiere atención.

**Detalles del Ticket:**
- **Ticket:** #{{ $ticket->id }}
- **Asunto:** {{ $ticket->subject }}
- **Categoría:** {{ $ticket->category ?? 'Sin categoría' }}
- **Prioridad:** {{ $ticket->priority }}
- **Solicitante:** {{ $creator->name ?? 'Usuario' }}
- **Compañía:** {{ $ticket->company }}
- **Fecha:** {{ \Carbon\Carbon::parse($ticket->created_at)->format('d/m/Y H:i') }}

👉 *Ingrese a la intranet para revisar y responder:*
🔗 **[Ver Ticket en la Intranet]({{ $url }})**

---
Atentamente,
**{{ config('app.name') }}**
</x-mail::message>
