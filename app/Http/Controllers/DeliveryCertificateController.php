<?php

namespace App\Http\Controllers;

use App\Models\DeliveryCertificate;
use App\Models\Firefighter;
use App\Models\Material;
use App\Models\DeliveryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DeliveryCertificateController extends Controller
{
    public function index()
    {
        $user = request()->user();
        $query = DeliveryCertificate::with('firefighter', 'user', 'items.material')->latest();

        if ($user->role !== 'admin' && $user->company) {
            $query->where('company', $user->company);
        }

        return Inertia::render('deliveries/index', [
            'certificates' => $query->get()
        ]);
    }

    public function create()
    {
        $user = request()->user();

        $firefightersQuery = Firefighter::query();
        $materialsQuery = Material::query()->where('stock_quantity', '>', 0);

        if ($user->role !== 'admin' && $user->company) {
            $firefightersQuery->where('company', $user->company);
            $materialsQuery->where('company', $user->company);
        }

        return Inertia::render('deliveries/create', [
            'firefighters' => $firefightersQuery->get(),
            'materials' => $materialsQuery->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'firefighter_id' => 'required|exists:firefighters,id',
            'date' => 'required|date',
            'observations' => 'nullable|string',
            'company' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.material_id' => 'required|exists:materials,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $certificate = DeliveryCertificate::create([
                'firefighter_id' => $validated['firefighter_id'],
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'observations' => $validated['observations'],
                'company' => $validated['company'],
            ]);

            foreach ($validated['items'] as $item) {
                DeliveryItem::create([
                    'delivery_certificate_id' => $certificate->id,
                    'material_id' => $item['material_id'],
                    'quantity' => $item['quantity'],
                ]);

                // Decrement stock
                $material = Material::findOrFail($item['material_id']);
                $material->decrement('stock_quantity', $item['quantity']);
            }
        });

        return redirect()->route('deliveries.index');
    }

    public function show(DeliveryCertificate $delivery)
    {
        $delivery->load('firefighter', 'user', 'items.material');
        return Inertia::render('deliveries/show', [
            'certificate' => $delivery
        ]);
    }

    public function downloadPdf(DeliveryCertificate $delivery)
    {
        $delivery->load('firefighter', 'user', 'items.material');
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.delivery-certificate', ['certificate' => $delivery]);
        return $pdf->download('acta-entrega-' . $delivery->id . '.pdf');
    }
}
