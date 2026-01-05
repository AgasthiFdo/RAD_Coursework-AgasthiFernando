import { useEffect, useState } from "react"
import { deleteUser, getAllUsers } from "../../services/UserAPI"
import { showConfirmDialog, showErrorAlert, showSuccessAlert } from "../../utils/SweetAlerts"
import { IoMdAdd } from "react-icons/io";
import { FaTrash } from 'react-icons/fa'
import { UserForm } from "./UserForm";




interface UserItem{
        _id:string
        name:string
        email: string
        image:string
    }

export default function User(){

    const [page, setPage] = useState(1)
    const [totalPages, settotalPages] = useState(1)
    const [users,setUsers] = useState<UserItem[]>([])
    const [showForm,setShowForm] = useState(false)

    useEffect(()=>{
        const fetchUsers = async () =>{
            try{
                const response = await getAllUsers(page, 3)
                setUsers(response.data.data.users)
                settotalPages(response.data.totalPages )
            }catch(error){
                console.error(error)
                showErrorAlert('error', "Can not load data")
            }
        }
        fetchUsers()
    },[page])

    const handleAddClick = () =>{
        setShowForm(true)
    }

    const handleDelete = (userDelete : UserItem) =>{
        showConfirmDialog(
            'Are you sure?',
            `${userDelete.name} Do you want to delete? `,
            'Yes, Delete id!'
        ).then(async(result)=>{
            if(result.isConfirmed){
                try{
                    await deleteUser(userDelete._id)
                    setUsers(prevUsers =>
                        prevUsers.filter(user => user._id !== userDelete._id)
                    )

                    showSuccessAlert('Deleted' ,`${userDelete.name} has been Deleted`)
                }catch(error){
                    console.error(error)
                    showErrorAlert('error', 'Faild to delete')
                }
            }
        })
    }

    const handleCloseForm = ()=>{
        setShowForm(false)
    }  
    const handleSavedUser = () =>{
        // if(savedUser._id){
        //     setUsers(prevUsers => prevUsers.map(user=>
        //         user._id === savedUser._id ? savedUser : user
        //     ))
        // }else{
        //     setUsers(prevUsers =>[
        //        ...prevUsers,
        //        {...savedUser, _id: savedUser._id || Date.now().toString()}
        //     ])
        // }
    }
    
    return(
        <>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-4 text-white">User</h2>
                <div className='flex justify-end mb-4'>
                    <button className='flex items-center gap-1 text-green-400 hover:text-green-600 font-medium'
                    onClick={handleAddClick}
                    >
                        Add User<IoMdAdd className='text-lg'/>
                    </button>
                </div>
                <div className='w-full overflow-x-auto'>
                    <table className="w-full text-left text-sm text-gray-300 table-fixed min-w-[1000px]">
                        <thead className="uppercase tracking-wider  bg-black/70 backdrop-blur-md border-b border-white/20">
                            <tr>
                                <th className='py-2 px-4 '>User Name</th>
                                <th className='py-2 px-4 '>Email</th>
                                <th className="py-2 px-4 text-center">Image</th>
                                <th className="py-2 px-4 text-center ">Action</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index)=>(
                                <tr key={index} className="border-b border-gray-800 hover:bg-black/25">
                                    <td className='py-2 px-4'>{user.name}</td>
                                    <td className='py-2 px-4'>{user.email}</td>
                                   

                                    <td className="py-2 px-4 flex gap-2 justify-center">
                                        {user.image  ? (
                                            
                                            <img
                                                
                                                src={user.image}
                                                alt={user.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                            
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </td>
                                    
                                    <td className='py-2 px-4'>
                                        
                                        <button className='text-red-400 hover:text-red-600 mx-2'
                                        onClick={()=>handleDelete(user)}>
                                            <FaTrash/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

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
            {showForm &&(
                    <UserForm
                    onClose={handleCloseForm}
                    onSave={handleSavedUser}
                   
                    />
                )}
        </>
    )
}