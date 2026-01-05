import React, { useEffect, useState } from "react"
import {  useLocation, useNavigate } from "react-router-dom"
import { showErrorAlert, showSuccessAlert } from "../../utils/SweetAlerts"
import { useDispatch, useSelector } from "react-redux"
import type { AppDisPatch, RootState } from "../../redux/store"
import { resetPasswordAction } from "../../redux/slices/authSlice"

export default function ResetPassword() {
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const[confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useDispatch<AppDisPatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const email = location.state?.email

    useEffect(()=>{
        if(!email){
            navigate('/forgot-password')
        }
    },[email, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if(newPassword !== confirmPassword){
            showErrorAlert('Password do not match')
            return
        }

        if (!email) return;

        dispatch(resetPasswordAction({
            email,
            otp: parseInt(otp),
            newPassword
        }))
        .unwrap()
        .then(() => {
            showSuccessAlert('Password reset successful! Login now');
            navigate('/login');
        })
        .catch((err: string) => {
            showErrorAlert('Reset Failed', err);
        });
    }

  return (
   
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex justify-center items-center p-6">
      
      
      <div className="w-[400px] max-w-full bg-[#1e293b]/50 backdrop-blur-2xl shadow-2xl rounded-3xl p-10 border border-white/10">
        
        <div className='flex items-center justify-center mb-6'>
            
            <h1 className='text-3xl font-extrabold text-[#fbbf24] tracking-wide drop-shadow-md'>
              CocktAIl<span className="text-white">🍸</span>REcipeS
            </h1>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Reset Password</h2>
          <p className="text-sm text-gray-400 mt-2">
            Enter the OTP sent to <br/>
            <span className="font-semibold text-[#fbbf24]">{email}</span>
          </p>
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
            <label className="block text-sm font-medium text-gray-300 mb-1">OTP Code</label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              // Centered and highlighted OTP input
              className="w-full px-4 py-2 bg-[#0f172a]/50 border border-gray-700 rounded-xl text-center tracking-[0.5em] text-xl font-bold text-[#fbbf24] focus:ring-2 focus:ring-[#fbbf24] focus:outline-none transition-all placeholder:tracking-normal placeholder:text-sm placeholder:font-normal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 bg-[#0f172a]/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#fbbf24] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 bg-[#0f172a]/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#fbbf24] focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
           
            className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-[#0f172a] font-bold shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}