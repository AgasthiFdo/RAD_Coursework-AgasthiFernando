import axiosInstance from "./axios"

export const getAllNotifications = () =>{
    return axiosInstance.get('/notification')
}

export const markAsRead = () =>{
    return axiosInstance.put('/notification/mark-read')
}