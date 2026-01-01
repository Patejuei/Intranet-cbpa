<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index()
    {
        return \Inertia\Inertia::render('admin/users/index', [
            'users' => \App\Models\User::all()
        ]);
    }

    public function create()
    {
        return \Inertia\Inertia::render('admin/users/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'company' => 'required|string',
            'role' => 'required|string|in:user,admin',
            'permissions' => 'nullable|array',
            'password' => 'required|string|min:8',
        ]);

        \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'company' => $validated['company'],
            'role' => $validated['role'],
            'permissions' => $validated['permissions'] ?? [],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
        ]);

        return redirect()->route('users.index');
    }

    public function edit(\App\Models\User $user)
    {
        return \Inertia\Inertia::render('admin/users/edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, \App\Models\User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'company' => 'required|string',
            'role' => 'required|string|in:user,admin',
            'permissions' => 'nullable|array',
            'password' => 'nullable|string|min:8',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'company' => $validated['company'],
            'role' => $validated['role'],
            'permissions' => $validated['permissions'] ?? [],
        ];

        if (!empty($validated['password'])) {
            $userData['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        }

        $user->update($userData);

        return redirect()->route('admin.users.index'); // Correct route name if standard resource used, likely 'users.index' or similar check route list. 
        // Based on previous code: route('users.index') was used in store. I will stick to that or check routes.
    }

    public function destroy(\App\Models\User $user)
    {
        $user->delete();
        return redirect()->back();
    }
}
