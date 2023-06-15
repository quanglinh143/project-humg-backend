import Payments from "../models/paymentModel.js"
import Users from "../models/userModel.js"
import Products from "../models/productModel.js"
import Coupons from "../models/couponModel.js"

const getPayments = async (req, res) => {
 try {
  const payments = await Payments.find().sort({ createdAt: -1 })
  res.json(payments)
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const getPaymentById = async (req, res) => {
 const { idPayment } = req.params
 const { idUser } = req.query

 try {
  const payments = await Payments.findById(idPayment)
  if (!payments) {
   return res.status(500).json({ msg: "Mã thanh toán không đúng" })
  }
  if (idUser === payments.user_id) {
   return res.json(payments)
  } else {
   return res.status(500).json({ msg: "Sai người dùng!" })
  }
  // return res.json(payments)
 } catch (error) {
  return res.status(500).json({ msg: "Đã có lỗi xảy ra" })
 }
}

const getPaymentDetailsByAdmin = async (req, res) => {
 const { id } = req.params
 try {
  const payments = await Payments.findById(id)
  if (!payments) {
   return res.status(500).json({ msg: "Mã thanh toán không đúng" })
  }
  res.json(payments)
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const createPayment = async (req, res) => {
 const {
  cart,
  address,
  totalPurchasePrice,
  methodShipping,
  phone_number,
  coupon,
 } = req.body
 if (!phone_number)
  return res.status(400).json({ msg: "Vui lòng thêm số điện thoại nhận hàng." })
 if (!address)
  return res.status(400).json({ msg: "Vui lòng thêm địa chỉ nhận hàng." })
 if (cart.length === 0)
  return res.status(400).json({ msg: "Vui lòng tích sản phẩm thanh toán." })

 try {
  const user = await Users.findById(req.user.id).select("name email")
  if (!user) return res.status(400).json({ msg: "Người dùng không tòn tại" })

  const { _id, name, email } = user
  const newPayment = new Payments({
   user_id: _id,
   name,
   email,
   cart,
   phone_number,
   address,
   totalPurchasePrice,
   methodShipping,
   coupon,
  })
  cart.filter((item) => {
   return sold(item._id, item.qty, item.sold, item.remaining)
  })

  await newPayment.save()
  if (coupon) {
   updateCoupon(coupon)
  }
  res.json({ msg: "Thanh toán thành công" })
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const sold = async (id, qty, oldSold, remaining) => {
 await Products.findOneAndUpdate(
  { _id: id },
  {
   sold: oldSold + qty,
   remaining: remaining - qty,
  }
 )
}

const updateCoupon = async (coupon) => {
 await Coupons.findOneAndUpdate(
  { _id: coupon },
  { $inc: { limits: -1 } },
  { new: true }
 )
}

const orderStatusPayment = async (req, res) => {
 const { item } = req.body
 const { status } = req.body
 if (status === "1") {
  await Payments.findOneAndUpdate(
   { _id: item._id },
   {
    status,
   }
  )
 }
 if (status === "2") {
  await Payments.findOneAndUpdate(
   { _id: item._id },
   {
    status,
   }
  )
 }
 if (status === "3") {
  await Payments.findOneAndUpdate(
   { _id: item._id },
   {
    status,
   }
  )
 }
 if (status === "4") {
  for (let i = 0; i < item.cart.length; i++) {
   const getItemProduct = await Products.find({ _id: item.cart[i]._id })
   // Khi users hủy đơn => hoàn hàng vào kho
   await Products.findOneAndUpdate(
    { _id: item.cart[i]._id },
    {
     sold: getItemProduct[0].sold - item.cart[i].qty,
     remaining: getItemProduct[0].remaining + item.cart[i].qty,
    }
   )

   // Khi users hủy đơn => hoàn lại mã giảm giá
   await Coupons.findOneAndUpdate(
    { _id: item.coupon },
    { $inc: { limits: +1 } },
    { new: true }
   )

   await Payments.findOneAndUpdate(
    { _id: item._id },
    {
     status,
    }
   )
  }
 }
 res.json({ msg: "Cập nhật tình trạng đơn hàng" })
}

const getRevenues = async (req, res) => {
 const { startDate, endDate } = req.query

 const filter = {
  createdAt: {
   $gte: startDate,
   $lte: endDate,
  },
 }

 try {
  let results = {}
  const payments = await Payments.find({ ...(startDate !== "" && filter) })
  let totalPurchase = 0
  for (let i = 0; i < payments.length; i++) {
   if (payments[i].status === "3") {
    totalPurchase += payments[i].totalPurchasePrice
   }
  }
  results.totalPurchasePrice = totalPurchase || 0
  results.result = payments
  res.json(results)
 } catch (error) {
  return res.status(500).json({ msg: "Đã có lỗi xảy ra" })
 }
}

export default {
 getPayments,
 getPaymentById,
 createPayment,
 orderStatusPayment,
 getPaymentDetailsByAdmin,
 getRevenues,
}
