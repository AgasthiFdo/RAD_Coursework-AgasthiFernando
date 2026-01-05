import { useNavigate } from "react-router-dom"


interface Recipe {
  _id : string
  title : string
  readyIn : string
  step : string
  images?: string[]
}

interface RecipeCardProps {
  recipe : Recipe
}

export default function RecipeCard({recipe}:RecipeCardProps){
  const navigate = useNavigate()
  return(
    <div 
      key={recipe._id}
      onClick={()=> navigate(`/recipe/${recipe.title}`)}
      className='bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer'>
        <div className='h-48 w-full overflow-hidden'>
            {recipe.images && recipe.images.length > 0 ?(
              <img 
                src={recipe.images[0]}
                alt={recipe.title}
                className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-500"
          
              />
            ) : (
              <div className='h-full w-full bg-gray-200 flex items-center justify-center text-gray-500'>
                    No Image
              </div>
            )}
        </div>

        <div className='p-4'>
            <h3 className='text-lg font-bold text-gray-800 truncate text-center'>
              {recipe.title}
            </h3>
        </div>
    </div>
  )

}