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
    return (
        <div className="w-full max-w-2xl">
            <form>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="nickname">Nickname</FieldLabel>
                        <Input id="nickname" autoComplete="on" placeholder="Hacob" />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="emotion">Emotion</FieldLabel>
                        <div className="flex flex-wrap gap-2">
                            {emotions.map(emotion => (
                                <button
                                    key={emotion.id}
                                    type="button"
                                    className="flex border px-3 py-1 rounded-md gap-2"
                                >
                                    {emotion.emoji}
                                    {emotion.name}
                                </button>
                            ))}
                        </div>

                    </Field>

                    <Field>
                        <FieldLabel htmlFor="message">Message</FieldLabel>
                        <Textarea
                            id="checkout-7j9-optional-comments"
                            placeholder="Add any additional comments"
                            className="resize-none"
                        />
                    </Field>


                    <Field className="flex justify-end" orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Button variant="outline" type="button" onClick={onClose}>
                        Cancel
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}
