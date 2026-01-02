<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

trait CompanyScopeTrait
{
  /**
   * Apply company filtering logic to a query.
   *
   * @param \Illuminate\Database\Eloquent\Builder $query
   * @param \Illuminate\Http\Request $request
   * @return \Illuminate\Database\Eloquent\Builder
   */
  protected function applyCompanyScope(Builder $query, Request $request)
  {
    $user = $request->user();

    // 1. Admin: Full Access (Can filter if parameter exists)
    if ($user->role === 'admin') {
      if ($request->filled('company')) {
        $query->where('company', $request->company);
      }
      return $query;
    }

    // 2. Comandancia: Full Access (Can filter if parameter exists)
    if ($user->company === 'Comandancia') {
      if ($request->filled('company')) {
        $query->where('company', $request->company);
      }
      return $query;
    }

    // 3. Others: Restricted to their company
    if ($user->company) {
      $query->where('company', $user->company);
    }

    return $query;
  }
}
