<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostReaction extends Model
{
    protected $table = 'post_reactions';

    protected $fillable = [
        'post_id',
        'reaction_id',
        'ip_address'
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function reaction()
    {
        return $this->belongsTo(Reaction::class);
    }
}
