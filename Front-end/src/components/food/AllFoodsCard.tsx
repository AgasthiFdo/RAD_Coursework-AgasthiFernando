import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDisPatch, RootState } from "../../redux/store"
import { fetchAllFoods } from "../../redux/slices/foodSlice"

export default function AllFoodsCard() {
    const [page, setPage] = useState(1)
    const dispatch = useDispatch<AppDisPatch>();
    const { foods, totalPages } = useSelector((state: RootState) => state.food);
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchAllFoods({ page, limit: 8 }));
    }, [dispatch, page])

    return (
        <div className="min-h-screen py-16 px-8 md:px-20 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
            <div className="flex items-center gap-4 mb-12">
                <h2 className="text-4xl font-black text-white uppercase tracking-tight">
                    All <span className="text-[#fbbf24]">Foods</span>
                </h2>
                <div className="h-px flex-grow bg-white/10"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {foods.map((food) => (
                    <div
                        key={food._id}
                        onClick={() => navigate(`/foodpage/${food.name}`)}
                        className="group cursor-pointer bg-[#1e293b]/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[#fbbf24]/10"
                    >
                        <div className="relative h-56 overflow-hidden">
                            <img
                                src={food.images?.[0]}
                                alt={food.name}
                                className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent opacity-60"></div>
                        </div>

                        <div className='p-6 text-center'>
                            <h3 className='text-lg font-bold text-white group-hover:text-[#fbbf24] transition-colors duration-300 tracking-tight capitalize'>
                                {food.name}
                            </h3>
                            <div className="mt-3 w-8 h-1 bg-[#fbbf24] mx-auto rounded-full group-hover:w-16 transition-all duration-500"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center gap-6 mt-16">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={`px-8 py-3 rounded-2xl border font-bold uppercase text-xs tracking-widest transition-all duration-300 ${
                        page === 1
                            ? "text-gray-600 border-white/5 cursor-not-allowed"
                            : "text-white border-[#fbbf24]/50 hover:bg-[#fbbf24] hover:text-[#0f172a] shadow-lg"
                    }`}
                >
                    Prev
                </button>

                <div className="flex items-center gap-2 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                    <span className="text-gray-400 text-xs uppercase font-black tracking-tighter">Page</span>
                    <span className="text-[#fbbf24] font-bold">{page}</span>
                    <span className="text-gray-600">/</span>
                    <span className="text-white font-bold">{totalPages}</span>
                </div>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={`px-8 py-3 rounded-2xl border font-bold uppercase text-xs tracking-widest transition-all duration-300 ${
                        page === totalPages
                            ? "text-gray-600 border-white/5 cursor-not-allowed"
                            : "text-white border-[#fbbf24]/50 hover:bg-[#fbbf24] hover:text-[#0f172a] shadow-lg"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    )
}