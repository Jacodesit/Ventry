import { Sun } from 'lucide-react';

type pageProps = {
    name: string
}

export default function Header({name}:pageProps) {
    const currentPath = window.location.pathname;

    return (
        <header className="w-full fixed px-5 md:px-15 lg:px-50 py-5 grid grid-cols-3 items-center shadow"
        >
            <p className="header text-2xl font-bold">{name}</p>

            {currentPath !== '/' && (
                <>
                    <nav className="flex justify-center items-center">
                        <ul className="flex items-center gap-5">
                            <li>Wall</li>
                            <li>About</li>
                        </ul>
                    </nav>

                    <div className='flex justify-end'>
                        <Sun />
                    </div>
                </>
            )}
        </header>
    )
}
