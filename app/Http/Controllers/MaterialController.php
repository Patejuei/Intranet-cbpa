<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Traits\CompanyScopeTrait;

class MaterialController extends Controller
{
    use CompanyScopeTrait;

    private function getValidPrefix($category)
    {
        $validCategories = [
            'Equipos de Protección Personal' => 'EPP',
            'Material de Extinción' => 'EXT',
            'Herramientas de Rescate' => 'RES',
            'Material Médico' => 'MED',
            'Telecomunicaciones' => 'TEL',
            'Entrada Forzada' => 'EFO',
            'Escalas' => 'ESC',
            'Ventilación' => 'VEN',
            'Riesgos Eléctricos' => 'REL',
            'Materiales Peligrosos' => 'HAZ',
        ];
        return $validCategories[$category] ?? null;
    }

    private function generateCode($prefix)
    {
        $lastMaterial = Material::where('code', 'like', $prefix . '-%')
            ->orderByRaw('CAST(SUBSTRING_INDEX(code, "-", -1) AS UNSIGNED) DESC')
            ->first();

        $nextNum = 1;
        if ($lastMaterial) {
            $parts = explode('-', $lastMaterial->code);
            if (count($parts) === 2 && is_numeric($parts[1])) {
                $nextNum = intval($parts[1]) + 1;
            }
        }

        $code = $prefix . '-' . str_pad($nextNum, 4, '0', STR_PAD_LEFT);
        while (Material::where('code', $code)->exists()) {
            $nextNum++;
            $code = $prefix . '-' . str_pad($nextNum, 4, '0', STR_PAD_LEFT);
        }
        return $code;
    }

    public function index()
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('inventory.view', $user->permissions ?? []) && !in_array('inventory.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $query = Material::query();
        $this->applyCompanyScope($query, request());

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%");
            });
        }

        return Inertia::render('inventory/index', [
            'materials' => $query->orderBy('product_name')->paginate(10)->withQueryString(),
            'filters' => request()->only(['search']) // Pass filters back to view to maintain state if needed
        ]);
    }

    public function show(Material $inventory)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('inventory.view', $user->permissions ?? [])) {
            abort(403);
        }

        // Ensure user can view this company's material
        if ($user->role !== 'admin' && $user->company !== $inventory->company) {
            abort(403);
        }

        return Inertia::render('inventory/show', [
            'material' => $inventory,
            'logs' => $inventory->logs()->with('user')->latest()->get(),
            'history' => $inventory->history()->with('user')->get(),
        ]);
    }

    public function update(Request $request, Material $inventory)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('inventory.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $validated = $request->validate([
            'product_name' => 'required|string',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'code' => 'nullable|string|unique:materials,code,' . $inventory->id,
            'serial_number' => 'nullable|string',
            'stock_quantity' => 'required|integer',
            'company' => 'required|string',
            'category' => 'nullable|string',
            'document_path' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,webp|max:10240',
        ]);

        if ($request->hasFile('document_path')) {
            $path = $request->file('document_path')->store('materials', 'public');
            $validated['document_path'] = $path;
        }

        // Constraint: If Serial Number exists, Stock max is 1.
        if (!empty($validated['serial_number']) && $validated['stock_quantity'] > 1) {
            return redirect()->back()->withErrors(['stock_quantity' => 'Items with Serial Number must have a stock of 1 (Unique Asset).']);
        }

        // Check if we need to generate (or regenerate) code
        // 1. If Code is empty AND Category is valid
        // 2. OR If Category Changed AND New Category is valid
        // Note: We check $request->category against $inventory->category
        $newCategory = $validated['category'] ?? null;
        $isNewCategoryValid = !empty($newCategory) && $newCategory !== 'Sin Categoría';
        $categoryChanged = $inventory->category !== $newCategory;

        if ($isNewCategoryValid && ($categoryChanged || empty($inventory->code))) {
            $prefix = $this->getValidPrefix($newCategory);
            if ($prefix) {
                // If regenerating, we overwrite the code.
                $validated['code'] = $this->generateCode($prefix);
            }
        }

        $oldStock = $inventory->stock_quantity;
        $inventory->fill($validated);

        $changes = $inventory->getDirty();
        $inventory->save();

        if (array_key_exists('stock_quantity', $changes)) {
            $newStock = $inventory->stock_quantity;
            $diff = $newStock - $oldStock;

            if ($diff !== 0) {
                \App\Models\MaterialHistory::create([
                    'material_id' => $inventory->id,
                    'user_id' => $user->id,
                    'type' => $diff > 0 ? 'ADD' : 'REMOVE',
                    'quantity_change' => $diff,
                    'current_balance' => $newStock,
                    'reference_type' => null, // Manual edit
                    'reference_id' => null,
                    'description' => 'Ajuste Manual de Inventario',
                ]);
            }

            // Log other changes if any
            unset($changes['stock_quantity']);
        }

        if (!empty($changes)) {
            unset($changes['updated_at']); // Don't log timestamp change

            $descriptions = [];
            foreach ($changes as $key => $newValue) {
                $oldValue = $inventory->getOriginal($key);
                $descriptions[] = "Campo '$key': '$oldValue' -> '$newValue'";
            }

            if (!empty($descriptions)) {
                \App\Models\MaterialHistory::create([
                    'material_id' => $inventory->id,
                    'user_id' => $user->id,
                    'type' => 'EDIT',
                    'quantity_change' => 0,
                    'current_balance' => $inventory->stock_quantity,
                    'reference_type' => null,
                    'reference_id' => null,
                    'description' => 'Modificación: ' . implode(' | ', $descriptions),
                ]);
            }
        }

        return redirect()->back();
    }

    public function store(Request $request)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('inventory.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $validated = $request->validate([
            'product_name' => 'required|string',
            'brand' => 'nullable|string',
            'model' => 'nullable|string',
            'code' => 'nullable|string|unique:materials',
            'serial_number' => 'nullable|string',
            'stock_quantity' => 'required|integer',
            'company' => 'required|string',
            'category' => 'nullable|string',
            'document_path' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,webp|max:10240', // Max 10MB
        ]);

        if ($request->hasFile('document_path')) {
            $path = $request->file('document_path')->store('materials', 'public');
            $validated['document_path'] = $path;
        }

        // Constraint: If Serial Number exists, Stock max is 1.
        if (!empty($validated['serial_number']) && $validated['stock_quantity'] > 1) {
            return redirect()->back()->withErrors(['stock_quantity' => 'Items with Serial Number must have a stock of 1 (Unique Asset).']);
        }

        // Generate Code if Category is valid
        $validated['code'] = null;
        if (!empty($validated['category']) && $validated['category'] !== 'Sin Categoría') {
            $prefix = $this->getValidPrefix($validated['category']);
            if ($prefix) {
                $validated['code'] = $this->generateCode($prefix);
            }
        }

        $material = Material::create($validated);

        // Log ALTA
        \App\Models\MaterialHistory::create([
            'material_id' => $material->id,
            'user_id' => $user->id,
            'type' => 'ALTA', // Use a standard type or 'ADD'
            'quantity_change' => $material->stock_quantity,
            'current_balance' => $material->stock_quantity,
            'reference_type' => null,
            'reference_id' => null,
            'description' => 'Alta de Material (Ingreso Inicial)',
        ]);

        return redirect()->back();
    }

    public function search(Request $request)
    {
        $code = $request->query('code');
        if (!$code) {
            return response()->json(null);
        }

        $user = request()->user();

        // Find match by code or serial_number
        $material = Material::where(function ($q) use ($code) {
            $q->where('code', $code)
                ->orWhere('serial_number', $code);
        });

        $this->applyCompanyScope($material, $request);

        $material = $material->first();

        return response()->json($material);
    }

    public function destroy(Material $inventory)
    {
        $user = request()->user();
        if ($user->role !== 'admin' && $user->role !== 'capitan' && $user->role !== 'comandante' && !in_array('inventory.edit', $user->permissions ?? [])) {
            abort(403);
        }

        $inventory->delete();

        return redirect()->back()->with('success', 'Material eliminado correctamente. Nota: El historial asociado se ha eliminado.');
    }

    public function import(Request $request)
    {
        $validated = $request->validate([
            'materials' => 'required|array',
            'materials.*.product_name' => 'required|string',
            'materials.*.stock_quantity' => 'required|numeric',
            'materials.*.company' => 'required|string',
        ]);

        // STRICT Category List
        $validCategories = [
            'Equipos de Protección Personal' => 'EPP',
            'Material de Extinción' => 'EXT',
            'Herramientas de Rescate' => 'RES',
            'Material Médico' => 'MED',
            'Telecomunicaciones' => 'TEL',
            'Entrada Forzada' => 'EFO',
            'Escalas' => 'ESC',
            'Ventilación' => 'VEN',
            'Riesgos Eléctricos' => 'REL',
            'Materiales Peligrosos' => 'HAZ',
        ];

        // Intelligent Keyword Mapping (Lower Case)
        $keywordMap = [
            // EPP
            'guante' => 'Equipos de Protección Personal',
            'casco' => 'Equipos de Protección Personal',
            'esclavina' => 'Equipos de Protección Personal',
            'bota' => 'Equipos de Protección Personal',
            'uniforme' => 'Equipos de Protección Personal',
            'jardinera' => 'Equipos de Protección Personal',
            'chaqueta' => 'Equipos de Protección Personal',
            'epp' => 'Equipos de Protección Personal',
            'arnes' => 'Equipos de Protección Personal',
            'cinturon' => 'Equipos de Protección Personal',

            // Extinción (EXT)
            'manguera' => 'Material de Extinción',
            'gemelo' => 'Material de Extinción',
            'bifurca' => 'Material de Extinción',
            'trifurca' => 'Material de Extinción',
            'piton' => 'Material de Extinción',
            'llave' => 'Material de Extinción',
            'extintor' => 'Material de Extinción',
            'espuma' => 'Material de Extinción',

            // Rescate (RES)
            'cuerda' => 'Herramientas de Rescate',
            'mosqueton' => 'Herramientas de Rescate',
            'cinta' => 'Herramientas de Rescate',
            'ferula' => 'Herramientas de Rescate',
            'camilla' => 'Herramientas de Rescate',
            'tripode' => 'Herramientas de Rescate',
            'holmatro' => 'Herramientas de Rescate',
            'cojin' => 'Herramientas de Rescate',

            // Médico (MED)
            'botiquin' => 'Material Médico',
            'dea' => 'Material Médico',
            'oxigeno' => 'Material Médico',
            'resuscitador' => 'Material Médico',
            'tijera' => 'Material Médico',
            'parche' => 'Material Médico',
            'suero' => 'Material Médico',

            // Telecom (TEL)
            'radio' => 'Telecomunicaciones',
            'base' => 'Telecomunicaciones',
            'antena' => 'Telecomunicaciones',
            'pila' => 'Telecomunicaciones',
            'bateria' => 'Telecomunicaciones',
            'mic' => 'Telecomunicaciones', // Microfono

            // Entrada Forzada (EFO)
            'hacha' => 'Entrada Forzada',
            'halligan' => 'Entrada Forzada',
            'maza' => 'Entrada Forzada',
            'cizalla' => 'Entrada Forzada',
            'croque' => 'Entrada Forzada',

            // Escalas (ESC)
            'escala' => 'Escalas',
            'extensible' => 'Escalas',
            'simple' => 'Escalas', // Careful with simple matches

            // Ventilación (VEN)
            'ventilador' => 'Ventilación',
            'extractor' => 'Ventilación',
            'fan' => 'Ventilación',

            // Riesgos Eléctricos (REL)
            'pertiga' => 'Riesgos Eléctricos',
            'detector' => 'Riesgos Eléctricos', // Could be HAZ too, assuming electric for now

            // Hazmat (HAZ)
            'traje' => 'Materiales Peligrosos', // Encapsulado
            'detector multigas' => 'Materiales Peligrosos',
            'absorbente' => 'Materiales Peligrosos',
        ];

        $importedCount = 0;

        foreach ($validated['materials'] as $item) {
            $inputCategory = isset($item['category']) ? trim($item['category']) : '';
            $productName = strtolower(trim($item['product_name']));

            $finalCategory = null;

            // 1. Direct Match Check
            if ($inputCategory && array_key_exists($inputCategory, $validCategories)) {
                $finalCategory = $inputCategory;
            }

            // 2. Intelligent Detection if still null
            if (!$finalCategory) {
                foreach ($keywordMap as $keyword => $cat) {
                    if (str_contains($productName, $keyword)) {
                        $finalCategory = $cat;
                        break; // Stop at first match
                    }
                }
            }

            // 3. Fallback (Default to 'Herramientas de Rescate' or 'Varios' if we had it, using strict list so RES)
            if (!$finalCategory) {
                // If input category was something else not in strict list, maybe we should respect it if we could, but requirement says "use listed ones".
                // Defaulting to 'Herramientas de Rescate' as a generic tool category
                $finalCategory = 'Herramientas de Rescate';
            }

            $prefix = $validCategories[$finalCategory]; // Guaranteed to exist

            // Auto-generate code
            $code = $item['code'] ?? null;

            if (empty($code)) {
                // Get highest code for this Prefix (e.g. EPP-%)
                // Use a atomic lock or robust method in real prod, here simplistic Approach
                $lastMaterial = Material::where('code', 'like', $prefix . '-%')
                    ->orderByRaw('CAST(SUBSTRING_INDEX(code, "-", -1) AS UNSIGNED) DESC') // Improved numeric sort
                    ->first();

                $nextNum = 1;
                if ($lastMaterial) {
                    $parts = explode('-', $lastMaterial->code);
                    if (count($parts) === 2 && is_numeric($parts[1])) {
                        $nextNum = intval($parts[1]) + 1;
                    }
                }

                $code = $prefix . '-' . str_pad($nextNum, 4, '0', STR_PAD_LEFT);

                // Double check uniqueness locally within this batch to avoid collisions if inserting many of same cat
                // (Though 'create' happens inside loop, so DB is source of truth)
                while (Material::where('code', $code)->exists()) {
                    $nextNum++;
                    $code = $prefix . '-' . str_pad($nextNum, 4, '0', STR_PAD_LEFT);
                }
            }

            Material::create([
                'product_name' => $item['product_name'],
                'brand' => $item['brand'] ?? null,
                'model' => $item['model'] ?? null,
                'code' => $code,
                'stock_quantity' => $item['stock_quantity'] ?? 0,
                'company' => $item['company'],
                'category' => $finalCategory,
                'serial_number' => $item['serial_number'] ?? null,
            ]);

            $importedCount++;
        }

        return redirect()->back()->with('success', $importedCount . ' materiales importados y clasificados correctamente.');
    }
}
