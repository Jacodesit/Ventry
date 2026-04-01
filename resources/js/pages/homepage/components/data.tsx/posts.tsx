import { Smile } from 'lucide-react';
import { useState, useRef, useEffect } from "react"
import type { Post, Reaction } from "@/types/post"
import PostHeader from "../modal/header/post-header"
import WelcomeModal from "../modal/welcome-modal"

type pageProps = {
    posts: Post[]
    reactions: Reaction[]
    type: 'rant' | 'secret'
}

export default function Posts({posts, reactions, type}:pageProps) {
    const [showWelcome, setShowWelcome] = useState(true);
    const [activePostId, setActivePostId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActivePostId(null);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <section className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 pb-5">
            {posts.map(post => (
                <div
                    key={post.id}

                    className={`break-inside-avoid mb-6 border rounded-md transition-all duration-300
                        ${post.type === 'rant' ? 'bg-white' : 'bg-gray-50'}`}
                >
                    <PostHeader post={post} type={type}/>

                    {/* Message Section */}
                    <div className="px-5 py-5 border-b">
                        {post.type === 'rant' ? (
                            <p className="text-xs text-gray-500 mb-1">Message:</p>
                        ) : (
                            <p className="text-xs text-gray-500 bg-gray-200 inline-block px-3 py-1 rounded-lg mb-1">To: {post.to_whom || 'Someone'}</p>
                        )}
                        <p className="whitespace-pre-wrap italic">{post.message}</p>
                    </div>

                    {/* Reactions Section */}
                    <div className='px-5 py-2 flex items-center'>
                        <div
                            ref={containerRef}
                            onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                            className="inline-block relative"
                        >
                            {activePostId === post.id && (
                                <div className='px-2 py-2 flex gap-1.5 border rounded-lg shadow bg-white absolute -top-17'>
                                    {reactions.map(reaction => (
                                        <div
                                            key={reaction.id}
                                            className="transition-all duration-300 hover:scale-125 cursor-pointer fade-in flex-1 text-2xl"
                                        >
                                            {reaction.emoji}
                                            <p className='text-[0.3em] text-center'>{reaction.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Smile size={20} className='cursor-pointer' />
                        </div>
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
