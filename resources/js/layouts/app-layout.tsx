import { usePage } from "@inertiajs/react";
import AOS from "aos";
import React from "react"
import { useEffect } from "react"
import "aos/dist/aos.css";
import Header from "@/components/heading"

type pageProps = {
    children: React.ReactNode
    name: string
}

export default function AppLayout({children, name}:pageProps) {
    const { component } = usePage();

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    useEffect(() => {
        AOS.refresh();
    }, [component]);

    return (
        <main className="">
            <Header name={name} />
            <div className="py-20 px-5 md:px-15 lg:px-50 dark:bg-[#000000]">
                {children}
            </div>
        </main>
    )
}
