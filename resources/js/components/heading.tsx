type pageProps = {
    name: string
}

export default function Header({name}:pageProps) {
    return (
        <header className="w-full fixed px-5 md:px-15 lg:px-50 py-5"
        >
            <p className="header text-2xl font-bold">{name}</p>
        </header>
    )
}
