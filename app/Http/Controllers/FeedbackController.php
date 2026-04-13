<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = $request->query('filter');

        $feedback = Feedback::when($filter && $filter !== 'All', function ($query) use ($filter) {
            $query->where('rating', $filter);
        })
        ->latest()
        ->get();

        return Inertia::render('feedback/page', [
            'feedback' => $feedback,
            'filter' => $filter ?? 'All'
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
        $validated = $request->validate([
            'nickname' => 'nullable|string|max:50',
            'rating'   => 'nullable|integer|min:1|max:5',
            'experience_type' => 'required|string|in:bug,feature_request,general_feedback,suggestion',
            'feedback_message' => 'required|string|max:500'
        ]);

        $validated['ip_address'] = $request->ip();

        Feedback::create($validated);

        return redirect()->back();
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
