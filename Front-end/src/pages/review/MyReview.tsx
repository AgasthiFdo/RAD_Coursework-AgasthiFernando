import { useEffect, useState } from "react"
import { deleteReview, getReviewByUser } from "../../services/ReviewAPI"
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { ReviewForm } from "../../components/Review/ReviewForm";
import { showConfirmDialog, showErrorAlert, showSuccessAlert } from "../../utils/SweetAlerts";

interface User {
    _id: string
    name: string
}

interface Recipe {
    _id: string
    title: string
}

interface ReviewCardItem {
    _id: string
    user: User
    recipe: Recipe
    rating: number
    description: string
}

export default function MyReview() {
    const [review, setReview] = useState<ReviewCardItem[]>([])
    const [selectedReview, setSelectedReview] = useState<ReviewCardItem | null>(null)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reponse = await getReviewByUser()
                setReview(reponse.data.data.reviews)
            } catch (error) {
                console.error(error)
            }
        }
        fetchReviews()
    }, [])

    const renderStar = (rating: number) => {
        return [...Array(5)].map((_, index) => {
            return (
                <FaStar
                    key={index}
                    size={14}
                    className={index < rating ? "text-[#fbbf24]" : "text-white/20"} />
            )
        })
    }

    const handleEdit = (review: ReviewCardItem) => {
        setSelectedReview(review)
        setShowForm(true)
    }

    const handleCloseForm = () => {
        setSelectedReview(null)
        setShowForm(false)
    }

    const handleSaved = () => {
        handleCloseForm()
    }

    const handleDelete = (reviewDelete: ReviewCardItem) => {
        showConfirmDialog(
            'Are you sure?',
            `Do you want to delete this review?`,
            'Yes, Delete it!'
        ).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteReview(reviewDelete._id)
                    setReview(prevReviews =>
                        prevReviews.filter(rev => rev._id !== reviewDelete._id)
                    )
                    showSuccessAlert('Deleted', 'This review has been deleted')
                } catch (error) {
                    console.error(error)
                    showErrorAlert('Error', 'Failed to delete')
                }
            }
        })
    }

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-10 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                        My <span className="text-[#fbbf24]">Reviews</span>
                    </h1>
                    <div className="h-px flex-grow bg-white/10"></div>
                </div>

                {review.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                        <p className="text-gray-500 text-lg font-medium">No Your Reviews Yet</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {review.map((rev) => (
                            <div key={rev._id} className="group bg-[#1e293b]/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-xl transition-all hover:bg-white/5">
                                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fbbf24] to-[#d97706] flex items-center justify-center text-[#0f172a] text-2xl font-black shadow-lg">
                                            {rev.user.name.charAt(0)}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="text-sm font-black text-white tracking-widest uppercase">
                                                {rev.user.name}
                                            </h4>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter bg-white/5 px-2 py-0.5 rounded-md">
                                                on {rev.recipe.title}
                                            </span>
                                        </div>

                                        <div className="flex gap-1 mb-3">
                                            {renderStar(rev.rating)}
                                        </div>
                                        <p className="text-gray-400 leading-relaxed text-[15px] italic">
                                            "{rev.description}"
                                        </p>
                                    </div>

                                    <div className="flex gap-3 self-end sm:self-center">
                                        <button
                                            className='p-3 rounded-xl bg-white/5 text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-lg'
                                            onClick={() => handleEdit(rev)}
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                        <button
                                            className='p-3 rounded-xl bg-white/5 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg'
                                            onClick={() => handleDelete(rev)}
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showForm && (
                <ReviewForm
                    onClose={handleCloseForm}
                    onSave={handleSaved}
                    selectedReview={selectedReview}
                    recipeId={selectedReview!.recipe._id}
                />
            )}
        </div>
    )
}