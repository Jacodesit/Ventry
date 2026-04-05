<?php

namespace App\Http\Controllers;

use App\Models\Emotion;
use App\Models\Post;
use App\Models\PostReaction;
use App\Models\Reaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class EmotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $emotions = Emotion::all();
        $reactions = Reaction::all();
        $posts = Post::with('emotion')
                    ->orderBy('created_at', 'desc')
                    ->get();

        // Manually add reaction data to each post
        foreach ($posts as $post) {
            // Get reaction counts using the PostReaction model
            $reactionGroups = PostReaction::where('post_id', $post->id)
                ->select('reaction_id', DB::raw('COUNT(*) as count'))
                ->groupBy('reaction_id')
                ->get();

            // Format reactions for the frontend
            $formattedReactions = [];
            foreach ($reactionGroups as $group) {
                $reaction = $reactions->firstWhere('id', $group->reaction_id);
                if ($reaction) {
                    $formattedReactions[] = [
                        'id' => $reaction->id,
                        'emoji' => $reaction->emoji,
                        'name' => $reaction->name,
                        'count' => $group->count
                    ];
                }
            }

            // Add the reactions to the post object
            $post->reactions = $formattedReactions;
        }

        return Inertia::render('homepage/page', [
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
