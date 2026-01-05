import axiosInstance from "./axios"

export const getRecipeByFood =  (foodId: string) =>{
    return axiosInstance.get(`/recipe/byfood/${foodId}`)
}

export const getAllRecipes = (page: number = 1 , limit : number =100)=>{
    return axiosInstance.get(`/recipe?page=${page}&limit=${limit}`)
}

export const addRecipe = (data: FormData)=>{
    return axiosInstance.post('/recipe/addRecipe', data, {
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const updateRecipe = ( id: string ,data: FormData)=>{
    return axiosInstance.put(`/recipe/updateRecipe/${id}`, data, {
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    })
}
export const deleteRecipes = (id: string) =>{
    return axiosInstance.delete(`/recipe/deleteRecipe/${id}`)
}
export const getRecipeByName = (title : string) =>{
    return axiosInstance.get(`/recipe/title/${encodeURIComponent(title)}`)
}

export const getPendingRecipes = (page: number = 1, limit: number = 3 ) =>{
    return axiosInstance.get(`/recipe/pending?page=${page}&limit=${limit}`)
}
export const approvedRecipe = (id: string) =>{
    return axiosInstance.put(`/recipe/approved/${id}`)
}
export const rejectedRecipes = (id:string) =>{
    return axiosInstance.put(`/recipe/rejected/${id}`)
}
export const getRecipeByUser = () =>{
    return axiosInstance.get('/recipe/myRecipe')
}
export const getTotalRecipesCount = () =>{
    return axiosInstance.get('/recipe/getTotalRecipesCount')
}

export const getRecipeGrowth = () =>{
    return axiosInstance.get('/recipe/recipesGrowth')
}


export const getTotalStatusAndCompire = () =>{
    return axiosInstance.get('/recipe/totalStatusCompire')
}

export const searchRecipes = (query: string) =>{
    return axiosInstance.get(`/recipe/search?query=${encodeURIComponent(query)}`)
}

export const downloadRecipePDF = (id:string)=>{
    return axiosInstance.get(`/recipe/downloadPDF/${id}`,{
        responseType: 'blob',
    })
}
