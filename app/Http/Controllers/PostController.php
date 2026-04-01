<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

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

        $rules = [
            'nickname' => 'nullable|string|max:50',
            'message'  => 'required|string|max:1000',
            'to_whom'  => 'nullable|string|max:50',
        ];

        if ($type === 'rant') {
            $rules['emotion_id'] = 'nullable|integer|exists:emotions,id|required_without:custom_emotion';
            $rules['custom_emotion'] = 'nullable|string|max:30|required_without:emotion_id';
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
