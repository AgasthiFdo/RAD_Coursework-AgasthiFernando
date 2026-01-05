type navButtonProps = {
    label: string
    active: boolean
    onClick: () => void
}

export default function NavButton({ label, active, onClick }: navButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`group flex flex-col items-center gap-2 transition-all duration-300 outline-none
                ${active ? "scale-110" : "hover:scale-105 opacity-60 hover:opacity-100"}
            `}
        >
            <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500
                ${active 
                    ? "bg-[#fbbf24] text-[#0f172a] shadow-[0_0_20px_rgba(251,191,36,0.4)] rotate-[10deg]" 
                    : "bg-white/5 text-white border border-white/10 group-hover:border-[#fbbf24]/50"}
            `}>
                {label[0].toUpperCase()}
            </div>
            
            <span className={`
                text-[10px] font-black uppercase tracking-[0.15em] transition-colors duration-300
                ${active ? "text-[#fbbf24]" : "text-gray-500 group-hover:text-white"}
            `}>
                {label}
            </span>

            {active && (
                <div className="w-1 h-1 bg-[#fbbf24] rounded-full animate-pulse"></div>
            )}
        </button>
    )
}