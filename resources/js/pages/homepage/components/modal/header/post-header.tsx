import type { Post } from "@/types/post"

type pageProps = {
    post: Post
    type: 'rant' | 'secret'
}

export default function PostHeader({ post }: pageProps) {
    const emotionText = post.custom_emotion || post.emotion?.name || '';
    const isLongText = emotionText.length > 12;

    return (
        <header>
            <style>
                {`
                    @keyframes marquee {
                        0% { transform: translateX(10%); }
                        100% { transform: translateX(-100%); }
                    }
                    .animate-marquee-slow {
                        display: inline-block;
                        animation: marquee 8s linear infinite;
                    }
                `}
            </style>

            <div className="w-full relative px-5 py-3 border-b rounded-t-md flex justify-between items-center">
                {/* User Info Section */}
                <div className="z-10">
                    <h4 className="m-0 text-base font-bold dark:text-accent-foreground tracking-tight">
                        {post?.nickname || 'Anonymous'}
                    </h4>
                    <p className="text-[10px] uppercase font-medium text-slate-400 tracking-wider">
                        {new Date(post.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </p>
                </div>

                {/* Tags Section */}
                <div className="flex gap-1.5 items-center">
                    {post.type === 'rant' && (
                        <div className={`flex items-center border border-slate-200 bg-white dark:bg-[#141414] dark:shadow dark:border-none dark:text-muted px-2.5 py-1 rounded-full shadow-sm max-w-32`}>
                            <span className="mr-1.5 shrink-0 text-sm">
                                {post.custom_emotion ? '📝' : (post.emotion?.emoji || '🙂')}
                            </span>

                            {/* Only apply the overflow and mask container to custom_emotion */}
                            {post.custom_emotion ? (
                                <div className="overflow-hidden whitespace-nowrap mask-[linear-gradient(to_right,black_80%,transparent_100%)]">
                                    <span
                                        className={`text-[11px] text-slate-600 dark:text-muted-foreground font-semibold ${isLongText ? 'animate-marquee-slow' : ''}`}
                                        title={emotionText}
                                    >
                                        {emotionText}
                                    </span>
                                </div>
                            ) : (
                                // Standard emotion stays static and simple
                                <span className="text-[11px] text-slate-600 dark:text-muted-foreground font-semibold truncate">
                                    {emotionText}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Category Badges */}
                    {post.type === 'rant' ? (
                        <p className="text-[10px] font-bold uppercase tracking-widest border border-blue-100 bg-blue-50 text-blue-500 px-2.5 py-1 rounded-md dark:bg-blue-950/50 dark:border-none">
                            Rant
                        </p>
                    ) : (
                        <p className="text-[10px] font-bold uppercase tracking-widest border border-green-100 bg-green-50 text-green-500 px-2.5 py-1 rounded-md dark:bg-green-950/50 dark:border-none">
                            Secret
                        </p>
                    )}
                </div>
            </div>
        </header>
    )
}
