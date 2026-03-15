<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable  = [
        'emotion_id',
        'nickname',
        'message',
        'custom_emotion',
        'ip_address',
        'expires_at',
        'expires_at',
    ];
}
