import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { downloadRecipePDF, getRecipeByName } from "../../services/RecipeAPI";
import { MdOutlinePostAdd } from "react-icons/md";
import { ReviewForm } from "../../components/Review/ReviewForm";
import { getReviewByRecipe } from "../../services/ReviewAPI";
import ReviewCard from "../../components/Review/ReviewCard";
import { FaFilePdf, FaRegClock, FaUserEdit, FaUtensils, FaCalendarAlt } from "react-icons/fa";

interface User {
  _id: string;
  name: string;
}

interface Food {
  _id: string;
  name: string;
}

interface Recipe {
  _id: string;
  user: User;
  food: Food;
  title: string;
  ingredients: string[];
  step: string;
  readyIn: string;
  date: Date;
  images?: string[];
}

export default function RecipeDetailsPage() {
  const { title } = useParams<{ title: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [activeImage, setActiveImage] = useState("");
  const [showForm, setShowForm] = useState(false)
  const [review, setReview] = useState<any[]>([])

  useEffect(() => {
    if (!title) return;
    const fetchRecipe = async () => {
      try {
        const response = await getRecipeByName(title);
        const recipeDetails = response.data.data.recipe;
        setRecipe(recipeDetails);
        const reviewResponse = await getReviewByRecipe(recipeDetails._id)
        setReview(reviewResponse.data.data.review)
        if (recipeDetails.images?.length > 0) {
          setActiveImage(recipeDetails.images[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecipe();
  }, [title]);

  const handleDownloadPDF = async () => {
    if (!recipe) return;
    try {
      const response = await downloadRecipePDF(recipe._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${recipe.title.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleAddClick = () => setShowForm(true);
  const handleCloseform = () => setShowForm(false);
  const handleSave = () => {};

  if (!recipe) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#fbbf24]"></div>
    </div>
  );

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-10 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            {recipe.title} <span className="text-[#fbbf24]">.</span>
          </h1>
          <button 
            onClick={handleDownloadPDF}
            className="group flex items-center gap-3 bg-red-500/10 border border-red-500/50 hover:bg-red-500 text-red-500 hover:text-white px-8 py-3 rounded-2xl shadow-xl transition-all font-bold uppercase text-sm tracking-widest"
          >
            <FaFilePdf className="text-xl" /> DOWNLOAD RECIPE
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          {[
            { icon: <FaUtensils />, label: "Food", val: recipe.food.name },
            { icon: <FaUserEdit />, label: "Author", val: recipe.user.name },
            { icon: <FaRegClock />, label: "Time", val: recipe.readyIn },
            { icon: <FaCalendarAlt />, label: "Date", val: new Date(recipe.date).toLocaleDateString() }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
              <span className="text-[#fbbf24]">{item.icon}</span>
              <span className="text-xs text-gray-400 uppercase font-bold tracking-tighter">{item.label}:</span>
              <span className="text-sm text-white font-semibold">{item.val}</span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-7">
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl h-[400px] md:h-[550px]">
              <img src={activeImage} className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700" alt="Recipe" />
            </div>
            <div className="flex gap-4 mt-6 overflow-x-auto pb-2 no-scrollbar">
              {recipe.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-24 h-24 flex-shrink-0 rounded-[1.5rem] overflow-hidden border-2 transition-all duration-300 ${
                    activeImage === img ? "border-[#fbbf24] scale-105 shadow-[0_0_15px_rgba(251,191,36,0.3)]" : "border-transparent opacity-40 hover:opacity-100"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-md">
              <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">The Story</h2>
              <p className="text-gray-400 leading-relaxed italic border-l-2 border-[#fbbf24]/30 pl-6">
                A beautifully crafted dish with a rich blend of flavors and textures. Follow through the steps to recreate this delicious meal.
              </p>
            </div>

            <div className="p-10 bg-gradient-to-br from-[#fbbf24] to-[#d97706] rounded-[2.5rem] shadow-2xl transform hover:rotate-1 transition-transform">
              <h2 className="text-2xl font-black text-[#0f172a] mb-6 uppercase tracking-tight">Ingredients</h2>
              <ul className="grid grid-cols-1 gap-3">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#0f172a] font-bold text-sm bg-white/20 p-3 rounded-xl border border-white/30">
                    <span className="w-2 h-2 bg-[#0f172a] rounded-full"></span>
                    {ing.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-16 p-10 md:p-16 bg-[#1e293b]/40 backdrop-blur-xl rounded-[3rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-6 mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Instructions</h2>
            <div className="h-px flex-grow bg-white/10"></div>
          </div>
          <p className="text-gray-300 leading-[2.2] whitespace-pre-line text-lg font-medium opacity-90">
            {recipe.step}
          </p>
        </div>

        <div className="p-10 md:p-16 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <h2 className="text-4xl font-black text-white uppercase tracking-tight">
              Reviews <span className="text-[#fbbf24] font-normal text-2xl ml-2">({review.length})</span>
            </h2>
            <button 
              onClick={handleAddClick}    
              className="group relative px-10 py-5 bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-[#0f172a] font-black rounded-full text-sm flex items-center gap-3 shadow-xl hover:scale-105 transition-all uppercase tracking-widest"
            >
              <MdOutlinePostAdd size={24}/> ADD REVIEW
            </button>
          </div>

          {review.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
              <p className="text-gray-500 text-xl font-medium">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {review.map((rev) => (
                <ReviewCard key={rev._id} review={rev}/>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <ReviewForm
          onClose={handleCloseform}
          onSave={handleSave}
          recipeId={recipe._id}
        />
      )}
    </div>
  );
}