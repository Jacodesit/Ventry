<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';

    protected $fillable = [
        'nickname',
        'message',
        'to_whom',
        'music_url',
        'emotion_id',
        'custom_emotion',
        'ip_address',
        'type'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationship with emotion
    public function emotion()
    {
        return $this->belongsTo(Emotion::class);
    }

    // CORRECT relationship through pivot table
    public function postReactions()
    {
        return $this->hasMany(PostReaction::class, 'post_id');
    }

    // CORRECT many-to-many relationship
    public function reactionList()
    {
        return $this->belongsToMany(Reaction::class, 'post_reactions', 'post_id', 'reaction_id')
                    ->withPivot('ip_address')
                    ->withTimestamps();
    }
}
