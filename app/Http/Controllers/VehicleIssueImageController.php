<?php

namespace App\Http\Controllers;

use App\Models\VehicleIssue;
use App\Models\VehicleIssueImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VehicleIssueImageController extends Controller
{
    public function store(Request $request, VehicleIssue $incident)
    {
        if (!$incident->canBeEditedBy($request->user())) {
            abort(403, 'No tiene permisos para editar esta incidencia.');
        }

        if ($incident->images()->count() >= 3) {
            return back()->withErrors(['image' => 'Se pueden añadir hasta un máximo de tres imágenes por incidencia.']);
        }

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $file = $request->file('image');
        $originalName = $file->getClientOriginalName();
        
        // Store in a subdirectory for the issue
        $path = $file->store("vehicle_issues/{$incident->id}", 'public');

        VehicleIssueImage::create([
            'vehicle_issue_id' => $incident->id,
            'image_path' => $path,
            'original_name' => $originalName,
            'uploaded_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Imagen añadida correctamente.');
    }

    public function download(VehicleIssueImage $image)
    {
        $user = request()->user();
        $incident = $image->issue;

        // Reuse view permissions from VehicleIssueController
        $canView = $user->role === 'admin' || 
                   $user->company === 'Comandancia' || 
                   $incident->vehicle->company === $user->company ||
                   $incident->reporter_id === $user->id;

        if (!$canView) {
            if ($user->role === 'mechanic' && $incident->sent_to_workshop) {
                $canView = true;
            }
            if ($user->role === 'inspector' && $user->department === 'Material Mayor' && $incident->sent_to_hq) {
                $canView = true;
            }
        }

        if (!$canView) {
            abort(403, 'No tiene permisos para ver o descargar esta imagen.');
        }

        if (!Storage::disk('public')->exists($image->image_path)) {
            abort(404, 'El archivo no existe.');
        }

        return response()->file(
            Storage::disk('public')->path($image->image_path),
            ['Content-Disposition' => 'attachment; filename="' . $image->original_name . '"']
        );
    }

    public function destroy(VehicleIssueImage $image)
    {
        $user = request()->user();
        $incident = $image->issue;

        if (!$incident->canDeleteImagesBy($user)) {
            abort(403, 'No tiene permisos para eliminar esta imagen.');
        }

        // Delete from storage
        if (Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();

        return back()->with('success', 'Imagen eliminada correctamente.');
    }
}
