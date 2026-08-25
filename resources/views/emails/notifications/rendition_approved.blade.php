<x-mail::message>
# 📑 Rendición Aprobada por Inspector — Validación Final Requerida

Estimada **Secretaria de Adquisiciones**,

La rendición de caja chica con documento **N° {{ $rendition->invoice_number }}** ha sido revisada y visada por el **Inspector de Material Mayor** (*{{ $inspector->name ?? 'Inspector' }}*), y se encuentra lista para su validación final.

**Resumen de la Rendición:**
- **N° Factura / Boleta:** **{{ $rendition->invoice_number }}**
- **Fecha Documento:** {{ $rendition->invoice_date ? \Carbon\Carbon::parse($rendition->invoice_date)->format('d/m/Y') : '-' }}
- **Proveedor / RUT:** {{ $rendition->supplier_rut }}
- **Monto:** **${{ number_format($rendition->amount, 0, ',', '.') }}**
- **Tipo de Gasto:** *{{ $expenseLabel }}*
- **Concepto:** {{ $rendition->description }}
- **Asignación:** {{ $vehicle ? $vehicle->name . ' (' . $vehicle->company . ')' : 'Taller / General' }}
- **Visado por:** {{ $inspector->name ?? 'Inspector de Material Mayor' }} el {{ $rendition->inspector_vised_at ? \Carbon\Carbon::parse($rendition->inspector_vised_at)->format('d/m/Y H:i') : now()->format('d/m/Y H:i') }}

👉 *Ingrese a la intranet para realizar la validación final del documento:*  
🔗 **[Validar Rendición en la Intranet]({{ $url }})**

---
Atentamente,  
**{{ config('app.name') }}**
</x-mail::message>
