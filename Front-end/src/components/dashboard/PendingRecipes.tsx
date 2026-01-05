import { useEffect, useState } from "react";
import { approvedRecipe, getPendingRecipes, rejectedRecipes } from "../../services/RecipeAPI";
import { FaCheckCircle } from 'react-icons/fa'
import { IoCloseCircle } from "react-icons/io5";
import { showErrorAlert, showSuccessAlert } from "../../utils/SweetAlerts";

interface Recipe{
    _id: string;
    title: string;
    user: { name: string };
    food: { name: string };
    ingredients: string
    step: string
    readyIn:string
    status: string;
    date: string;
    images: string[]
}

export default function PendingRecipes(){

    const [pendingRecipes, setPendingRecipes] = useState<Recipe[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(()=>{
        const loadPendingRecipes =  async ()=>{
            try{
                const response = await getPendingRecipes(page, 3)
                setPendingRecipes(response.data.data.recipes)
                setTotalPages(response.data.totalPages)
            }catch(error){
                console.error(error)
            }

        }
        loadPendingRecipes()
    },[page])

    const handleApproved = async (id: string)=>{
        try{
            await approvedRecipe(id)
            showSuccessAlert('Approved' , "Recipe has been approved and is now public")
            setPendingRecipes(pendingRecipes.filter(rec => rec._id !== id))
        }catch(error){
            console.error(error)
            showErrorAlert('Error' , "Failed to approve recipe")
        }
    }

    const handleReject = async (id:string) =>{
        try{
            await rejectedRecipes(id)
            showSuccessAlert('Reject' , "Recipe has been Rejected ")
        }catch(error){
            console.error(error)
            showErrorAlert('Error' , "Failed to reject recipe")
        }
    }



    return(
        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-4 text-white">Pending Recipes</h2>
            {pendingRecipes.length === 0 ? (
                <p className="text-gray-300">No Pending Recipes</p>
            ):(
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300 table-fixed min-w-[1000px]">
                        <thead className="uppercase tracking-wider  bg-black/70 backdrop-blur-md border-b border-white/20">
                            <tr>
                                <th scope="col" className="py-2 px-4 w-[10%]">Title</th>
                                <th scope="col" className="py-2 px-4 w-[8%]">Food</th>
                                <th scope="col" className="py-2 px-4 w-[8%]">User</th>
                                <th scope="col" className="py-2 px-4 w-[12%]">Ingradiants</th>
                                <th scope="col" className="py-2 px-4 w-[8%]">Ready In</th>
                                <th scope="col" className="py-2 px-4 w-[8%]">Date</th>
                                <th scope="col" className="py-2 px-4 w-[25%]">Step</th>
                                <th scope="col" className="py-2 px-4 w-[12%]">Images</th>
                                <th scope="col" className="py-2 px-4 w-[9%]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRecipes.map((recipe)=>(
                                <tr key={recipe._id} className="border-b border-gray-700 hover:bg-black/25">
                                    <td className="px-4 py-2 font-medium text-white align-top">{recipe.title}</td>
                                    <td className="px-4 py-2 align-top">{recipe.food?.name || <span className="text-red-400">Unknown Food</span>}</td>
                                    <td className="px-4 py-2 align-top">{recipe.user?.name || <span className="text-red-400">Unknown User</span>}</td>
                                    <td className="py-4 px-2 align-top">
                                        {(()=>{
                                            const ingre = recipe.ingredients
                                            if(Array.isArray(ingre)){
                                                return ingre.join(", ")
                                            }
                                            try{
                                                return JSON.parse(ingre).join(", ")
                                            }catch{
                                                return ingre
                                            }
                                        })()}
                                    </td>
                                    <td className="px-4 py-2 align-top">{recipe.readyIn}</td>
                                    <td className="px-4 py-2 align-top">
                                        {new Date(recipe.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 align-top">
                                        <div className="break-words whitespace-pre-wrap max-h-40 overflow-y-auto pr-1">
                                            {recipe.step}
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 flex gap-2 align-top justify-center">
                                        {recipe.images && recipe.images.length > 0 ? (
                                            recipe.images.map((imageUrl, idx)=>(
                                                <img
                                                    key={idx}
                                                    src={imageUrl}
                                                    alt={`${recipe.title} ${idx + 1}`}
                                                    className="w-16 h-16 object-cover rounded-md">
                                                    
                                                </img>
                                            ))
                                        ):(
                                            <span>No Images</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 align-top">
                                        
                                       <div className="flex items-center justify-center gap-3">
        
                                            <button 
                                                className="text-green-400 hover:text-green-600 transition-colors"
                                                onClick={() => handleApproved(recipe._id)}
                                                title="Approve"
                                            >
                                                <FaCheckCircle size={20} />
                                            </button>

                                            <button 
                                                className="text-red-400 hover:text-red-600 transition-colors"
                                                title="Reject"
                                                onClick={() => handleReject(recipe._id)}>
                                                <IoCloseCircle size={22} /> {/* size eka poddak wadi kala lassanata penanna */}
                                            </button>
                                            
                                        </div>
                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>  
            )}
            <div className="flex justify-center items-center gap-4 mt-10">
                <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`px-5 py-2 rounded-lg border text-sm font-medium transition ${
                    page === 1
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
                >
                Prev
                </button>

                <span className="text-gray-600 text-sm">
                Page <span className="font-semibold">{page}</span> of{" "}
                <span className="font-semibold">{totalPages}</span>
                </span>

                <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`px-5 py-2 rounded-lg border text-sm font-medium transition ${
                    page === totalPages
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
                >
                Next
                </button>
            </div>
        </div>
    )
}