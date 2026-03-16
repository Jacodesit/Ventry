<?php

namespace App\Http\Controllers;

use App\Models\Emotion;
use App\Models\Post;
use App\Models\Reaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $emotions = Emotion::all();
        $reactions = Reaction::all();
        $posts = Post::with('emotion')->latest()->get();

        return inertia::render('homepage/page', [
            'emotions' => $emotions,
            'reactions' => $reactions,
            'posts' => $posts
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
