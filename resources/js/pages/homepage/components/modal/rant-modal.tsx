// import { Button } from "@/components/ui/button"
import {
    Dialog,
    // DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    // DialogFooter
} from "@/components/ui/dialog"
import type { Emotion } from "@/types/post"
import RantForm from "../form/rant-form"

type pageProps = {
    openRant: boolean
    onClose: () => void
    emotions: Emotion[]
}

export default function RantModal({openRant, onClose, emotions}:pageProps) {
    return (
        <Dialog open={openRant} onOpenChange={onClose} >
            <DialogContent className="sm:max-w-2xl w-full z-1000">
                <DialogHeader className="border-b pb-2 text-left">
                    <DialogTitle className="text-3xl font-bold">Let it all out</DialogTitle>
                    <DialogDescription>
                        Write your thoughts freely. Nobody will know it’s you.
                    </DialogDescription>
                </DialogHeader>

                <RantForm
                    onClose={onClose}
                    emotions={emotions}
                />
            </DialogContent>
        </Dialog>
    )
}
