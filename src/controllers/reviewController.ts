import { NextFunction, Request, Response} from "express";
import userModel from "../models/userModel";
import { Recipe } from "../models/RecipeModel";
import { Review } from "../models/ReviewModel";
import { error } from 'console';
import { AuthRequest } from "../middleware/authMiddleware";


export const addReview = async (req:Request, res:Response, next:NextFunction) =>{
    try{
        const {user, recipe, rating, description, date} = req.body

        const exstingUser = await userModel.findById(user)

        if(!exstingUser){
            return res.status(404).json({
                success: false,
                data:null,
                message:"User Not Found"
            })
        }
        const existingRecipe = await Recipe.findById(recipe)

        if(!existingRecipe){
            return res.status(404).json({
                success: false,
                data:null,
                message:"User Not Found"
            })
        }
        const newReview = new Review({
            user,
            recipe,
            rating,
            description,
            date : new Date()
        })
        await newReview.save()

        res.status(201).json({
            success:true,
            data: {review: newReview},
            message: "Review Saved successfully"
        })
    }catch(error){
        next(error)
    }
}

export const updateReview = async (req:Request, res: Response, next :NextFunction)=>{
    try{
        const {id} = req.params
        const {resipe , rating, description} = req.body

        const exsitingReview = await Review.findById(id)
        if(!exsitingReview){
            return res.status(404).json({
                success: false,
                message: "Review not found"
            })
        }

        exsitingReview.recipe = resipe || exsitingReview.recipe
        exsitingReview.rating = rating || exsitingReview.rating
        exsitingReview.description = description || exsitingReview.description

        await exsitingReview.save()

         res.status(200).json({
             success: true,
            data: {review: exsitingReview},
            message: "Review updated successflly"
        })
    }catch(error){
        next(error)
    }
}

export const deleteReview = async (req:Request, res:Response, next:NextFunction) =>{
    try{
        const {id} = req.params
        const exsitingReview = await Review.findById(id)
        if(!exsitingReview){
            return res.status(404).json({
                success: false,
                message: "Review not found"
            })
        }
        await Review.findByIdAndDelete(id)
         res.status(200).json({
            success: true,
            message: "Review deleted successflly"
        })
    }catch(error){
        next(error)
    }
}

export const getReviewByRecipe = async (req:Request, res:Response, next:NextFunction) =>{
    try{
        const {recipe} = req.params
        const review = await Review.find({recipe: recipe})
        .populate("user", "name")
        .populate("recipe","title")

        if(!review){
            return res.status(404).json({
                 success: false,
                data:null,
                message:"Review Not Found"
            })
        }
        res.status(200).json({
            success: true,
            data: { review: review },
            message: "Review fetched successfully",
        })
    }catch(error){
        console.error(error)
        next(error)
    }
}

export const getAllReviews = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 3
        const skip = (page -1) * limit

        const reviews = await Review.find()
            .populate("user", "name")
            .populate("recipe", "title")
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
        const total = await Review.countDocuments()
        
        res.status(200).json({
            success: true,
            data: { reviews },
            message: "Reviews fetched successfully",
            totalPages: Math.ceil(total / limit),
            totalCount: total,
            page
        })
    }catch(error){
        console.error(error)
        res.status(500).json({
            success: false,
            data: null,
            message: "Error fetching Reviews",
            error,
        })
    }
}

export const getReviewByUser = async (req:AuthRequest, res:Response, next:NextFunction) => {
    try{
        const userId = req.user?._id

        if(!userId){
            return res.status(401).json({
                success: false,
                data: null,
                message: "User not logged in"
            })
        }

        const reviews = await Review.find({user: userId})
            .populate("user", "name")
            .populate("recipe", "title")
            .sort({date: -1})
        
        res.status(200).json({
            success: true,
            data: { reviews },
            message: "User reviews fetched successfully"
        })
    }catch(error){
        next(error)
    }
}
export const getTotalReviewsCount = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const totalReviews = await Review.countDocuments()
        res.status(200).json({
            success:true,
            data: {totalReviews},
            message: "Totals reviews count fetched successfully"
        })
    }catch(error){
        next(error)
    }

    
}