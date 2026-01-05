import { FaStar } from "react-icons/fa";

interface User {
    _id: string
    name: string
}

interface Recipe {
    _id: string
    title: string
}

interface ReviewCardItem {
    _id: string
    user: User
    recipe: Recipe
    rating: number
    description: string
}

interface ReviewCardProps {
    review: ReviewCardItem
}

export default function ReviewCard({ review }: ReviewCardProps) {

    const renderStar = (rating: number) => {
        return [...Array(5)].map((_, index) => {
            return (
                <FaStar
                    key={index}
                    size={14}
                    className={index < rating ? "text-[#fbbf24] drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" : "text-white/10"} 
                />
            )
        })
    }

    return (
        <div className="group bg-[#1e293b]/40 backdrop-blur-md border border-white/5 p-6 rounded-[2.5rem] transition-all duration-500 hover:bg-white/[0.04] hover:border-[#fbbf24]/20 hover:-translate-y-1 shadow-xl">
            <div className="flex gap-5 items-start">
                <div className="flex-shrink-0 relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#fbbf24] to-[#d97706] flex items-center justify-center text-[#0f172a] text-xl font-black uppercase shadow-lg transform transition-transform group-hover:rotate-6">
                        {review.user.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0f172a] rounded-full flex items-center justify-center border border-white/10">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                        <h4 className="text-sm font-black text-white tracking-widest uppercase">
                            {review.user.name}
                        </h4>
                        <div className="flex gap-0.5 px-3 py-1 bg-black/30 rounded-full border border-white/5 w-fit">
                            {renderStar(review.rating)}
                        </div>
                    </div>

                    <div className="mb-3">
                        <span className="text-[10px] font-black text-[#fbbf24]/50 uppercase tracking-tighter italic">
                            Reviewing: {review.recipe.title}
                        </span>
                    </div>

                    <div className="relative">
                        <span className="absolute -top-2 -left-2 text-4xl text-white/5 font-serif pointer-events-none">“</span>
                        <p className="text-gray-400 leading-relaxed text-sm font-medium italic">
                            {review.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}