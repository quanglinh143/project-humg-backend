import express from "express"
import couponCtrl from "../controllers/couponCtrl.js"
import authMiddleware from "../middleware/auth.js"
import authAdminMiddleware from "../middleware/authAdmin.js"
const router = express.Router()

router
 .route("/coupon")
 .get(authMiddleware, authAdminMiddleware, couponCtrl.getCoupons)
 .post(authMiddleware, authAdminMiddleware, couponCtrl.createCoupon)

router
 .route("/coupon/:id")
 .delete(authMiddleware, authAdminMiddleware, couponCtrl.deleteCoupon)
 .put(authMiddleware, authAdminMiddleware, couponCtrl.updateCoupon)

router.route("/coupon_confirm").post(couponCtrl.confirmCoupon)

export default router
