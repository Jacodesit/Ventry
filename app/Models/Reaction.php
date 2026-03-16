<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reaction extends Model
{
    protected $fillable = [
        'name',
        'emoji'
    ];

    public function posts() {
        return $this->belongsTo(Post::class);
    }
}
