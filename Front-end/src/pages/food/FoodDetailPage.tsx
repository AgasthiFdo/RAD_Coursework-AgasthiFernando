import { useEffect, useState } from "react"
import { getFoodByName } from "../../services/FoodAPI"
import { useParams } from "react-router-dom"
import { getRecipeByFood } from "../../services/RecipeAPI"
import RecipeCard from "../../components/recipe/RecipeCard"
import { MdOutlinePostAdd } from "react-icons/md";
import { UserAddRecipeForm } from "../../components/UserAddRecipeForm"
import { showSuccessAlert } from "../../utils/SweetAlerts"

interface Food {
  _id: string
  name: string
  category: string
  cuisine: string
  description: string
  images: string[]
}

export default function FoodPage() {
  const { name } = useParams<{ name: string }>()
  const [food, setFood] = useState<Food | null>(null)
  const [activeImage, setActiveImage] = useState<string>("")
  const [recipes, setRecipes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!name) return
    const fetchFood = async () => {
      try {
        const response = await getFoodByName(name)
        const foodDetail = response.data.data.food
        setFood(foodDetail)
        const recipeResponse = await getRecipeByFood(foodDetail._id);
        setRecipes(recipeResponse.data.data.recipes);

        if (foodDetail.images.length > 0) {
          setActiveImage(foodDetail.images[0])
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchFood()
  }, [name])

  if (!food) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fbbf24]"></div>
      </div>
    )
  }

  const handleSavedFood = (newRecipe: any) => {
    setShowForm(false);
    if (newRecipe.status === 'Approved') {
      setRecipes((prev) => [newRecipe, ...prev]);
      showSuccessAlert('Success', 'Recipe Added Successfully!');
    } else {
      showSuccessAlert('Submitted', 'Your recipe has been submitted for admin approval.');
    }
  }

  const handleAddClick = () => setShowForm(true)
  const handleCloseForm = () => setShowForm(false)

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Food Detail Card */}
        <div className="relative rounded-[2.5rem] overflow-hidden lg:flex bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 shadow-2xl">
          
          {/* Left Side: Image Gallery */}
          <div className="lg:w-1/2 p-8 flex flex-col items-center bg-[#0f172a]/40">
            <div className="w-full h-[400px] lg:h-[500px] mb-6 rounded-3xl overflow-hidden border border-white/10 shadow-inner group">
              <img
                src={activeImage}
                alt={food.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto w-full py-2 no-scrollbar">
              {food.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    activeImage === img 
                      ? "border-[#fbbf24] scale-110 shadow-[0_0_15px_rgba(251,191,36,0.4)]" 
                      : "border-transparent opacity-40 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Info Content */}
          <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-[#fbbf24]/10 text-[#fbbf24] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-[#fbbf24]/20">
                {food.category}
              </span>
              <span className="bg-white/5 text-gray-300 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-white/10">
                {food.cuisine}
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              {food.name}
            </h1>

            <div className="text-gray-400 text-lg leading-relaxed mb-10 border-l-2 border-[#fbbf24]/30 pl-6 italic">
              {food.description}
            </div>

            {/* Highlights Section */}
            <div className="mt-auto p-8 bg-gradient-to-br from-[#fbbf24] to-[#d97706] rounded-[2rem] shadow-2xl transform hover:rotate-1 transition-transform">
              <p className="text-[#0f172a] text-xl mb-4 font-black uppercase tracking-wider">
                Quick Highlights
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#0f172a] font-bold text-sm">
                <li className="flex items-center gap-2">✓ Authentic Flavor</li>
                <li className="flex items-center gap-2">✓ Signature Aroma</li>
                <li className="flex items-center gap-2">✓ Family Perfect</li>
                <li className="flex items-center gap-2">✓ Easy Prep</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex justify-center">
          <button 
            onClick={handleAddClick}
            className="group relative px-10 py-5 bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-[#0f172a] font-black rounded-full text-lg flex items-center gap-3 shadow-[0_10px_30px_rgba(251,191,36,0.3)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.5)] transition-all transform hover:-translate-y-1 active:scale-95"
          >
            <MdOutlinePostAdd size={28}/>
            ADD YOUR RECIPE
          </button>
        </div>


        <div className="mt-24">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-black text-white tracking-tight">
              Related <span className="text-[#fbbf24]">Recipes</span>
            </h2>
            <div className="h-px flex-grow bg-white/10"></div>
          </div>

          {recipes.length === 0 ? (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-[2rem]">
               <p className="text-gray-500 text-xl font-medium tracking-wide">No recipes available for this food yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <UserAddRecipeForm
          onClose={handleCloseForm}
          onSave={handleSavedFood}
        />
      )}
    </div>
  );
}