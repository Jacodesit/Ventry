<?php

namespace Database\Seeders;

use App\Models\Emotion;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmotionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $emotions = [
            ['name' => 'Happy', 'emoji' => '🙂'],
            ['name' => 'Sad', 'emoji' => '😔'],
            ['name' => 'Angry', 'emoji' => '😡'],
            ['name' => 'Stressed', 'emoji' => '😰'],
            ['name' => 'Frustrated', 'emoji' => '😤'],
            ['name' => 'Relieved', 'emoji' => '😌'],
            ['name' => 'Confused', 'emoji' => '🤔'],
            ['name' => 'Excited', 'emoji' => '🤩'],
            ['name' => 'Grateful', 'emoji' => '🥹'],
            ['name' => 'Lonely', 'emoji' => '😞'],
            ['name' => 'Anxious', 'emoji' => '😟'],
            ['name' => 'Embarrassed', 'emoji' => '😳'],
            ['name' => 'Tired', 'emoji' => '😴'],
            ['name' => 'Hopeful', 'emoji' => '🌤️'],
        ];

        foreach ($emotions as $emotion) {
            Emotion::firstOrCreate($emotion);
        }
    }
}
