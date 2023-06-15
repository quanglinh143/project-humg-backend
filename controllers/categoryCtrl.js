import Category from "../models/categoryModel.js"
import Product from "../models/productModel.js"

const getCategories = async (req, res) => {
 const search = req.query.keyword
 const sort = req.query.sort
 let results = {}
 try {
  if (!search && !sort) {
   results = await Category.find()
   res.json(results)
  } else {
   const categories = await Category.find({
    name: new RegExp(search, "i"),
   }).sort(sort)
   const page = parseInt(req.query.page)
   const limit = parseInt(req.query.limit)
   const startIndex = (page - 1) * limit
   const lastIndex = page * limit
   results.totalCategories = categories.length
   results.pageCount = Math.ceil(categories.length / limit)

   if (lastIndex < categories.length) {
    results.next = {
     page: page + 1,
    }
   }

   if (startIndex > 0) {
    results.prev = {
     page: page - 1,
    }
   }

   results.result = categories.slice(startIndex, lastIndex)
   res.json(results)
  }
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const selectCategories = async (req, res) => {
 let results = {}
 try {
  const categories = await Category.find().sort({ name: "asc" })
  if (categories) {
   results.total = categories.length
   results.result = categories
  }
  res.json(results)
 } catch (error) {
  return res.status(500).json({ msg: "An error has occurred" })
 }
}

const deleteCategories = async (req, res) => {
 const { id } = req.params
 try {
  const products = await Product.findOne({ category: id })
  if (products)
   return res
    .status(400)
    .json({ msg: "Vui lòng xóa tất cả sản phẩm liên quan" })
  await Category.findByIdAndDelete(req.params.id)

  return res.json({ msg: "Deleted by ID." })
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const updateCategories = async (req, res) => {
 try {
  const { name } = req.body
  const { id } = req.params
  const exists = await Category.findOne({ name })
  if (exists) return res.status(400).json({ msg: "Thể loại này đã tồn tại" })
  await Category.findOneAndUpdate({ _id: id }, { name: name }, { new: true })
  return res.json({ msg: "Updated by ID." })
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const createCategory = async (req, res) => {
 try {
  // if user have role =1 -> admin
  // only admin can CRUD
  const { name } = req.body
  const category = await Category.findOne({ name })
  if (category) return res.status(400).json({ msg: "Thể loại này đã tồn tại" })

  const newCategory = new Category({ name })
  await newCategory.save()

  res.json({ msg: "Thêm mới thành công" })
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

export default {
 getCategories,
 createCategory,
 deleteCategories,
 updateCategories,
 selectCategories,
}
