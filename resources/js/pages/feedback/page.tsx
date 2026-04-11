import { Star } from "lucide-react"
import AppLayout from "@/layouts/app-layout";
import type { Feedback } from "@/types/post";
import FeedbackHeader from "./component/header/header";

type pageProps = {
    name: string
    feedback: Feedback[]
}

export default function Feedback({name, feedback}:pageProps) {
    return (
        <AppLayout name={name}>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 pb-5 py-10 mt-10 mb-20">
                {feedback.map(userFeedback => (
                    <div
                        data-aos="fade-up"
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
        </AppLayout>
    )
}
