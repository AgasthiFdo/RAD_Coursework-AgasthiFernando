import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { addReview, deleteReview, getAllReviews, getReviewByRecipe, getReviewByUser, getTotalReviewsCount, updateReview } from '../controllers/reviewController';


const router = Router()

router.post(

            "/addReview" ,
            authenticateUser,
            addReview

            )       

router.get("/byRecipe/:recipe", getReviewByRecipe)        
router.get("/", getAllReviews)
router.delete("/deleteReview/:id", deleteReview)
router.get(

        "/myReviews",
        authenticateUser,
        getReviewByUser

            )

router.put(

    "/updateReview/:id",
    authenticateUser,
    updateReview

)

 router.get("/getTotalReviewesCount",getTotalReviewsCount)

 export default router       