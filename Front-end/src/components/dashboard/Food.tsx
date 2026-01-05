import { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'
import { IoMdAdd } from "react-icons/io";
import FoodForm from "../dashboard/FoodForm"
import { showConfirmDialog, showErrorAlert, showSuccessAlert } from '../../utils/SweetAlerts';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDisPatch, RootState } from '../../redux/store';
import { deleteFoodAction, fetchAllFoods, setSelectedFood, type Food } from '../../redux/slices/foodSlice';

type FoodItem = Food

export default function Foods() {
    const [page, setPage] = useState(1)
    const [showForm, setShowForm] = useState(false)
    const dispatch = useDispatch<AppDisPatch>();
    const { foods, loading, totalPages } = useSelector((state: RootState) => state.food);

    useEffect(() => {
        dispatch(fetchAllFoods({ page, limit: 3 }));
    }, [dispatch, page])

    const handleSavedFood = () => {
        dispatch(fetchAllFoods({ page, limit: 3 }));
        setShowForm(false);
    }
    const handleEditFood = (food: FoodItem) => {
        dispatch(setSelectedFood(food))
        setShowForm(true)
    }
    const handleAddClick = () => {
        dispatch(setSelectedFood(null))
        setShowForm(true)
    }
    const handleCloseForm = () => {
        dispatch(setSelectedFood(null))
        setShowForm(false)
    }

    const handleDelete = (foodDelete: FoodItem) => {
        showConfirmDialog(
            'Are you sure?',
            `${foodDelete.name} Do you want to delete? `,
            'Yes, Delete id!'
        ).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    dispatch(deleteFoodAction(foodDelete._id));
                    showSuccessAlert('Deleted', `${foodDelete.name} has been Deleted`)
                } catch (error) {
                    console.error(error)
                    showErrorAlert('error', 'Faild to delete')
                }
            }
        })
    }

    return (
        <>
            <div className="bg-[#1e293b]/40 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl">
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                        Food <span className="text-[#fbbf24]">Management</span>
                    </h2>
                    <button 
                        className='flex items-center justify-center gap-2 bg-[#fbbf24] text-[#0f172a] px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all duration-300 shadow-lg active:scale-95'
                        onClick={handleAddClick}
                    >
                        Add New Food <IoMdAdd className='text-xl' />
                    </button>
                </div>

                {loading && (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#fbbf24]"></div>
                    </div>
                )}

                <div className='w-full overflow-x-auto rounded-3xl border border-white/5'>
                    <table className="w-full text-left text-sm text-gray-300 table-fixed min-w-[1000px] border-collapse">
                        <thead className="uppercase tracking-[0.2em] text-[10px] font-black bg-white/5 text-[#fbbf24] border-b border-white/10">
                            <tr>
                                <th className='py-5 px-6 w-[15%]'>Name</th>
                                <th className='py-5 px-6 w-[10%]'>Category</th>
                                <th className="py-5 px-6 w-[10%]">Cuisine</th>
                                <th className='py-5 px-6 w-[30%]'>Description</th>
                                <th className='py-5 px-6 w-[25%] text-center'>Images</th>
                                <th className='py-5 px-6 w-[10%] text-center'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {foods.map((food: FoodItem, index: number) => (
                                <tr key={index} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className='py-6 px-6 font-bold text-white'>{food.name}</td>
                                    <td className='py-6 px-6'>
                                        <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold border border-white/10">
                                            {food.category}
                                        </span>
                                    </td>
                                    <td className='py-6 px-6 italic text-gray-400'>{food.cuisine}</td>
                                    <td className='py-6 px-6 leading-relaxed'>
                                        <p className="line-clamp-2">{food.description}</p>
                                    </td>
                                    <td className="py-6 px-6">
                                        <div className="flex gap-2 justify-center">
                                            {food.images && food.images.length > 0 ? (
                                                food.images.slice(0, 3).map((imgUrl: string, idx: number) => (
                                                    <img
                                                        key={idx}
                                                        src={imgUrl}
                                                        alt={`${food.name}`}
                                                        className="w-12 h-12 object-cover rounded-xl border border-white/10 group-hover:border-[#fbbf24]/50 transition-all shadow-md"
                                                    />
                                                ))
                                            ) : (
                                                <span className="text-gray-600 italic">No Image</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className='py-6 px-6'>
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                className='p-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-lg'
                                                onClick={() => handleEditFood(food)}
                                            >
                                                <FaEdit size={16}/>
                                            </button>
                                            <button 
                                                className='p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg'
                                                onClick={() => handleDelete(food)}
                                            >
                                                <FaTrash size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-center items-center gap-6 mt-10">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={`px-6 py-2 rounded-xl border font-bold uppercase text-[10px] tracking-widest transition-all ${
                            page === 1
                                ? "text-gray-600 border-white/5 cursor-not-allowed"
                                : "text-white border-[#fbbf24]/30 hover:bg-[#fbbf24] hover:text-[#0f172a] shadow-lg"
                        }`}
                    >
                        Prev
                    </button>

                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                        <span className="text-gray-500 text-[10px] font-black uppercase">Page</span>
                        <span className="text-[#fbbf24] font-bold text-sm">{page}</span>
                        <span className="text-gray-600 text-xs">/</span>
                        <span className="text-white font-bold text-sm">{totalPages}</span>
                    </div>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className={`px-6 py-2 rounded-xl border font-bold uppercase text-[10px] tracking-widest transition-all ${
                            page === totalPages
                                ? "text-gray-600 border-white/5 cursor-not-allowed"
                                : "text-white border-[#fbbf24]/30 hover:bg-[#fbbf24] hover:text-[#0f172a] shadow-lg"
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {showForm && (
                <FoodForm
                    onClose={handleCloseForm}
                    onSave={handleSavedFood}
                />
            )}
        </>
    )
}