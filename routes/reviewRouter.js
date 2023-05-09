import express from "express"
import reviewCtrl from "../controllers/reviewCtrl.js"
import authMiddleware from "../middleware/auth.js"

const router = express.Router()

router
 .route("/products/:id/reviews")
 .get(reviewCtrl.getReviewsProductById)
 .post(authMiddleware, reviewCtrl.createReviewsProductById)

export default router
