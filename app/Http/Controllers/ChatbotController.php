<?php

// namespace App\Http\Controllers;

// use App\Actions\Chat\GenerateGeminiResponse;
// use App\Services\GeminiService;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Log;
// use Inertia\Inertia;

// class ChatbotController extends Controller
// {
//     protected GeminiService $gemini;

//     public function __construct(GeminiService $gemini)
//     {
//         $this->gemini = $gemini;
//     }

//     /**
//      * Show the chat interface
//      */
//     public function index()
//     {
//         return Inertia::render('chatbot/page');
//     }

//     /**
//      * Handle chat message and return response
//      */
//     public function sendMessage(Request $request, GenerateGeminiResponse $generator)
//     {
//         $request->validate([
//             'message' => 'required|string|max:500',
//             'history' => 'sometimes|array'
//         ]);

//         try {
//             $response = $generator->handle(
//                 $request->input('message'),
//                 $request->input('history', [])
//             );

//             return response()->json([
//                 'response' => $response
//             ]);
//         } catch (\Exception $e) {
//             Log::error('Chatbot Controller Error', ['error' => $e->getMessage()]);
//             return response()->json([
//                 'response' => 'I am having trouble responding right now. Please try again in a moment.'
//             ], 500);
//         }
//     }

//     /**
//      * Stream chat response
//      */
//     public function streamMessage(Request $request)
//     {
//         $request->validate([
//             'message' => 'required|string|max:500',
//             'history' => 'sometimes|array'
//         ]);

//         $stream = $this->gemini->streamText(
//             $request->input('message'),
//             $request->input('history', [])
//         );

//         return response()->stream(function () use ($stream) {
//             while (!$stream->eof()) {
//                 $chunk = $stream->read(1024);
//                 // Parse the SSE format from Gemini
//                 $lines = explode("\n", $chunk);
//                 foreach ($lines as $line) {
//                     if (str_starts_with($line, 'data: ')) {
//                         $data = json_decode(substr($line, 6), true);
//                         $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
//                         if ($text) {
//                             echo "data: " . json_encode(['text' => $text]) . "\n\n";
//                             ob_flush();
//                             flush();
//                         }
//                     }
//                 }
//             }
//             echo "data: [DONE]\n\n";
//             ob_flush();
//             flush();
//         }, 200, [
//             'Content-Type' => 'text/event-stream',
//             'Cache-Control' => 'no-cache',
//             'X-Accel-Buffering' => 'no',
//         ]);
//     }
// }

namespace App\Http\Controllers;

use App\Actions\Chat\GenerateGroqResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ChatbotController extends Controller
{
    public function index()
    {
        return Inertia::render('Chatbot/Index');
    }

    public function sendMessage(Request $request, GenerateGroqResponse $generator)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'sometimes|array'
        ]);

        try {
            $response = $generator->handle(
                $request->input('message'),
                $request->input('history', [])
            );

            return response()->json([
                'response' => $response
            ]);
        } catch (\Exception $e) {
            Log::error('Chatbot Controller Error', ['error' => $e->getMessage()]);
            return response()->json([
                'response' => 'I am having trouble responding right now. Please try again in a moment.'
            ], 500);
        }
    }
}
