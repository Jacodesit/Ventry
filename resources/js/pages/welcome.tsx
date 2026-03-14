import { Link } from "@inertiajs/react"
import { SquarePen } from 'lucide-react';
import Header from "@/components/heading"


type pageProps = {
    name: string
}

export default function Welcome({name}:pageProps) {
    const subtext = 'Share your thoughts anonymously. Express how you feel. Sometimes letting it out is enough.'

    return (
        <main>
            <Header name={name} />
            <div className="flex items-center justify-center flex-col min-h-screen w-full relative">
                {/* Dashed Bottom Fade Grid */}
                <div
                    className="absolute inset-0 z-0"
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
                            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
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
                        radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
                    `,
                    maskComposite: "intersect",
                        WebkitMaskComposite: "source-in",
                    }}
                />
                <div className="flex justify-center md:items-center flex-col gap-10 md:gap-20 z-90 px-5 md:px-0 ">
                    <div className="flex flex-col gap-1">
                        <h1 className="headline text-5xl lg:text-7xl font-extrabold">Say what you cant say <span className="text-blue-500 underline">out loud</span></h1>
                        <p className="subtext text-left md:text-center text-lg">{subtext}</p>
                    </div>

                    <div className="">
                        <Link
                            href={'/home'}
                            className="border text-xs md:text-sm px-5 py-3 rounded-md transition-all duration-300 hover:bg-accent-foreground hover:text-muted flex items-center gap-2"
                        >
                            <SquarePen size={15} />
                            Publish Now
                        </Link>
                    </div>
                </div>
            </div>
        </main>

    )
}
