import { forgotPassword, getProfile, handleRefreshToken, login, resetPassword, signup } from "../controllers/authController";
import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { createUser, deleteUser, getAllUsers, getTotalUsersCount, updateUser } from "../controllers/userController";
import upload from "../middleware/upload";


const authRouter = Router()
authRouter.post('/signup', signup)
authRouter.post('/login', login)
authRouter.get("/me", authenticateUser,getProfile)
authRouter.put("/updateUser/:id", upload.single('image'), updateUser)
authRouter.post("/forgot-password",forgotPassword)
authRouter.post("/reset-password", resetPassword)
authRouter.get("/", getAllUsers) 
authRouter.delete("/deleteUser/:id", deleteUser)
authRouter.post("/createUser", createUser)
authRouter.get("/getTotalUsersCount",getTotalUsersCount)
authRouter.post('/refresh', handleRefreshToken)


export default authRouter