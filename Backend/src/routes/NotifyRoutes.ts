import { Router } from "express";
import { getNotifications, markAsRead } from "../controllers/notificationController";


const router = Router()
router.get("/", getNotifications)
router.put("/mark-read", markAsRead)

export default router