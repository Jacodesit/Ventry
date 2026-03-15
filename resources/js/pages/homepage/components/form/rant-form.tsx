import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
import {
    Field,
    //   FieldDescription,
    FieldGroup,
    FieldLabel,
    // FieldLegend,
    // FieldSeparator,
    // FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { Emotion } from "@/types/post"
import { Textarea } from "@/components/ui/textarea"

type pageProps = {
    onClose: () => void
    emotions: Emotion[]
}

export default function RantForm({onClose, emotions}:pageProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nickname: '',
        emoji_id: '',
        message: ''
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        post('/posts', {
            onSuccess: () => {
                reset()
                onClose();
            }
        })

    }

    return (
        <div className="w-full max-w-2xl">
            <form onSubmit={submit}>
                <FieldGroup>
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
                                    value={data.emoji_id}
                                    onChange={(e) => setData('emoji_id', e.target.value)}
                                    key={emotion.id}
                                    type="button"
                                    className="flex border px-3 py-1 rounded-md gap-2 cursor-pointer transition-all duration-300 hover:bg-accent-foreground hover:text-muted"
                                >
                                    {emotion.emoji}
                                    {emotion.name}
                                </button>
                            ))}
                        </div>
                        {errors.emoji_id && <p className="errors text-xs text-destructive">{errors.emoji_id}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="message">Message</FieldLabel>
                        <Textarea
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            id="message"
                            placeholder="What's on your mind?"
                            rows={20}
                            className="resize-none"
                        />
                        {errors.message && <p className="errors text-xs text-destructive">{errors.message}</p>}
                    </Field>


                    <Field className="flex justify-end" orientation="horizontal">
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
                </FieldGroup>
            </form>
        </div>
    )
}
