import type { Post, Reaction } from "@/types/post"

type pageProps = {
    posts: Post[]
    reactions: Reaction[]
}

export default function Posts({posts, reactions}:pageProps) {
    return (
        <section className="grid grid-cols-3 gap-6 pb-5">
            {posts.map(post => (
                <div
                    key={post.id}
                    className="border rounded-md"
                >
                    <div className="px-3 py-2 border-b flex justify-between items-center bg-blue-500 rounded-t-md text-muted">
                        <div>
                            <h4 className="m-0 text-xl">{post?.nickname || 'Anonymous'}</h4>
                            <p className="text-xs">
                                {new Date(post.created_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>
                        </div>
                        <p className="text-xs">{post.emotion.name}</p>
                    </div>

                    <div className="px-3 py-5 border-b">
                        <p className="text-xs text-gray-500 py-1">Message:</p>
                        <p className="text-sm h-35">{post.message}</p>
                    </div>

                    <div className="px-3 py-2 flex gap-1.5">
                        {reactions.map(reaction => (
                            <div
                                key={reaction.id}
                                className="transition-all duration-300 hover:scale-200 cursor-pointer"
                            >
                                {reaction.emoji}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    )
}
