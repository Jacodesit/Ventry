import { useForm } from "@inertiajs/react"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type pageProps = {
    onClose: () => void
}

export default function FeedbackForm({onClose}:pageProps) {
    const { data, setData, processing, errors, reset, post } = useForm({
        'nickname': '',
        'rating': 0,
        'experience_type': '',
        'feedback_message': '',
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        post('/feedback', {
            onSuccess: () => {
                toast.success('Thanks! Your voice helps improve the platform.')
                reset()
                onClose()
            }
        })
    }

    const types = [
        { label: "Bug", value: "bug", description: "Something is broken or not working" },
        { label: "Suggestion", value: "suggestion", description: "Ideas to improve the system" },
        { label: "General Feedback", value: "general_feedback", description: "Other thoughts or comments" },
        { label: "Feature Request", value: "feature_request", description: "Request a new feature" },
    ]

    return (
        <div className="w-full max-w-2xl">
            <form onSubmit={submit}>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="rating">Rating</FieldLabel>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setData('rating', star)}
                                    className="text-yellow-500"
                                >
                                    <Star
                                        size={24}
                                        fill={star <= data.rating ? "currentColor" : "none"}
                                        stroke="currentColor"
                                    />
                                </button>
                            ))}
                        </div>
                        {errors.rating && <p className="errors text-xs text-destructive">{errors.rating}</p>}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="type">Feedback Type</FieldLabel>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-full border p-2 text-left rounded-md capitalize">
                                {types.find(t => t.value === data.experience_type)?.label || "Select type"}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-96 z-9999" align="start">
                                {types.map((type, index) => (
                                    <DropdownMenuItem
                                        className="capitalize flex flex-col items-start"
                                        key={index}
                                        onClick={() => setData('experience_type', type.value)}
                                    >
                                        <span className="font-medium border px-4 py-1 dark:bg-[#0a0a0a] rounded-md">{type.label}</span>
                                        <span className="text-xs">- {type.description}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </Field>

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
                        <FieldLabel htmlFor="message">Feedback Message</FieldLabel>
                        <Textarea
                            value={data.feedback_message}
                            onChange={(e) => setData('feedback_message', e.target.value)}
                            id="feedback_message"
                            autoComplete="on"
                            placeholder="Tell us what you think"
                            className="resize-none dark:bg-[#000000] dark:border-[#181818]"
                        />
                        {errors.feedback_message && <p className="errors text-xs text-destructive">{errors.feedback_message}</p>}
                    </Field>

                    <Field className="flex justify-end border-t pt-2 mt-4" orientation="horizontal">
                        <Button
                            disabled={processing}
                            type="submit"
                        >
                            {processing ? 'Posting...' : 'Post'}
                        </Button>

                        <Button variant='outline' type="button" onClick={onClose}>
                            Cancel
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}
