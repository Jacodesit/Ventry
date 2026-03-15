<?php

use App\Http\Controllers\EmotionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', fn() => Inertia::render('welcome'))->name('index');
Route::get('/wall', [EmotionController::class, 'index'])->name('wall');

require __DIR__.'/settings.php';
