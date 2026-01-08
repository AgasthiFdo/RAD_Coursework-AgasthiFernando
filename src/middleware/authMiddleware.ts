import { Request, Response, NextFunction } from "express"
import jwt, { Secret } from "jsonwebtoken"
import config from "../config/jwt"
import User, {IUser} from "../models/userModel"

export interface AuthRequest extends Request {
  user?: IUser
}

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET as Secret) as {
      sub: string
      role: string
    }

    console.log(decoded)

    if (!decoded.sub) {
      return res.status(401).json({ message: "Token payload invalid" })
    }

    const user: IUser | null = await User.findById( decoded.sub )

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error(error)
    return res.status(401).json({ message: "Token is not valid" })
  }
}

export const authorizeRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" })
    }
    next()
  }
}

export const authorizeAdmin = authorizeRole(["Admin"])
export const authorizeUser = authorizeRole(["User"])