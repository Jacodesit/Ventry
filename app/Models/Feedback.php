<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $fillable = [
        'nickname',
        'rating',
        'experience_type',
        'feedback_message',
        'ip_address',
        'would_recommend',
    ];
}
