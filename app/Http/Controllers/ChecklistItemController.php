<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChecklistItem;

class ChecklistItemController extends Controller
{
    public function index(Request $request)
    {
        $user = request()->user();
        if (!$user) abort(403);

        // Determine if user can configure other companies
        // "El Usuario de Rol de Inspector de Material Mayor podrá configurar el formato de Checklist de Cualquier compañía"
        // Admin, Comandante, or Inspector MM can select company.
        $canConfigureAll = false;
        if ($user->role === 'admin' || $user->role === 'comandante') {
            $canConfigureAll = true;
        } elseif ($user->role === 'inspector' && trim($user->department) === 'Material Mayor') {
            $canConfigureAll = true;
        }

        $targetCompany = $request->input('company', $user->company);

        // If user cannot configure all, force targetCompany to be their own.
        // Unless they are editing global? Actually usually users edit their own company items + view global.
        // But prompt says "specifying the Company to configure".
        // Let's assume if not canConfigureAll, they only see/edit their own.
        if (!$canConfigureAll) {
            $targetCompany = $user->company;
        }

        // Fetch items for the target company OR Global items?
        // Usually configuration means "What items appear for this company".
        // Global items appear for everyone.
        // If we selecting a company to configure, we probably want to see Global + Specific for that company.

        $items = ChecklistItem::where('is_active', true)
            ->where(function ($q) use ($targetCompany) {
                // If configuring Comandancia, maybe only Comandancia items?
                // Or Global + Comandancia.
                // Generally: Global (null) OR targetCompany.
                $q->where('company', $targetCompany)
                    ->orWhereNull('company');
            })
            ->get()
            ->groupBy('category');

        return \Inertia\Inertia::render('vehicles/checklist/configure', [
            'items' => $items,
            'canConfigureAll' => $canConfigureAll,
            'currentCompany' => $targetCompany,
            'companies' => $canConfigureAll ? \App\Models\User::distinct()->whereNotNull('company')->pluck('company') : [],
            // Better to get companies from Vehicles or config? Or just distinct users? 
            // Or maybe just a hardcoded list of main companies + Comandancia.
            // Let's stick to distinct from somewhere or just pass current.
            // For now, passing 'companies' as a prop would be good if we have a list.
            // Let's rely on frontend or just distinct existing companies in users.
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user) abort(403);

        // Determine if user can configure other companies (copied from index)
        $canConfigureAll = false;
        if ($user->role === 'admin' || $user->role === 'comandante') {
            $canConfigureAll = true;
        } elseif ($user->role === 'inspector' && trim($user->department) === 'Material Mayor') {
            $canConfigureAll = true;
        }

        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'short_name' => 'required|string|max:255',
            'full_name' => 'required|string|max:255',
            'company' => $canConfigureAll ? 'nullable|string' : 'prohibited', // Only allow company selection if authorized
        ]);

        $targetCompany = $user->company; // Default to user's company

        if ($canConfigureAll && !empty($validated['company'])) {
            $targetCompany = $validated['company'];
        } elseif (!$canConfigureAll && !empty($validated['company'])) {
            // If user tried to specify a company but isn't authorized, force their own.
            // This case should be caught by validation 'prohibited' but as a safeguard.
            $targetCompany = $user->company;
        }

        ChecklistItem::create([
            'short_name' => $validated['short_name'],
            'full_name' => $validated['full_name'],
            'category' => $validated['category'],
            'company' => $targetCompany, // Use specific company if set and allowed, otherwise user's company
            'is_active' => true,
        ]);

        return back()->with('success', 'Item creado.');
    }

    public function destroy(\App\Models\ChecklistItem $checklistItem)
    {
        $user = request()->user();
        // Only allow deleting own company items? 
        // Or admin/capitan can delete anything?
        // Let's restrict to same company if not admin.
        if ($user->role !== 'admin' && $checklistItem->company && $checklistItem->company !== $user->company) {
            abort(403, 'No puede eliminar items de otra compañía.');
        }

        $checklistItem->update(['is_active' => false]);
        return back()->with('success', 'Item eliminado.');
    }
}
