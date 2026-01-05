import { useEffect, useRef, useState } from "react";
import heroPic from "../../assets/heropic.png";
import { useNavigate } from "react-router-dom";
import { searchRecipes } from "../../services/RecipeAPI";
import { HiMagnifyingGlass } from "react-icons/hi2";

interface searchResult {
  _id: string;
  title: string;
  images: string[];
}

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<searchResult[]>([]);
  const [showSuggestions, setShowSuggestion] = useState(false);
  const dropdown = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      if (query.length > 1) {
        try {
          const response = await searchRecipes(query);
          if (response.data.success) {
            setSuggestions(response.data.data);
            setShowSuggestion(true);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestion(false);
      }
    };
    const timeout = setTimeout(() => {
      fetchRecipes();
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleOutSideClick(event: MouseEvent) {
      if (dropdown.current && !dropdown.current.contains(event.target as Node)) {
        setShowSuggestion(false);
      }
    }
    document.addEventListener("mousedown", handleOutSideClick);
    return () => document.removeEventListener("mousedown", handleOutSideClick);
  }, [dropdown]);

  const handleClick = (title: string) => {
    navigate(`/recipe/${encodeURIComponent(title)}`);
    setShowSuggestion(false);
  };

  return (
    <section className="min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#fbbf24] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500 rounded-full blur-[150px]"></div>
      </div>

      <div className="flex flex-col justify-center z-10 max-w-2xl">
        <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] mb-8 uppercase tracking-tighter">
          Feel <span className="text-[#fbbf24]">The</span> <br /> 
          Beverages <br /> 
          Feel <span className="text-[#fbbf24]">The</span> Taste
        </h1>
        
        <p className="text-gray-400 text-lg mb-10 max-w-lg italic border-l-4 border-[#fbbf24] pl-6">
          Discover the art of mixology and gourmet flavors. Your journey to extraordinary taste starts here.
        </p>

        <div className="relative w-full md:w-[500px]" ref={dropdown}>
          <div className="bg-white/5 backdrop-blur-xl shadow-2xl rounded-[2rem] flex items-center p-5 w-full border border-white/10 focus-within:border-[#fbbf24]/50 transition-all">
            <HiMagnifyingGlass className="text-[#fbbf24] text-3xl mr-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search premium recipes..."
              className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-xl font-medium"
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-4 bg-[#1e293b] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 border border-white/10 backdrop-blur-2xl">
              <ul>
                {suggestions.map((recipe) => (
                  <li
                    key={recipe._id}
                    onClick={() => handleClick(recipe.title)}
                    className="px-6 py-4 hover:bg-white/5 cursor-pointer flex items-center gap-4 transition-all border-b last:border-none border-white/5 group"
                  >
                    {recipe.images && recipe.images.length > 0 ? (
                      <img 
                        src={recipe.images[0]} 
                        alt={recipe.title} 
                        className="w-14 h-14 rounded-2xl object-cover border border-white/10 group-hover:border-[#fbbf24] transition-all"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">🍸</div>
                    )}
                    
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-lg group-hover:text-[#fbbf24] transition-colors">
                        {recipe.title}
                      </span>
                      <span className="text-xs text-gray-500 uppercase tracking-widest font-black">Premium Recipe</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="relative mt-16 md:mt-0 group">
        <div className="absolute inset-0 bg-[#fbbf24] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <img
          src={heroPic}
          alt="Premium Beverages"
          className="relative z-10 w-[400px] md:w-[500px] lg:w-[600px] rounded-full shadow-[0_0_80px_rgba(0,0,0,0.4)] border-[15px] border-white/5 backdrop-blur-md transform transition-transform duration-700 hover:scale-105"
        />
      </div>
    </section>
  );
}