type tabProps = {
    label: string
    active: boolean
    onClick: () => void
}

export default function Tab({ label, active, onClick }: tabProps) {
    return (
        <button
            onClick={onClick}
            className={`
                px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300
                ${active 
                    ? "bg-[#fbbf24] text-[#0f172a] shadow-lg shadow-[#fbbf24]/20 scale-105" 
                    : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300"
                }
            `}
        >
            {label}
        </button>
    )
}