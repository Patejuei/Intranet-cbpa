<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RepairRequest;
use App\Models\Firefighter;
use App\Models\ReceptionCertificate;
use App\Models\ReceptionItem;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class RepairRequestController extends Controller
{
    public function index()
    {
        // Add filtering logic based on user role if needed
        $requests = RepairRequest::with(['material', 'requester', 'inspector'])->latest()->get();
        return Inertia::render('equipment/repairs/index', [
            'requests' => $requests
        ]);
    }

    public function create()
    {
        return Inertia::render('equipment/repairs/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'material_id' => 'required|exists:materials,id',
            'description' => 'required|string',
        ]);

        RepairRequest::create([
            ...$validated,
            'requested_by' => auth()->id(),
            'status' => 'PENDING',
        ]);

        return redirect()->route('equipment.repairs.index')->with('success', 'Solicitud de reparación creada.');
    }

    public function show($id)
    {
        $repairRequest = RepairRequest::with(['material', 'requester', 'inspector', 'receptionCertificate', 'deliveryCertificate'])->findOrFail($id);
        return Inertia::render('equipment/repairs/show', [
            'repairRequest' => $repairRequest
        ]);
    }

    // Inspector Action: Receive Item (Generate Reception Certificate)
    public function receive(Request $request, $id)
    {
        $repairRequest = RepairRequest::findOrFail($id);

        // Find the firefighter profile of the requester (Captain)
        // Assuming link via RUT or Email
        $requesterUser = \App\Models\User::find($repairRequest->requested_by);
        $firefighter = Firefighter::where('rut', $requesterUser->rut)->first();

        // Create Reception Certificate if firefighter found
        $certId = null;
        if ($firefighter) {
            // Calculate correlative
            $lastCorrelative = ReceptionCertificate::where('company', 'Comandancia')->max('correlative');
            $nextCorrelative = $lastCorrelative ? $lastCorrelative + 1 : 1;

            $cert = ReceptionCertificate::create([
                'firefighter_id' => $firefighter->id,
                'user_id' => auth()->id(), // Inspector receiving
                'date' => now(),
                'observations' => 'Recepción por Solicitud de Reparación #' . $repairRequest->id,
                'company' => 'Comandancia', // Received at HQ
                'correlative' => $nextCorrelative,
                'assignment_type' => 'company', // From Company to HQ
            ]);

            ReceptionItem::create([
                'reception_certificate_id' => $cert->id,
                'material_id' => $repairRequest->material_id,
                'quantity' => 1,
            ]);

            // Move Stock: Decrease from Company (Requester's Company)
            // Logic handled in ReceptionCertificateController usually involves checking assignment type.
            // Here we assume the item is physically moving.
            // We should decrement from the source company?
            // The material belongs to a company.
            $material = $repairRequest->material;
            // If material is in a company, decrement stock there?
            // "Material Menor" logic is complex. For now, we trust the Certificate record as the doc.
            // Adjusting stock might double-count if we are not careful with how standard Receptions work.
            // Let's stick to generating the document for now. 

            $certId = $cert->id;
        }

        $repairRequest->update([
            'inspector_id' => auth()->id(),
            'inspection_date' => now(),
            'status' => 'RECEIVED_BY_INSPECTOR',
            'reception_certificate_id' => $certId,
        ]);

        return redirect()->back()->with('success', 'Material recepcionado para inspección.');
    }

    // Inspector Action: Evaluate (Approve or Reject)
    public function evaluate(Request $request, $id)
    {
        $repairRequest = RepairRequest::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:APPROVED,REJECTED',
            'observation' => 'nullable|string',
        ]);

        $repairRequest->update([
            'status' => $validated['status'] === 'APPROVED' ? 'APPROVED' : 'REJECTED',
            'inspection_observation' => $validated['observation'],
        ]);

        return redirect()->back()->with('success', 'Evaluación registrada.');
    }

    // Acquisitions Action: Send to Provider (Generate Delivery Certificate)
    public function sendToProvider(Request $request, $id)
    {
        $repairRequest = RepairRequest::findOrFail($id);
        $validated = $request->validate([
            'provider_name' => 'required|string',
            'repair_description' => 'required|string',
        ]);

        $repairRequest->update([
            'status' => 'SENT_TO_PROVIDER',
            'provider_name' => $validated['provider_name'],
            'repair_description' => $validated['repair_description'],
            'delivery_date' => now(),
        ]);

        return redirect()->back()->with('success', 'Enviado a proveedor.');
    }

    public function downloadProviderAct($id)
    {
        $repairRequest = RepairRequest::with(['material', 'requester', 'inspector'])->findOrFail($id);

        $data = [
            'request' => $repairRequest,
            'date' => now()->format('d-m-Y H:i'),
            'title' => 'Acta de Entrega a Proveedor',
        ];

        $pdf = Pdf::loadView('pdf.repair-provider-act', $data);
        return $pdf->download('acta-entrega-proveedor-' . $repairRequest->id . '.pdf');
    }

    // Acquisitions Action: Finish Repair (Register Invoice)
    public function finish(Request $request, $id)
    {
        $repairRequest = RepairRequest::findOrFail($id);
        $validated = $request->validate([
            'invoice_number' => 'required|string',
            'repair_cost' => 'required|numeric',
            'invoice_file' => 'nullable|file|mimes:pdf,jpg,png',
        ]);

        $path = null;
        if ($request->hasFile('invoice_file')) {
            $path = $request->file('invoice_file')->store('invoices', 'public');
        }

        $repairRequest->update([
            'status' => 'FINISHED',
            'invoice_number' => $validated['invoice_number'],
            'repair_cost' => $validated['repair_cost'],
            'invoice_path' => $path,
            'return_date' => now(),
        ]);

        return redirect()->back()->with('success', 'Reparación finalizada.');
    }
}
