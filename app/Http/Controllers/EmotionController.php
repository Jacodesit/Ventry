<?php

namespace App\Http\Controllers;

use App\Models\Emotion;
use App\Models\Feedback;
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
    public function index(Request $request)
    {
        $emotions = Emotion::all();
        $reactions = Reaction::all();
        $feedback = Feedback::all();

        $filter = $request->query('filter');

        $query = Post::with('emotion');

        if ($filter === 'rant') {
            $query->where('type', 'rant');
        } elseif ($filter === 'secret') {
            $query->where('type', 'secret');
        }

        $posts = $query->orderBy('created_at', 'desc')->paginate(10);

        if ($filter) {
            $posts->appends(['filter' => $filter]);
        }

        foreach ($posts as $post) {
            $reactionGroups = PostReaction::where('post_id', $post->id)
                ->select('reaction_id', DB::raw('COUNT(*) as count'))
                ->groupBy('reaction_id')
                ->get();

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
            $post->reactions = $formattedReactions;
        }

        return Inertia::render('homepage/page', [
            'emotions' => $emotions,
            'reactions' => $reactions,
            'posts' => $posts,
            'feedback' => $feedback,
            'filters' => [
                'type' => $filter
            ]
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
