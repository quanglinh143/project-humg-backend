import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema(
 {
  user_id: {
   type: String,
   required: true,
  },
  name: {
   type: String,
   required: true,
  },
  email: {
   type: String,
   required: true,
  },
  phone_number: {
   type: String,
  },
  paymentID: {
   type: String,
  },
  address: {
   type: String,
   required: true,
  },
  cart: {
   type: Array,
   default: [],
  },
  totalPurchasePrice: {
   type: Number,
   default: 0,
  },
  status: {
   type: String,
   enum: ["0", "1", "2", "3", "4"],
   default: "0",
  },
  methodShipping: {
   type: String,
   enum: ["0", "1"],
  },
  coupon: {
   type: String,
   default: null,
  },
 },
 {
  timestamps: true,
 }
)

export default mongoose.model("Payments", paymentSchema)
