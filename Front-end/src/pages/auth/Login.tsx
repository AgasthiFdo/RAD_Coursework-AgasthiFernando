import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDisPatch, RootState } from '../../redux/store';
import { loginUser, resetError } from '../../redux/slices/authSlice';
import { showToast } from '../../utils/SweetAlerts';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch<AppDisPatch>()
  const navigate = useNavigate()

  const {loading, error, isAuthenticated, user} = useSelector((state:RootState)=>state.auth)

  useEffect(()=>{
    dispatch(resetError())
  },[dispatch])

  useEffect(()=>{
    if(isAuthenticated){
       showToast('Hello!');
      if(user?.role === 'Admin'){
        navigate('/dashboard')
      } else {
        navigate('/') 
      }
    }
  },[isAuthenticated, user , navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex justify-center items-center p-6">
      
      
      <div className="w-[400px] max-w-full bg-[#1e293b]/50 backdrop-blur-2xl shadow-2xl rounded-3xl p-10 border border-white/10">
        
          <div className='flex items-center justify-center mb-6'>
            
            <h1 className='text-3xl font-extrabold text-[#fbbf24] tracking-wide drop-shadow-md'>
              CocktAIl🍸REcipeS
            </h1>
          </div>

         
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">LOGIN</h2>
            <p className="text-sm text-gray-400 mt-1">Feel The Journey</p>
          </div>

         
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                // Input fields dark kale, focus eka Golden kala
                className="w-full px-4 py-2 bg-[#0f172a]/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all"                
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-4 py-2 bg-[#0f172a]/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all"                
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center text-sm text-gray-400">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-[#0f172a] border-gray-700 rounded text-[#fbbf24] focus:ring-[#fbbf24]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="/forgot-password" className="text-sm text-[#fbbf24] hover:text-[#fcd34d] font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                // Button eka Gold gradient ekakata maru kara
                className="w-full py-3 mt-6 rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-[#0f172a] font-bold shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-[#fbbf24] hover:text-[#fcd34d] transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Login;