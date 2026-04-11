import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import type { Feedback } from "@/types/post"

dayjs.extend(relativeTime)

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
                    <p className="text-[10px] font-medium text-slate-400 tracking-wider">
                        {dayjs(feedback?.created_at).format('MMM D, YYYY')} • {dayjs(feedback?.created_at).fromNow()}
                    </p>
                </div>
        </div>
    )
}
