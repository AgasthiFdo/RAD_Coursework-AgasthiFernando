import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllFoods } from '../../services/FoodAPI'

interface Food {
  _id: string
  name: string
  category: string
  cuisine: string
  description: string
  images: string[]
}

interface Props {
  selectedCategory?: string
}

export default function FoodCard({ selectedCategory }: Props) {
  const [foods, setFoods] = useState<Food[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await getAllFoods()
        let allFoods = response.data.data.foods

        if (selectedCategory) {
          allFoods = allFoods.filter(
            (f: Food) =>
              f.category.toLowerCase() === selectedCategory.toLowerCase()
          )
        }
        setFoods(allFoods)
      } catch (error) {
        console.error(error)
      }
    }
    fetchFoods()
  }, [selectedCategory])

  return (
    <section className='px-8 md:px-20 py-10'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10'>
        {foods.slice(0, 8).map((food) => (
          <div
            key={food._id}
            onClick={() => navigate(`/foodpage/${food.name}`)}
            className='group cursor-pointer bg-[#1e293b]/40 backdrop-blur-md rounded-[2rem] overflow-hidden border border-white/10 shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[#fbbf24]/20'
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={food.images?.[0]}
                alt={food.name}
                className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60"></div>
              
              <div className="absolute top-4 left-4 bg-[#fbbf24] text-[#0f172a] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                {food.cuisine}
              </div>
            </div>

            <div className='p-6 text-center'>
              <h3 className='text-lg font-bold text-white group-hover:text-[#fbbf24] transition-colors duration-300 tracking-tight'>
                {food.name}
              </h3>
              <div className="mt-3 w-12 h-1 bg-[#fbbf24]/20 mx-auto rounded-full group-hover:w-20 group-hover:bg-[#fbbf24] transition-all duration-500"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}