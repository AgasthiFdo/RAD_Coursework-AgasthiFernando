import { useParams } from 'react-router-dom'
import FoodCard from '../../components/Home/FoodCard'

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  
  const formattedTitle = category 
    ? category.charAt(0).toUpperCase() + category.slice(1) 
    : "";

  return (
    
    <div className='min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-16 px-6 md:px-16'>
        
        
        <div className="mb-10 border-b border-white/10 pb-6">
          <h2 className='text-4xl md:text-5xl font-black tracking-tight'>
            <span className="text-white opacity-40 text-sm uppercase tracking-[0.3em] block mb-2">Category</span>
            <span className="bg-gradient-to-r from-[#fbbf24] to-[#d97706] bg-clip-text text-transparent">
              {formattedTitle}
            </span>
          </h2>
        </div>

        
        <div className="relative">
          
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#fbbf24] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
          
          <FoodCard selectedCategory={category} />
        </div>
    </div>
  )
}