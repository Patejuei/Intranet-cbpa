<x-mail::message>
  # Material Recibido en Comandancia

  Estimado Capitán,

  Se informa que el material solicitado ha sido recibido físicamente en las dependencias de la Comandancia y se encuentra en proceso de ingreso a inventario.

  **Detalles de la Solicitud:**
  - **Compañía:** {{ $acquisition->company }}
  - **Fecha Solicitud:** {{ $acquisition->created_at->format('d/m/Y') }}
  - **Factura:** {{ $acquisition->invoice_number }}

  **Items Recibidos:**
  @foreach ($acquisition->items as $item)
  - {{ $item->item_name }} (x{{ $item->quantity }})
  @endforeach

  Se le notificará nuevamente cuando el Inspector finalice el ingreso al inventario y el material esté listo para retiro.

  Atentamente,<br>
  {{ config('app.name') }}
</x-mail::message>