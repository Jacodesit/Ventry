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

type pageProps = {
    onClose: () => void
    type: 'rant' | 'secret'
}

export default function SecretForm({onClose,type}:pageProps) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        nickname: string
        to_whom: string
        message: string
        type: string
    }>({
        nickname: '',
        to_whom: '',
        message: '',
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
                        <FieldLabel htmlFor="receipient">To whom <span className="text-blue-500">(Optional)</span></FieldLabel>
                        <Input
                            value={data.to_whom}
                            onChange={(e) => setData('to_whom', e.target.value)}
                            id="to_whom"
                            autoComplete="on"
                            placeholder="Name of the person this secret are dedicated to"
                        />
                        {errors.nickname && <p className="errors text-xs text-destructive">{errors.nickname}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="message">Message</FieldLabel>
                        <Textarea
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            id="message"
                            placeholder="What's on your secret?"
                            rows={20}
                            className="resize-none"
                        />
                        {errors.message && <p className="errors text-xs text-destructive">{errors.message}</p>}
                    </Field>
                </FieldGroup>

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
