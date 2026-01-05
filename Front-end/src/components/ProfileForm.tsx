import React, { useEffect, useState } from "react"
import ReactDOM from 'react-dom'
import { updateUser } from "../services/UserAPI"
import { showSuccessAlert, showErrorAlert } from '../utils/SweetAlerts';

interface User {
    _id: string
    name: string
}

interface UserItem {
    _id: string
    user: User
    id: string
    name: string
    email: string
    image?: string
}

interface FormData {
    name: string
    email: string
}

interface UserFormProps {
    onClose: () => void
    onSave: (user: UserItem) => void
    editUser: UserItem | null
}

export const ProfileForm: React.FC<UserFormProps> = ({ onClose, onSave, editUser }) => {
    const [formdata, setFormdata] = useState<FormData>({
        name: editUser?.name || '',
        email: editUser?.email || ''
    })
    const [file, setFile] = useState<FileList | null>(null)
    const [existingImageUrl, setExsitingImageUrl] = useState<string>(editUser?.image || '')
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (editUser) {
            setFormdata({
                name: editUser.name,
                email: editUser.email,
            })
            setExsitingImageUrl(editUser.image || '')
        }
    }, [editUser])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files)
            setPreviewUrl(URL.createObjectURL(e.target.files[0]))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormdata((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formdata.name || !formdata.email) {
            setError("Please fill in all required fields")
            return
        }
        if (!editUser || !editUser._id) {
            setError("User identification error")
            return
        }

        setError(null)
        setLoading(true)

        const data = new FormData()
        data.append('name', formdata.name)
        data.append('email', formdata.email)

        if (file && file.length > 0) {
            data.append("image", file[0])
        }

        try {
            const response = await updateUser(editUser._id, data)
            showSuccessAlert('Success', 'Profile updated successfully')
            onSave(response.data.data.user)
            onClose()
        } catch (error: any) {
            setLoading(false)
            let errorMessage = 'Failed to update profile.';
            if (error.response?.data?.message) {
                errorMessage = typeof error.response.data.message === 'object'
                    ? JSON.stringify(error.response.data.message)
                    : String(error.response.data.message);
            }
            setError(errorMessage);
            showErrorAlert('Update Failed', errorMessage);
        }
    }

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md flex justify-center items-center z-[100] p-6 transition-all duration-300">
            <div className="relative bg-[#1e293b] border border-white/10 text-white p-8 rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden">
                
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent"></div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tighter">
                        Edit <span className="text-[#fbbf24]">Profile</span>
                    </h2>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Update your personal information</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#fbbf24] to-amber-600 shadow-xl">
                                <div className="w-full h-full rounded-full bg-[#0f172a] overflow-hidden flex items-center justify-center border-4 border-[#1e293b]">
                                    {previewUrl || existingImageUrl ? (
                                        <img 
                                            src={previewUrl || existingImageUrl} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl font-black text-gray-700">{formdata.name.charAt(0)}</span>
                                    )}
                                </div>
                            </div>
                            <label className="absolute bottom-1 right-1 bg-[#fbbf24] p-2 rounded-full cursor-pointer shadow-lg hover:bg-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#0f172a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                </svg>
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Full Name</label>
                            <input
                                name="name"
                                value={formdata.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#fbbf24]/50 outline-none transition-all"
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                value={formdata.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#fbbf24]/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                            <p className="text-[10px] font-black uppercase text-red-500 text-center tracking-widest leading-tight">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-4 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-4 rounded-2xl bg-[#fbbf24] text-[#0f172a] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    )
}