import type { Post } from "@/types/post"

type pageProps = {
    post: Post
}

export default function PostHeader({post}:pageProps) {
    return (
        <header>
            <div className="w-full relative px-5 py-3 border-b rounded-t-md">
                <div
                    className="absolute inset-0 z-10 rounded-t-md"
                    style={{
                    backgroundImage: `
                        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
                        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 0",
                    maskImage: `
                        repeating-linear-gradient(
                            to right,
                            black 0px,
                            black 3px,
                            transparent 3px,
                            transparent 8px
                            ),
                            repeating-linear-gradient(
                            to bottom,
                            black 0px,
                            black 3px,
                            transparent 3px,
                            transparent 8px
                            ),
                            radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)
                    `,
                    WebkitMaskImage: `
                repeating-linear-gradient(
                            to right,
                            black 0px,
                            black 3px,
                            transparent 3px,
                            transparent 8px
                            ),
                            repeating-linear-gradient(
                            to bottom,
                            black 0px,
                            black 3px,
                            transparent 3px,
                            transparent 8px
                            ),
                            radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)
                    `,
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                    }}
                />
                <div className="flex justify-between items-center ">
                    <div className="z-50">
                        <h4 className="m-0 text-lg font-semibold">{post?.nickname || 'Anonymous'}</h4>
                        <p className="text-xs opacity-80">
                            {new Date(post.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                        </p>

                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100">
                        {post.custom_emotion
                            ? `📝 ${post.custom_emotion}`
                            : `${post.emotion?.emoji || '🙂'} ${post.emotion?.name || ''}`
                        }
                    </div>
                </div>
            </div>
        </header>

    )
}
