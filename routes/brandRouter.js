import express from "express"
import brandCtrl from "../controllers/brandCtrl.js"
import authMiddleware from "../middleware/auth.js"
import authAdminMiddleware from "../middleware/authAdmin.js"

const router = express.Router()

router
 .route("/brand")
 .get(brandCtrl.getBrands)
 .post(authMiddleware, authAdminMiddleware, brandCtrl.createBrand)

router
 .route("/brand/:id")
 .delete(authMiddleware, authAdminMiddleware, brandCtrl.deleteBrands)
 .put(authMiddleware, authAdminMiddleware, brandCtrl.updateBrands)

router.route("/brand_all").get(brandCtrl.selectBrands)

export default router
