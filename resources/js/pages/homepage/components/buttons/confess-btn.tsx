import { SquarePen } from 'lucide-react';

type pageProps = {
    onClick: () => void;
    cooldown: number

}

export default function ConfessBtn({onClick, cooldown}:pageProps) {
    return (
        <button
            disabled={cooldown > 0}
            onClick={onClick}
            className="border text-xs md:text-sm px-6 py-2 rounded-md transition-all duration-300 hover:bg-accent-foreground hover:text-muted flex items-center gap-2 cursor-pointer"
        >
            <SquarePen size={15} />
            {cooldown > 0 ? `Wait ${cooldown}s` : 'Share a secret'}
        </button>
    )
}
