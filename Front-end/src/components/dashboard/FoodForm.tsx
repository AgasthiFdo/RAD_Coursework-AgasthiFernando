import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom'
import { showErrorAlert, showSuccessAlert } from '../../utils/SweetAlerts';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDisPatch, RootState } from '../../redux/store';
import { addFoodAction, updateFoodAction } from '../../redux/slices/foodSlice';
import type { AxiosError } from 'axios';

interface FoodsFormProps {
  onClose: () => void;
  onSave: () => void
}

interface FormData {
  name: string
  category: string;
  cuisine: string;
  description: string;
}

interface ApiErrorResponse {
  message: string;
}

export const FoodForm: React.FC<FoodsFormProps> = ({ onClose, onSave }) => {
  const dispatch = useDispatch<AppDisPatch>()
  const { selectedFood, loading } = useSelector((state: RootState) => state.food)

  const [formData, setFormData] = useState<FormData>({
    name: selectedFood?.name || '',
    category: selectedFood?.category || '',
    cuisine: selectedFood?.cuisine || '',
    description: selectedFood?.description || ''
  })
  const [existingImageUrls, setExsitingImageUrls] = useState<string[]>(selectedFood?.images || [])
  const [files, setFiles] = useState<FileList | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedFood) {
      setFormData({
        name: selectedFood.name,
        category: selectedFood.category,
        cuisine: selectedFood.cuisine,
        description: selectedFood.description
      })
      setExsitingImageUrls(selectedFood.images || [])
    } else {
      setFormData({
        name: '',
        category: '',
        cuisine: '',
        description: ''
      })
      setExsitingImageUrls([])
    }
  }, [selectedFood])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.name || !formData.category || !formData.cuisine || !formData.description) {
      setError("Please fill all fields")
      return
    }
    if (existingImageUrls.length === 0 && (!files || files.length === 0)) {
      setError("Please add at least one image");
      return;
    }
    const totalImage = existingImageUrls.length + (files ? files.length : 0)
    if (totalImage > 5) {
      setError("Maximum 5 images allowed")
      return
    }

    setError(null)
    const data = new FormData()
    data.append('name', formData.name)
    data.append('category', formData.category)
    data.append('cuisine', formData.cuisine)
    data.append('description', formData.description)

    if (files) {
      for (let i = 0; i < files.length; i++) {
        data.append('images', files[i])
      }
    }

    try {
      if (selectedFood) {
        await dispatch(updateFoodAction({ id: selectedFood._id, data })).unwrap()
        showSuccessAlert('Success', 'Food updated successfully')
      } else {
        await dispatch(addFoodAction(data)).unwrap()
        showSuccessAlert('Success', "Food added successfully")
      }
      onSave()
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>;
      const errorMessage = typeof err === 'string' ? err : 'Operation failed. Please try again.';
      setError(errorMessage);
      showErrorAlert('Error', errorMessage);
    }
  }

  const formTitle = selectedFood ? "Edit Food" : "Add New Food"
  const saveButtonText = selectedFood ? "Update Food" : 'Save Food'

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md flex justify-center items-center z-[100] p-6">
      <div className="relative bg-[#1e293b] border border-white/10 text-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden transition-all">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent"></div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            {selectedFood ? 'Edit' : 'Add'} <span className="text-[#fbbf24]">Food</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Food Title</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Spicy Ramen"
                className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#fbbf24]/50 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0f172a] border border-white/10 text-white outline-none focus:border-[#fbbf24]/50 appearance-none cursor-pointer"
                >
                  <option value="">Select</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snacks">Snacks</option>
                  <option value="desserts">Desserts</option>
                  <option value="beverages">Beverages</option>
                  <option value="appetizers">Appetizers</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="meats">Meats</option>
                  <option value="sea foods">Sea Foods</option>
                  <option value="street food">Street Food</option>
                  <option value="traditional">Traditional</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Cuisine</label>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0f172a] border border-white/10 text-white outline-none focus:border-[#fbbf24]/50 appearance-none cursor-pointer"
                >
                  <option value="">Select</option>
                  <option value="sri_lankan">Sri Lankan</option>
                  <option value="indian">Indian</option>
                  <option value="chinese">Chinese</option>
                  <option value="italian">Italian</option>
                  <option value="japanese">Japanese</option>
                  <option value="mexican">Mexican</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about this dish..."
                className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#fbbf24]/50 outline-none transition-all resize-none"
              />
            </div>

            {existingImageUrls.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24]">Current Assets</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {existingImageUrls.map((url, index) => (
                    <img key={index} src={url} className="w-14 h-14 object-cover rounded-xl border border-white/10" />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Upload Media</label>
              <div className="relative group">
                <input
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  accept='image/*'
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 text-center group-hover:border-[#fbbf24]/30 transition-all">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Click to browse or drop images</span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-[10px] font-black uppercase text-red-500 text-center tracking-widest">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 rounded-2xl bg-white/5 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-4 rounded-2xl bg-[#fbbf24] text-[#0f172a] text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? 'Processing...' : saveButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default FoodForm;