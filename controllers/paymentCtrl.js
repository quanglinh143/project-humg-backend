import Payments from "../models/paymentModel.js"
import Users from "../models/userModel.js"
import Products from "../models/productModel.js"

const getPayments = async (req, res) => {
 try {
  const payments = await Payments.find().sort({ createdAt: -1 })
  res.json(payments)
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const getPaymentById = async (req, res) => {
 const { id } = req.params
 try {
  const payments = await Payments.findById(id)
  if (!payments) {
   return res.status(500).json({ msg: "This payment code is not available" })
  }
  res.json(payments)
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const createPayment = async (req, res) => {
 try {
  const user = await Users.findById(req.user.id).select("name email")
  if (!user) return res.status(400).json({ msg: "User does not exist." })

  const { cart, paymentID, address, totalPurchasePrice } = req.body
  const { _id, name, email } = user
  const newPayment = new Payments({
   user_id: _id,
   name,
   email,
   cart,
   paymentID,
   address,
   totalPurchasePrice,
  })
  cart.filter((item) => {
   return sold(item._id, item.qty, item.sold)
  })
  await newPayment.save()
  res.json({ msg: "Payment success!" })
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const sold = async (id, qty, oldSold) => {
 await Products.findOneAndUpdate(
  { _id: id },
  {
   sold: oldSold + qty,
  }
 )
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
   totalPurchase += payments[i].totalPurchasePrice
  }
  results.totalPurchasePrice = totalPurchase.toFixed(2) || 0
  results.result = payments
  res.json(results)
 } catch (error) {
  return res.status(500).json({ msg: "An error has occurred" })
 }
}

export default {
 getPayments,
 getPaymentById,
 createPayment,
 getRevenues,
}
