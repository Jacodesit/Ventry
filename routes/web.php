<?php

use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\EmotionController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\QuoteController;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', fn() => Inertia::render('welcome'))->name('index');
Route::get('/wall', [EmotionController::class, 'index'])->name('wall');
Route::resource('posts', PostController::class)->except('index');
Route::get('/about', fn() => Inertia::render('aboutpage/page'))->name('about');
Route::post('/react', [PostController::class, 'react'])->name('post.react');
Route::get('/quotes', [QuoteController::class, 'getQuote'])->name('post.quote');
Route::get('/feedback', [FeedbackController::class, 'index'])->name('index.feedback');

// For submtting a feedback
Route::post('/feedback', [FeedbackController::class, 'store'])->name('post.feedback');

// Chatbot related routes
Route::get('/chatbot', [ChatbotController::class, 'index'])->name('chatbot.index');
Route::post('/chatbot/send', [ChatbotController::class, 'sendMessage'])->name('chatbot.send');
Route::post('/chatbot/stream', [ChatbotController::class, 'streamMessage'])->name('chatbot.stream');

// Route::get('/test-chat', function () {
//     $generator = new \App\Actions\Chat\GenerateGeminiResponse();

//     $prompt = "I have so many friends but I've never felt more alone. I'm always the one making people laugh, but when I go home, it's just silence. Nobody really knows the real me. I feel like I'm disappearing and no one would even notice.
// ";

//     $response = $generator->handle($prompt, []);

//     return response()->json([
//         'prompt' => $prompt,
//         'response' => $response
//     ]);
// });

require __DIR__.'/settings.php';
