<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\EmotionController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', fn() => Inertia::render('welcome'))->name('index');
Route::get('/wall', [EmotionController::class, 'index'])->name('wall');
Route::resource('posts', PostController::class)->except('index');
Route::get('/about', fn() => Inertia::render('aboutpage/page'))->name('about');
Route::post('/react', [PostController::class, 'react'])->name('post.react');
require __DIR__.'/settings.php';
