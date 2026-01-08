import { Request, Response, NextFunction } from "express";
import userModel from "../models/userModel";
import {Food} from "../models/FoodModel"
import { Recipe } from '../models/RecipeModel';
import { Notification } from "../models/NotificationModel";
import { error } from 'console';
import cloudinary from "../config/cloudinary";
import { Email } from '../models/EmailModel';
import { sendApprovalemail } from "./emailController";
import { AuthRequest } from "../middleware/authMiddleware";
import PDFDocument from "pdfkit";


export const addRecipie = async (req:Request, res:Response, next: NextFunction)=>{
    try{
        const {user, food, title, ingredients, step, readyIn, date} = req.body
        
        const exstingUser = await userModel.findById(user)
        const userRole = (req as any).user.role
        const checkStatus = userRole === 'Admin' ? 'Approved' : 'Pending' 

        if(!exstingUser){
            return res.status(404).json({
                success: false,
                data:null,
                message:"User Not Found"
            })
        }

        const exstingFood = await Food.findById(food)
        if(!exstingFood){
            return res.status(404).json({
                success: false,
                data:null,
                message:"Food Not Found"
            })
        }

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
        const newResipe = new Recipe({
            user,
            food,
            title,
            ingredients : ingredients.split(","),
            step,
            readyIn,
            date : new Date(),
            images: imageURLs,
            status: checkStatus
        })
        await newResipe.save()

        if(userRole === 'User'){
            const foodData = await Food.findById(food)
            const userData = await userModel.findById(user)
            const notification = new Notification({
                recipeId : newResipe._id,
                userId : user,
                recipeTitle : title,
                foodName :  foodData?.name,
                userName : userData?.name,
                message : `New Recipe '${title}' submitted for approval`,
                read: false,
                createdAt : new Date()

            })
            await notification.save()

            const io = req.app.get("io")
            io.emit("New Pending Recipe", {
                message: "New Recipe Submitted",
                data:{
                    recipeId: newResipe._id,
                    recipeTitle: title,
                    foodName : foodData?.name,
                    userName : userData?.name,
                    createdAt : new Date()
                }
            })
        }

        const message = userRole === 'Admin' ? "Recipe Added Successfully" : "Recipes Submitted for Approval"
        res.status(201).json({
            success:true,
            data: {recipe: newResipe},
            message: message
        })
    }catch(error){
        next(error)
    }
}

export const getAllRecipes = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 3
        const skip = (page -1) * limit

        const recipes = await Recipe.find({status: 'Approved'})
                .populate("user", "name")
                .populate("food","name")
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limit)
        const total = await Recipe.countDocuments({status: 'Approved'})
        
        res.status(200).json({
            success: true,
            data: { recipes },
            message: "Recipes fetched successfully",
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page
        })
    }catch(error){
        res.status(500).json({
            success: false,
            data: null,
            message: "Error fetching Recipes",
            error,
        })
    }
}

export const getRecipeByFood = async (req:Request, res:Response, next:NextFunction) =>{
    try{
        const {food} = req.params
        const recipe = await Recipe.find({food: food, status: 'Approved'})
        .populate("user", "user")
        .populate("food", "name")
        if(!recipe){
            return res.status(404).json({
                 success: false,
                data:null,
                message:"Recipe Not Found"
            })
        }
        res.status(200).json({
        success: true,
        data: { recipes: recipe },
        message: "Recipe fetched successfully",
        })
    }catch(error){
        next(error)
    }
}

export const updateRecipe = async (req:Request, res:Response, next:NextFunction) =>{
    try{
        const {id} = req.params
        const { food, title, ingredients, step, readyIn} = req.body
        const files = req.files as Express.Multer.File[] || []

        const existingRecipe = await Recipe.findById(id)
        if(!existingRecipe){
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            })
        }

            let updatedImages = [...existingRecipe.images || []]
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
        
        existingRecipe.food = food || existingRecipe.food
        existingRecipe.title = title || existingRecipe.title
        existingRecipe.ingredients = ingredients || existingRecipe.ingredients
        existingRecipe.step = step || existingRecipe.step
        existingRecipe.readyIn = readyIn || existingRecipe.readyIn
        existingRecipe.images = updatedImages

        await existingRecipe.save()

       
    }catch(error){
        next(error)
    }
}

export const deleteRecipe = async (req:Request, res:Response, next:NextFunction)  =>{
    try{
        const {id} = req.params

        const existingRecpe = await Recipe.findById(id)
        if(!existingRecpe){
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            })
        }
        for (const imageUrl of existingRecpe.images ?? []){
            try{
                const parts = imageUrl.split("/")
                const filename = parts[parts.length - 1]
                const publicId = `recipe/${filename.split("."[0])}`
                await cloudinary.uploader.destroy(publicId)
            }catch(error){
                console.error(error)
            }
        }

        await Recipe.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message:"Recipe deleted successfully" 
        })
    }catch(error){
        next(error)
    }
}

export const getRecipeByTitle = async (req:Request, res: Response, next:NextFunction) =>{
    try{
        const {title} = req.params

        const decodedTitle = decodeURIComponent(title)
        const recipe = await Recipe.findOne({title: decodedTitle})

        if(!recipe){
             return res.status(404).json({
                success: false,
                message: "Recipe not found",
            })
        }
        res.status(200).json({
            success: true,
            data: { recipe },
            message: "Recipe fetched successfully",
        })
    }catch(error){
        next(error)
    }
}

export const getPandingRecipes = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const page = parseInt(req.query.page as string) || 1
        const limit  = parseInt(req.query.limit as string) || 3
        const skip = (page -1) * limit
        const recipes = await Recipe.find({ status: 'Pending' })
        .populate("user", "name")
        .populate("food", "name")
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        const total = await Recipe.countDocuments({status : 'Pending'})


        res.status(200).json({
            success:true,
            data:{recipes},
            message: "Get Pneding Recipes",
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page
        })
    }catch(error){
        next(error)
    }
}

export const approveRecipe = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const {id} = req.params

        const recipe = await Recipe.findByIdAndUpdate(
            id,
            {status: 'Approved'},
            {new: true}
        ).populate("user","name email")

        if(!recipe){
            return res.status(404).json({
                success:false,
               
                message: "Recipe not found"
            })
        }

        const recipeUser = recipe.user as any

        if(recipeUser && recipeUser.email){
            try{
                await sendApprovalemail(recipeUser.email, recipeUser.name, recipe.title)

                const emailDeatils = new Email({
                    recipe: recipe._id,
                    user: recipeUser._id,
                    userEmail: recipeUser.email,
                    subject: "Recipe Approved!",
                    message: "Recipe Approval",
                    status: "Success",
                    sendAt: new Date()
                })

                await emailDeatils.save()
                console.log("send mail")

            }catch(error){
                console.error("Failed to send email", error)

            }

        }

        res.status(200).json({
             success:true,
            data:{recipe},
            message: "Recipe Approved Succesfully and Email sent",
            
            
        })
    }catch(error){
        next(error)
    }
}

export const rejectRecipes = async (req:Request, res:Response, next:NextFunction) =>{
    try{
        const {id} = req.params

        const recipe = await Recipe.findByIdAndUpdate(
            id,
            {status : 'Reject'},
            {new: true}
        )
        if(!recipe){
           return res.status(404).json({
                success:false,
               
                message: "Recipe not found"
            }) 
        }
        res.status(200).json({
             success:true,
            data:{recipe},
            message: "Recipe Rejected Succesfully"
        })
    }catch(error){
        next(error)
    }
}

export const getRecipeByUser = async (req:AuthRequest, res:Response, next:NextFunction) => {
    try{
        const userId = req.user?._id

        if(!userId){
            return res.status(401).json({
                success: false,
                data: null,
                message: "User not logged in"
            })
        }

        const recipes = await Recipe.find({user: userId})
            .populate("food", "name")
            .sort({date: -1})
        
        res.status(200).json({
            success: true,
            data: { recipes },
            message: "User Recipe fetched successfully"
        })
    }catch(error){
        next(error)
    }
    
}
export const getTotalRecipesCount = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const totalRecipes = await Recipe.countDocuments({status: 'Approved'})
        res.status(200).json({
            success:true,
            data: {totalRecipes},
            message: "Totals recipes count fetched successfully"
        })
    }catch(error){
        next(error)
    }
}

export const getRecipesGrowth = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const growthData = await Recipe.aggregate([
            {
                $match:{
                    status: "Approved"
                }
            },
            {
                $group:{
                    _id:{
                        $dateToString:{
                            format : "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count:{$sum: 1}
                }
            },
            {
                $sort: {_id: 1}
            }
        ])
        const formattedData = growthData.map((item)=>({
            day: item._id,
            recipes: item.count
        }))
        res.status(200).json({
            success: true,
            data: formattedData
        })
    }catch(error){
        next(error)
    }
}
export const getTotalStatusAndCompire = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const statusResult = await Recipe.aggregate([
            {
                $group:{
                    _id: "$status",
                    value: {$sum: 1}
                }
            }
        ])

        const statusData = [
            {name: "Pending",
             value: 0   
            },
            {name:"Approved",
            value: 0
            },
            {name:"Reject",
             value: 0   
            }
        ]

        statusResult.forEach(item =>{
            const index = statusData.findIndex(data => data.name === item._id)
            if(index !== -1){
                statusData[index].value = item.value
            }
        })
        res.status(200).json({
            success:true,
            statusData
        })
    }catch(error){
        next(error)
    }
}

export const searchRecipes = async (req:Request, res:Response, next: NextFunction)=>{
    try{
        const {query} = req.query

        if(!query){
            return res.status(400).json({
                success: false,
                message : "A word is requires"
            })
        }

        const recipes = await Recipe.find({
            status: 'Approved',
            $or:[
                { title : { 
                    $regex: query,
                    $options: 'i'
                }},
                { ingredients : {
                    $regex: query,
                    $options: 'i'
                }}
            ]
        }).select("title image _id").limit(6)

        res.status(200).json({
            success: true,
            data: recipes
        })
    }catch(error){
        next(error)
    }
}

export const downloadRecipePDF = async (req:Request, res:Response,next:NextFunction)=>{
    try{
        const {id} = req.params
        const recipe = await Recipe.findById(id)
        .populate("food", "name")
        .populate("user", "name")
        
        if(!recipe){
            return res.status(404).json({
                success:false,
                message: "Recipe Not found"
            })
        }  
        const document = new PDFDocument ({margin:50})

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename=${recipe.title.replace(/\s+/g, '_')}.pdf`);
        document.pipe(res)

        document.fontSize(25).fillColor('#E44D26').text(recipe.title, {align:'center'})
        document.moveDown()

        document.fontSize(14).fillColor('black').text(`Food Category: ${(recipe.food as any)?.name}`)
        document.text(`Created by: ${(recipe.user as any)?.name}`);
        document.text(`Ready in: ${recipe.readyIn}`);
        document.moveDown()

        document.fontSize(18).fillColor('#333').text('Ingredients')
        recipe.ingredients.forEach((ing, index)=>{
            document.fontSize(12).text(`${index +1}. ${ing}`)
        })
        document.moveDown()
        document.fontSize(18).text('Preparation Steps:')
        document.fontSize(12).text(recipe.step)
        document.end()
        
    }catch(error){
        next(error)
    }
}