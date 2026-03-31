import { TriangleAlert, Info } from 'lucide-react';
import { useState } from 'react';

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
    const [ isRespected, setIsRespected ] = useState(false);

    const reminders = [
        { reminder: 'Be respectful. No hate or harassment.' },
        { reminder: 'Keep it anonymous. Don’t share personal details.' },
        { reminder: 'No offensive or harmful words.' },
        { reminder: 'What you post may affect others. Think first.' }
    ]

    const rules = [
        { rules: '20-second cooldown between posts' },
        { rules: 'Posts reset every 24 hours' },
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

                <div className='flex items-center gap-1'>
                    <Info size={12} />
                    <h1
                        className="font-medium"
                    >
                        Posting rules
                    </h1>
                </div>

                <div className='px-4'>
                    <ul className='list-disc'>
                        {rules.map((rule, index) => (
                            <li
                                key={index}
                                className='text-gray-500'
                            >
                                {rule.rules}
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="font-medium bg-green-100 p-3 text-green-900 border-green-500 border border-l-4 border-l-green-500 rounded-md">This is a safe space. Keep it that way.</p>

                <DialogFooter className='border-t pt-2 mt-4 flex justify-between items-center w-full gap-99'>
                    <div className='flex items-center gap-1 justify-start'>
                        <input
                            type="checkbox"
                            onChange={(e) => setIsRespected(e.target.checked)}

                        />
                        <p>I will be respectful</p>
                    </div>

                    <Button
                        disabled={!isRespected}
                        onClick={onClose}
                    >
                        Proceed
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
