import { router, Link } from "@inertiajs/react"
import { ChevronLeft, ChevronRight, Smile } from 'lucide-react';
import { useState, useRef, useEffect } from "react"
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import type { Post, Reaction } from "@/types/post"
import FeedbackModal from "../modal/feedback-modal";
import PostHeader from "../modal/header/post-header"
import ViewModal from '../modal/view-modal';
import WelcomeModal from "../modal/welcome-modal"

type pageProps = {
    posts?: {
        data: Post[]
        links: {
            url: string | null
            label: string
            active: boolean
        }[]
    } | null
    reactions?: Reaction[]
    type?: 'rant' | 'secret'
    filters?: {
        type?: string
    }
}

export default function Posts({posts, reactions = [], type = 'rant'}: pageProps) {
    const [showWelcome, setShowWelcome] = useState(() => {
        const seen = localStorage.getItem('ventry_welcome_seen');

        return !seen;
    });

    const [activePostId, setActivePostId] = useState<number | null>(null);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [isReacting, setIsReacting] = useState<number | null>(null);
    const [openFeedback, setOpenFeedback] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const currentFilter = (urlParams.get('filter') as 'all' | 'rant' | 'secret') || 'all';
    const [filter, setFilter] = useState<'all' | 'rant' | 'secret'>(currentFilter);

    const safePosts = {
        data: posts?.data ?? [],
        links: posts?.links ?? [],
    };

    const postRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activePostId !== null) {
                const currentRef = postRefs.current[activePostId];

                if (currentRef && !currentRef.contains(event.target as Node)) {
                    setActivePostId(null);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [activePostId]);

    const handleFilterChange = (value: string) => {
        const newFilter = value as 'all' | 'rant' | 'secret';
        setFilter(newFilter);

        // Navigate with the filter parameter
        router.get(
            window.location.pathname,
            { filter: newFilter === 'all' ? undefined : newFilter },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true
            }
        );
    };

    const handleReact = (postId: number, reactionId: number) => {
        if (isReacting === postId) {
            return;
        }

        setIsReacting(postId);

        router.post('/react', {
            post_id: postId,
            reaction_id: reactionId
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setActivePostId(null);
                setIsReacting(null);
                router.reload({ only: ['posts'] });
            },
            onError: () => {
                setIsReacting(null);
            }
        });
    };

    return (
        <section className="p-5 flex flex-col justify-between">
            <div data-aos="fade-up">
                <Tabs
                    className="mb-5 flex justify-end items-end"
                    value={filter}
                    onValueChange={handleFilterChange}
                >
                    <TabsList className="w-50">
                        <TabsTrigger value="all"
                            className="rounded-md text-gray-500 dark:text-gray-400
                            data-[state=active]:bg-white data-[state=active]:dark:bg-[#0A0A0A]
                            data-[state=active]:shadow-sm"
                        >
                            All
                        </TabsTrigger>

                        <TabsTrigger value="rant"
                            className="rounded-md text-gray-500 dark:text-gray-400
                            data-[state=active]:bg-white data-[state=active]:dark:bg-[#0A0A0A]
                            data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400
                            data-[state=active]:shadow-sm"
                        >
                            Rant
                        </TabsTrigger>

                        <TabsTrigger value="secret"
                            className="rounded-md text-gray-500 dark:text-gray-400
                            data-[state=active]:bg-white data-[state=active]:dark:bg-[#0A0A0A]
                            data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400
                            data-[state=active]:shadow-sm"
                        >
                            Secret
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 pb-5">
                    {safePosts.data.length === 0 && (
                        <div className="h-[90vh] flex items-center justify-center text-gray-500">
                            No post yet. Be the first to share something.
                        </div>
                    )}

                    {safePosts.data.map(post => (
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
                                <div className="">
                                    <p className="whitespace-pre-wrap italic">{post.message}</p>
                                </div>
                            </div>

                            {/* Reactions Section */}
                            <div className='px-5 py-2 flex items-center'>
                                <div
                                    ref={(el) => {
                                        postRefs.current[post.id] = el;
                                    }}
                                    onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                                    className="inline-block relative w-full"
                                >
                                    {activePostId === post.id && (
                                        <div className='absolute -top-16 left-1/2 -translate-x-1/2 flex gap-2 p-1.5
                                                        bg-white backdrop-blur-md border border-slate-200/60
                                                        rounded-full shadow-xl shadow-black/5 animate-in fade-in
                                                        zoom-in-95 duration-200 dark:bg-[#000000] dark:border-none z-50'>
                                            {reactions.map(reaction => (
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleReact(post.id, reaction.id)
                                                    }}
                                                    key={reaction.id}
                                                    className={`group flex flex-col items-center justify-center
                                                            w-10 h-10 rounded-full transition-all duration-200
                                                            hover:bg-white hover:dark:bg-[#0a0a0a] hover:scale-125 hover:shadow-sm cursor-pointer
                                                            ${isReacting === post.id ? 'opacity-50 pointer-events-none' : ''}`}
                                                >
                                                    <span className="text-xl leading-none">{reaction.emoji}</span>
                                                    <span className='absolute -top-8 scale-0 group-hover:scale-100
                                                            transition-transform bg-slate-800 text-white
                                                            text-[10px] px-2 py-1 rounded-md pointer-events-none whitespace-nowrap'>
                                                        {reaction.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className='flex justify-between items-center'>
                                        <button
                                            className="inline-block p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                            disabled={isReacting === post.id}
                                        >
                                            <Smile size={22} strokeWidth={1.5} />
                                        </button>

                                        <div className="flex gap-1 flex-wrap">
                                            {post.reactions && post.reactions.length > 0 ? (
                                                post.reactions.map(r => (
                                                    <span
                                                        key={r.id}
                                                        className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md
                                                                ${post.type ===  'rant' ? 'bg-gray-50 dark:bg-[#121212]' : 'bg-gray-200 dark:bg-[#0a0a0a]'}
                                                            `}
                                                    >
                                                        {r.emoji} {r.count}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400 px-2 py-1">No reactions yet</span>
                                            )}
                                        </div>

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
                </div>
            </div>

            {safePosts.links.length > 3 && (
                <div data-aos="fade-up" className="flex gap-2 mt-4 justify-end py-8">
                    {safePosts.links.map((link, index) => {
                        let label: React.ReactNode = link.label;

                        if (label && typeof label === "string" && label.includes("Previous")) {
                            label = <ChevronLeft size={16} />;
                        }

                        if (label && typeof label === "string" && label.includes("Next")) {
                            label = <ChevronRight size={16} />;
                        }

                        if (label === "...") {
                            return <span key={index} className="px-2 py-1">...</span>;
                        }

                        return (
                            <Link
                                key={index}
                                href={link.url ?? ""}
                                preserveScroll={false}
                                className={`px-3 py-1 border text-sm rounded-md ${
                                    link.active ? "bg-[#f5f5f5] dark:bg-[#121212] text-black dark:text-white" : ""
                                } ${!link.url ? "opacity-50 pointer-events-none" : ""}`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>
            )}

            <div data-aos="fade-up" data-aos-delay="200" className="h-auto py-30 rounded-md bg-gray-50 dark:bg-[#121212] mt-20 text-center">
                <h1 className="text-5xl font-semibold mb-5">How did Ventry make you feel?</h1>
                <button
                    onClick={() => setOpenFeedback(true)}
                    className="rounded-lg px-8 py-3 bg-gray-100 dark:bg-[#0a0a0a] cursor-pointer transition-all duration-300 hover:bg-gray-500 hover:text-white dark:hover:bg-gray-50/20"
                >
                    Give feedback
                </button>
            </div>

            <FeedbackModal
                openFeedback={openFeedback}
                onClose={() => setOpenFeedback(false)}
            />
        </section>
    )
}
