import AllRecipesCard from "../../components/recipe/AllRecipesCard"

const AllRecipesPage = () => {
    return (
        <div className="min-h-screen bg-fixed bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-10">
            <div className="max-w-7xl mx-auto px-6 mb-8 mt-6">
                <h1 className="text-4xl font-black text-white tracking-tight">
                    Discovery <span className="text-[#fbbf24]">Recipes</span>
                </h1>
                <p className="text-gray-400 mt-2 italic border-l-2 border-[#fbbf24]/50 pl-4">
                    Explore the finest cocktail recipes and culinary secrets.
                </p>
            </div>

            <div className="max-w-7xl mx-auto">
                <AllRecipesCard />
            </div>
        </div>
    )
}

export default AllRecipesPage