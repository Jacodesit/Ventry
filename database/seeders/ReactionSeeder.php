<?php

namespace Database\Seeders;

use App\Models\Reaction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reactions = [
            ['name' => 'Happy', 'emoji' => '🙂'],
            ['name' => 'Sad', 'emoji' => '😔'],
            ['name' => 'Love', 'emoji' => '❤️'],
            ['name' => 'Laugh', 'emoji' => '😂'],
            ['name' => 'Sad', 'emoji' => '😔'],
            ['name' => 'Angry', 'emoji' => '😡'],
            ['name' => 'Surprised', 'emoji' => '😲'],
        ];

        foreach($reactions as $reaction) {
            Reaction::firstOrCreate($reaction);
        }
    }
}
