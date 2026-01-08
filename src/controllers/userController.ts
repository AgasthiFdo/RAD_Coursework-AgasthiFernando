import { NextFunction, Request, Response } from "express";
import userModel from "../models/userModel";
import bcrypt from 'bcrypt';
import cloudinary from "../config/cloudinary";
import { error } from "console";


 
 
 export const createUser = async (req:Request, res:Response, next:NextFunction) =>{
    const {name, email, password, image, role} = req.body

    if(!name || !email || !password){
        return res.status(400).json({
           message: "Missing required fields" 
        })
    }

    try{
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(400).json({
           message: "User already exists" 
        })
    }
        const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
        
                const user = new userModel({
                    name,
                    email,
                    password:hashedPassword,
                    image: null,
                    role
                })
                await user.save()
        
        
                res.status(201).json({
                    success: true,
                    data:{user},
                    message: "User Create Successfully"
                });
        
    }catch(error){
        res.status(500).json({ message: "Server error" })

    }
}

export const updateUser = async(req:Request, res:Response, next:NextFunction) =>{
    try{
        const {id} = req.params
        const {name, email ,password} = req.body
        const file = req.file

        const existingUSer = await userModel.findById(id)

        if(!existingUSer){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        let updatedImage = existingUSer.image;

        if (file) {
        const uploaded: any = await new Promise((resolve, reject) => {
            const upload_stream = cloudinary.uploader.upload_stream(
            { folder: "users" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
            );
            upload_stream.end(file.buffer);
        });

        updatedImage = uploaded.secure_url;
        }

        existingUSer.name = name || existingUSer.name
        existingUSer.email = email || existingUSer.email
        existingUSer.password = password || existingUSer.password
        existingUSer.image = updatedImage

        await existingUSer.save()

        res.status(200).json({
            success: true,
            data: {user: existingUSer},
            message: "Food updated successflly"
        })
    }catch(error){
        next(error)
    }
}

export const getAllUsers = async (req:Request, res:Response, next:NextFunction)=>{
    try{
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 3
            const skip = (page - 1) * limit
    
            const users = await userModel.find()
               
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limit)
            const total = await userModel.countDocuments()    
    
            res.status(200).json({
                success: true,
                data: { users },
                message: "Users fetched successfully",
                totalPages: Math.ceil(total / limit),
                totalCount: total,
                page
            });
        }catch(error){
            res.status(500).json({
                success: false,
                data: null,
                message: "Error fetching Users",
                error,
        });
    }
}

export const deleteUser = async (req:Request, res:Response, next:NextFunction)=>{
    try{
            const {id} = req.params
    
            const existingUser = await userModel.findById(id)
            if(!existingUser){
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }
    
            const imageUrl = existingUser.image
            if(imageUrl){
                try{
                    const parts = imageUrl?.split("/")
                    const filename = parts[parts.length - 1]
                    const publicId = `users/${filename.split(".")[0]}`
                    await cloudinary.uploader.destroy(publicId)
                }catch(error){
                    console.error(error)
                }
            }
            
    
            await userModel.findByIdAndDelete(id)
            res.status(200).json({
                success: true,
                message:"User deleted successfully" 
            })
        }catch(error){
            next(error)
        }
}
 
export const getTotalUsersCount = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const totalUsers = await userModel.countDocuments()
        res.status(200).json({
            success:true,
            data: {totalUsers},
            message: "Totals users count fetched successfully"
        })
    }catch(error){
        next(error)
    }

    
}


