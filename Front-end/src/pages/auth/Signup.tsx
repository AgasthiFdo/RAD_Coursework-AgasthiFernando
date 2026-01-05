import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { showErrorAlert } from '../../utils/SweetAlerts';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDisPatch, RootState } from '../../redux/store';
import { signupUser } from '../../redux/slices/authSlice';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDisPatch>();
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    
    if (password !== confirmPassword) {
      const errorMessage = 'Passwords do not match';
      setPasswordError(errorMessage);
      showErrorAlert('Password Error', errorMessage);
      return;
    }
    
    setPasswordError('');
    dispatch(signupUser({ name, email, password }))
    .unwrap()
    .then(() => navigate('/login'))
    .catch(() => {});
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex justify-center items-center p-6">
      
      
      <div className="w-[400px] max-w-full bg-[#1e293b]/50 backdrop-blur-2xl shadow-2xl rounded-3xl p-10 border border-white/10">
        

          <div className="flex items-center justify-center mb-5">
            
            <h1 className="text-3xl font-extrabold text-[#fbbf24] tracking-wide drop-shadow-md">
              CocktAIl🍸REcipeS
            </h1>
          </div>


          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">REGISTER</h2>
            <p className="text-sm text-gray-400 mt-1">Join the club</p>
          </div>


          {(error || passwordError) && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-200">{error || passwordError}</p>
                </div>
              </div>
            </div>
          )}


          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-[#0f172a]/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all"
                placeholder="Enter full name"            />
            </div>

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
                className="w-full px-4 py-2 bg-[#0f172a]/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all"
                 placeholder="Enter email"
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#0f172a]/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all"
                 placeholder="Create password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#0f172a]/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all"
                placeholder="Confirm your password"
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                
                className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-[#0f172a] font-bold shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-center text-sm text-gray-400 mt-5">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-[#fbbf24] hover:text-[#fcd34d] transition-colors"
                >
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    
  );
};

export default Signup;