<?php

namespace App\Http\Controllers;

use App\Models\PettyCashRendition;
use App\Models\PettyCashAttachment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PettyCashController extends Controller
{
  public function index(Request $request)
  {
    $user = $request->user();

    // Roles: mechanic (creator), inspector (reviewer), comandante (final reviewer), admin (all)
    // Inspector checks: Role 'inspector' AND Dept 'Material Mayor'
    $isInspector = $user->role === 'inspector' && trim($user->department) === 'Material Mayor';
    $isMechanic = $user->role === 'mechanic';
    $isComandante = $user->role === 'comandante' || $user->role === 'admin'; // Admin gets super powers

    $query = PettyCashRendition::with(['user', 'inspector', 'comandante', 'attachments'])->latest();

    if ($isMechanic) {
      // Mechanic sees their own renditions
      $query->where('user_id', $user->id);
    } elseif ($isInspector) {
      // Inspector sees all? Or only pending/processed?
      // Usually they need to see everything to manage history.
      // Maybe default filter to 'pending' in frontend?
    } elseif ($isComandante) {
      // See everything.
    } else {
      abort(403, 'Unauthorized');
    }

    $renditions = $query->paginate(15);

    return Inertia::render('vehicles/petty-cash/index', [
      'renditions' => $renditions,
      'userRole' => $user->role,
      'canVisaInspector' => $isInspector,
      'canVisaComandante' => $isComandante,
    ]);
  }

  public function create()
  {
    return Inertia::render('vehicles/petty-cash/create');
  }

  public function store(Request $request)
  {
    $request->validate([
      'amount' => 'required|integer|min:1',
      'description' => 'nullable|string',
      'attachments' => 'required|array|min:1',
      'attachments.*' => 'file|mimes:jpeg,png,jpg,pdf|max:10240', // 10MB max
    ]);

    $rendition = PettyCashRendition::create([
      'user_id' => $request->user()->id,
      'amount' => $request->amount,
      'description' => $request->description,
      'status' => 'pending_inspector', // Direct to inspector? Or draft first? User said: "Registra -> Se envia" usually implies strict flow. Let's make it direct for simplicity unless "save draft" is needed. Assuming direct submit.
    ]);

    if ($request->hasFile('attachments')) {
      foreach ($request->file('attachments') as $file) {
        $path = $file->store('petty_cash', 'public');
        PettyCashAttachment::create([
          'rendition_id' => $rendition->id,
          'file_path' => $path,
          'file_name' => $file->getClientOriginalName(),
          'mime_type' => $file->getClientMimeType(),
        ]);
      }
    }

    return redirect()->route('vehicles.petty-cash.index')->with('success', 'Rendición creada correctamente.');
  }

  public function show(PettyCashRendition $pettyCash)
  {
    $pettyCash->load(['user', 'inspector', 'comandante', 'rejectedBy', 'attachments']);

    $user = request()->user();
    $isInspector = $user->role === 'inspector' && trim($user->department) === 'Material Mayor';
    $isComandante = $user->role === 'comandante' || $user->role === 'admin';

    return Inertia::render('vehicles/petty-cash/show', [
      'rendition' => $pettyCash,
      'canVisaInspector' => $isInspector,
      'canVisaComandante' => $isComandante,
    ]);
  }

  public function review(Request $request, PettyCashRendition $pettyCash)
  {
    $request->validate([
      'action' => 'required|in:approve,reject',
      'reason' => 'nullable|required_if:action,reject|string',
    ]);

    $user = $request->user();
    $isInspector = $user->role === 'inspector' && trim($user->department) === 'Material Mayor';
    $isComandante = $user->role === 'comandante' || $user->role === 'admin';

    if ($request->action === 'reject') {
      $pettyCash->update([
        'status' => 'rejected',
        'rejected_by' => $user->id,
        'rejected_at' => now(),
        'rejection_reason' => $request->reason,
      ]);
      return back()->with('success', 'Rendición rechazada.');
    }

    // Approve Logic
    if ($pettyCash->status === 'pending_inspector') {
      if (!$isInspector && !$isComandante) abort(403, 'No autorizado para revisar como Inspector.');

      $pettyCash->update([
        'status' => 'pending_comandante',
        'inspector_id' => $user->id,
        'inspector_vised_at' => now(),
      ]);
      return back()->with('success', 'Visado por Inspector exitoso.');
    }

    if ($pettyCash->status === 'pending_comandante') {
      if (!$isComandante) abort(403, 'No autorizado para revisar como Comandante.');

      $pettyCash->update([
        'status' => 'approved',
        'comandante_id' => $user->id,
        'comandante_vised_at' => now(),
      ]);
      // Logic: "Liberado a pago" (Freed for payment) - implied by status Approved.
      return back()->with('success', 'Rendición aprobada y liberada a pago.');
    }

    return back()->with('error', 'Estado no válido para aprobación.');
  }

  public function viewAttachment(PettyCashRendition $pettyCash, PettyCashAttachment $attachment)
  {
    if ($attachment->rendition_id !== $pettyCash->id) {
      abort(404);
    }

    // Permissions check (same as show)
    $user = request()->user();
    $isInspector = $user->role === 'inspector' && trim($user->department) === 'Material Mayor';
    $isComandante = $user->role === 'comandante' || $user->role === 'admin';
    $isOwner = $user->id === $pettyCash->user_id;

    if (!$isInspector && !$isComandante && !$isOwner) {
      abort(403);
    }

    $path = Storage::disk('public')->path($attachment->file_path);

    if (!file_exists($path)) {
      // Try without 'public' prefix if stored differently, but we used store('...', 'public')
      // store('petty_cash', 'public') -> storage/app/public/petty_cash/file
      // Storage::disk('public')->path() -> storage/app/public/petty_cash/file
      abort(404, 'File not found');
    }

    return response()->file($path);
  }
}
