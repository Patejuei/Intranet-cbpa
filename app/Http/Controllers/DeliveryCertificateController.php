<?php

namespace App\Http\Controllers;

use App\Models\DeliveryCertificate;
use App\Models\Firefighter;
use App\Models\Material;
use App\Models\DeliveryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

use App\Traits\CompanyScopeTrait;

class DeliveryCertificateController extends Controller
{
    use CompanyScopeTrait;

    public function index()
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('deliveries.view', $user->permissions ?? []) && !in_array('deliveries.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $query = DeliveryCertificate::with('firefighter', 'user', 'items.material')->latest();
        $this->applyCompanyScope($query, request());

        return Inertia::render('deliveries/index', [
            'certificates' => $query->paginate(10)
        ]);
    }

    public function create()
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('deliveries.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $firefightersQuery = Firefighter::query();
        $materialsQuery = Material::query()->where('stock_quantity', '>', 0);

        $this->applyCompanyScope($firefightersQuery, request());
        $this->applyCompanyScope($materialsQuery, request());

        return Inertia::render('deliveries/create', [
            'firefighters' => $firefightersQuery->get(),
            'materials' => $materialsQuery->get()
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('deliveries.edit', $user->permissions ?? [])) {
            abort(403);
        }

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
            // Calculate correlative
            $lastCorrelative = DeliveryCertificate::where('company', $validated['company'])->max('correlative');
            $nextCorrelative = $lastCorrelative ? $lastCorrelative + 1 : 1;

            $certificate = DeliveryCertificate::create([
                'firefighter_id' => $validated['firefighter_id'],
                'user_id' => $request->user()->id,
                'date' => $validated['date'],
                'observations' => $validated['observations'],
                'company' => $validated['company'],
                'correlative' => $nextCorrelative,
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
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('deliveries.view', $user->permissions ?? []) && !in_array('deliveries.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $delivery->load('firefighter', 'user', 'items.material');
        return Inertia::render('deliveries/show', [
            'certificate' => $delivery
        ]);
    }

    public function downloadPdf(DeliveryCertificate $delivery)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && !in_array('deliveries.view', $user->permissions ?? []) && !in_array('deliveries.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $delivery->load('firefighter', 'user', 'items.material');
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.delivery-certificate', ['certificate' => $delivery]);
        return $pdf->download('acta-entrega-' . $delivery->id . '.pdf');
    }
}
