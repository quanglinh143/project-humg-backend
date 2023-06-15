import Brand from "../models/brandModel.js"
import Product from "../models/productModel.js"

const getBrands = async (req, res) => {
 const search = req.query.keyword
 const sort = req.query.sort
 let results = {}
 try {
  if (!search && !sort) {
   results = await Brand.find()
   res.json(results)
  } else {
   const brands = await Brand.find({
    name: new RegExp(search, "i"),
   }).sort(sort)
   const page = parseInt(req.query.page)
   const limit = parseInt(req.query.limit)
   const startIndex = (page - 1) * limit
   const lastIndex = page * limit
   results.totalBrands = brands.length
   results.pageCount = Math.ceil(brands.length / limit)

   if (lastIndex < brands.length) {
    results.next = {
     page: page + 1,
    }
   }

   if (startIndex > 0) {
    results.prev = {
     page: page - 1,
    }
   }

   results.result = brands.slice(startIndex, lastIndex)
   res.json(results)
  }
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const selectBrands = async (req, res) => {
 let results = {}
 try {
  const brands = await Brand.find().sort({ name: "asc" })
  if (brands) {
   results.total = brands.length
   results.result = brands
  }
  res.json(results)
 } catch (error) {
  return res.status(500).json({ msg: "Đã có lỗi xảy ra" })
 }
}

const deleteBrands = async (req, res) => {
 const { id } = req.params
 try {
  const products = await Product.findOne({ brand: id })
  if (products)
   return res
    .status(400)
    .json({ msg: "Vui lòng xóa tất cả sản phẩm liên quan" })
  await Brand.findByIdAndDelete(req.params.id)

  return res.json({ msg: "Xóa thành công" })
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const updateBrands = async (req, res) => {
 try {
  const { name } = req.body
  const { id } = req.params
  const exists = await Brand.findOne({ name })
  if (exists) return res.status(400).json({ msg: "Nhãn hàng này đã tồn tại" })

  await Brand.findOneAndUpdate({ _id: id }, { name: name }, { new: true })

  return res.json({ msg: "Cập nhật thành công" })
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const createBrand = async (req, res) => {
 try {
  const { name } = req.body
  const brand = await Brand.findOne({ name })
  if (brand) return res.status(400).json({ msg: "Nhãn hàng này đã tồn tại" })

  const newBrand = new Brand({ name })
  await newBrand.save()

  res.json({ msg: "Thêm mới thành công" })
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

export default {
 getBrands,
 createBrand,
 deleteBrands,
 updateBrands,
 selectBrands,
}
