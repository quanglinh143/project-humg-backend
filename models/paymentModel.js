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
  paymentID: {
   type: String,
   required: true,
  },
  address: {
   type: Object,
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
   type: Boolean,
   default: false,
  },
 },
 {
  timestamps: true,
 }
)

export default mongoose.model("Payments", paymentSchema)
