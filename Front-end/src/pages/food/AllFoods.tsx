import AllFoodsCard from "../../components/food/AllFoodsCard"

const AllFoods = () => {
    return (
        
        <div className="min-h-screen bg-fixed bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-10">
            
            
            <div className="max-w-7xl mx-auto px-6 mb-8 mt-6">
                <h1 className="text-4xl font-black text-white tracking-tight">
                    Explore <span className="text-[#fbbf24]">All </span>
                </h1>
                <p className="text-gray-400 mt-2">Discover our curated collection of premium cocktail ingredients and foods.</p>
            </div>


            <div className="max-w-7xl mx-auto">
                <AllFoodsCard />
            </div>
               
        </div>
    )
}

export default AllFoods