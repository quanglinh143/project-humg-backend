import express from "express"
import categoryCtrl from "../controllers/categoryCtrl.js"
import authMiddleware from "../middleware/auth.js"
import authAdminMiddleware from "../middleware/authAdmin.js"
const router = express.Router()

router
 .route("/category")
 .get(categoryCtrl.getCategories)
 .post(authMiddleware, authAdminMiddleware, categoryCtrl.createCategory)

router
 .route("/category/:id")
 .delete(authMiddleware, authAdminMiddleware, categoryCtrl.deleteCategories)
 .put(authMiddleware, authAdminMiddleware, categoryCtrl.updateCategories)

router.route("/category_all").get(categoryCtrl.selectCategories)

export default router
