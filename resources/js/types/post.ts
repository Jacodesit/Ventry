export type Emotion = {
    id: number,
    name: string,
    emoji: string,

}

export type Post = {
    id: number,
    type: 'rant' | 'secret',
    nickname: string,
    emotion_id: string,
    message: string,
    custom_emotion: string
    emotion: Emotion
    created_at: string
}

export type Reaction = {
    id:number,
    name: string,
    emoji: string,
}
