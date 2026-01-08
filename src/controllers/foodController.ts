import {Request, Response, NextFunction } from "express";
import { Food } from "../models/FoodModel";
import bucket from "../config/firebase";
import { error } from 'console';
import cloudinary from "../config/cloudinary";


export const addFood = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const {name, category,cuisine, description} = req.body
        let imageURLs: string[] = [];

    if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
            const uploaded: any = await new Promise((resolve, reject) => {
            const upload_stream = cloudinary.uploader.upload_stream(
                { folder: "food" },
                (error, result) => {
                if (error) return reject(error);
                resolve(result);
                }
            );
            upload_stream.end(file.buffer);
            });

            imageURLs.push(uploaded.secure_url);
        }
    }

        const newFood = new Food({
            name,
            category,
            cuisine,
            description,
            images:imageURLs
        })
        await newFood.save()
        res.status(201).json({
            success:true,
            data: {food: newFood},
            message: "Food Added Successfully"
        })
    }catch(error){
        next(error)
    }
}

export const getAllFoods = async(req:Request, res:Response, next: NextFunction)=>{
    try{
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 3
        const skip = (page - 1) * limit

        const foods = await Food.find()
           
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
        const total = await Food.countDocuments()    

        res.status(200).json({
            success: true,
            data: { foods },
            message: "Foods fetched successfully",
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page
        });
    }catch(error){
        res.status(500).json({
            success: false,
            data: null,
            message: "Error fetching Foods",
            error,
    });
    }
}

export const updateFood = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const {id} = req.params
        const {name, category,cuisine, description} = req.body
        const files = req.files as Express.Multer.File[]

        const existingFood = await Food.findById(id)
        if(!existingFood){
            return res.status(404).json({
                success: false,
                message: "Food not found"
            })
        }

        let updatedImages = [...existingFood.images]
        if(files && Array.isArray(files) && files.length > 0){
            for(const file of files){
                const uploaded: any = await new Promise((resolve, reject)=>{
                    const upload_stream = cloudinary.uploader.upload_stream(
                        { folder: "food" },
                        (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                        }
                    );
                    upload_stream.end(file.buffer);
                })
                updatedImages.push(uploaded.secure_url)
            }

        }

        existingFood.name = name || existingFood.name  
        existingFood.category = category || existingFood.category  
        existingFood.cuisine = cuisine || existingFood.cuisine  
        existingFood.description = description || existingFood.description  
        existingFood.images = updatedImages  

        await existingFood.save()

        res.status(200).json({
            success: true,
            data: {food: existingFood},
            message: "Food updated successflly"
        })
    }catch(error){
        next(error)
    }
}

export const deleteFood = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const {id} = req.params

        const existingFood = await Food.findById(id)
        if(!existingFood){
            return res.status(404).json({
                success: false,
                message: "Food not found"
            })
        }

        for(const imageUrl of existingFood.images){
            try{
                const parts = imageUrl.split("/")
                const filename = parts[parts.length - 1]
                const publicId = `foods/${filename.split(".")[0]}`
                await cloudinary.uploader.destroy(publicId)
            }catch(error){
                console.error(error)
            }
        }

        await Food.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message:"Food deleted successfully" 
        })
    }catch(error){
        next(error)
    }
}

export const getFoodsById = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const {id} = req.params
        const food = await Food.findById(id)
        if(!food){
            return res.status(404).json({
                success: false,
                data:null,
                message:"Food Not Found"
            })
        }
        res.status(200).json({
        success: true,
        data: { food },
        message: "Food fetched successfully",
    });
    }catch(error){
        next(error)
    }
}

export const getFoodByName = async (req: Request, res:Response, next:NextFunction)=>{
    try{
        const {name} = req.params

        const decodedName = decodeURIComponent(name)
        const food = await Food.findOne({name: decodedName})

        if(!food){
            return res.status(404).json({
                success: false,
                message: "Food not found",
            })
        }
        res.status(200).json({
            success: true,
            data: { food },
            message: "Food fetched successfully",
        })
    }catch(error){
        next(error)
    }
}

export const getTotalFoodsCount = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const totalFoods = await Food.countDocuments()
        res.status(200).json({
            success:true,
            data: {totalFoods},
            message: "Totals foods count fetched successfully"
        })
    }catch(error){
        next(error)
    }
}

