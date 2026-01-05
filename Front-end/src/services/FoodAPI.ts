import axiosInstance from "./axios";


export const addFood = (data: FormData)=>{
    return axiosInstance.post('/food/addFood', data, {
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const updateFood =  (id: string, data: FormData) =>{
    return axiosInstance.put(`/food/updateFood/${id}`, data,{
        headers:{
            'Content-Type' : 'multipart/form-data'
        }
    })
}
export const getAllFoods = async (page: number = 1, limit: number = 100) =>{
    return axiosInstance.get(`/food?page=${page}&limit=${limit}`)
}
export const deleteFood =  (id: string) =>{
    return axiosInstance.delete(`/food/deleteFood/${id}`)
}
export const getFoodByName = (name: string) =>{
    return axiosInstance.get(`/food/name/${encodeURIComponent(name)}`)
}
export const getTotalFoodsCount = () =>{
    return axiosInstance.get('/food/getTotalFoodsCount')
}