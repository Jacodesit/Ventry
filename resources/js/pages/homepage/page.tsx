import AppLayout from "@/layouts/app-layout"

type pageProps = {
    name: string
}

export default function Home({name}:pageProps) {
    return (
        <AppLayout name={name}>
            <div>
                this is home page
            </div>
        </AppLayout>
    )
}
