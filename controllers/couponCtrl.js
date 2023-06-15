import Coupons from "../models/couponModel.js"
import Payments from "../models/paymentModel.js"

const getCoupons = async (req, res) => {
 const search = req.query.keyword
 const sort = req.query.sort
 let results = {}
 try {
  if (!search && !sort) {
   results = await Coupons.find()
   res.json(results)
  } else {
   const coupons = await Coupons.find({
    name: new RegExp(search, "i"),
   }).sort(sort)
   const page = parseInt(req.query.page)
   const limit = parseInt(req.query.limit)
   const startIndex = (page - 1) * limit
   const lastIndex = page * limit
   results.totalCoupons = coupons.length
   results.pageCount = Math.ceil(coupons.length / limit)

   if (lastIndex < coupons.length) {
    results.next = {
     page: page + 1,
    }
   }

   if (startIndex > 0) {
    results.prev = {
     page: page - 1,
    }
   }

   results.result = coupons.slice(startIndex, lastIndex)
   res.json(results)
  }
 } catch (error) {
  return res.status(500).json({ msg: "Đã có lỗi xảy ra" })
 }
}

const createCoupon = async (req, res) => {
 try {
  const {
   coupon_name,
   coupon_code,
   start_date,
   end_date,
   limits,
   discounts,
   status,
  } = req.body
  if (
   !coupon_name ||
   !coupon_code ||
   !start_date ||
   !end_date ||
   !limits ||
   !discounts ||
   !status
  )
   return res.status(400).json({ msg: "Vui lòng nhập đủ trường dữ liệu." })
  const checkCouponName = await Coupons.findOne({ name: coupon_name })
  const checkCouponCode = await Coupons.findOne({ name: coupon_code })
  if (checkCouponName)
   return res
    .status(400)
    .json({ msg: "Tên sự kiện khuyến mại này đã tồn tại." })
  if (checkCouponCode)
   return res.status(400).json({ msg: "Mã sự kiện khuyến mại này đã tồn tại." })

  const newCoupon = new Coupons({
   name: coupon_name,
   code: coupon_code,
   start_date,
   end_date,
   limits,
   discounts,
   status,
  })
  await newCoupon.save()

  res.json({ msg: "Thêm mới mã giảm giá thành công" })
 } catch (error) {
  return res.status(500).json({ msg: "Đã có lỗi xảy ra" })
 }
}

const updateCoupon = async (req, res) => {
 const { id } = req.params
 const { name, code, start_date, end_date, limits, discounts, status } =
  req.body
 try {
  if (!name || !code || !start_date || !end_date || !limits || !discounts) {
   return res.status(400).json({ msg: "Vui lòng nhập đủ trường dữ liệu." })
  }
  await Coupons.findOneAndUpdate(
   { _id: id },
   { name, code, start_date, end_date, limits, discounts, status },
   { new: true }
  )

  return res.json({ msg: "Cập nhật thành công thành công" })
 } catch (error) {
  return res.status(500).json({ msg: "Đã có lỗi xảy ra" })
 }
}

const deleteCoupon = async (req, res) => {
 const { id } = req.params
 try {
  await Coupons.findByIdAndDelete(id)

  return res.json({ msg: "Xóa mã giảm giá thành công" })
 } catch (error) {
  return res.status(500).json({ msg: "Đã có lỗi xảy ra" })
 }
}

const confirmCoupon = async (req, res) => {
 const { code, idUser } = req.body
 try {
  const coupon = await Coupons.findOne({ code })
  const exists = await Payments.findOne({
   user_id: idUser,
   coupon: coupon._id.toString(),
  })
  if (exists) return res.status(400).json({ msg: "Bạn đã dùng mã này rồi" })
  if (!coupon) return res.status(400).json({ msg: "Mã giảm giá không đúng" })
  if (coupon.status === false)
   return res.status(400).json({ msg: "Mã giảm giá tạm thời bị khóa" })
  if (coupon.limits === 0)
   return res.status(400).json({ msg: "Mã giảm giá đã hết" })
  if (new Date(coupon.start_date).getTime() - new Date().getTime() > 0)
   return res.status(400).json({ msg: "Mã giảm giá hiện chưa diễn ra" })
  if (new Date(coupon.end_date).getTime() - new Date().getTime() < 0)
   console.log(
    "first",
    new Date(coupon.start_date).getTime() - new Date().getTime()
   )
  return res.status(400).json({ msg: "Mã giảm giá đã quá hạn" })
  return res.status(200).json(coupon)
 } catch (error) {
  return res.status(500).json({ msg: "Đã có lỗi xảy ra" })
 }
}

export default {
 getCoupons,
 createCoupon,
 updateCoupon,
 deleteCoupon,
 confirmCoupon,
}

// if (new Date(coupon.start_date).getTime() - new Date().getTime() < 0)
