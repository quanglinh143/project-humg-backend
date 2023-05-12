import express from "express"
import PaymentCtrl from "../controllers/paymentCtrl.js"
import authMiddleware from "../middleware/auth.js"
import authAdminMiddleware from "../middleware/authAdmin.js"

const router = express.Router()

router
 .route("/payment")
 .get(authMiddleware, authAdminMiddleware, PaymentCtrl.getPayments)
 .post(authMiddleware, PaymentCtrl.createPayment)

router
 .route("/payment/:id")
 .get(authMiddleware, authAdminMiddleware, PaymentCtrl.getPaymentById)

router.route("/revenue").get(PaymentCtrl.getRevenues)

export default router
