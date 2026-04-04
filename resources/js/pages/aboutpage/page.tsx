import { Info, Lock, Settings, ShieldCheck, Zap, QuoteIcon } from "lucide-react";
import AppLayout from "@/layouts/app-layout";

type pageProps = {
    name: string
}

export default function About({name}:pageProps) {
    const datas = [
        { works: 'No sign up required' },
        { works: 'Post anonymously' },
        { works: 'Choose to rant or share a secret' },
        { works: 'Posts reset every 24 hours' },
        { works: 'Cooldown prevents spam' }
    ]

    const rules = [
        { name: 'Be respectful' },
        { name: 'No hate or harassment' },
        { name: 'Keep things anonymous' },
        { name: 'Be Think before posting' }
    ]

    return (
        <AppLayout name={name}>
            <div className="grid grid-cols-4 grid-rows-6 gap-2 py-10 mt-10 mb-20">
                <div data-aos="fade-up" data-aos-delay="0" className="col-span-2 row-span-3 border rounded-md p-7 bg-gray-50 dark:bg-[#0a0a0a]">
                    <div className="flex items-center gap-1 mb-5">
                        <Info size={17} />
                        <h1 className="text-lg font-bold">What is Ventry?</h1>
                    </div>
                    <p className="text-sm dark:text-muted-foreground">Ventry is a place where you can speak your mind without fear. It’s a safe corner of the internet where you can share your thoughts, feelings, and secrets completely anonymously. No accounts. No usernames. No pressure. Just a space for honesty, for letting out what you’ve been holding inside. You don’t have to explain yourself, and you don’t have to worry about being judged.</p>
                </div>
                <div data-aos="fade-up" data-aos-delay="100" className="col-start-3 row-span-3 border rounded-md p-7 bg-gray-50 dark:bg-[#0a0a0a]">
                    <div className="flex items-center gap-1 mb-5">
                        <Settings size={17} />
                        <h1 className="text-lg font-bold">How it works?</h1>
                    </div>

                    <ul className="list-disc px-5">
                        {datas.map((data, index) => (
                            <li
                                key={index}
                                className="text-sm dark:text-muted-foreground"
                            >
                                {data.works}
                            </li>
                        ))}
                    </ul>

                </div>
                <div data-aos="fade-up" data-aos-delay="200" className="col-start-1 col-span-2 row-start-4 row-span-3 border rounded-md  p-7 bg-gray-50 dark:bg-[#0a0a0a]">
                    <div className="flex items-center gap-1 mb-5">
                        <Zap size={17} />
                        <h1 className="text-lg font-bold">Why it exists?</h1>
                    </div>
                    <p className="text-sm dark:text-muted-foreground">Everyone has moments when they feel alone, when they carry thoughts and emotions that weigh them down. Not everyone has someone they can trust to talk to. Ventry exists for those moments. It’s a place to release what’s been bottled up, to express the things you don’t say out loud, and to feel lighter knowing that someone, even if invisible, has heard you.</p>
                </div>
                <div data-aos="fade-up" data-aos-delay="300" className="col-start-4 row-start-1 row-span-3 border rounded-md p-7 bg-gray-50 dark:bg-[#0a0a0a]">
                    <div className="flex items-center gap-1 mb-5">
                        <ShieldCheck size={17} />
                        <h1 className="text-lg font-bold">Community Rules</h1>
                    </div>

                    <ul className="list-disc px-5">
                        {rules.map((rule, index) => (
                            <li
                                key={index}
                                className="text-sm dark:text-muted-foreground"
                            >
                                {rule.name}
                            </li>
                        ))}
                    </ul>

                </div>
                <div data-aos="fade-up" data-aos-delay="400" className="col-start-3 col-span-2 row-start-4 row-span-3 border p-7 bg-gray-50 dark:bg-[#0a0a0a] rounded-md">
                    <div className="flex items-center gap-1 mb-5">
                        <Lock size={17} />
                        <h1 className="text-lg font-bold">Privacy</h1>
                    </div>
                    <p className="text-sm dark:text-muted-foreground">Your privacy matters. Ventry doesn’t collect personal data. Every post is completely anonymous. Your identity is safe. The only time we use your IP is to stop spam and keep the space secure, nothing more. You can share freely, knowing that Ventry protects your voice while letting it be heard.</p>
                </div>
            </div>

            <div
                data-aos="fade-up"
                data-aos-delay="500"
                className="relative overflow-hidden  dark:bg-[#0a0a0a] bg-[#f9fafb] py-24 px-6 flex flex-col items-center justify-center min-h-[60vh] rounded-md"
            >
                {/* Background Accent - Subtle Minimalist Element */}
                <QuoteIcon
                    size={180}
                    className="absolute -top-10 -left-10 opacity-[0.03] dark:opacity-[0.05] -rotate-12 pointer-events-none"
                />

                <div className="max-w-4xl w-full relative z-10">
                    <div className="flex justify-center mb-8 text-slate-400">
                        <QuoteIcon size={32} strokeWidth={1} />
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl text-center leading-[1.1] tracking-tight font-extralight italic text-slate-900 dark:text-slate-100">
                        Your voice matters. <br className="hidden md:block" />
                        <span className="opacity-50">Even if no one knows it’s you.</span>
                    </h1>

                    <div className="mt-12 flex items-center justify-center gap-3">
                        <div className="h-px w-8 bg-slate-300 dark:bg-slate-800"></div>
                        <p className="text-xs uppercase tracking-[0.2em] font-medium text-slate-500">
                            Jacob
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
