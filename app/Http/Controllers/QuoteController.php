<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;

class QuoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getQuote(): JsonResponse
    {
        $totalQuotes = Quote::count();

        if ($totalQuotes === 0) {
            return response()->json(null);
        }

        $dayOfYear = now()->dayOfYear;
        $index = $dayOfYear % $totalQuotes;

        $quote = Quote::skip($index)->first();

        return response()->json($quote);
    }


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
