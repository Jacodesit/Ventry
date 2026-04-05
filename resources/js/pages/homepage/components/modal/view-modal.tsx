import { Smile } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { router, usePage } from "@inertiajs/react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import type { Post, Reaction } from "@/types/post"

type pageProps = {
    reactions: Reaction[]
    post: Post | null
    open: boolean
    onClose: () => void
}

export default function ViewModal({post, open, onClose, reactions}:pageProps) {
    const { props } = usePage();
    const emotionText = post?.custom_emotion || post?.emotion?.name || '';
    const isLongText = emotionText.length > 12;
    const [activePostId, setActivePostId] = useState<number | null>(null);
    const [isReacting, setIsReacting] = useState<number | null>(null);

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

    const handleReact = (postId: number, reactionId: number) => {
        // Prevent multiple rapid clicks
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
                // This reloads the posts data
                router.reload({ only: ['posts'] });
            },
            onError: () => {
                setIsReacting(null);
            }
        });
    };

    if(!open) {
        return null
    }

    // Get the latest post data from the page props (this is the key fix)
    const currentPost = props.posts?.find((p: Post) => p.id === post?.id) || post;

    const getSpotifyEmbed = (url: string) => {
        return url.replace("open.spotify.com", "open.spotify.com/embed")
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
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
            <DialogContent className={`sm:max-w-2xl w-full z-1000
                    ${currentPost?.type === 'secret' ? 'bg-gray-50 dark:bg-[#121212]' : 'bg-white dark:bg-[#0a0a0a]'}
                `}>
                <div className="flex gap-5 flex-col">
                    {currentPost?.type === 'rant' ? (
                        <div className="flex flex-col">
                            <DialogHeader className="border-b pb-2 text-left">
                                <DialogTitle className="text-xl font-bold flex items-center gap-3">
                                    <span>{currentPost.nickname || 'Anonymous'}'s post</span>
                                    <div className={`flex items-center border border-slate-200 bg-white dark:bg-[#141414] dark:shadow dark:border-none dark:text-muted px-2.5 rounded-full shadow-sm max-w-50`}>
                                        <span className="mr-1.5 shrink-0 text-sm">
                                            {currentPost.custom_emotion ? '📝' : (currentPost.emotion?.emoji || '🙂')}
                                        </span>

                                        {currentPost.custom_emotion ? (
                                            <div className="flex items-center py-1 overflow-hidden whitespace-nowrap mask-[linear-gradient(to_right,black_80%,transparent_100%)]">
                                                <span
                                                    className={`text-sm text-slate-600 dark:text-muted-foreground font-semibold ${isLongText ? 'animate-marquee-slow' : ''}`}
                                                    title={emotionText}
                                                >
                                                    {emotionText}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] text-slate-600 dark:text-muted-foreground font-semibold truncate">
                                                {emotionText}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[0.5em] border-2 border-blue-500 bg-blue-50 text-blue-700 px-3 py-1 rounded-md dark:bg-blue-950/50 dark:border-none">RANT</span>
                                </DialogTitle>
                            </DialogHeader>
                            <div className="flex py-10">
                                <div className="max-h-96 overflow-y-auto pr-2">
                                    <p className="text-xs text-gray-500 mb-1">Message:</p>
                                    <p className="whitespace-pre-wrap italic">{currentPost.message}</p>
                                </div>
                            </div>
                            <DialogFooter className="border-t">
                                <div className='py-2 flex items-center justify-between w-full'>
                                    <div
                                        ref={containerRef}
                                        onClick={() => setActivePostId(activePostId === currentPost.id ? null : currentPost.id)}
                                        className="inline-block relative"
                                    >
                                        {activePostId === currentPost.id && (
                                            <div className='absolute -top-16 left-1/2 -translate-x-1/2 flex gap-2 p-1.5
                                                            bg-white backdrop-blur-md border border-slate-200/60
                                                            rounded-full shadow-xl shadow-black/5 animate-in fade-in
                                                            zoom-in-95 duration-200 dark:bg-[#0a0a0a] dark:border-none z-50'>
                                                {reactions.map(reaction => (
                                                    <div
                                                        key={reaction.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleReact(currentPost.id, reaction.id)
                                                        }}
                                                        className={`group flex flex-col items-center justify-center
                                                                w-10 h-10 rounded-full transition-all duration-200
                                                                hover:bg-white hover:dark:bg-[#0a0a0a] hover:scale-125 hover:shadow-sm cursor-pointer
                                                                ${isReacting === currentPost.id ? 'opacity-50 pointer-events-none' : ''}`}
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

                                        <div className="flex">
                                            <button
                                                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                                disabled={isReacting === currentPost.id}
                                            >
                                                <Smile size={22} strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reaction Counts - Now updates in real-time */}
                                    <div className="flex gap-1 flex-wrap">
                                        {currentPost.reactions && currentPost.reactions.length > 0 ? (
                                            currentPost.reactions.map(r => (
                                                <span
                                                    key={r.id}
                                                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md
                                                        ${currentPost.type === 'rant' ? 'bg-gray-50 dark:bg-[#121212]' : 'bg-gray-200 dark:bg-[#0a0a0a]'}
                                                    `}
                                                >
                                                    {r.emoji} {r.count}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 px-2 py-1">No reactions yet</span>
                                        )}
                                    </div>
                                </div>
                            </DialogFooter>
                        </div>
                    ) : (
                        <div className="flex gap-5 flex-col" >
                            <DialogHeader className="border-b pb-2 text-left">
                                <DialogTitle className="text-xl font-bold flex items-center gap-3">
                                    <span className="text-[0.5em] border-2 border-green-500 bg-green-50 text-green-700 px-3 py-1 rounded-md dark:bg-green-950/50 dark:border-none">SECRET</span>
                                </DialogTitle>
                            </DialogHeader>
                            <p className="text-gray-500 text-sm">Someone left a message for <span className="border-b">{currentPost?.to_whom}</span></p>
                            <div className="max-h-72 overflow-y-auto pr-2">
                                <p
                                    className={`text-xs text-gray-500 bg-gray-200 dark:bg-[#0a0a0a] dark:text-muted-foreground inline-block px-3 py-1 rounded-lg mb-1 ${currentPost?.type !== 'secret' ? 'hidden' : 'block'}`}
                                >
                                    To: {currentPost?.to_whom || 'Someone'}
                                </p>

                                <p className="whitespace-pre-wrap italic mb-5">{currentPost?.message}</p>
                                <p className="text-right font-semibold italic">- {currentPost?.nickname || 'Anonymous'}</p>
                            </div>

                            {currentPost?.music_url && (
                                <div className="mt-4">
                                    <p className="text-gray-500 text-sm mb-1">
                                        They left a song with this.
                                    </p>

                                    <div className="group relative overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 p-1 transition-all hover:shadow-md border border-black/5 dark:border-white/5">
                                        <iframe
                                            title="Spotify Player"
                                            src={getSpotifyEmbed(currentPost?.music_url || '')}
                                            width="100%"
                                            height="80"
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                            loading="lazy"
                                            className="rounded-xl grayscale-[0.2] contrast-[0.9] hover:grayscale-0 transition-all duration-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <DialogFooter className="border-t">
                                <div className='py-2 flex items-center justify-between w-full'>
                                    <div
                                        ref={containerRef}
                                        onClick={() => setActivePostId(activePostId === currentPost?.id ? null : currentPost?.id)}
                                        className="inline-block relative"
                                    >
                                        {activePostId === currentPost?.id && (
                                            <div className='absolute -top-16 left-1/2 -translate-x-1/2 flex gap-2 p-1.5
                                                            bg-white backdrop-blur-md border border-slate-200/60
                                                            rounded-full shadow-xl shadow-black/5 animate-in fade-in
                                                            zoom-in-95 duration-200 dark:bg-[#0a0a0a] dark:border-none z-50'>
                                                {reactions.map(reaction => (
                                                    <div
                                                        key={reaction.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleReact(currentPost.id, reaction.id)
                                                        }}
                                                        className={`group flex flex-col items-center justify-center
                                                                w-10 h-10 rounded-full transition-all duration-200
                                                                hover:bg-white hover:dark:bg-[#0a0a0a] hover:scale-125 hover:shadow-sm cursor-pointer
                                                                ${isReacting === currentPost?.id ? 'opacity-50 pointer-events-none' : ''}`}
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

                                        <div className="flex">
                                            <button
                                                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                                disabled={isReacting === currentPost?.id}
                                            >
                                                <Smile size={22} strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reaction Counts - Now updates in real-time */}
                                    <div className="flex gap-1 flex-wrap">
                                        {currentPost?.reactions && currentPost.reactions.length > 0 ? (
                                            currentPost.reactions.map(r => (
                                                <span
                                                    key={r.id}
                                                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md
                                                        ${currentPost.type === 'rant' ? 'bg-gray-50 dark:bg-[#121212]' : 'bg-gray-200 dark:bg-[#0a0a0a]'}
                                                    `}
                                                >
                                                    {r.emoji} {r.count}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 px-2 py-1">No reactions yet</span>
                                        )}
                                    </div>
                                </div>
                            </DialogFooter>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
