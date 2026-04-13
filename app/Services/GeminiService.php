<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $baseUrl;
    protected string $model;
    protected string $apiKey;

    public function __construct()
    {
        $this->baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/';
        $this->model = env('GEMINI_MODEL', 'gemini-2.5-flash-lite');
        $this->apiKey = env('GEMINI_API_KEY');
    }

    /**
     * Generate a text response from Gemini
     */
    public function generateText(string $prompt, array $history = []): string
    {
        $systemPrompt = "You are an empathetic listener for an anonymous emotional support platform called 'Freedom Wall'. " .
                       "Users share feelings, confessions, and personal struggles anonymously. " .
                       "Your role: Respond with warmth, validation, and gentle support. Never judge. " .
                       "Ask thoughtful follow-up questions when appropriate. " .
                       "If you detect mentions of self-harm or crisis, gently suggest professional resources.";

        // Build the contents array with system prompt, history, and current message
        $contents = [];

        // Add system prompt as first user message (Gemini doesn't have native system role)
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $systemPrompt]]
        ];
        $contents[] = [
            'role' => 'model',
            'parts' => [['text' => "I understand. I'm here to listen with warmth and without judgment. What would you like to share?"]]
        ];

        // Add conversation history
        foreach ($history as $message) {
            $contents[] = [
                'role' => $message['role'],
                'parts' => [['text' => $message['content']]]
            ];
        }

        // Add current user message
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $prompt]]
        ];

        try {
            $response = Http::timeout(60)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($this->baseUrl . $this->model . ':generateContent?key=' . $this->apiKey, [
                    'contents' => $contents,
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 1024,
                        'topP' => 0.95,
                        'topK' => 40,
                    ],
                    'safetySettings' => [
                        [
                            'category' => 'HARM_CATEGORY_HARASSMENT',
                            'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                        ],
                        [
                            'category' => 'HARM_CATEGORY_HATE_SPEECH',
                            'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                        ],
                        [
                            'category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                            'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                        ],
                        [
                            'category' => 'HARM_CATEGORY_DANGEROUS_CONTENT',
                            'threshold' => 'BLOCK_MEDIUM_AND_ABOVE'
                        ]
                    ]
                ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['candidates'][0]['content']['parts'][0]['text'] ?? 'I apologize, but I could not generate a response.';
            }

            Log::error('Gemini API Error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return 'I am having trouble responding right now. Please try again in a moment.';

        } catch (\Exception $e) {
            Log::error('Gemini Service Exception', ['error' => $e->getMessage()]);
            return 'Something went wrong. Please try again later.';
        }
    }

    /**
     * Stream a response from Gemini (for typing effect)
     */
    public function streamText(string $prompt, array $history = [])
    {
        $systemPrompt = "You are an empathetic listener for an anonymous emotional support platform called 'Freedom Wall'. " .
                       "Users share feelings, confessions, and personal struggles anonymously. " .
                       "Your role: Respond with warmth, validation, and gentle support. Never judge.";

        $contents = [];

        // Build contents similar to generateText method
        $contents[] = ['role' => 'user', 'parts' => [['text' => $systemPrompt]]];
        $contents[] = ['role' => 'model', 'parts' => [['text' => "I understand. I'm here to listen."]]];

        foreach ($history as $message) {
            $contents[] = [
                'role' => $message['role'],
                'parts' => [['text' => $message['content']]]
            ];
        }

        $contents[] = ['role' => 'user', 'parts' => [['text' => $prompt]]];

        $response = Http::timeout(60)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->post($this->baseUrl . $this->model . ':streamGenerateContent?key=' . $this->apiKey, [
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 1024,
                ]
            ]);

        return $response->toPsrResponse()->getBody();
    }
}
