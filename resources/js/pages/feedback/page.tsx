import { Star } from "lucide-react"
import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import type { Feedback } from "@/types/post";
import FeedbackModal from "../homepage/components/modal/feedback-modal";
import FeedbackHeader from "./component/header/header";

type pageProps = {
    name: string
    feedback: Feedback[]
}

export default function Feedback({name, feedback}:pageProps) {
    const [openFeedback, setOpenFeedback] = useState(false);

    return (
        <AppLayout name={name}>
            <section className="grid grid-cols-2 items-center pt-10">
                <div data-aos="fade-up" data-aos-delay="100" className="text-left h-50 justify-center flex flex-col">
                    <h1 className="font-bold text-3xl md:text-4xl lg:text-6xl">
                        {/* Voices From the Community */}
                        <span className="text-blue-500">Voices</span> From the <span className="text-blue-500">Community</span>
                    </h1>
                    <p className="text-sm md:text-base font-extralight text-gray-500">Your feedback shapes every update we build.</p>
                </div>

                <div data-aos="fade-up" data-aos-delay="300" className="flex justify-end">
                    <button
                        onClick={() => setOpenFeedback(true)}
                        className="rounded-lg px-8 py-3 bg-gray-100 dark:bg-[#0a0a0a] cursor-pointer transition-all duration-300 hover:bg-gray-500 hover:text-white dark:hover:bg-gray-50/20"
                    >
                        Give feedback
                    </button>
                </div>
            </section>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 pt-5 pb-10 mb-20">
                {feedback.map(userFeedback => (
                    <div
                        data-aos="fade-up"
                        data-aos-delay="0"
                        className="break-inside-avoid mb-6 border rounded-md transition-all duration-300 z-50 dark:bg-[#0a0a0a]"
                        key={userFeedback.id}
                    >
                        <FeedbackHeader feedback={userFeedback} />

                        <div>
                            <div className="flex items-center gap-2 px-5 pt-5">
                                <div className="flex text-yellow-500">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={18}
                                            fill={star <= userFeedback.rating ? "currentColor" : "none"}
                                            stroke="currentColor"
                                        />
                                    ))}
                                </div>
                                <div className="text-xs border px-4 py-1 rounded-md dark:bg-[#121212]">
                                    {userFeedback.experience_type
                                        .split('_')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ')
                                    }
                                </div>
                            </div>

                            <div className="px-5 py-5 border-b">
                                {userFeedback.feedback_message}
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            <FeedbackModal
                openFeedback={openFeedback}
                onClose={() => setOpenFeedback(false)}
            />
        </AppLayout>
    )
}
