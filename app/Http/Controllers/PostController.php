<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $type = $request->input('type');

        $ip = $request->ip();
        $lastPost = Post::where('ip_address', $ip)
            ->latest()
            ->first();

        $rules = [
            'nickname' => 'nullable|string|max:50',
            'message'  => 'required|string|max:1000',
            'to_whom'  => 'nullable|string|max:50',
            'music_url'=> 'nullable|url'
        ];

        if ($type === 'rant') {
            $rules['emotion_id'] = 'nullable|integer|exists:emotions,id|required_without:custom_emotion';
            $rules['custom_emotion'] = 'nullable|string|max:30|required_without:emotion_id';
        }

        if ($lastPost) {
            $secondsPassed = Carbon::parse($lastPost->created_at)->diffInSeconds(now());

            if ($secondsPassed < 10) {
                $remaining = 10 - $secondsPassed;

                return back()->withErrors([
                    'cooldown' => "Wait {$remaining}s before posting again."
                ]);
            }
        }

        $validated = $request->validate($rules);

        $validated['ip_address'] = $request->ip();
        $validated['type'] = $type;

        Post::create($validated);

        return redirect('/wall');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //
    }
}
