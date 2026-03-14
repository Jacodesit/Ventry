import React from "react"
import Header from "@/components/heading"

type pageProps = {
    children: React.ReactNode
    name: string
}

export default function AppLayout({children, name}:pageProps) {
    return (
        <main>
            <Header name={name} />
            <div className="h-screen py-20 px-5 md:px-15 lg:px-50">
                {children}
            </div>
        </main>
    )
}
