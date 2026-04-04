import { SquarePen } from 'lucide-react';

type pageProps = {
    onClick: () => void
    cooldown: number
}

export default function RantBtn({onClick, cooldown}:pageProps) {
    return (
        <button
            disabled={cooldown > 0}
            onClick={onClick}
            className={`border text-xs md:text-sm px-6 py-2 rounded-md flex items-center gap-2
                ${cooldown > 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-accent-foreground hover:text-muted cursor-pointer'
                }
            `}
        >
            <SquarePen size={15} />
            {cooldown > 0 ? `Wait ${cooldown}s` : 'Rant Something'}
        </button>
    )
}
