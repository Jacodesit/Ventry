import { useState } from 'react'
import { Typewriter } from 'react-simple-typewriter'
import AppLayout from "@/layouts/app-layout"
import type { Emotion } from '@/types/post'
import ConfessBtn from "./components/buttons/confess-btn"
import RantBtn from "./components/buttons/rant-btn"
import RantModal from './components/modal/rant-modal'

type pageProps = {
    name: string
    emotions: Emotion[]
}

export default function Home({name, emotions}:pageProps) {
    const [openRant, setRantOpen] = useState(false);

    return (
        <AppLayout name={name}>
            <section className="flex justify-center items-center h-80 flex-col gap-5">
                <div className="text-center">
                    <h1 className="font-bold text-7xl">
                        <Typewriter
                            words={[
                                "What’s On Your Mind?",
                                "Got Something To Say?",
                                "A Secret To Share?",
                                "Let It Out.",
                                "Say It Here. No Judgement.",
                                "Share Your Thoughts",
                                "Speak Freely",
                                "Let Your Voice Be Heard",
                                "Post Anonymously",
                                "Unleash Your Mind",
                                "Drop Your Story",
                                "Express Yourself",
                                "Confess Something",
                                "Rant Without Limits",
                                "Someone Will Read This",
                                "Your Words Matter",
                                "Join The Conversation",
                                "Be Honest, Be Bold"
                            ]}
                            loop={0}
                            cursor
                            cursorStyle="|"
                            typeSpeed={85}
                            deleteSpeed={50}
                            delaySpeed={1500}
                        />
                    </h1>
                    <p className="font-extralight text-gray-500">Write what you want. Read what others feel. One place. One shared voice.</p>
                </div>
                <div className='flex gap-2'>
                    <RantBtn onClick={() => setRantOpen(true)} />
                    <ConfessBtn />
                </div>
            </section>
            <RantModal
                emotions={emotions}
                openRant={openRant}
                onClose={() => setRantOpen(false)}
            />
        </AppLayout>
    )
}
