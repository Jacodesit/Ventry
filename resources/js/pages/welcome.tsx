import { router, usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react"
import AOS from "aos";
import { SquarePen } from 'lucide-react';
import { useEffect, useState } from "react"
import Header from "@/components/heading"
import "aos/dist/aos.css";
import type { Quote } from "@/types/post";

type pageProps = {
    name: string
    quotes: Quote[]
}

export default function Welcome({name}:pageProps) {
    const subtext = 'Share your thoughts anonymously. Express how you feel. Sometimes letting it out is enough.'
    const { component } = usePage();

    const [quote, setQuote] = useState<Quote | null>(null);

    useEffect(() => {
        fetch('/quotes')
            .then(res => res.json())
            .then(setQuote);
    }, []);

    useEffect(() => {
        const now = new Date()

        const nextMidnight = new Date()
        nextMidnight.setHours(24, 0, 0, 0)

        const timeUntilMidnight = nextMidnight.getTime() - now.getTime()

        const timer = setTimeout(() => {
            router.reload({ only: ['quote'] })
        }, timeUntilMidnight)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        AOS.init({ duration: 500, once: true });
    }, []);

    useEffect(() => {
        AOS.refresh();
    }, [component]);

    return (
        <main
            className="landing-page h-screen"
        >
            <Header name={name} />
            {/*  */}
            <div
                className="flex justify-center h-screen md:items-center flex-col gap-10 md:gap-20 z-90 px-5 md:px-0"
            >
                <div data-aos="fade-up" data-aos-delay="500"  className="flex flex-col gap-1">
                    <h1 className="headline text-5xl lg:text-7xl font-extrabold">Say what you cant say <span className="text-blue-500 underline">out loud</span></h1>
                    <p className="subtext text-left md:text-center text-lg">{subtext}</p>
                </div>

                {quote && (
                    <div data-aos="fade-up" data-aos-delay="700" className="text-center px-10 py-5 rounded-md bg-gray-50/20 border dark:shadow-2xl dark:bg-[#0a0a0a]/10">
                        <p className="text-xs mb-5 font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-neutral-500">Quotes for today</p>
                        <p className=" italic">"{quote.text}"</p>
                        <p className="mt-2">— {quote.author}</p>
                    </div>
                )}

                <div data-aos="fade-up" data-aos-delay="900">
                    <Link
                        href={'/wall'}
                        className="border text-xs md:text-sm px-6 py-2 rounded-md transition-all duration-300 hover:bg-accent-foreground hover:text-muted flex items-center gap-2"
                    >
                        <SquarePen size={15} />
                        Publish Now
                    </Link>
                </div>
            </div>
        </main>

    )
}
