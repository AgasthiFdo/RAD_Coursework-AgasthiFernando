import type React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutAction } from "../redux/slices/authSlice";













export const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDisPatch>();
  const navigate = useNavigate()

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/login')
  };

  const handleLogin = () => {
    dispatch(logoutAction())
    navigate('/login')
  }

  return (
    <nav className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 fixed top-0 left-0 w-full z-[100]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        <div className="flex items-center">
          <Link to="/" className="text-xl font-black text-white tracking-tighter uppercase group">
            CocktAIl<span className="text-[#fbbf24] group-hover:text-white transition-colors">REcipeS</span> 🍸
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-10">
          <Link
            to="/"
            className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-[#fbbf24] transition-all"
          >
            HOME
          </Link>

          <div className="relative group">
            <button className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-[#fbbf24] transition-all cursor-pointer flex items-center gap-1">
              CATEGORIES
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-64 bg-[#1e293b] border border-white/10 shadow-2xl rounded-[2rem] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-4 z-50 backdrop-blur-2xl">
              <div className="grid grid-cols-1 gap-1 px-2 max-h-96 overflow-y-auto custom-scrollbar">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={`/category/${cat.name.toLowerCase()}`}
                    className="flex items-center px-4 py-2.5 space-x-3 hover:bg-[#fbbf24] hover:text-[#0f172a] rounded-2xl transition-all group/item"
                  >
                    <img src={cat.image} className="w-6 h-6 rounded-lg object-cover border border-white/10 group-hover/item:border-[#0f172a]/20" alt={cat.name} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            to="/all-foods"
            className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-[#fbbf24] transition-all"
          >
            OTHERS
          </Link>

          <Link
            to="/all-recipes"
            className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-[#fbbf24] transition-all"
          >
            RECIPES
          </Link>

          <div className="flex items-center">
            {isAuthenticated && user ? (
              <div className="relative group">
                <button className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#fbbf24] to-[#d97706] p-0.5 shadow-lg shadow-[#fbbf24]/10 hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-[#0f172a] rounded-[14px] flex items-center justify-center overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-black text-[#fbbf24]">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </button>

                <div className="absolute right-0 mt-4 w-64 bg-[#1e293b] border border-white/10 shadow-2xl rounded-[2.5rem] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden z-50 backdrop-blur-2xl">
                  <div className="p-6 text-center border-b border-white/5">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-[#fbbf24] to-[#d97706] p-1 shadow-xl">
                       <div className="w-full h-full bg-[#0f172a] rounded-[20px] flex items-center justify-center overflow-hidden">
                        {user.image ? (
                          <img src={user.image} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl font-black text-[#fbbf24]">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tighter">{user.name}</h4>
                    <p className="text-[9px] font-bold text-[#fbbf24] uppercase tracking-[0.2em] mt-1 opacity-60">Verified Member</p>
                  </div>

                  <div className="p-2">
                    <Link to="/my-recipes" className="flex items-center px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                      My Recipes
                    </Link>
                    <Link to="/my-review" className="flex items-center px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                      My Reviews
                    </Link>
                    <Link to="/profile" className="flex items-center px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-6 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-2xl transition-all mt-1"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={handleLogin}
                className="px-8 py-2.5 rounded-2xl bg-[#fbbf24] text-[#0f172a] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-[#fbbf24]/10"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};