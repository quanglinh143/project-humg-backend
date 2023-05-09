import Product from "../models/productModel.js"
import Payment from "../models/paymentModel.js"

const getProducts = async (req, res) => {
 const search = req.query.keyword
 const sort = req.query.sort || "-createdAt"
 const filter = req.query.filter
 try {
  if (filter !== undefined) {
   const filterItem = JSON.parse(filter)
   const products = await Product.find({
    name: new RegExp(search, "i"),
    ...(filterItem.category.length && { category: filterItem.category }),
    ...(filterItem.brand.length && { brand: filterItem.brand }),
    ...(filterItem.price && { price: { $gte: 0, $lt: filterItem.price } }),
   }).sort(sort)
   const page = parseInt(req.query.page)
   const limit = parseInt(req.query.limit)
   const startIndex = (page - 1) * limit
   const lastIndex = page * limit

   const results = {}
   results.totalProducts = products.length || 0
   results.pageCount = Math.ceil(products.length / limit)

   if (lastIndex < products.length) {
    results.next = {
     page: page + 1,
    }
   }

   if (startIndex > 0) {
    results.prev = {
     page: page - 1,
    }
   }

   results.result = products.slice(startIndex, lastIndex) || []

   res.json(results)
  }
 } catch (error) {
  return res.status(500).json({ msg: error.msg })
 }
}

const getProductById = async (req, res) => {
 const { id } = req.params

 try {
  const product = await Product.findById(id)
  return res.send(product)
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const createProducts = async (req, res) => {
 const { name, price, description, content, images, category, brand } = req.body
 try {
  if (!images)
   return res.status(400).json({ msg: " Không có ảnh được tải lên." })
  if (!name || !price || !description || !content || !category || !brand)
   return res.status(400).json({ msg: " Vui lòng nhập đủ trường dữ liệu." })

  const product = await Product.findOne({ name })
  if (product)
   return res.status(400).json({ msg: "This product already exists." })
  const newProduct = new Product({
   name,
   price,
   description,
   content,
   images,
   category,
   brand,
  })
  await newProduct.save()
 } catch (error) {
  res.json({ msg: "An error has occurred!" })
 }
 res.json({ msg: "Successfully added new products." })
}

const updateProducts = async (req, res) => {
 try {
  const { id } = req.params
  const { name, price, description, content, images, category } = req.body
  if (!images)
   return res.status(400).json({ msg: " Không có ảnh được tải lên." })
  await Products.findOneAndUpdate(
   { _id: id },
   {
    name: name,
    price,
    description,
    content,
    images,
    category,
   },
   { new: true }
  )

  return res.json({ msg: "Updated by ID." })
 } catch (error) {
  return res.status(500).json({ msg: error.msg })
 }
}

const deleteProducts = async (req, res) => {
 const { id } = req.params

 try {
  await Product.findOneAndDelete({ _id: id })
  res.json({ msg: "Deleted a Product." })
 } catch (error) {
  return res.status(500).json({ msg: error.msg })
 }
}

const selectProducts = async (req, res) => {
 let results = {}
 try {
  const products = await Product.find().sort({ name: "asc" })
  if (products) {
   results.total = products.length
   results.result = products
  }
  res.json(results)
 } catch (error) {
  return res.status(500).json({ msg: "An error has occurred" })
 }
}

const dailyDiscover = async (req, res) => {
 const { userId } = req.query
 try {
  let results = {}

  const payments = await Payment.find({ user_id: userId })
  if (payments.length > 0) {
   const filterCategory =
    payments.length > 0 &&
    payments[payments.length - 1].cart.map((item) => {
     return item.category
    })

   const products = await Product.find({
    ...(filterCategory.length > 0 && { category: filterCategory }),
   })

   results.total = products.length
   results.result = products
   return res.json(results)
  } else {
   results.total = 0
   results.result = []
   return res.json(results)
  }
 } catch (error) {
  return res.status(500).json({ msg: "An error has occurred" })
 }
}

export default {
 getProducts,
 getProductById,
 createProducts,
 updateProducts,
 deleteProducts,
 selectProducts,
 dailyDiscover,
}
