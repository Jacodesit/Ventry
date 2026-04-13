<?php

namespace App\Actions\Chat;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerateGeminiResponse
{
    /**
     * Crisis keywords that trigger immediate helpline response
     */
    private const CRISIS_KEYWORDS = [
        // Direct statements
        'suicide',
        'suicidal',
        'kill myself',
        'end my life',
        'hurt myself',
        'self harm',
        'die',

        // Variations with contractions
        'want to die',
        'wanna die',
        'want to kill',
        'wanna kill',
        'wanna end',
        'want to end',

        // Phrases
        'better off dead',
        'don\'t want to live',
        'don\'t wanna live',
        'end it all',
        'take my life',
        'taking my life',
        'no reason to live',
        'tired of living',
    ];

    /**
     * Off-topic keywords that trigger a redirect response
     */
    private const OFF_TOPIC_KEYWORDS = [
        // Technical/Programming
        'code', 'coding', 'programming', 'javascript', 'python', 'react', 'laravel',
        'php', 'html', 'css', 'api', 'function', 'debug', 'error', 'compile',
        'algorithm', 'database', 'sql', 'query', 'backend', 'frontend', 'framework',
        'npm', 'composer', 'git', 'github', 'stack overflow',

        // Homework/Academic
        'homework', 'assignment', 'essay', 'thesis', 'math problem', 'equation',
        'solve for', 'calculate', 'research paper', 'exam', 'test answer',
        'due tomorrow', 'plagiarism', 'citation', 'bibliography',

        // General Knowledge
        'what is the capital', 'who is the president', 'weather today', 'news',
        'stock price', 'sports score', 'recipe for', 'how to cook', 'directions to',
        'what time is', 'translate this', 'meaning of life',

        // Inappropriate/Roleplay
        'sex', 'porn', 'nude', 'naked', 'explicit', 'roleplay', 'pretend you are',
        'dirty', 'nsfw', 'sext', 'hookup',
    ];

    /**
     * Off-topic redirect message
     */
    private const OFF_TOPIC_MESSAGE =
        "I hear you, but I want to be honest—I'm here specifically as a listener for feelings, " .
        "confessions, and emotional support. I'm not really built for that kind of question. 💭\n\n" .
        "If something's on your mind or weighing on your heart, I'm all ears. " .
        "But if you need help with that topic, I might not be the right person for it. Hope you understand. 😊";

    /**
     * Crisis helpline message (Philippines)
     */
    private const CRISIS_MESSAGE =
        "I'm really glad you reached out. What you're feeling matters, and you deserve support. "
        . "If things feel overwhelming, please consider contacting a crisis hotline:\n\n"
        . "📞 **NCMH Crisis Hotline (Philippines)**\n"
        . "• 1553 (landline, toll-free)\n"
        . "• 0966 351 4518 (Globe/TM)\n"
        . "• 0917 899 8727 (USAP)\n\n"
        . "If you're in immediate danger, please call **911** or go to the nearest emergency room.\n\n"
        . "You're not alone in this. I'm still here to listen if you want to talk more about what's going on. 😊";

    /**
     * System prompt for the empathetic chatbot
     */
    private const SYSTEM_PROMPT =
        "You are Paul, an empathetic listener for an anonymous emotional support platform called 'Freedom Wall'. "
        . "Users share feelings, confessions, and personal struggles anonymously.\n\n"
        . "YOUR ROLE: Respond with warmth, validation, and gentle support. Never judge. "
        . "Use a warm, conversational tone. Ask thoughtful follow-up questions when appropriate. "
        . "Never suggest harmful actions.\n\n"
        . "BOUNDARIES: If a user asks for technical help, homework answers, facts, or anything unrelated to emotions, "
        . "gently redirect them back to emotional sharing. Never provide medical, legal, or financial advice. "
        . "Never roleplay or pretend to be someone else.";

    /**
     * Handle the chat message and return a response
     */
    public function handle(string $prompt, array $history = []): string
    {
        // 1. Check for crisis keywords first (highest priority)
        if ($this->detectCrisis($prompt)) {
            Log::info('Crisis keyword detected in chat message', ['prompt' => $prompt]);
            return self::CRISIS_MESSAGE;
        }

        // 2. Check for off-topic content
        if ($this->detectOffTopic($prompt)) {
            Log::info('Off-topic message detected', ['prompt' => $prompt]);
            return self::OFF_TOPIC_MESSAGE;
        }

        // 3. Get configuration
        $model = env('GEMINI_MODEL', 'gemini-2.5-flash-lite');
        $apiKey = env('GEMINI_API_KEY');

        if (empty($apiKey)) {
            Log::error('Gemini API key is missing');
            return 'I\'m having trouble connecting right now. Please try again in a moment.';
        }

        // 4. Build the conversation payload
        $contents = $this->buildConversationContext($prompt, $history);

        // 5. Call Gemini API
        return $this->callGeminiApi($model, $apiKey, $contents);
    }

    /**
     * Check if the message contains crisis keywords
     */
    private function detectCrisis(string $prompt): bool
    {
        // Normalize the text
        $normalized = strtolower($prompt);

        // Expand common contractions
        $normalized = str_replace(
            ['wanna', 'gonna', 'gotta', 'cant', 'dont', 'won\'t', 'im', 'i\'m'],
            ['want to', 'going to', 'got to', 'can not', 'do not', 'will not', 'i am', 'i am'],
            $normalized
        );

        // Remove punctuation for cleaner matching
        $normalized = preg_replace('/[^\w\s]/', '', $normalized);

        foreach (self::CRISIS_KEYWORDS as $keyword) {
            if (str_contains($normalized, $keyword)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if the message is off-topic
     */
    private function detectOffTopic(string $prompt): bool
    {
        $normalized = strtolower($prompt);
        $normalized = preg_replace('/[^\w\s]/', '', $normalized);

        foreach (self::OFF_TOPIC_KEYWORDS as $keyword) {
            if (str_contains($normalized, $keyword)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Build the conversation context array for the API
     */
    private function buildConversationContext(string $prompt, array $history): array
    {
        $contents = [];

        // Add system prompt as a user-model exchange
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => self::SYSTEM_PROMPT]]
        ];
        $contents[] = [
            'role' => 'model',
            'parts' => [['text' => "I understand. I'm Paul, and I'm here to listen with warmth and without judgment. What would you like to share?"]]
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

        return $contents;
    }

    /**
     * Make the actual API call to Gemini
     */
    private function callGeminiApi(string $model, string $apiKey, array $contents): string
    {
        $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/';
        $url = $baseUrl . $model . ':generateContent?key=' . $apiKey;

        try {
            $response = Http::timeout(60)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($url, [
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

                // Log token usage
                if (isset($data['usageMetadata'])) {
                    Log::info('Gemini API Usage', [
                        'prompt_tokens' => $data['usageMetadata']['promptTokenCount'] ?? 0,
                        'response_tokens' => $data['usageMetadata']['candidatesTokenCount'] ?? 0,
                        'total_tokens' => $data['usageMetadata']['totalTokenCount'] ?? 0,
                    ]);
                }

                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    return $data['candidates'][0]['content']['parts'][0]['text'];
                }

                Log::warning('Gemini response missing expected structure', [
                    'response' => $data
                ]);

                return 'I received your message but had trouble forming a response. Could you rephrase that?';
            }

            Log::error('Gemini API Error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return 'I\'m having trouble responding right now. Please try again in a moment.';

        } catch (\Exception $e) {
            Log::error('Gemini Service Exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return 'Something went wrong. Please try again later.';
        }
    }
}
