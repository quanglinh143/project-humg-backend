import express from "express"
import productCtrl from "../controllers/productCtrl.js"

const router = express.Router()

router
 .route("/products")
 .get(productCtrl.getProducts)
 .post(productCtrl.createProducts)

router
 .route("/products/:id")
 .get(productCtrl.getProductById)
 .post(productCtrl.deleteProducts)
 .put(productCtrl.updateProducts)

router.route("/product_all").get(productCtrl.selectProducts)
router.route("/daily_discover").get(productCtrl.dailyDiscover)

export default router
