import jwt, {Secret} from 'jsonwebtoken';
import userModel, {IUser} from '../models/userModel';
import config from "../config/jwt"
import bcrypt from 'bcryptjs'
import {Request, Response, NextFunction } from 'express';
import { AuthRequest } from "../middleware/authMiddleware";
import nodemailer from 'nodemailer';
import { generateAccessToken, generateRefreshToken } from '../utils/tokens';
import dotenv from "dotenv"

dotenv.config()



const signup = async (req:Request, res:Response, next:NextFunction) =>{

    try{

        const { name, email, password } = req.body;
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            const error = new Error('USer with this email already exists');
            (error as any).statusCode = 409;
            throw error;

        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({

            name,
            email,
            password:hashedPassword,
            image: null

        })
        await newUser.save()

        res.status(201).json({

            success: true,
            message: 'Librarian registered successfully',
            data: {

                id: newUser.id,
                name: newUser.name,
                email: newUser.email

            }

        });

    }catch(error){

        next(error)
    }
}


const login = async (req:Request, res:Response, next:NextFunction) =>{

    try{

        const { email, password } = req.body;
        const user = await userModel.findOne({email})
        if(!user){

            const error = new Error('Invalid credentials');
            (error as any).statusCode = 401;

            throw error;

        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){

            const error = new Error('Invalid credentials');
            (error as any).statusCode = 401;

            throw error;

        }

        const token = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        res.status(200).json({

            success: true,
            message: 'Login successful',
            
            data: {

                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                role:user.role,
                token,
                refreshToken

            }

        })

    }catch(error){

        next(error)

    }
}

const getProfile = async (req:AuthRequest, res:Response, next:NextFunction) =>{

    try{

        const userId = req.user?._id


        const user = await userModel.findById(userId).select("-password")

        if(!user){

            const error = new Error('USer not found');
            (error as any).statusCode = 404;

            throw error;

        }

        const {name, email, image, role} = user

        res.status(200).json({

            success: true,
            user : {name, email, image, role}

        });

    }catch(error){
        next(error)

    }

}

const generateOTP = () =>{

    return Math.floor(10000 + Math.random() * 900000)

}

const forgotPassword = async (req:Request, res:Response, next:NextFunction)=>{

    try{

        const {email} = req.body


        const user = await userModel.findOne({email})

        if(!user){
            return res.status(404).json({

                message : "User not found"

            })

        }

        const otp = generateOTP()
        user.resetOTP = otp
        user.OTPExpire = new Date(Date.now() + 10 * 60 * 1000)
        await user.save()

        const otpsend = nodemailer.createTransport({

            service: 'gmail',
            auth:{

                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS

            }

        })

        await otpsend.sendMail({

            to: user.email,

            subject: "Password Reset OTP",
            html: `<h3>Your OTP is</h3><h2>${otp}</h2>`

        })
        return res.status(200).json({

            success: true,
            message: "OTP sent to email"

        })

    }catch(error){

        next(error)

    }

}

const resetPassword = async (req:Request, res:Response, next:NextFunction) =>{

    try{

        const {email, otp, newPassword} = req.body

        const user = await userModel.findOne({

            email,
            resetOTP:otp,
            OTPExpire: {$gt: new Date()}

        })

        if(!user){

            return res.status(404).json({
                message : "User not found"

            })

        }

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword ,salt)

        user.resetOTP = null
        user.OTPExpire = null

        await user.save()

        return res.status(200).json({

            success: true,
            message: "Password Reset Successfull"

        })

    }catch(error){
        next(error)

    }

}

const handleRefreshToken = async(req:Request, res:Response) =>{

    try{
        
        const {token} = req.body
        if (!token) {

            return res.status(400).json({ 

                message: "Token required" 

            })
        }

        const payload = jwt.verify(token, config.JWT_REFRESH_SECRET as Secret)

        const user = await userModel.findById(payload.sub)

        if (!user) {

            return res.status(403).json({ 

                message: "Invalid refresh token" 

            })

        }

        const accessToken = generateAccessToken(user)

        res.status(200).json({

            accessToken

        })

    }catch(error){

        res.status(403).json({

            message: "Invalid or expire token"

        })

    }
    
}

export {signup, login, getProfile, forgotPassword, resetPassword , handleRefreshToken}