import { Sun } from 'lucide-react';

type pageProps = {
    name: string
}

export default function Header({name}:pageProps) {
    const currentPath = window.location.pathname;

    const links = [
        {name: 'Wall'},
        {name: 'About'}
    ]

    return (
        <header className="w-full fixed px-5 md:px-15 lg:px-50 py-5 grid grid-cols-3 items-center shadow z-900"
        >
            <p className="header text-2xl font-bold">{name}</p>

            {currentPath !== '/' && (
                <>
                    <nav className="flex justify-center items-center">
                        <ul className="flex items-center gap-5">
                            {links.map(link => (
                                <li
                                    key={link.name}
                                    className={`${currentPath === '/' + link.name.toLowerCase()
                                        ? 'text-blue-500 font-extrabold border-b-2 border-blue-500'
                                        : ''
                                    }`}
                                >
                                    {link.name}
                                </li>
                            ))}
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
