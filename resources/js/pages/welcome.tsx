import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react"
import AOS from "aos";
import { SquarePen } from 'lucide-react';
import { useEffect } from "react"
import Header from "@/components/heading"
import "aos/dist/aos.css";

type pageProps = {
    name: string
}

export default function Welcome({name}:pageProps) {
    const subtext = 'Share your thoughts anonymously. Express how you feel. Sometimes letting it out is enough.'
    const { component } = usePage();

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
                data-aos="zoom-in"
                className="flex justify-center h-screen  md:items-center flex-col gap-10 md:gap-20 z-90 px-5 md:px-0"
            >
                <div className="flex flex-col gap-1">
                    <h1 className="headline text-5xl lg:text-7xl font-extrabold">Say what you cant say <span className="text-blue-500 underline">out loud</span></h1>
                    <p className="subtext text-left md:text-center text-lg">{subtext}</p>
                </div>

                <div className="">
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
