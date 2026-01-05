import axiosInstance from "./axios"

export const updateUser = (id: string, data: FormData) =>{
    return axiosInstance.put(`/auth/updateUser/${id}`,data,{
         headers:{
            'Content-Type': 'form-data'
        }
    })

}
interface UserData{
    name:string
    email:string
    password:string
    role: string
}
export const createUser = (data: UserData)=>{
    return axiosInstance.post('/auth/createUser', data ,{
        headers:{
            'Content-Type': 'application/json'
        }
    })
}
export const refreshTokens = async (refreshToken: string) => {
  const res = await axiosInstance.post("/auth/refresh", { token: refreshToken })
  return res.data
}

export const getAllUsers  = (page: number =1, limit: number =100 )=>{
    return axiosInstance.get(`/auth?page=${page}&limit=${limit}`)
}
export const deleteUser  = (id:string )=>{
    return axiosInstance.delete(`/auth/deleteUser/${id}`)
}
export const getTotalUsersCount = () =>{
    return axiosInstance.get('/auth/getTotalUsersCount')
}