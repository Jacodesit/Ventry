import { SquarePen } from 'lucide-react';

type pageProps = {
    onClick: () => void
}

export default function RantBtn({onClick}:pageProps) {
    return (
        <button
            onClick={onClick}
            className="border text-xs md:text-sm px-6 py-2 rounded-md transition-all duration-300 hover:bg-accent-foreground hover:text-muted flex items-center gap-2 cursor-pointer"
        >
            <SquarePen size={15} />
            <p>Rant something</p>
        </button>
    )
}
