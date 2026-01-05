<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AssignedMaterial;
use App\Models\Firefighter;
use Inertia\Inertia;

class AssignedMaterialController extends Controller
{
  public function index(Request $request)
  {
    $user = $request->user();

    // Authorization Check
    $hasAccess = $user->role === 'admin' ||
      $user->role === 'capitan' ||
      $user->role === 'comandante' ||
      ($user->role === 'inspector' && $user->department === 'Material Menor') ||
      in_array('assigned_materials', $user->permissions ?? []) ||
      in_array('assigned_materials.view', $user->permissions ?? []);

    if (!$hasAccess) {
      abort(403, 'Acceso denegado a este módulo.');
    }

    $search = $request->input('search');
    $companyFilter = $request->input('company');

    $query = Firefighter::with(['assignedMaterials.material']);
    // Removed the whereHas('assignedMaterials') constraint to show ALL firefighters

    if ($search) {
      $query->where(function ($q) use ($search) {
        $q->where('full_name', 'like', "%{$search}%")
          ->orWhere('rut', 'like', "%{$search}%");
      });
    }

    // Company Permissions logic
    if ($user->company === 'Comandancia' || $user->role === 'admin' || $user->role === 'comandante') {
      if ($companyFilter) {
        $query->where('company', $companyFilter);
      }
    } else {
      // Enforce user's company
      $query->where('company', $user->company);
    }

    return Inertia::render('equipment/assigned/index', [
      'firefighters' => $query->paginate(20)->withQueryString(),
      'filters' => $request->only(['search', 'company']),
      'can_filter_company' => ($user->company === 'Comandancia' || $user->role === 'admin' || $user->role === 'comandante')
    ]);
  }

  public function show(Firefighter $firefighter)
  {
    // Authorization Check
    $user = request()->user();
    $hasAccess = $user->role === 'admin' ||
      $user->role === 'capitan' ||
      $user->role === 'comandante' ||
      ($user->role === 'inspector' && $user->department === 'Material Menor') ||
      in_array('assigned_materials', $user->permissions ?? []) ||
      in_array('assigned_materials.view', $user->permissions ?? []);

    if (!$hasAccess) {
      abort(403, 'Acceso denegado a este módulo.');
    }

    $firefighter->load(['assignedMaterials.material', 'assignedMaterials' => function ($q) {
      $q->where('quantity', '>', 0);
    }]);

    return Inertia::render('equipment/assigned/show', [
      'firefighter' => $firefighter
    ]);
  }

  public function getByFirefighter(Firefighter $firefighter)
  {
    // API endpoint for Reception form
    return response()->json(
      $firefighter->assignedMaterials()
        ->with('material')
        ->where('quantity', '>', 0)
        ->get()
    );
  }
}
