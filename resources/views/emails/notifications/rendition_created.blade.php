<x-mail::message>
# 💰 Nueva Rendición de Caja Chica Ingresada

Se ha ingresado una nueva rendición de caja chica en el Taller Mecánico que requiere su revisión y aprobación como **Inspector de Material Mayor**.

**Detalles del Comprobante:**
- **N° Factura / Boleta:** **{{ $rendition->invoice_number }}**
- **Fecha Documento:** {{ $rendition->invoice_date ? \Carbon\Carbon::parse($rendition->invoice_date)->format('d/m/Y') : '-' }}
- **Proveedor / RUT:** {{ $rendition->supplier_rut }}
- **Tipo de Gasto:** *{{ $expenseLabel }}*
- **Monto Total:** **${{ number_format($rendition->amount, 0, ',', '.') }}**
- **Concepto / Detalle:** {{ $rendition->description }}
- **Asignación:** {{ $vehicle ? $vehicle->name . ' (' . $vehicle->company . ')' : 'Taller / General' }}
- **Ingresado por:** {{ $user->name ?? 'Mecánico' }}

👉 *Ingrese para revisar los documentos adjuntos y aprobar la rendición:*  
🔗 **[Revisar Rendición en la Intranet]({{ $url }})**

---
Atentamente,  
**{{ config('app.name') }}**
</x-mail::message>
