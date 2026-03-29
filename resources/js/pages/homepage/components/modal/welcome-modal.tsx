import { TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    // DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"

type pageProps = {
    showWelcome: boolean
    onClose: () => void
}

export default function WelcomeModal({onClose, showWelcome}:pageProps) {
    const reminders = [
        { reminder: 'Be respectful. No hate or harassment.' },
        { reminder: 'Keep it anonymous. Don’t share personal details.' },
        { reminder: 'No offensive or harmful words.' },
        { reminder: 'What you post may affect others. Think first.' }
    ]

    return (
        <Dialog open={showWelcome} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl w-full z-9999">
                <DialogHeader className="border-b pb-2 text-left">
                    <DialogTitle className="text-3xl font-bold">Welcome to Ventry</DialogTitle>
                    <DialogDescription>
                        Write your thoughts freely. Nobody will know it’s you.
                    </DialogDescription>
                </DialogHeader>

                <div className='flex items-center gap-1'>
                    <TriangleAlert size={12} />
                    <h1
                        className="font-medium"
                    >
                        Before you post
                    </h1>
                </div>

                <div className="px-4">
                    <ul className="list-disc">
                        {reminders.map((reminder, index) => (
                            <li
                                key={index}
                                className='text-gray-500'
                            >
                                {reminder.reminder}
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="font-medium">This is a safe space. Keep it that way.</p>

                 <DialogFooter className='border-t pt-2 mt-4 flex justify-between items-center w-full gap-99'>
                    <div className='flex items-center gap-1 justify-start'>
                        <input
                            type="checkbox"
                        />
                        <p>I will be respectful</p>
                    </div>

                    <Button
                        onClick={onClose}
                    >
                        Proceed
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
