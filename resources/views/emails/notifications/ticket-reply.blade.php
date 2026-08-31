<x-mail::message>
# 💬 Nueva Respuesta en Ticket de Soporte

Se ha registrado una nueva respuesta en el ticket **#{{ $ticket->id }}**.

**Detalles:**
- **Ticket:** #{{ $ticket->id }} - {{ $ticket->subject }}
- **Respondido por:** {{ $replier->name ?? 'Usuario' }}
- **Fecha:** {{ \Carbon\Carbon::parse($reply->created_at)->format('d/m/Y H:i') }}

**Mensaje:**
> {{ \Illuminate\Support\Str::limit($reply->message, 300) }}

👉 *Vea la conversación completa aquí:*
🔗 **[Ver Ticket en la Intranet]({{ $url }})**

---
Atentamente,
**{{ config('app.name') }}**
</x-mail::message>
