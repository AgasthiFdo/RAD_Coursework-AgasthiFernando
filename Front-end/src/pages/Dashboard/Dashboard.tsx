import { useEffect, useState } from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import Tab from '../../components/dashboard/Tab'
import Foods from '../../components/dashboard/Food';
import Recipie from '../../components/dashboard/Recipe';
import User from '../../components/dashboard/User';
import PendingRecipes from '../../components/dashboard/PendingRecipes';
import NotificationBell from '../../components/dashboard/NotifyBell';
import Review from '../../components/dashboard/Review';
import { getTotalRecipesCount } from '../../services/RecipeAPI';
import { getTotalReviewsCount } from '../../services/ReviewAPI';
import { getTotalUsersCount } from '../../services/UserAPI';
import Home from '../../components/dashboard/Home';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDisPatch, RootState } from '../../redux/store';
import { logoutAction } from '../../redux/slices/authSlice';
import { fetchTotalFoodsCount } from '../../redux/slices/foodSlice';

type TabType = "home" | "foods" | "recipies" | "users" | "reviews" | "Peending Recipes"

export default function Dashboard() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDisPatch>()
  const totalResults = useSelector((state: RootState) => state.food.totalResults)

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [stats, setStats] = useState({
    totalFoods: 0,
    totalRecipies: 0,
    totalReviews: 0,
    totalUsers: 0,
  })

  const logout = () => {
    dispatch(logoutAction())
  }

  useEffect(() => {
    dispatch(fetchTotalFoodsCount())
  }, [dispatch])

  useEffect(() => {
    const loadTotalRecipesCount = async () => {
      try {
        const res = await getTotalRecipesCount()
        setStats(prev => ({ ...prev, totalRecipies: res.data.data.totalRecipes }))
      } catch (error) { console.error(error) }
    }
    loadTotalRecipesCount()

    const loadTotalReviewsCount = async () => {
      try {
        const res = await getTotalReviewsCount()
        setStats(prev => ({ ...prev, totalReviews: res.data.data.totalReviews }))
      } catch (error) { console.error(error) }
    }
    loadTotalReviewsCount()

    const loadTotalUsersCount = async () => {
      try {
        const res = await getTotalUsersCount()
        setStats(prev => ({ ...prev, totalUsers: res.data.data.totalUsers }))
      } catch (error) { console.error(error) }
    }
    loadTotalUsersCount()
  }, [])

  return (
    <div className="min-h-screen bg-[#0f172a] bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-6 md:p-10">
      
      {/* Header Section */}
      <div className='flex justify-between items-center mb-10'>
        <div>
          <h1 className='text-3xl font-black tracking-tight text-white'>
            Admin <span className="text-[#fbbf24]">Dashboard</span>
          </h1>
          <p className="text-gray-400 text-sm">Manage your foods, recipes and users.</p>
        </div>

        <div className='flex items-center gap-6'>
          <NotificationBell />
          
          <div className="relative group">
            {isAuthenticated && user ? (
              <>
                <button className="w-12 h-12 rounded-full border-2 border-[#fbbf24]/50 p-0.5 hover:border-[#fbbf24] transition-all duration-300 cursor-pointer overflow-hidden shadow-lg shadow-black/40">
                  {user.image ? (
                    <img src={user.image} alt="profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="w-full h-full bg-[#fbbf24] flex items-center justify-center text-[#0f172a] font-bold text-xl uppercase">
                      {user?.name?.charAt(0)}
                    </div>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="absolute right-0 mt-4 w-56 bg-[#1e293b] border border-white/10 shadow-2xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 z-50 backdrop-blur-xl">
                  <div className="px-4 py-3 border-b border-white/10 mb-2">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#fbbf24] hover:text-[#0f172a] transition-all font-medium">
                    My Profile
                  </Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-all font-medium">
                    Logout Account
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="px-6 py-2 rounded-xl bg-[#fbbf24] text-[#0f172a] font-bold hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard title="Total Foods" value={totalResults} icon="🍛" />
        <StatsCard title="Total Recipes" value={stats.totalRecipies} icon="📜" />
        <StatsCard title="Total Reviews" value={stats.totalReviews} icon="📝" />
        <StatsCard title="Total Users" value={stats.totalUsers} icon="👨‍💻" />
      </div>

      {/* Main Tabs & Content */}
      <div className="bg-[#1e293b]/40 backdrop-blur-md rounded-[2rem] p-8 border border-white/5 shadow-xl">
        <div className="flex overflow-x-auto no-scrollbar border-b border-white/10 mb-8 pb-2">
          <div className="flex space-x-2">
            {(["home", "foods", "recipies", "users", "reviews", "Peending Recipes"] as TabType[]).map((tab) => (
              <Tab
                key={tab}
                label={tab.charAt(0).toUpperCase() + tab.slice(1).replace('Peending', 'Pending')}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'home' && <Home />}
          {activeTab === 'foods' && <Foods />}
          {activeTab === 'recipies' && <Recipie />}
          {activeTab === 'users' && <User />}
          {activeTab === 'reviews' && <Review />}
          {activeTab === 'Peending Recipes' && <PendingRecipes />}
        </div>
      </div>
    </div>
  );
}