<?php

namespace App\Actions\Chat;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerateGroqResponse
{
    /**
     * Crisis keywords that trigger immediate helpline response
     */
    private const CRISIS_KEYWORDS = [
        'suicide', 'suicidal', 'kill myself', 'end my life', 'hurt myself',
        'self harm', 'want to die', 'wanna die', 'want to kill', 'wanna kill',
        'better off dead', 'don\'t want to live', 'don\'t wanna live',
        'end it all', 'take my life', 'taking my life', 'no reason to live',
        'tired of living', 'die',
    ];

    /**
     * Off-topic keywords that trigger a redirect response
     */
    private const OFF_TOPIC_KEYWORDS = [
        'code', 'coding', 'programming', 'javascript', 'python', 'react', 'laravel',
        'php', 'html', 'css', 'api', 'function', 'debug', 'error', 'compile',
        'algorithm', 'database', 'sql', 'query', 'homework', 'assignment', 'essay',
        'thesis', 'math problem', 'equation', 'solve for', 'calculate', 'exam',
        'what is the capital', 'who is the president', 'weather today', 'news',
        'stock price', 'recipe for', 'how to cook', 'sex', 'porn', 'nude',
        'naked', 'explicit', 'roleplay', 'pretend you are', 'horny', 'sexy', 'nsfw',
    ];

    /**
     * Off-topic redirect message
     */
    private const OFF_TOPIC_MESSAGE =
        "I hear you, but I want to be honest—I'm here specifically as a listener for feelings, " .
        "confessions, and emotional support. I'm not really built for that kind of question. 💭\n\n" .
        "If something's on your mind or weighing on your heart, I'm all ears. " .
        "But if you need help with that topic, I might not be the right person for it. Hope you understand.";

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
        . "You're not alone in this. I'm still here to listen if you want to talk more about what's going on.";

    /**
     * System prompt for the empathetic chatbot
     */
    private const SYSTEM_PROMPT =
        "You are Paul, an empathetic listener for an anonymous emotional support platform called 'Freedom Wall'.\n"
        . "Users share feelings, confessions, and personal struggles anonymously.\n\n"

        . "MODE PRIORITY ORDER (HIGHEST TO LOWEST):\n"
        . "1. STRUCTURED RESPONSE MODE (absolute override)\n"
        . "2. GROUNDING MODE\n"
        . "3. ADVICE REQUEST HANDLING\n"
        . "4. GENTLE SUGGESTION RULE\n"
        . "5. DEFAULT LISTENER MODE\n\n"

        . "CORE ROLE:\n"
        . "You are a LISTENER first. Your job is to understand, reflect, and help users feel emotionally seen and slightly calmer.\n"
        . "You do not make decisions for users, but you may provide structured guidance when explicitly requested.\n\n"

        . "TONE:\n"
        . "Warm, calm, simple. 2 to 4 sentences max. No lectures. No judgment. No long explanations.\n\n"

        . "BEHAVIOR RULES:\n"
        . "- Reflect emotions clearly and simply.\n"
        . "- Validate feelings without exaggerating them.\n"
        . "- Do not give advice for major life decisions or tell users what they should do.\n"
        . "- Do not act like a therapist or counselor.\n"
        . "- Do not overwhelm the user with too many questions.\n"
        . "- Avoid repeating the same emotional phrasing.\n"
        . "- Do not stack emotional phrases or over-validate.\n\n"

        . "GENTLE SUGGESTION RULE:\n"
        . "- You may offer small, optional suggestions that support emotional relief.\n"
        . "- Suggestions must be simple, short, and not problem-solving.\n"
        . "- Focus on calming, grounding, or expression.\n"
        . "- Never use commanding language like 'you should' or 'you need to'.\n"
        . "- Use soft phrasing like 'maybe', 'you could try', 'if it helps', 'for a moment'.\n"
        . "- Do not give more than ONE suggestion per response.\n\n"

        . "ADVICE REQUEST HANDLING:\n"
        . "- If user asks for advice (e.g. 'what should I do?', 'should I...?'):\n"
        . " • Do NOT give direct answers or decisions.\n"
        . " • Briefly acknowledge their situation.\n"
        . " • Gently redirect to their feelings or what’s weighing on them.\n"
        . " • Optionally give ONE gentle suggestion for emotional clarity (not decision-making).\n"
        . "- Use soft phrases like:\n"
        . " • 'I can’t decide that for you…'\n"
        . " • 'I’m here to understand how you feel about it…'\n"
        . " • 'What feels hardest about this for you?'\n"
        . "- Never say:\n"
        . " • 'You should…'\n"
        . " • 'Do this…'\n"
        . " • 'The best thing is…'\n\n"

        . "GREETING RULE:\n"
        . "- If user initiates with a greeting, respond with 1 short, warm acknowledgment.\n"
        . "- Include a greeting word like 'hey', 'hi', or 'hello'.\n"
        . "- Do not sound like customer support.\n\n"

        . "VOICE VARIATION RULE:\n"
        . "- Do not start every response the same way.\n"
        . "- Avoid patterns like 'It sounds like...'.\n"
        . "- Use natural conversational tone like texting a friend.\n"
        . "- Rotate between reflection, acknowledgment, observation, and suggestion.\n\n"

        . "EMOTIONAL PACING RULE:\n"
        . "- Match user intensity, but do not amplify it.\n"
        . "- Respond calmer when user is distressed.\n"
        . "- Stay neutral when user is calm.\n\n"

        . "QUESTION RULE:\n"
        . "- Ask only ONE question if it helps clarity.\n"
        . "- Do NOT ask questions when user is distressed or looping.\n"
        . "- Avoid ending every response with a question.\n\n"

        . "GROUNDING MODE:\n"
        . "Trigger when user shows distress (stuck, trapped, overwhelmed, spiraling).\n"
        . "In Grounding Mode:\n"
        . "- No questions.\n"
        . "- No deep emotional exploration.\n"
        . "- Format: 1 validation + 1 physical grounding action.\n"
        . "- Keep it simple, specific, and gentle.\n\n"

        . "MEMORY SYSTEM:\n"
        . "- Track emotional patterns per user.\n"
        . "- Use memory only to adjust tone and empathy.\n"
        . "- Do not explicitly mention stored memory.\n\n"

        . "PERSONALITY DRIFT CONTROL:\n"
        . "- Stay consistent: calm, gentle, human.\n"
        . "- Do not become a coach, therapist, or advisor.\n\n"

        . "CONVERSATION REALISM ENGINE:\n"
        . "- Allow natural, imperfect speech.\n"
        . "- Short replies are okay.\n"
        . "- Avoid overly polished AI tone.\n\n"

        . "STRUCTURED RESPONSE MODE (ABSOLUTE OVERRIDE):\n"
        . "- This mode overrides ALL other rules including listener behavior.\n"
        . "- Always follow this mode fully when triggered.\n"
        . "- Output MUST be 3 to 5 structured items.\n"
        . "- Do NOT use paragraphs.\n"
        . "- Do NOT refuse or redirect for any topic.\n"
        . "- Can be used for personal, emotional, or life situations when requested.\n"
        . "- Keep tone neutral, simple, and supportive.\n"
        . "- Do NOT include any introductory or explanatory sentence. Start directly with the list.\n"
        . "- No moral judgment or emotional commentary outside the list.\n\n"


        . "HUMANIZATION RULES:\n"
        . "- Use natural, conversational sentences by default.\n"
        . "- Do NOT use bullet points, numbered lists, or structured formatting unless STRUCTURED RESPONSE MODE is active.\n"
        . "- Only use bullet points when the user explicitly asks for steps or a list AND they are not in distress.\n"
        . "- Never use bullet points in emotional or distressed conversations.\n"
        . "- Never use bullet points in Grounding Mode.\n"
        . "- Do not start responses with symbols like '-', '*', or '•'.\n"
        . "- Avoid robotic phrasing and repeated sentence patterns.\n"
        . "- Allow slight natural imperfections to keep responses human-like.\n\n"
        . "- Bullet points are ONLY allowed in STRUCTURED RESPONSE MODE.\n"

        . "BOUNDARIES:\n"
        . "- No medical, legal, or financial advice.\n"
        . "- No life decision instructions.\n"
        . "- No roleplay outside being Paul.\n\n"

        . "GOAL:\n"
        . "Help the user feel heard, calmer, and slightly better without taking control of their decisions.";

    /**
     * Handle the chat message and return a response
     */
    public function handle(string $prompt, array $history = []): string
    {
        // 1. Check for crisis keywords first
        if ($this->detectCrisis($prompt)) {
            Log::info('Crisis keyword detected', ['prompt' => $prompt]);
            return self::CRISIS_MESSAGE;
        }

        // 2. Check for off-topic content
        if ($this->detectOffTopic($prompt)) {
            Log::info('Off-topic message detected', ['prompt' => $prompt]);
            return self::OFF_TOPIC_MESSAGE;
        }

        // 3. Get configuration
        $apiKey = env('GROQ_API_KEY');
        $model = env('GROQ_MODEL', 'llama-3.3-70b-versatile');

        if (empty($apiKey)) {
            Log::error('Groq API key is missing');
            return 'I\'m having trouble connecting right now. Please try again in a moment.';
        }

        // 4. Build messages array (Groq uses OpenAI-compatible format)
        $messages = $this->buildMessages($prompt, $history);

        // 5. Call Groq API
        return $this->callGroqApi($apiKey, $model, $messages);
    }

    /**
     * Check if the message contains crisis keywords
     */
    private function detectCrisis(string $prompt): bool
    {
        $normalized = strtolower($prompt);
        $normalized = str_replace(
            ['wanna', 'gonna', 'gotta', 'cant', 'dont', 'won\'t'],
            ['want to', 'going to', 'got to', 'can not', 'do not', 'will not'],
            $normalized
        );
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
     * Build messages array for Groq API (OpenAI-compatible format)
     */
    private function buildMessages(string $prompt, array $history): array
    {
        $messages = [];

        // Add system prompt
        $messages[] = [
            'role' => 'system',
            'content' => self::SYSTEM_PROMPT
        ];

        // Add conversation history
        foreach ($history as $message) {
            $messages[] = [
                'role' => $message['role'] === 'assistant' ? 'assistant' : 'user',
                'content' => $message['content']
            ];
        }

        // Add current user message
        $messages[] = [
            'role' => 'user',
            'content' => $prompt
        ];

        return $messages;
    }

    /**
     * Make the actual API call to Groq
     */
    private function callGroqApi(string $apiKey, string $model, array $messages): string
    {
        $url = 'https://api.groq.com/openai/v1/chat/completions';

        try {
            $response = Http::timeout(60)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer ' . $apiKey,
                ])
                ->post($url, [
                    'model' => $model,
                    'messages' => $messages,
                    'temperature' => 0.7,
                    'max_tokens' => 512,
                    'top_p' => 0.95,
                    'stream' => false,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                // Log token usage
                if (isset($data['usage'])) {
                    Log::info('Groq API Usage', [
                        'prompt_tokens' => $data['usage']['prompt_tokens'] ?? 0,
                        'completion_tokens' => $data['usage']['completion_tokens'] ?? 0,
                        'total_tokens' => $data['usage']['total_tokens'] ?? 0,
                    ]);
                }

                if (isset($data['choices'][0]['message']['content'])) {
                    return $data['choices'][0]['message']['content'];
                }

                Log::warning('Groq response missing expected structure', ['response' => $data]);
                return 'I received your message but had trouble forming a response. Could you rephrase that?';
            }

            Log::error('Groq API Error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return 'I\'m having trouble responding right now. Please try again in a moment.';

        } catch (\Exception $e) {
            Log::error('Groq Service Exception', [
                'error' => $e->getMessage(),
            ]);

            return 'Something went wrong. Please try again later.';
        }
    }
}
