import { useState } from "react"
import type { Post, Reaction } from "@/types/post"
import PostHeader from "../modal/header/post-header"
import WelcomeModal from "../modal/welcome-modal"

type pageProps = {
    posts: Post[]
    reactions: Reaction[]
}

export default function Posts({posts, reactions}:pageProps) {
    const [showWelcome, setShowWelcome] = useState(true);

    return (
        <section className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 pb-5">
            {posts.map(post => (
                <div
                    key={post.id}

                    className="break-inside-avoid mb-6 border rounded-md transition-all duration-300 transform hover:-translate-y-2 bg-white"
                >
                    <PostHeader post={post} />

                    {/* Message Section */}
                    <div className="px-5 py-5 border-b">
                        <p className="text-xs text-gray-500 mb-1">Message:</p>
                        <p className="whitespace-pre-wrap italic">{post.message}</p>
                    </div>

                    {/* Reactions Section */}
                    <div className="px-5 py-2 flex gap-1.5">
                        {reactions.map(reaction => (
                            <div
                                key={reaction.id}
                                className="transition-all duration-300 hover:scale-150 cursor-pointer flex items-center"
                            >
                                {reaction.emoji}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {showWelcome && (
                <WelcomeModal
                    showWelcome={showWelcome}
                    onClose={() => setShowWelcome(false)}
                />
            )}
        </section>
    )
}
