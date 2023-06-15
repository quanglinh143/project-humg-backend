import mongoose from "mongoose"

const couponSchema = new mongoose.Schema(
 {
  name: {
   type: String,
   required: true,
   trim: true,
   unique: true,
  },
  code: {
   type: String,
   required: true,
   trim: true,
   unique: true,
  },
  start_date: {
   type: Date,
   required: true,
  },
  end_date: {
   type: Date,
   required: true,
  },
  limits: {
   type: Number,
   required: true,
  },
  discounts: {
   type: Number,
   required: true,
  },
  status: {
   type: Boolean,
   required: true,
  },
 },
 {
  timestamps: true,
 }
)

export default mongoose.model("Coupon", couponSchema)
