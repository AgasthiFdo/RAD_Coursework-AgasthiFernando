import HeroSection from "../../components/Home/HeroSection"
import FoodCard from "../../components/Home/FoodCard"
import Category from "../../components/Home/Category"
import { Link } from "react-router-dom"
import { HiOutlineArrowLongRight } from "react-icons/hi2";

const Home = () => {
    return (
        <div className="min-h-screen bg-fixed bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
            
            <HeroSection />

            {/* Category Section */}
            <div className="relative z-10 -mt-10">
                <Category />
            </div>


            <div className="px-8 md:px-20 py-12 mt-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-8">
                    <div>
                        <span className="text-[#fbbf24] text-sm font-bold uppercase tracking-[0.3em] mb-2 block">
                            Our Taste
                        </span>
                        <h2 className='text-4xl md:text-5xl font-black text-white tracking-tight'>
                            Some of our <span className="text-[#fbbf24]">Drinks</span>
                        </h2>
                    </div>
                    <p className="text-gray-400 max-w-md text-sm md:text-right">
                        Explore our handpicked selection of premium ingredients and delightful cocktail bases.
                    </p>
                </div>
            </div>
            
            <div className="px-4 md:px-10">
                <FoodCard />
            </div>


            <div className="flex justify-center pb-24 mt-20">
                <Link
                    to="/all-foods"
                    className="
                        group relative inline-flex items-center gap-4 
                        px-10 py-5 rounded-full
                        bg-gradient-to-r from-[#fbbf24] to-[#d97706]
                        text-[#0f172a] font-black text-xl
                        shadow-[0_10px_30px_rgba(251,191,36,0.3)] 
                        hover:shadow-[0_20px_50px_rgba(251,191,36,0.5)]
                        transition-all duration-300 ease-out
                        hover:scale-105 active:scale-95
                        overflow-hidden
                    "
                >
                    {/* Glossy Overlay Effect */}
                    <span className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <span className="relative z-10 tracking-tight">
                        See All Beverages
                    </span>

                    <HiOutlineArrowLongRight className="relative z-10 text-3xl transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
            </div>
        </div>
    )
}

export default Home