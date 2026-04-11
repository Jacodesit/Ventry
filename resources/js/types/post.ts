export type Quote = {
    id: number,
    text: string,
    author: string
}

export type Feedback = {
    id: number,
    nickname: string,
    rating: number,
    feedback_message: string,
    experience_type: 'bug' | 'suggestion' | 'general_feedback' | 'feature_request',
    created_at: string
}

export type Emotion = {
    id: number,
    name: string,
    emoji: string,
}

export type Post = {
    id: number,
    type: 'rant' | 'secret',
    to_whom: string,
    nickname: string,
    emotion_id: string,
    message: string,
    custom_emotion: string
    emotion: Emotion
    reactions: Reaction[]
    music_url: string
    created_at: string
}

export type Reaction = {
    id:number,
    name: string,
    emoji: string,
    count: number
}
