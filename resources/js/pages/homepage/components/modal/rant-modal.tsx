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
    openModal: boolean
    onClose: () => void
    emotions: Emotion[]
    type: 'rant' | 'secret'
}

export default function RantModal({openModal, onClose, emotions, type}:pageProps) {
    return (
        <Dialog open={openModal} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl w-full z-1000">
                <DialogHeader className="border-b pb-2 text-left">
                    <DialogTitle className="text-3xl font-bold flex items-center gap-5">Let it all out <span className="text-[0.3em] border-2 border-blue-500 bg-blue-50 text-blue-700 px-3 py-1 rounded-md">{type.charAt(0).toUpperCase() + type.slice(1)}</span></DialogTitle>
                    <DialogDescription>
                        Write your thoughts freely. Nobody will know it’s you.
                    </DialogDescription>
                </DialogHeader>

                <RantForm
                    type={type}
                    onClose={onClose}
                    emotions={emotions}
                />
            </DialogContent>
        </Dialog>
    )
}
