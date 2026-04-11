import type { Feedback } from "@/types/post"

type pageProps = {
    feedback: Feedback
}

export default function FeedbackHeader({feedback}:pageProps) {
    return (
        <div className="w-full relative px-5 py-3 border-b rounded-t-md flex justify-between items-center">
            <div className="z-10">
                    <h4 className="m-0 text-base font-bold dark:text-accent-foreground tracking-tight">
                        {feedback?.nickname || 'Anonymous'}
                    </h4>
                    <p className="text-[10px] uppercase font-medium text-slate-400 tracking-wider">
                        {new Date(feedback?.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </p>
                </div>
        </div>
    )
}
