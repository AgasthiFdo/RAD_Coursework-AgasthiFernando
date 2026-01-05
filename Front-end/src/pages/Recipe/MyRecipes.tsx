import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { deleteRecipes, getRecipeByUser } from "../../services/RecipeAPI";
import { showConfirmDialog, showErrorAlert, showSuccessAlert } from "../../utils/SweetAlerts";
import { RecipeForm } from "../../components/dashboard/RecipeForm";
import { useDispatch } from "react-redux";
import type { AppDisPatch } from "../../redux/store";
import { setSelectedMyRecipe } from "../../redux/slices/recipeSlice";

interface User {
  _id: string;
  name: string;
}

interface Food {
  _id: string;
  name: string;
}

interface Recipe {
  _id: string
  user: User
  food: Food
  title: string
  ingredients: string
  step: string
  readyIn: string
  date: Date
  images?: string[]
}

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false)
  const dispatch = useDispatch<AppDisPatch>();

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const res = await getRecipeByUser();
      setRecipes(res.data.data.recipes);
    } catch (error) {
      console.error("Error loading recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (recipe: Recipe) => {
    dispatch(setSelectedMyRecipe(recipe))
    setShowForm(true)
  }

  const handleCloseForm = () => {
    dispatch(setSelectedMyRecipe(null))
    setShowForm(false)
  }

  const handleMyRecipesaved = () => {
    loadRecipes();
    handleCloseForm()
  }

  const handleDelete = async (recipeDelete: Recipe) => {
    showConfirmDialog(
      'Are you sure?',
      `${recipeDelete.title} Do you want to delete? `,
      'Yes, Delete it!'
    ).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteRecipes(recipeDelete._id)
          setRecipes(prevRecipes =>
            prevRecipes.filter(rec => rec._id !== recipeDelete._id)
          )
          showSuccessAlert('Deleted', `${recipeDelete.title} has been Deleted`)
        } catch (error) {
          console.error(error)
          showErrorAlert('error', 'Failed to delete')
        }
      }
    })
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fbbf24]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">
            My <span className="text-[#fbbf24]">Recipes</span>
          </h1>
          <div className="h-px flex-grow bg-white/10"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="group bg-[#1e293b]/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[#fbbf24]/10 hover:shadow-2xl">
              <div className="relative h-64 overflow-hidden">
                {recipe.images && recipe.images.length > 0 ? (
                  <img
                    src={recipe.images[0]}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0f172a] flex items-center justify-center text-gray-500 italic">
                    No Image Available
                  </div>
                )}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-[#0f172a] text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                  {recipe.readyIn}
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4 line-clamp-1 group-hover:text-[#fbbf24] transition-colors">{recipe.title}</h2>
                
                <div className="space-y-4 mb-8">
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    <span className="text-[#fbbf24] font-black uppercase tracking-[0.2em] text-[10px] block mb-1">Ingredients</span> {recipe.ingredients}
                  </p>
                  <p className="text-sm text-gray-300 line-clamp-3 italic border-l-2 border-[#fbbf24]/30 pl-4 bg-white/5 py-2 rounded-r-lg">
                    {recipe.step}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                  <button 
                    onClick={() => handleEdit(recipe)}
                    className="p-4 bg-white/5 text-[#fbbf24] rounded-2xl hover:bg-[#fbbf24] hover:text-[#0f172a] transition-all duration-300 shadow-lg border border-white/5 active:scale-90"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(recipe)}
                    className="p-4 bg-white/5 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg border border-white/5 active:scale-90"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-32 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10 backdrop-blur-sm">
            <p className="text-gray-500 text-xl font-medium tracking-wide">You haven't added any recipes yet.</p>
          </div>
        )}
      </div>

      {showForm && (
        <RecipeForm
          onClose={handleCloseForm}
          onSave={handleMyRecipesaved}
        />
      )}
    </div>
  );
}