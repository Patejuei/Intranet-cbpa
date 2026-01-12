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
            'Seguridad' => 'SEG',
            'Otro' => 'OTH'
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
            return redirect()->back()->withErrors(['stock_quantity' => 'Los items con Serial Number deben tener un stock de 1 (Objeto Único).']);
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
            return redirect()->back()->withErrors(['stock_quantity' => 'Los items con Serial Number deben tener un stock de 1 (Objeto Único).']);
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
            'materials.*.brand' => 'nullable|string',
            'materials.*.model' => 'nullable|string',
            'materials.*.stock_quantity' => 'required|numeric',
            'materials.*.company' => 'required|string',
            'materials.*.serial_number' => 'nullable|string',
            'materials.*.category' => 'nullable|string',
            'materials.*.code' => 'nullable|string',
        ]);



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

        $count = 0;
        foreach ($validated['materials'] as $item) {
            // Force defaults: Category is 'Sin Categoría' if not provided
            $category = $item['category'] ?? 'Sin Categoría';
            // Code is null for import
            $code = null;

            // Create Material
            $material = Material::create([
                'product_name' => $item['product_name'],
                'brand' => $item['brand'] ?? null,
                'model' => $item['model'] ?? null,
                'stock_quantity' => $item['stock_quantity'] ?? 0,
                'company' => $item['company'],
                'serial_number' => $item['serial_number'] ?? null,
                'category' => $category,
                'code' => $code,
            ]);

            // Create History Log (Alta)
            \App\Models\MaterialHistory::create([
                'material_id' => $material->id,
                'user_id' => $request->user()->id,
                'type' => 'ALTA',
                'quantity_change' => $material->stock_quantity,
                'current_balance' => $material->stock_quantity,
                'reference_type' => null,
                'reference_id' => null,
                'description' => 'Importación Masiva',
            ]);

            $count++;
        }

        return redirect()->back()->with('success', $count . ' materiales importados y clasificados correctamente.');
    }

    public function importViper(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        $file = $request->file('file');

        try {
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file->getPathname());
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray();
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['file' => 'Error al leer el archivo Excel: ' . $e->getMessage()]);
        }

        // Load Dictionary
        $dictionary = json_decode(file_get_contents(resource_path('js/types/viper-category-dictionary.json')), true);

        $count = 0;
        // Skip header row (index 0)
        for ($i = 1; $i < count($rows); $i++) {
            $row = $rows[$i];

            // Adjust indices to 0-based array from 1-based column description
            // Col 2 (Lugar) -> index 1
            // Col 3 (Familia) -> index 2
            // Col 5 (Producto) -> index 4
            // Col 6 (Marca) -> index 5
            // Col 9 (Serie) -> index 8
            // Col 10 (Cantidad) -> index 9

            $lugar = $row[1] ?? '';
            $familia = $row[2] ?? '';
            $productName = $row[4] ?? '';
            $brand = $row[5] ?? '';
            $serial = $row[8] ?? '';
            $quantity = $row[9] ?? 0;

            if (empty($productName)) continue; // Skip empty rows

            // Parse Company
            $company = 'Comandancia'; // Default
            if (str_contains($lugar, 'Cuartel Primera') || str_contains($lugar, 'Primera Compañía')) $company = 'Primera Compañía';
            elseif (str_contains($lugar, 'Cuartel Segunda') || str_contains($lugar, 'Segunda Compañía')) $company = 'Segunda Compañía';
            elseif (str_contains($lugar, 'Cuartel Tercera') || str_contains($lugar, 'Tercera Compañía')) $company = 'Tercera Compañía';
            elseif (str_contains($lugar, 'Cuartel Cuarta') || str_contains($lugar, 'Cuarta Compañía')) $company = 'Cuarta Compañía';
            elseif (str_contains($lugar, 'Cuartel Quinta') || str_contains($lugar, 'Quinta Compañía')) $company = 'Quinta Compañía';
            elseif (str_contains($lugar, 'Cuartel Séptima') || str_contains($lugar, 'Séptima Compañía')) $company = 'Séptima Compañía';
            elseif (str_contains($lugar, 'Cuartel Octava') || str_contains($lugar, 'Octava Compañía')) $company = 'Octava Compañía';
            elseif (str_contains($lugar, 'Cuartel Novena') || str_contains($lugar, 'Novena Compañía')) $company = 'Novena Compañía';
            elseif (str_contains($lugar, 'Cuartel Décima') || str_contains($lugar, 'Décima Compañía')) $company = 'Décima Compañía';

            // Parse Category
            $category = $this->parseViperCategory($familia, $dictionary);

            // Generate code
            $prefix = $this->getValidPrefix($category);
            if ($prefix) {
                $code = $this->generateCode($prefix);
            }

            // Create
            $material = Material::create([
                'product_name' => $productName,
                'brand' => $brand ?: null,
                'model' => null,
                'stock_quantity' => (int)$quantity,
                'company' => $company,
                'serial_number' => $serial ?: null,
                'category' => $category,
                'code' => $code ?? null,
            ]);

            \App\Models\MaterialHistory::create([
                'material_id' => $material->id,
                'user_id' => $request->user()->id,
                'type' => 'ALTA', // Use a standard type or 'ADD'
                'quantity_change' => $material->stock_quantity,
                'current_balance' => $material->stock_quantity,
                'reference_type' => null,
                'reference_id' => null,
                'description' => 'Importación VIPER',
            ]);

            $count++;
        }

        return redirect()->back()->with('success', "Importación VIPER completada. $count items procesados.");
    }

    private function parseViperCategory($familiaString, $dictionary)
    {
        $parts = explode('->', $familiaString);
        // Trim all parts
        $parts = array_map('trim', $parts);

        $first = $parts[0] ?? '';
        $second = $parts[1] ?? '';
        $third = $parts[2] ?? '';

        // Rule 1: First Element
        if ($first === 'COMUNICACIONES') return 'Telecomunicaciones';
        if ($first === 'Equipos de Protección Personal') return 'Equipos de Protección Personal';
        if ($first === 'Otros') return 'Otro';

        // Rule 2: Second Element Logic
        if ($second === 'Detectores') {
            if ($third === 'Detector Multigas' || $third === 'Detector de gas') return 'Materiales Peligrosos';
            if ($third === 'Detector de corriente alterna') return 'Riesgos Eléctricos';
            return 'Material de Extinción';
        }

        // Dictionary Lookup
        foreach ($dictionary as $catKey => $keywords) {
            if (in_array($second, $keywords)) {
                return $catKey;
            }
        }

        // Blank logic
        if (empty($second)) return 'Sin Categoría';

        // Implicit fallback
        return 'Sin Categoría';
    }
}
