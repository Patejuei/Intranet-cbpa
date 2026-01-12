<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Firefighter;

class MyProfileController extends Controller
{
  public function show(Request $request)
  {
    $user = $request->user();

    // Find linked Firefighter profile by RUT (primary) or Email (fallback)
    $query = Firefighter::query();

    if ($user->rut) {
      $query->where('rut', $user->rut);
    } else {
      $query->where('email', $user->email);
    }

    $firefighter = $query->with(['assignedMaterials' => function ($q) {
      // Filter only currently assigned items (quantity > 0)
      $q->where('quantity', '>', 0)->with('material');
    }])
      ->first();

    // Double check fallback if RUT search yielded nothing but user has email
    if (!$firefighter && $user->rut && $user->email) {
      $firefighter = Firefighter::where('email', $user->email)
        ->with(['assignedMaterials' => function ($q) {
          $q->where('quantity', '>', 0)->with('material');
        }])
        ->first();
    }

    return Inertia::render('my-profile/index', [
      'firefighter' => $firefighter,
      'assignedMaterials' => $firefighter ? $firefighter->assignedMaterials : [],
    ]);
  }
}
