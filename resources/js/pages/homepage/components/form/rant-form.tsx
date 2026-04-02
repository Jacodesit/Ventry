import { useForm } from "@inertiajs/react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Emotion } from "@/types/post"

type pageProps = {
    onClose: () => void
    emotions: Emotion[]
    type: 'rant' | 'secret'
}

export default function RantForm({onClose, emotions,type}:pageProps) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        nickname: string
        emotion_id: number | ''
        message: string
        custom_emotion: string
        type: string
    }>({
        nickname: '',
        emotion_id: '',
        message: '',
        custom_emotion: '',
        type: type,
    })

    useEffect(() => {
        setData('type', type)
    },[type, setData])

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        post('/posts', {
            onSuccess: () => {
                reset()
                onClose();
            }
        })
    }

    const hasEmotion = data.emotion_id !== ''
    const hasCustom = data.custom_emotion.trim() !== ''

    return (
        <div className="w-full max-w-2xl">
            <form onSubmit={submit}>
                <FieldGroup className="">
                    <Field>
                        <FieldLabel htmlFor="nickname">Nickname <span className="text-blue-500">(Optional)</span></FieldLabel>
                        <Input
                            value={data.nickname}
                            onChange={(e) => setData('nickname', e.target.value)}
                            id="nickname"
                            autoComplete="on"
                            placeholder="Hacob"
                        />
                        {errors.nickname && <p className="errors text-xs text-destructive">{errors.nickname}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="emotion">Emotion</FieldLabel>
                        <div className="flex flex-wrap gap-2">
                            {emotions.map(emotion => (
                                <button
                                    value={data.emotion_id}
                                    onClick={() => {
                                        setData('emotion_id', emotion.id)
                                        setData('custom_emotion', '')
                                    }}
                                    disabled={hasCustom}
                                    key={emotion.id}
                                    type="button"
                                    className={`flex border px-3 py-1 rounded-md gap-2 cursor-pointer transition-all duration-300
                                        ${data.emotion_id === emotion.id ? 'bg-blue-500 text-white' : 'hover:bg-accent-foreground hover:text-muted'}`}
                                >
                                    {emotion.emoji}
                                    {emotion.name}
                                </button>
                            ))}
                        </div>
                        {errors.emotion_id && <p className="errors text-xs text-destructive">{errors.emotion_id}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="custom-emotion">Describe your feeling</FieldLabel>
                        <Input
                            value={data.custom_emotion}
                            onChange={(e) => {
                                setData('custom_emotion', e.target.value)

                                if (e.target.value) {
                                    setData('emotion_id', '')
                                }
                            }}
                            disabled={hasEmotion}
                            id="custom-emotion"
                            placeholder="Put your feeling into words (e.g. stressed, calm)"
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="message">Message</FieldLabel>
                        <Textarea
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            id="message"
                            placeholder="What's on your mind?"
                            rows={20}
                            className="resize-none dark:bg-[#000000] dark:border-[#181818]"
                        />
                        {errors.message && <p className="errors text-xs text-destructive">{errors.message}</p>}
                    </Field>
                </FieldGroup>
                {/* <ScrollBar orientation="vertical" /> */}


                <Field className="flex justify-end border-t pt-2 mt-4" orientation="horizontal">
                    <Button
                        disabled={processing}
                        type="submit"
                    >
                        {processing ? 'Posting...' : 'Post'}
                    </Button>
                    <Button variant="outline" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                </Field>
            </form>
        </div>
    )
}
