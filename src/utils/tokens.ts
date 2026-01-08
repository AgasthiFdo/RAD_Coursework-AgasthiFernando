
import config from "../config/jwt"
import { IUser } from "../models/userModel"
import dotenv from "dotenv"
import jwt, {Secret} from 'jsonwebtoken';
dotenv.config()

export const generateAccessToken = (user: IUser) => {

  return jwt.sign(

    {   sub: user._id.toString(), 
        role: user.role 
    },
        config.JWT_SECRET as Secret,
    { 
        expiresIn: "4h" 
    }

  )

}

export const generateRefreshToken = (user: IUser) =>{

    return jwt.sign(

        {
            sub: user._id.toString()
        },
        config.JWT_REFRESH_SECRET as Secret,
        {
            expiresIn: "7d"
        }

    )
}
