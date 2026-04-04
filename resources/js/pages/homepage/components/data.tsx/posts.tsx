import { Smile } from 'lucide-react';
import { useState, useRef, useEffect } from "react"
import type { Post, Reaction } from "@/types/post"
import PostHeader from "../modal/header/post-header"
import ViewModal from '../modal/view-modal';
import WelcomeModal from "../modal/welcome-modal"

type pageProps = {
    posts: Post[]
    reactions: Reaction[]
    type: 'rant' | 'secret'
}

export default function Posts({posts, reactions, type}:pageProps) {
    const [showWelcome, setShowWelcome] = useState(() => {
        const seen = localStorage.getItem('ventry_welcome_seen');

        return !seen;
    });

    const [activePostId, setActivePostId] = useState<number | null>(null);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)

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
                    data-aos="fade-up"
                    className={`break-inside-avoid mb-6 border rounded-md transition-all duration-300 z-50
                        ${post.type === 'rant' ? 'bg-white dark:bg-[#0A0A0A]'  : 'bg-gray-50 dark:bg-[#121212]'}`}
                >
                    <PostHeader post={post} type={type}/>

                    {/* Message Section */}
                    <div className="px-5 py-5 border-b">
                        {post.type === 'secret' ? (
                            <div className='flex items-center gap-1 mb-1'>
                                <p className="text-xs text-gray-500 bg-gray-200 dark:bg-[#0a0a0a] dark:text-muted-foreground inline-block px-3 py-1 rounded-lg ">
                                    To: {post.to_whom || 'Someone'}
                                </p>
                                {post.music_url && (
                                        <img
                                        src="./images/spotify.svg"
                                        alt="spotify"
                                        className='h-4 dark:invert-100'
                                    />
                                )}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500 mb-1">Message:</p>
                        )}
                        <p className="whitespace-pre-wrap italic">{post.message}</p>
                    </div>



                    {/* Reactions Section */}
                    <div className='px-5 py-2 flex items-center'>
                        <div
                            ref={containerRef}
                            onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                            className="inline-block relative w-full"
                        >
                            {activePostId === post.id && (
                                <div className='absolute -top-16 left-1/2 -translate-x-1/2 flex gap-2 p-1.5
                                                bg-white backdrop-blur-md border border-slate-200/60
                                                rounded-full shadow-xl shadow-black/5 animate-in fade-in
                                                zoom-in-95 duration-200 dark:bg-[#000000] dark:border-none'>
                                    {reactions.map(reaction => (
                                        <div
                                            key={reaction.id}
                                            className="group flex flex-col items-center justify-center
                                                    w-10 h-10 rounded-full transition-all duration-200
                                                    hover:bg-white hover:dark:bg-[#0a0a0a] hover:scale-125 hover:shadow-sm cursor-pointer"
                                        >
                                            <span className="text-xl leading-none">{reaction.emoji}</span>

                                            <span className='absolute -top-8 scale-0 group-hover:scale-100
                                                    transition-transform bg-slate-800 text-white
                                                    text-[10px] px-2 py-1 rounded-md pointer-events-none'>
                                                {reaction.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className='flex justify-between'>
                                <button
                                    className="inline-block p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                >
                                    <Smile size={22} strokeWidth={1.5} />
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedPost(post)
                                    }}
                                    className='text-xs text-gray-500 cursor-pointer transition-all duration-300 hover:underline hover:text-foreground'
                                >
                                    View Post
                                </button>
                            </div>
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

            <ViewModal
                reactions={reactions}
                post={selectedPost}
                open={selectedPost !== null}
                onClose={() => setSelectedPost(null)}
            />
        </section>
    )
}
