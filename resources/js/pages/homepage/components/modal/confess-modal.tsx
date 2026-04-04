import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import type { Emotion } from "@/types/post"
import SecretForm from "../form/secret-form"

type pageProps = {
    openModal: boolean
    onClose: () => void
    emotions: Emotion[]
    type: 'rant' | 'secret'
    setCoolDown: React.Dispatch<React.SetStateAction<number>>
}

export default function ConfessModal({openModal, onClose, type, setCoolDown}:pageProps) {
    return (
        <Dialog open={openModal} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl w-full z-1000">
                <DialogHeader className="border-b pb-2 text-left">
                    <DialogTitle className="text-3xl font-bold flex items-center gap-3">Share a secret or confession<span className="text-[0.3em] border-2 border-green-500 bg-green-50 text-green-700 px-3 py-1 rounded-md dark:bg-green-950/50 dark:border-none">{type.charAt(0).toUpperCase() + type.slice(1)}</span></DialogTitle>
                    <DialogDescription>
                        Share something you've never told anyone...
                    </DialogDescription>
                </DialogHeader>

                <SecretForm
                    setCoolDown={setCoolDown}
                    type={type}
                    onClose={onClose}
                />
            </DialogContent>
        </Dialog>
    )
}
