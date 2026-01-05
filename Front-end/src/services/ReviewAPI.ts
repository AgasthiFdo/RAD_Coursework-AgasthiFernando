import axiosInstance from "./axios"

interface ReviewData{
    user:any
    recipe:string
    rating:number
    description: string
}
export const addReview = (data: ReviewData)=>{
    return axiosInstance.post('/review/addReview', data ,{
        headers:{
            'Content-Type': 'application/json'
        }
    })
}
export const getReviewByRecipe = (recipeId: string)=>{
    return axiosInstance.get(`/review/byRecipe/${recipeId}`)
}

export const getAllReviews  = (page: number =1, limit: number =100 )=>{
    return axiosInstance.get(`/review?page=${page}&limit=${limit}`)
}
export const deleteReview  = (id:string )=>{
    return axiosInstance.delete(`/review/deleteReview/${id}`)
}
export const getReviewByUser = () =>{
    return axiosInstance.get('/review/myReviews')
}
export const updateReview = (id:string , data:ReviewData) =>{
    return axiosInstance.put(`/review/updateReview/${id}`, data,{
         headers:{
            'Content-Type': 'application/json'
        }
    })
}
export const getTotalReviewsCount = () =>{
    return axiosInstance.get('/review/getTotalReviewesCount')
}
