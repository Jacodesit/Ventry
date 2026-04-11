import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import FeedbackForm from "../form/feedback-form"

type pageProps = {
    openFeedback: boolean,
    onClose: () => void
}

export default function FeedbackModal({openFeedback, onClose}:pageProps) {
    return (
        <Dialog open={openFeedback} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl w-full z-1000">
                <DialogHeader className="border-b pb-2 text-left">
                    <DialogTitle className="text-3xl font-bold flex items-center gap-3">Help Us Improve</DialogTitle>
                    <DialogDescription>
                        Takes less than a minute. Your feedback helps us fix and improve fast.
                    </DialogDescription>
                </DialogHeader>

                <FeedbackForm onClose={onClose}/>
            </DialogContent>
        </Dialog>
    )
}
