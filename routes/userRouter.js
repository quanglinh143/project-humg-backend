import express from "express"
import { userCtrl } from "../controllers/index.js"
import authMiddleware from "../middleware/auth.js"
import authAdminMiddleware from "../middleware/authAdmin.js"

const router = express.Router()
router.post("/register", userCtrl.register)
router.post("/login", userCtrl.login)
router.get("/logout", userCtrl.logout)
router.get("/refresh_token", userCtrl.refreshToken)
router.get("/info", authMiddleware, userCtrl.getUser)
router.patch("/addCart", authMiddleware, userCtrl.addCart)
router.get("/history", authMiddleware, userCtrl.history)
router.post("/changePassword", authMiddleware, userCtrl.changePassword)
router.post("/updateInfo", authMiddleware, userCtrl.updateInfo)
router.post("/login_dashboard", userCtrl.loginDashboard)
router.get("/getTotalUser", userCtrl.getTotalUser)

export default router
