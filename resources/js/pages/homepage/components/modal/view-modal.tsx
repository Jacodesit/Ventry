import { Smile } from "lucide-react"
import { useState, useRef, useEffect } from "react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    // DialogDescription,
} from "@/components/ui/dialog"
import type { Post, Reaction } from "@/types/post"

type pageProps = {
    reactions: Reaction[]
    post: Post | null
    open: boolean
    onClose: () => void
}

export default function ViewModal({post, open, onClose, reactions}:pageProps) {
    const emotionText = post?.custom_emotion || post?.emotion?.name || '';
    const isLongText = emotionText.length > 12;
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

    if(!open) {
        return null
    }

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
                    ${post?.type === 'secret' ? 'bg-gray-50 dark:bg-[#121212]' : 'bg-white dark:bg-[#0a0a0a]'}
                `}>
                <div className="flex gap-5 flex-col">
                    {post?.type === 'rant' ? (
                        <div className="flex flex-col">
                            <DialogHeader className="border-b pb-2 text-left">
                                <DialogTitle className="text-xl font-bold flex items-center gap-3"><span>{post.nickname || 'Anonymous'}'s post</span>
                                    <div className={`flex items-center border border-slate-200 bg-white dark:bg-[#141414] dark:shadow dark:border-none dark:text-muted px-2.5 rounded-full shadow-sm max-w-50`}>
                                        <span className="mr-1.5 shrink-0 text-sm">
                                            {post.custom_emotion ? '📝' : (post.emotion?.emoji || '🙂')}
                                        </span>

                                        {post.custom_emotion ? (
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
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Message:</p>
                                    <p className="whitespace-pre-wrap italic">{post.message}</p>
                                </div>
                            </div>
                            <DialogFooter className="border-t">
                                <div className='py-2 flex items-center'>
                                    <div
                                        ref={containerRef}
                                        onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                                        className="inline-block relative "
                                    >
                                        {activePostId === post.id && (
                                            <div className='absolute -top-16 left-1/2 -translate-x-1/2 flex gap-2 p-1.5
                                                            bg-white backdrop-blur-md border border-slate-200/60
                                                            rounded-full shadow-xl shadow-black/5 animate-in fade-in
                                                            zoom-in-95 duration-200 dark:bg-[#0a0a0a] dark:border-none'>
                                                {reactions.map(reaction => (
                                                    <div
                                                        key={reaction.id}
                                                        className="group flex flex-col items-center justify-center
                                                                w-10 h-10 rounded-full transition-all duration-200
                                                                hover:bg-white hover:dark:bg-[#0a0a0a] hover:scale-125 hover:shadow-sm cursor-pointer"
                                                    >
                                                        <span className="text-xl leading-none">{reaction.emoji}</span>

                                                        {/* Tooltip-style name that appears on hover */}
                                                        <span className='absolute -top-8 scale-0 group-hover:scale-100
                                                                transition-transform bg-slate-800 text-white
                                                                text-[10px] px-2 py-1 rounded-md pointer-events-none'>
                                                            {reaction.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex">
                                            <button
                                                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                            >
                                                <Smile size={22} strokeWidth={1.5} />
                                            </button>
                                        </div>
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
                            <p className="text-gray-500 text-sm">Someone left a message for <span className="border-b">{post?.to_whom}</span></p>
                            <div className="">
                                <p
                                    className={`text-xs text-gray-500 bg-gray-200 dark:bg-[#0a0a0a] dark:text-muted-foreground inline-block px-3 py-1 rounded-lg mb-1 ${post?.type !== 'secret' ? 'hidden' : 'block'} }`}
                                >
                                    To: {post?.to_whom || 'Someone'}
                                </p>

                                <p className="whitespace-pre-wrap italic mb-5">{post?.message}</p>
                                <p className="text-right font-semibold italic">- {post?.nickname || 'Anonymous'}</p>
                            </div>

                            {post?.music_url && (
                                <div className="mt-4">
                                    <p className="text-gray-500 text-sm mb-1">
                                        They left a song with this.
                                    </p>

                                    <div className="group relative overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 p-1 transition-all hover:shadow-md border border-black/5 dark:border-white/5">
                                        <iframe
                                            title="Spotify Player"
                                            src={getSpotifyEmbed(post?.music_url || '')}
                                            width="100%"
                                            height="80" // Compact height is often cleaner
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                            loading="lazy"
                                            className="rounded-xl grayscale-[0.2] contrast-[0.9] hover:grayscale-0 transition-all duration-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <DialogFooter className="border-t">
                                <div className='py-2 flex items-center'>
                                    <div
                                        ref={containerRef}
                                        onClick={() => setActivePostId(activePostId === post?.id ? null : post?.id)}
                                        className="inline-block relative "
                                    >
                                        {activePostId === post?.id && (
                                            <div className='absolute -top-16 left-1/2 -translate-x-1/2 flex gap-2 p-1.5
                                                            bg-white backdrop-blur-md border border-slate-200/60
                                                            rounded-full shadow-xl shadow-black/5 animate-in fade-in
                                                            zoom-in-95 duration-200 dark:bg-[#0a0a0a] dark:border-none'>
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

                                        <div className="flex">
                                            <button
                                                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                            >
                                                <Smile size={22} strokeWidth={1.5} />
                                            </button>
                                        </div>
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
