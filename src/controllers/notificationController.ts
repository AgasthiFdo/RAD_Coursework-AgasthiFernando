import { NextFunction, Request, Response } from "express";
import { Notification } from '../models/NotificationModel';


export const getNotifications = async (req:Request, res: Response, next:NextFunction)=>{
    try{
        const notification = await Notification.find({read: false}).sort({createdAt: -1})
        const unReadNotify = await Notification.countDocuments({read: false})

        res.status(200).json({
            success: true,
            data: {notification, unReadNotify}
        })
    }catch(error){
        next(error)
    }
}

export const markAsRead = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        await Notification.updateMany({read: false},{read: true})
        res.status(200).json({
            success: true,
            message: "Notification mark as Read"
        })
    }catch(error){
        next(error)
    }
}