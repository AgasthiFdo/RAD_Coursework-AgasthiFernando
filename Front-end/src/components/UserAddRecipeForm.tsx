import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { addRecipe } from '../services/RecipeAPI';
import { showErrorAlert, showSuccessAlert } from '../utils/SweetAlerts';
import { getAllFoods } from '../services/FoodAPI';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

interface User { _id: string; name: string; }
interface Food { _id: string; name: string; }
interface RecipeItem {
    _id: string;
    user: User;
    food: Food;
    title: string;
    ingredients: string;
    step: string;
    readyIn: string;
    images?: string[];
}
interface FormData {
    food: string;
    title: string;
    ingredients: string;
    step: string;
    readyIn: string;
}
interface UserAddRecipeFormProps {
    onClose: () => void;
    onSave: (recipe: RecipeItem) => void;
}

export const UserAddRecipeForm: React.FC<UserAddRecipeRecipeFormProps> = ({ onClose, onSave }) => {
    const [formdata, setFormdata] = useState<FormData>({
        food: '', title: '', ingredients: '', step: '', readyIn: ''
    })
    const [files, setFiles] = useState<FileList | null>(null)
    const [previews, setPreviews] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [foods, setFoods] = useState<Food[]>([])
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        const loadFoods = async () => {
            try {
                const res = await getAllFoods()
                setFoods(res.data.data.foods)
            } catch (error) {
                console.error(error)
            }
        }
        loadFoods()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormdata((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(e.target.files);
            const selectedFiles = Array.from(e.target.files);
            const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews(previewUrls);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formdata.food || !formdata.title || !formdata.ingredients || !formdata.step || !formdata.readyIn) {
            setError("Fill All Fields"); return;
        }
        if (!files || files.length === 0) {
            setError("Please add at least one image"); return;
        }
        if (files.length > 5) {
            setError("Maximum 5 images allowed"); return;
        }

        setError(null)
        setLoading(true)
        const data = new FormData()
        data.append('user', user?._id || "")
        data.append('food', formdata.food)
        data.append('title', formdata.title)
        data.append('ingredients', formdata.ingredients)
        data.append('step', formdata.step)
        data.append('readyIn', formdata.readyIn)

        if (files) {
            for (let i = 0; i < files.length; i++) {
                data.append('images', files[i])
            }
        }

        try {
            const response = await addRecipe(data)
            showSuccessAlert('Success', 'Recipe Successfully Added')
            onSave(response.data.data.recipe)
            onClose()
        } catch (error: any) {
            setLoading(false)
            let errorMessage = error.response?.data?.message || 'Failed to add recipe.';
            setError(String(errorMessage));
            showErrorAlert('Upload Failed', String(errorMessage));
        }
    }

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-md flex justify-center items-center z-[100] p-4 overflow-y-auto">
            <div className="relative bg-[#1e293b] border border-white/10 text-white p-8 rounded-[3rem] shadow-2xl w-full max-w-2xl my-auto max-h-[90vh] overflow-y-auto custom-scrollbar">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">
                        Create <span className="text-[#fbbf24]">Recipe</span> 🍹
                    </h2>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Share your mixology secrets</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Base Beverage</label>
                            <select
                                name="food"
                                value={formdata.food}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[#fbbf24]/50 outline-none transition-all appearance-none"
                            >
                                <option value="" className="bg-[#1e293b]">Select Category</option>
                                {foods.map((item) => (
                                    <option key={item._id} value={item._id} className="bg-[#1e293b]">{item.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Preparation Time</label>
                            <input
                                name="readyIn"
                                value={formdata.readyIn}
                                onChange={handleChange}
                                placeholder="e.g. 10 Mins"
                                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#fbbf24]/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Recipe Title</label>
                        <input
                            name="title"
                            value={formdata.title}
                            onChange={handleChange}
                            placeholder="Ex: Midnight Martini"
                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#fbbf24]/50 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Ingredients (Comma Separated)</label>
                        <textarea
                            name="ingredients"
                            value={formdata.ingredients}
                            onChange={handleChange}
                            placeholder="Vodka, Espresso, Sugar Syrup..."
                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#fbbf24]/50 outline-none transition-all h-24 resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Preparation Steps</label>
                        <textarea
                            name="step"
                            value={formdata.step}
                            onChange={handleChange}
                            placeholder="Describe the process..."
                            className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#fbbf24]/50 outline-none transition-all h-32 resize-none"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Gallery (Max 5)</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-[2rem] cursor-pointer bg-white/5 hover:bg-white/10 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-3 text-[#fbbf24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Click to upload images</p>
                                </div>
                                <input name="images" type="file" onChange={handleFileChange} multiple accept="image/*" className="hidden" />
                            </label>
                        </div>
                        
                        {previews.length > 0 && (
                            <div className="flex flex-wrap gap-3 p-4 bg-white/5 rounded-3xl border border-white/5">
                                {previews.map((url, i) => (
                                    <img key={i} src={url} className="w-16 h-16 object-cover rounded-xl border border-white/10 shadow-lg" alt="preview" />
                                ))}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                            <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] px-6 py-4 rounded-2xl bg-[#fbbf24] text-[#0f172a] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-[#fbbf24]/10 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Publish Recipe'}
                        </button>
                    </div>
                </form>

                <button onClick={onClose} className="absolute top-6 right-8 text-gray-500 hover:text-white transition-colors font-black">✕</button>
            </div>
        </div>,
        document.body
    )
}