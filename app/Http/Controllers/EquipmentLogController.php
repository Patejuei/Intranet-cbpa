<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\EquipmentLog;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\MaterialReceived;

class EquipmentLogController extends Controller
{
    public function index()
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && $user->role !== 'secretaria_adquisiciones' && $user->role !== 'inspector' && !in_array('equipment.view', $user->permissions ?? []) && !in_array('equipment.edit', $user->permissions ?? [])) {
            abort(403);
        }

        // Equipment Logs (Historial de Movimientos Alta/Baja Manual)
        $logsQuery = EquipmentLog::with('user')->latest();
        if ($user->role !== 'admin' && $user->role !== 'secretaria_adquisiciones' && $user->company && $user->company !== 'Comandancia') {
            $logsQuery->whereHas('user', function ($q) use ($user) {
                $q->where('company', $user->company);
            });
        }

        // Acquisitions Logic
        $acquisitionsQuery = \App\Models\MaterialAcquisition::with('items')->latest();

        if ($user->role === 'capitan') {
            $acquisitionsQuery->where('company', $user->company);
        } elseif ($user->role !== 'admin' && $user->role !== 'secretaria_adquisiciones' && $user->role !== 'inspector' && $user->company !== 'Comandancia') {
            $acquisitionsQuery->where('company', $user->company);
        }

        $companies = [
            'Primera Compañía',
            'Segunda Compañía',
            'Tercera Compañía',
            'Cuarta Compañía',
            'Quinta Compañía',
            'Sexta Compañía',
            'Séptima Compañía',
            'Octava Compañía',
            'Novena Compañía',
            'Comandancia',
            'Taller',
            'TIC',
            'Mayordomía'
        ];

        return Inertia::render('equipment/index', [
            'logs' => $logsQuery->paginate(10),
            'acquisitions' => $acquisitionsQuery->get(), // List for Tabs
            'materials' => \App\Models\Material::where('company', $user->company)->get(),
            'userRole' => $user->role,
            'userCompany' => $user->company,
            'companies' => $companies // Passed for Alta Manual Selector
        ]);
    }

    public function store(Request $request)
    {
        return $this->storeManualLog($request);
    }

    private function storeManualLog(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && $user->role !== 'secretaria_adquisiciones' && !in_array('equipment.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $type = $request->input('type');

        // Validation Rules
        $rules = [
            'type' => 'required|in:ALTA,BAJA',
            'reason' => 'nullable|string',
            'document' => 'nullable|file|max:10240',
        ];

        if ($type === 'ALTA') {
            $rules['invoice_number'] = 'required|string';
            $rules['invoice_date'] = 'required|date';
            $rules['supplier_rut'] = 'required|string';
            $rules['supplier_name'] = 'required|string';
            $rules['items'] = 'required|array|min:1';
            $rules['items.*.item_name'] = 'required|string';
            $rules['items.*.quantity'] = 'required|integer|min:1';
            $rules['items.*.unit_price'] = 'nullable|integer|min:0';
            $rules['company'] = 'nullable|string'; // For Admin/Commanders/Secretary
        } else {
            // BAJA uses single item structure
            $rules['item_name'] = 'required|string';
            $rules['quantity'] = 'required|integer|min:1';
            $rules['brand'] = 'nullable|string';
            $rules['model'] = 'nullable|string';
            $rules['serial_number'] = 'nullable|string';
            $rules['category'] = 'nullable|string';
            $rules['inventory_number'] = 'nullable|string';
        }

        $validated = $request->validate($rules);

        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('equipment_docs', 'public');
        }

        if ($type === 'ALTA') {
            // NEW WORKFLOW: Creates MaterialAcquisition instead of EquipmentLog

            $targetCompany = $validated['company'] ?? $user->company ?? 'Comandancia';

            // Create Acquisition with status 'purchased' (Pendiente)
            $acquisition = \App\Models\MaterialAcquisition::create([
                'company' => $targetCompany,
                'status' => 'purchased',
                'invoice_number' => $validated['invoice_number'],
                'invoice_date' => $validated['invoice_date'],
                'supplier_rut' => $validated['supplier_rut'],
                'supplier_name' => $validated['supplier_name'],
                'document_path' => $documentPath,
            ]);

            foreach ($request->items as $itemData) {
                // Save items with their Unit Price
                \App\Models\MaterialAcquisitionItem::create([
                    'material_acquisition_id' => $acquisition->id,
                    'item_name' => $itemData['item_name'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'] ?? null,
                    'details' => $validated['reason'] ?? 'Alta Manual',
                ]);
            }

            return redirect()->back()->with('success', 'Adquisición registrada exitosamente como Pendiente. Debe confirmar la recepción en el listado de solicitudes.');
        } else {
            // BAJA Logic (Keep existing single item)
            $quantity = $validated['quantity'];
            $inventoryNumber = null;
            $manualInventoryNumber = $request->input('inventory_number');
            $material = null;

            if (!empty($manualInventoryNumber)) {
                $material = \App\Models\Material::where(function ($q) use ($manualInventoryNumber) {
                    $q->where('code', $manualInventoryNumber)
                        ->orWhere('serial_number', $manualInventoryNumber);
                })->where('company', $user->company)->first();
            }
            if (!$material) {
                $material = \App\Models\Material::where('company', $user->company)
                    ->where('product_name', $validated['item_name'])
                    ->first();
            }

            if ($material) {
                if ($material->stock_quantity >= $quantity) {
                    $material->decrement('stock_quantity', $quantity);
                    $inventoryNumber = $material->code;

                    $log = EquipmentLog::create([
                        'item_name' => $material->product_name,
                        'brand' => $material->brand,
                        'model' => $material->model,
                        'serial_number' => $validated['serial_number'] ?? $material->serial_number,
                        'inventory_number' => $inventoryNumber,
                        'category' => $material->category,
                        'type' => 'BAJA',
                        'quantity' => $quantity,
                        'reason' => $validated['reason'],
                        'document_path' => $documentPath,
                        'material_id' => $material->id,
                        'user_id' => $user->id,
                    ]);

                    \App\Models\MaterialHistory::create([
                        'material_id' => $material->id,
                        'user_id' => $user->id,
                        'type' => 'REMOVE',
                        'quantity_change' => -$quantity,
                        'current_balance' => $material->stock_quantity,
                        'reference_type' => EquipmentLog::class,
                        'reference_id' => $log->id,
                        'description' => 'Baja Manual: ' . $validated['reason'],
                    ]);
                } else {
                    return redirect()->back()->withErrors(['quantity' => 'No hay suficiente stock.']);
                }
            } else {
                return redirect()->back()->withErrors(['item_name' => 'Material no encontrado.']);
            }

            return redirect()->back()->with('success', 'Baja registrada exitosamente.');
        }
    }

    // --- Acquisition Flow Methods ---

    public function storeRequest(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.item_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.details' => 'nullable|string',
        ]);

        $company = $request->user()->company;
        if (!$company) $company = 'Comandancia'; // Default if none

        $acquisition = \App\Models\MaterialAcquisition::create([
            'company' => $company,
            'status' => 'requested',
        ]);

        foreach ($request->items as $item) {
            \App\Models\MaterialAcquisitionItem::create([
                'material_acquisition_id' => $acquisition->id,
                'item_name' => $item['item_name'],
                'quantity' => $item['quantity'],
                'details' => $item['details'] ?? null,
            ]);
        }

        return back()->with('success', 'Solicitud de material creada.');
    }

    public function storePurchase(Request $request, \App\Models\MaterialAcquisition $acquisition)
    {
        $request->validate([
            'invoice_number' => 'required|string',
            'invoice_date' => 'required|date',
            'supplier_rut' => 'required|string',
            'supplier_name' => 'required|string',
            'document' => 'nullable|file|mimes:pdf,jpg,png|max:10240',
        ]);

        $path = null;
        if ($request->hasFile('document')) {
            $path = $request->file('document')->store('invoices', 'public');
        }

        $acquisition->update([
            'status' => 'purchased',
            'invoice_number' => $request->invoice_number,
            'invoice_date' => $request->invoice_date,
            'supplier_rut' => $request->supplier_rut,
            'supplier_name' => $request->supplier_name,
            'document_path' => $path,
        ]);

        return back()->with('success', 'Compra registrada/confirmada.');
    }

    public function confirmReception(Request $request, \App\Models\MaterialAcquisition $acquisition)
    {
        // Confirm reception by Secretary. Status: Received.
        // Optional: Update Inventory Codes if provided
        if ($request->has('items')) {
            $request->validate([
                'items' => 'array',
                'items.*.id' => 'required|exists:material_acquisition_items,id',
                'items.*.inventory_code' => 'nullable|string',
            ]);

            foreach ($request->items as $itemData) {
                $dbItem = \App\Models\MaterialAcquisitionItem::find($itemData['id']);
                if ($dbItem && isset($itemData['inventory_code'])) {
                    $dbItem->update(['inventory_code' => $itemData['inventory_code']]);
                }
            }
        }

        $acquisition->update(['status' => 'received']);

        return back()->with('success', 'Material recibido en secretaría. Pendiente de ingreso por Inspector.');
    }

    public function finishInventoryEntry(Request $request, \App\Models\MaterialAcquisition $acquisition)
    {
        // Inspector Logic: Loop items, create exact materials in Comandancia
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:material_acquisition_items,id',
            'items.*.item_name' => 'required|string', // Allow editing name
            'items.*.category' => 'required|string', // Category is mandatory
            'items.*.brand' => 'required|string',
            'items.*.model' => 'nullable|string',
            'items.*.serial_number' => 'nullable|string',
            'items.*.inventory_code' => 'nullable|string',
            // unit_price is persisted from item, but inspector might edit? No, price is from invoice.
        ]);

        foreach ($request->items as $itemData) {
            $dbItem = \App\Models\MaterialAcquisitionItem::find($itemData['id']);
            if (!$dbItem) continue;

            $dbItem->update([
                'item_name' => $itemData['item_name'], // Update name if changed
                'brand' => $itemData['brand'],
                'model' => $itemData['model'] ?? null,
                'category' => $itemData['category'], // Save category
                'serial_number' => $itemData['serial_number'] ?? null,
                'inventory_code' => $itemData['inventory_code'] ?? null,
            ]);

            // Create Material in COMANDANCIA
            $material = \App\Models\Material::create([
                'product_name' => $dbItem->item_name,
                'brand' => $dbItem->brand,
                'model' => $dbItem->model,
                'serial_number' => $dbItem->serial_number,
                'code' => $dbItem->inventory_code,
                'stock_quantity' => $dbItem->quantity,
                'company' => 'Comandancia',
                'category' => $itemData['category'], // Use selected category
            ]);

            // Create Log (Alta) so it appears in history
            EquipmentLog::create([
                'item_name' => $material->product_name,
                'type' => 'ALTA',
                'quantity' => $dbItem->quantity,
                'unit_price' => $dbItem->unit_price,
                'category' => $itemData['category'],
                'brand' => $dbItem->brand,
                'model' => $dbItem->model,
                'serial_number' => $dbItem->serial_number,
                'inventory_number' => $dbItem->inventory_code,
                'reason' => "Adquisición Factura #{$acquisition->invoice_number}",
                'document_path' => $acquisition->document_path,
                'material_id' => $material->id,
                'user_id' => $request->user()->id,
                'invoice_number' => $acquisition->invoice_number,
                'invoice_date' => $acquisition->invoice_date,
                'supplier_rut' => $acquisition->supplier_rut,
                'supplier_name' => $acquisition->supplier_name,
            ]);

            // History Link
            \App\Models\MaterialHistory::create([
                'material_id' => $material->id,
                'user_id' => $request->user()->id,
                'type' => 'ADD',
                'quantity_change' => $dbItem->quantity,
                'current_balance' => $dbItem->quantity,
                'reference_type' => \App\Models\MaterialAcquisition::class,
                'reference_id' => $acquisition->id,
                'description' => "Ingreso por Adquisición (Factura: {$acquisition->invoice_number})",
            ]);
        }

        $acquisition->update(['status' => 'completed']);

        // Notify Captain (Requester/Target Company)
        $captain = \App\Models\User::where('company', $acquisition->company)
            ->where('role', 'capitan')
            ->first();

        // if ($captain) {
        //     Mail::to($captain->email)->send(new MaterialReceived($acquisition));
        // }

        return back()->with('success', 'Material ingresado al inventario de Comandancia y notificado al Capitán.');
    }
}
