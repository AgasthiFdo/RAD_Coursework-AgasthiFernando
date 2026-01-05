import { FaUser, FaShieldAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { ProfileForm } from "../../components/ProfileForm";
import { useDispatch, useSelector } from "react-redux";
import type { AppDisPatch, RootState } from "../../redux/store";
import { updateUserInfo } from "../../redux/slices/authSlice";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export default function Profile() {
  const [editUser, setEditUser] = useState<UserItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch<AppDisPatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleEditProfile = (user: UserItem) => {
    setEditUser(user);
    setShowForm(true);
  };

  const handleSavedUser = (updatedUser: UserItem) => {
    if (updatedUser) {
      dispatch(
        updateUserInfo({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          image: updatedUser.image,
          role: user?.role || "user",
        })
      );
    }
  };

  const handleCloseForm = () => {
    setEditUser(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-16 px-4">
      <div className="max-w-5xl mx-auto bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        
        <div className="w-full md:w-72 bg-[#0f172a]/60 border-b md:border-b-0 md:border-r border-white/10 p-8">
          <div className="text-center md:text-left mb-10">
            <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Welcome back,</p>
            <h2 className="text-xl font-bold text-white truncate">
               {user?.name}
            </h2>
          </div>

          <nav className="space-y-2">
            <button className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-[#0f172a] font-bold shadow-lg transition-all">
              <FaUser /> My Profile
            </button>
            <button className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
              <FaShieldAlt /> Account Security
            </button>
          </nav>
        </div>

     
        <div className="flex-1 p-8 md:p-12">
          <header className="flex justify-between items-center mb-12">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              General <span className="text-[#fbbf24]">Information</span>
            </h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            <div className="space-y-4">
               <label className="flex items-center gap-2 text-[#fbbf24] font-medium uppercase tracking-wider text-xs">
                <CgProfile className="text-lg" /> Profile Picture
              </label>
              <div className="relative group w-44 h-44">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#fbbf24] to-[#d97706] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative w-44 h-44 bg-[#0f172a] rounded-full overflow-hidden border-2 border-white/10 flex items-center justify-center shadow-2xl">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl font-black text-[#fbbf24]">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            
            <div className="space-y-8">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <label className="flex items-center gap-2 text-[#fbbf24] font-medium uppercase tracking-wider text-xs mb-2">
                  <FaUser /> Full Name
                </label>
                <p className="text-xl text-white font-medium">{user?.name}</p>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <label className="flex items-center gap-2 text-[#fbbf24] font-medium uppercase tracking-wider text-xs mb-2">
                  <MdEmail /> Email Address
                </label>
                <p className="text-xl text-white font-medium">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <button
              className="px-8 py-4 bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-[#0f172a] font-black rounded-xl hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transform hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm"
              onClick={() => user && handleEditProfile(user)}
            >
              Edit My Profile
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <ProfileForm
          onClose={handleCloseForm}
          onSave={handleSavedUser}
          editUser={editUser}
        />
      )}
    </div>
  );
}