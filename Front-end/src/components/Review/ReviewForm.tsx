import type React from "react"
import { useEffect, useState } from "react"
import ReactDOM from 'react-dom'
import { addReview, updateReview } from "../../services/ReviewAPI"
import { showErrorAlert, showSuccessAlert } from "../../utils/SweetAlerts"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"

interface User {
    _id: string
    name: string
}

interface Recipe {
    _id: string
    title: string
}

interface ReviewItem {
    _id: string
    user: User
    recipe: Recipe
    rating: number
    description: string
}

interface ReviewFormProps {
    onClose: () => void
    onSave: (review: ReviewItem) => void
    recipeId: string
    selectedReview: ReviewItem | null
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onClose, onSave, recipeId, selectedReview }) => {

    const [hover, setHover] = useState(0)
    const [rating, setRating] = useState(0)
    const [description, setDescription] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const user = useSelector((state: RootState) => state.auth.user)

    useEffect(() => {
        if (selectedReview) {
            setRating(selectedReview.rating)
            setDescription(selectedReview.description)
        } else {
            setRating(0)
            setDescription("")
        }
    }, [selectedReview])

    const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (rating === 0 || !description.trim()) {
            setError("Please provide both a rating and a review description")
            return
        }

        const payload = {
            user: user?._id,
            recipe: recipeId,
            rating,
            description
        }
        setLoading(true)
        try {
            let response;
            if (selectedReview) {
                response = await updateReview(selectedReview._id, payload)
            } else {
                response = await addReview(payload)
            }
            showSuccessAlert('Success', selectedReview ? 'Review updated successfully' : 'Review posted successfully');
            onSave(response.data.data.review);
            onClose();
        } catch (error: any) {
            setLoading(false)
            let errorMessage = 'Failed to process review. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = typeof error.response.data.message === 'object'
                    ? JSON.stringify(error.response.data.message)
                    : String(error.response.data.message);
            }
            setError(errorMessage);
            showErrorAlert('Error', errorMessage);
            console.error('Submit Error:', error);
        }
    }

    const formTitle = selectedReview ? "Edit Review" : "Add Your Review"
    const saveButtonText = selectedReview ? "Update Review" : "Post Review"

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md flex justify-center items-center z-[100] p-6 transition-all duration-300">
            <div className="relative bg-[#1e293b] border border-white/10 text-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden">
                
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent"></div>

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tighter">
                        {selectedReview ? 'Edit' : 'New'} <span className="text-[#fbbf24]">Review</span>
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handlesubmit} className="space-y-6">
                    <div className="flex flex-col items-center space-y-3 bg-black/20 p-6 rounded-3xl border border-white/5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Rate your experience</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className={`text-4xl transition-all duration-200 transform ${
                                        star <= (hover || rating) 
                                        ? "text-[#fbbf24] scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" 
                                        : "text-gray-700 scale-100"
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                             <span className="text-[10px] font-bold text-[#fbbf24] uppercase">
                                {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                             </span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Your Feedback</label>
                        <textarea
                            name="description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What did you think about this recipe?"
                            className="w-full px-5 py-4 rounded-3xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-[#fbbf24]/50 outline-none transition-all resize-none"
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                            <p className="text-[10px] font-black uppercase text-red-500 text-center tracking-widest leading-tight">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-2">
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
    )
}

export default ReviewForm;