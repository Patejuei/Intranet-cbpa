<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\MaterialBajaHistory;
use App\Models\MaterialBajaRequest;
use App\Models\MaterialBajaValidation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class MaterialBajaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return redirect()->route('equipment.index', ['tab' => 'BAJAS']);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = request()->user();

        // Fetch materials available for this user to deregister
        $query = Material::query()->select('id', 'product_name', 'code', 'serial_number', 'stock_quantity', 'company');

        if ($user->role !== 'admin') {
            $query->where('company', $user->company);
        }

        // Filter out items with 0 stock?
        $query->where('stock_quantity', '>', 0);

        $materials = $query->orderBy('product_name')->get();

        return Inertia::render('equipment/bajas/Create', [
            'materials' => $materials,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storeRequest(Request $request)
    {
        $validated = $request->validate([
            'material_id' => 'required|exists:materials,id',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string',
            'images' => 'nullable|array', // Array of base64 strings
            'images.*' => 'string',
        ]);

        $material = Material::findOrFail($validated['material_id']);

        // Validation: Verify ownership/company
        $user = $request->user();
        if ($user->role !== 'admin' && $user->company !== $material->company) {
            return redirect()->back()->withErrors(['material_id' => 'No tienes permiso para dar de baja material de otra compañía.']);
        }

        // Validation: Stock sufficiency
        if ($material->stock_quantity < $validated['quantity']) {
            return redirect()->back()->withErrors(['quantity' => 'La cantidad solicitada excede el stock disponible.']);
        }

        // Serialize images to JSON
        $imagesJson = $validated['images'] ? json_encode($validated['images']) : null;

        MaterialBajaRequest::create([
            'user_id' => $user->id,
            'material_id' => $validated['material_id'],
            'quantity' => $validated['quantity'],
            'reason' => $validated['reason'],
            'images' => $imagesJson,
            'status' => 'PENDIENTE',
        ]);

        return redirect()->route('equipment.index', ['tab' => 'BAJAS'])->with('success', 'Solicitud de baja registrada correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $bajaRequest = MaterialBajaRequest::with(['user', 'material', 'validation', 'history', 'validation.inspector'])->findOrFail($id);

        // Security check?
        // For now, allow authorized roles.

        return Inertia::render('equipment/bajas/Show', [
            'bajaRequest' => $bajaRequest,
        ]);
    }

    /**
     * Inspector validates the request.
     */
    public function storeValidation(Request $request, $id)
    {
        $bajaRequest = MaterialBajaRequest::findOrFail($id);

        $validated = $request->validate([
            'is_reparable' => 'required|boolean',
            'evaluation_notes' => 'nullable|string',
        ]);

        $user = $request->user();

        // Create Validation Record
        $validation = MaterialBajaValidation::create([
            'request_id' => $bajaRequest->id,
            'inspector_id' => $user->id,
            'is_reparable' => $validated['is_reparable'],
            'evaluation_notes' => $validated['evaluation_notes'],
        ]);

        // Update Request Status
        if ($validated['is_reparable']) {
            $bajaRequest->update(['status' => 'EN_REPARACION']);
            // Maybe trigger a repair workflow? For now just status.
        } else {
            $bajaRequest->update(['status' => 'VALIDADO']); // Ready for Secretary approval
        }

        // Generate PDFs (Acta de Recepción & Acta de Baja)
        // For now, we'll placeholder the paths or generate them on the fly in a separate method. 
        // The requirement says: "ésta validación generará una Acta..."
        // Let's generate them now to store the path.

        // $receptionPdfPath = ...
        // $bajaPdfPath = ...

        // $validation->update([
        //    'reception_certificate_path' => $receptionPdfPath,
        //    'baja_certificate_path' => $bajaPdfPath
        // ]);

        return redirect()->back()->with('success', 'Validación registrada correctamente.');
    }

    /**
     * Secretary approves the baja (Final Step).
     */
    public function approveBaja(Request $request, MaterialBajaRequest $baja)
    {
        $user = $request->user();

        if ($user->role !== 'secretaria_adquisiciones' && $user->role !== 'admin') {
            abort(403, 'No autorizado.');
        }

        if ($baja->status !== 'VALIDADO') {
            abort(400, 'La solicitud no está validada para baja.');
        }

        $material = $baja->material;

        // Deduct stock
        if ($material) {
            $material->decrement('stock_quantity', $baja->quantity);

            // Log in general history
            \App\Models\MaterialHistory::create([
                'material_id' => $material->id,
                'user_id' => $user->id,
                'type' => 'REMOVE',
                'quantity_change' => -$baja->quantity,
                'current_balance' => $material->stock_quantity, // Decremented value
                'description' => 'Baja Aprobada (Solicitud #' . $baja->id . ')',
            ]);
        }

        // Create Baja History
        MaterialBajaHistory::create([
            'material_request_id' => $baja->id,
            'original_material_id' => $material ? $material->id : null,
            'product_name' => $material ? $material->product_name : 'Material Eliminado',
            'code' => $material ? $material->code : null,
            'quantity_removed' => $baja->quantity,
            'approved_by' => $user->id,
        ]);

        $baja->update(['status' => 'APROBADO']);

        return redirect()->back()->with('success', 'Baja aprobada y ejecutada correctamente.');
    }
    public function downloadReceptionCertificate(MaterialBajaRequest $baja)
    {
        if ($baja->status === 'PENDIENTE') {
            abort(404);
        }

        $pdf = Pdf::loadView('pdf.reception_certificate', [
            'baja' => $baja,
            'date' => now()->format('d/m/Y H:i'),
        ]);

        return $pdf->download("Acta_Recepcion_Baja_{$baja->id}.pdf");
    }

    public function downloadBajaCertificate(MaterialBajaRequest $baja)
    {
        if ($baja->status !== 'APROBADO') {
            abort(404);
        }

        $history = MaterialBajaHistory::where('material_request_id', $baja->id)->firstOrFail();

        $pdf = Pdf::loadView('pdf.baja_certificate', [
            'baja' => $baja,
            'history' => $history,
            'date' => $history->created_at->format('d/m/Y H:i'),
        ]);

        return $pdf->download("Certificado_Baja_{$baja->id}.pdf");
    }
}
