import { Link } from '@inertiajs/react';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

type pageProps = {
    name: string
}

export default function Header({name}:pageProps) {
    const currentPath = window.location.pathname;

    const links = [
        {name: 'Wall', href: '/wall'},
        {name: 'About', href: '/about'}
    ]

    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');

        if (saved) {
            return saved === 'dark';
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <header className={`w-full fixed px-5 md:px-15 lg:px-50 py-5 flex justify-between items-center shadow z-10
            ${currentPath !== '/' ? 'bg-[#f9fafb] dark:bg-[#0a0a0a]' : '' }
        `}
        >
            <p className="header text-2xl font-bold">{name}</p>
            <>
                {currentPath !== '/' && (
                    <nav className="flex justify-center items-center">
                        <ul className="flex items-center gap-5">
                            {links.map(link => (
                                <Link
                                    href={link.href}
                                    key={link.name}
                                    className={`${currentPath === '/' + link.name.toLowerCase()
                                        ? 'text-blue-500 font-extrabold border-b-2 border-blue-500'
                                        : ''
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </ul>
                    </nav>
                )}

                <div className='flex justify-end'>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className='p-2 rounded-full shadow transition-all duration-300 hover:bg-accent-foreground hover:text-muted  cursor-pointer'
                    >
                        {darkMode ? <Moon size={15} /> : <Sun size={15}/>}
                    </button>

                </div>
            </>

        </header>
    )
}
