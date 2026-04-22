<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HelpController extends Controller
{
    /**
     * Display the manual.
     */
    public function index(Request $request, $section = 'general', $submodule = null)
    {
        return Inertia::render('help/index', [
            'activeSection' => $section,
            'activeSubmodule' => $submodule,
        ]);
    }
}
